import { promises as fs } from 'fs';
import path from 'path';
import { getServiceClient } from '@/lib/supabase';
import {
  calcCortisolScore,
  calcDopamineScore,
  calcOxytocinScore,
  calcSerotoninScore,
  filterEntriesInPeriod,
  getMondayOfWeek,
  getPreviousWeekRange,
  getSundayOfWeek,
  getUserStreak,
} from '@/lib/scoring';
import { generateERScore } from '@/lib/scoring-er';
import type {
  ChatEntry,
  ERScore,
  GrowthScoreSnapshot,
  HormoneScore,
  Mode,
  UserId,
} from '@/types';

const SCORES_FILE = path.join(process.cwd(), 'data', 'growth_scores.json');
const PERIOD_DAYS = 7;

function getERCacheMs(): number {
  const raw = process.env.ER_SCORE_CACHE_MS;
  const parsed = raw ? parseInt(raw, 10) : 86400000;
  return Number.isFinite(parsed) ? parsed : 86400000;
}

interface StoredScoreRow {
  id: string;
  user_id: UserId;
  period_start: string;
  period_end: string;
  oxytocin_score: number;
  dopamine_score: number;
  serotonin_score: number;
  cortisol_score: number;
  er_self_awareness: number | null;
  er_self_regulation: number | null;
  er_empathy: number | null;
  er_social_skill: number | null;
  er_composite: number | null;
  er_generated_at: string | null;
  entries_count: number;
  created_at: string;
}

export function emptySnapshot(userId: UserId): GrowthScoreSnapshot {
  const periodStart = getMondayOfWeek();
  const periodEnd = getSundayOfWeek();
  const now = new Date().toISOString();
  return {
    userId,
    periodStart,
    periodEnd,
    hormone: { oxytocin: 0, dopamine: 0, serotonin: 0, cortisol: 100 },
    er: null,
    entriesCount: 0,
    createdAt: now,
    lastUpdated: now,
  };
}

function rowToSnapshot(row: StoredScoreRow): GrowthScoreSnapshot {
  const hasER =
    row.er_composite != null &&
    row.er_self_awareness != null &&
    row.er_self_regulation != null &&
    row.er_empathy != null &&
    row.er_social_skill != null;

  return {
    userId: row.user_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    hormone: {
      oxytocin: row.oxytocin_score,
      dopamine: row.dopamine_score,
      serotonin: row.serotonin_score,
      cortisol: row.cortisol_score,
    },
    er: hasER
      ? {
          self_awareness: row.er_self_awareness!,
          self_regulation: row.er_self_regulation!,
          empathy: row.er_empathy!,
          social_skill: row.er_social_skill!,
          composite: row.er_composite!,
          rationale: '',
        }
      : null,
    entriesCount: row.entries_count,
    createdAt: row.created_at,
    lastUpdated: row.er_generated_at ?? row.created_at,
  };
}

function splitPeriodEntries(allEntries: ChatEntry[]) {
  const periodStart = getMondayOfWeek();
  const periodEnd = getSundayOfWeek();
  const weekEntries = filterEntriesInPeriod(allEntries, periodStart, periodEnd);
  const prev = getPreviousWeekRange();
  const prevEntries = filterEntriesInPeriod(allEntries, prev.start, prev.end);
  return { periodStart, periodEnd, weekEntries, prevEntries };
}

/** Hitung 4 hormone score secara paralel (Approach B) */
export async function calculateHormoneScores(
  weekEntries: ChatEntry[],
  prevEntries: ChatEntry[]
): Promise<HormoneScore> {
  const streak = getUserStreak(weekEntries);
  const [oxytocin, dopamine, serotonin, cortisol] = await Promise.all([
    Promise.resolve(calcOxytocinScore(weekEntries, PERIOD_DAYS)),
    Promise.resolve(calcDopamineScore(weekEntries, streak)),
    Promise.resolve(calcSerotoninScore(weekEntries, prevEntries, PERIOD_DAYS)),
    Promise.resolve(calcCortisolScore(weekEntries)),
  ]);
  return { oxytocin, dopamine, serotonin, cortisol };
}

async function readFileScores(): Promise<StoredScoreRow[]> {
  try {
    const raw = await fs.readFile(SCORES_FILE, 'utf-8');
    return JSON.parse(raw) as StoredScoreRow[];
  } catch {
    return [];
  }
}

async function writeFileScores(rows: StoredScoreRow[]): Promise<void> {
  await fs.mkdir(path.dirname(SCORES_FILE), { recursive: true });
  await fs.writeFile(SCORES_FILE, JSON.stringify(rows, null, 2), 'utf-8');
}

async function upsertStoredHormone(
  userId: UserId,
  periodStart: string,
  periodEnd: string,
  hormone: HormoneScore,
  entriesCount: number,
  preserveER?: StoredScoreRow | null
): Promise<void> {
  const client = getServiceClient();
  const payload = {
    user_id: userId,
    period_start: periodStart,
    period_end: periodEnd,
    oxytocin_score: hormone.oxytocin,
    dopamine_score: hormone.dopamine,
    serotonin_score: hormone.serotonin,
    cortisol_score: hormone.cortisol,
    entries_count: entriesCount,
  };

  if (client) {
    await client.from('growth_scores').upsert(payload, {
      onConflict: 'user_id,period_start',
    });
    return;
  }

  const rows = await readFileScores();
  const idx = rows.findIndex(
    (r) => r.user_id === userId && r.period_start === periodStart
  );
  const existing = idx >= 0 ? rows[idx] : preserveER ?? null;
  const base: StoredScoreRow = {
    id: existing?.id ?? crypto.randomUUID(),
    user_id: userId,
    period_start: periodStart,
    period_end: periodEnd,
    oxytocin_score: hormone.oxytocin,
    dopamine_score: hormone.dopamine,
    serotonin_score: hormone.serotonin,
    cortisol_score: hormone.cortisol,
    er_self_awareness: existing?.er_self_awareness ?? null,
    er_self_regulation: existing?.er_self_regulation ?? null,
    er_empathy: existing?.er_empathy ?? null,
    er_social_skill: existing?.er_social_skill ?? null,
    er_composite: existing?.er_composite ?? null,
    er_generated_at: existing?.er_generated_at ?? null,
    entries_count: entriesCount,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
  if (idx >= 0) rows[idx] = base;
  else rows.push(base);
  await writeFileScores(rows);
}

async function upsertEmptyScores(userId: UserId): Promise<void> {
  const periodStart = getMondayOfWeek();
  const periodEnd = getSundayOfWeek();
  await upsertStoredHormone(
    userId,
    periodStart,
    periodEnd,
    { oxytocin: 0, dopamine: 0, serotonin: 0, cortisol: 100 },
    0
  );
}

async function fetchStoredRow(
  userId: UserId,
  periodStart: string
): Promise<StoredScoreRow | null> {
  const client = getServiceClient();
  if (client) {
    const { data } = await client
      .from('growth_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('period_start', periodStart)
      .maybeSingle();
    return (data as StoredScoreRow | null) ?? null;
  }
  const rows = await readFileScores();
  return rows.find((r) => r.user_id === userId && r.period_start === periodStart) ?? null;
}

async function fetchLatestStoredRow(userId: UserId): Promise<StoredScoreRow | null> {
  const periodStart = getMondayOfWeek();
  const current = await fetchStoredRow(userId, periodStart);
  if (current) return current;

  const client = getServiceClient();
  if (client) {
    const { data } = await client
      .from('growth_scores')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as StoredScoreRow | null) ?? null;
  }

  const rows = await readFileScores();
  return (
    rows
      .filter((r) => r.user_id === userId)
      .sort((a, b) => b.period_start.localeCompare(a.period_start))[0] ?? null
  );
}

/** Baca snapshot terbaru dari DB — tanpa recalculate (Section 7.4) */
export async function getLatestScores(
  userId: UserId
): Promise<GrowthScoreSnapshot | null> {
  const row = await fetchLatestStoredRow(userId);
  return row ? rowToSnapshot(row) : null;
}

/** Event: entri baru / refresh manual / dashboard on-demand — hormone only */
export async function syncHormoneScores(
  userId: UserId,
  allEntries: ChatEntry[]
): Promise<{ snapshot: GrowthScoreSnapshot; hormone: HormoneScore }> {
  const { periodStart, periodEnd, weekEntries, prevEntries } =
    splitPeriodEntries(allEntries);
  const hormone = await calculateHormoneScores(weekEntries, prevEntries);
  const existing = await fetchStoredRow(userId, periodStart);
  await upsertStoredHormone(
    userId,
    periodStart,
    periodEnd,
    hormone,
    weekEntries.length,
    existing
  );
  const row = await fetchStoredRow(userId, periodStart);
  return {
    hormone,
    snapshot: row ? rowToSnapshot(row) : emptySnapshot(userId),
  };
}

function erFromRow(row: StoredScoreRow): ERScore | null {
  if (
    row.er_composite == null ||
    row.er_self_awareness == null ||
    row.er_self_regulation == null ||
    row.er_empathy == null ||
    row.er_social_skill == null
  ) {
    return null;
  }
  return {
    self_awareness: row.er_self_awareness,
    self_regulation: row.er_self_regulation,
    empathy: row.er_empathy,
    social_skill: row.er_social_skill,
    composite: row.er_composite,
    rationale: '',
  };
}

function isERCacheValid(erGeneratedAt: string | null): boolean {
  if (!erGeneratedAt) return false;
  return Date.now() - new Date(erGeneratedAt).getTime() < getERCacheMs();
}

async function saveERScore(userId: UserId, er: ERScore): Promise<void> {
  const periodStart = getMondayOfWeek();
  const client = getServiceClient();
  const erPayload = {
    er_self_awareness: er.self_awareness,
    er_self_regulation: er.self_regulation,
    er_empathy: er.empathy,
    er_social_skill: er.social_skill,
    er_composite: er.composite,
    er_generated_at: new Date().toISOString(),
  };

  if (client) {
    const { data: existing } = await client
      .from('growth_scores')
      .select('id')
      .eq('user_id', userId)
      .eq('period_start', periodStart)
      .maybeSingle();

    if (existing) {
      await client
        .from('growth_scores')
        .update(erPayload)
        .eq('user_id', userId)
        .eq('period_start', periodStart);
    }
    return;
  }

  const rows = await readFileScores();
  const idx = rows.findIndex(
    (r) => r.user_id === userId && r.period_start === periodStart
  );
  if (idx < 0) return;
  rows[idx] = { ...rows[idx], ...erPayload };
  await writeFileScores(rows);
}

/** Event: /growth session — ER dengan guard 24 jam */
export async function maybeGenerateERScore(
  userId: UserId,
  allEntries: ChatEntry[],
  mode: Mode
): Promise<ERScore | null> {
  if (mode !== 'growth') return null;

  const periodStart = getMondayOfWeek();
  const existing = await fetchStoredRow(userId, periodStart);

  if (existing && isERCacheValid(existing.er_generated_at)) {
    return erFromRow(existing);
  }

  try {
    const { weekEntries } = splitPeriodEntries(allEntries);
    const er = await generateERScore(userId, weekEntries);
    await saveERScore(userId, er);
    return er;
  } catch {
    if (existing) return erFromRow(existing);
    return null;
  }
}

/** Event: entri dihapus — recalc hormone dari sisa entri */
export async function recalculateAfterDelete(
  userId: UserId,
  remainingEntries: ChatEntry[]
): Promise<GrowthScoreSnapshot> {
  if (remainingEntries.length === 0) {
    await upsertEmptyScores(userId);
    return emptySnapshot(userId);
  }
  const { snapshot } = await syncHormoneScores(userId, remainingEntries);
  return snapshot;
}

/** Event: cron Senin — snapshot minggu lalu */
export async function snapshotPreviousWeek(
  userId: UserId,
  entries: ChatEntry[]
): Promise<void> {
  if (entries.length === 0) return;

  const lastWeekStart = getPreviousWeekRange().start;
  const lastWeekEnd = getPreviousWeekRange().end;
  const weekEntries = filterEntriesInPeriod(entries, lastWeekStart, lastWeekEnd);
  if (weekEntries.length === 0) return;

  const hormone = await calculateHormoneScores(weekEntries, []);
  await upsertStoredHormone(
    userId,
    lastWeekStart,
    lastWeekEnd,
    hormone,
    weekEntries.length
  );
}

export async function getScoreHistory(
  userId: UserId,
  limit = 8
): Promise<GrowthScoreSnapshot[]> {
  const client = getServiceClient();
  let rows: StoredScoreRow[] = [];

  if (client) {
    const { data } = await client
      .from('growth_scores')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false })
      .limit(limit);
    rows = (data as StoredScoreRow[] | null) ?? [];
  } else {
    rows = (await readFileScores())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => b.period_start.localeCompare(a.period_start))
      .slice(0, limit);
  }

  return rows.map(rowToSnapshot).reverse();
}

/** @deprecated Use getLatestScores for dashboard reads */
export async function getLatestGrowthSnapshot(
  userId: UserId,
  allEntries: ChatEntry[]
): Promise<GrowthScoreSnapshot> {
  const stored = await getLatestScores(userId);
  if (stored) return stored;
  if (allEntries.length === 0) return emptySnapshot(userId);
  const { snapshot } = await syncHormoneScores(userId, allEntries);
  return snapshot;
}
