import {
  calcOxytocinScore,
  filterEntriesInPeriod,
  getMondayOfWeek,
  getSundayOfWeek,
} from '@/lib/scoring';
import type {
  AnalisisScore,
  ChatEntry,
  ConversationScore,
  Mode,
  ModeHistoricalResponse,
  ModeScoreData,
  PlanScore,
  ReflectScore,
  ScoreDelta,
  UserId,
} from '@/types';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 50;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function weightedRecencyAvg(values: number[]): number {
  if (values.length === 0) return 50;
  let total = 0;
  let weight = 0;
  values.forEach((v, i) => {
    const w = i === values.length - 1 ? 2 : 1;
    total += v * w;
    weight += w;
  });
  return total / weight;
}

function getScoreField(entry: ChatEntry, field: string): number | null {
  const data = entry.score_data;
  if (!data || typeof data !== 'object') return null;
  const val = (data as unknown as Record<string, unknown>)[field];
  return typeof val === 'number' ? val : null;
}

function analisisResolutionRate(allEntries: ChatEntry[]): number {
  const analisis = allEntries.filter((e) => e.mode === 'analisis');
  if (analisis.length === 0) return 100;
  let resolved = 0;
  analisis.forEach((a) => {
    const t = new Date(a.created_at).getTime();
    const hasFollowUp = allEntries.some(
      (e) =>
        (e.mode === 'plan' || e.mode === 'conversation') &&
        new Date(e.created_at).getTime() > t &&
        new Date(e.created_at).getTime() < t + 172800000
    );
    if (hasFollowUp) resolved++;
  });
  return Math.round((resolved / analisis.length) * 100);
}

function countEmpathyMentions(entries: ChatEntry[]): number {
  let count = 0;
  const patterns = [/dian/i, /harist/i, /pasangan/i, /partner/i, /dia mungkin/i];
  entries.forEach((e) => {
    const text = e.messages.map((m) => m.content).join(' ');
    if (patterns.some((p) => p.test(text))) count++;
  });
  return count;
}

function reflectGapPenalty(reflectEntries: ChatEntry[]): number {
  if (reflectEntries.length < 2) return 0;
  const sorted = [...reflectEntries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  let maxGap = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = Math.floor(
      (new Date(sorted[i].created_at).getTime() -
        new Date(sorted[i - 1].created_at).getTime()) /
        86400000
    );
    maxGap = Math.max(maxGap, gap);
  }
  return maxGap >= 3 ? 10 : 0;
}

export function calcHistoricalReflect(
  entries: ChatEntry[],
  allPeriodEntries: ChatEntry[]
): ReflectScore {
  const oxyValues = entries
    .map((e) => getScoreField(e, 'oxytocin') ?? getScoreField(e, 'session_oxytocin'))
    .filter((v): v is number => v != null);
  const serValues = entries
    .map((e) => getScoreField(e, 'serotonin') ?? getScoreField(e, 'session_serotonin'))
    .filter((v): v is number => v != null);

  let oxytocin = oxyValues.length
    ? weightedRecencyAvg(oxyValues)
    : clamp(calcOxytocinScore(entries) * 0.7 + 30);
  let serotonin = serValues.length
    ? avg(serValues) - reflectGapPenalty(entries)
    : clamp(60 + entries.length * 5 - reflectGapPenalty(entries));

  return {
    oxytocin: clamp(oxytocin),
    serotonin: clamp(serotonin),
    signals: [],
  };
}

export function calcHistoricalAnalisis(
  entries: ChatEntry[],
  allPeriodEntries: ChatEntry[]
): AnalisisScore {
  const count = entries.length;
  const cortisol = clamp(100 - count * 12, 10, 100);
  const resolution_rate = analisisResolutionRate(allPeriodEntries);
  const self_regulation = clamp(resolution_rate * 0.85 + 15);

  return { cortisol, self_regulation, resolution_rate };
}

export function calcHistoricalPlan(
  entries: ChatEntry[],
  allPeriodEntries: ChatEntry[]
): PlanScore {
  let dopamine = clamp(Math.min(entries.length * 10, 60));
  const hasFollowUp = entries.some((plan) => {
    const t = new Date(plan.created_at).getTime();
    return allPeriodEntries.some(
      (e) =>
        e.mode === 'reflect' &&
        new Date(e.created_at).getTime() > t &&
        new Date(e.created_at).getTime() < t + 604800000
    );
  });
  if (hasFollowUp) dopamine = clamp(dopamine + 20);

  const hasConversation = allPeriodEntries.some((e) => e.mode === 'conversation');
  const social_skill = clamp(hasConversation ? 70 : 50);

  return { dopamine, social_skill, effectiveness: 'pending' };
}

export function calcHistoricalConversation(
  entries: ChatEntry[],
  allPeriodEntries: ChatEntry[]
): ConversationScore {
  const hasReflectNear = entries.some((conv) => {
    const t = new Date(conv.created_at).getTime();
    return allPeriodEntries.some(
      (e) =>
        e.mode === 'reflect' &&
        Math.abs(new Date(e.created_at).getTime() - t) < 172800000
    );
  });

  const oxytocin = clamp(hasReflectNear ? 70 : 50);
  const self_regulation = clamp(analisisResolutionRate(allPeriodEntries) * 0.9);
  const empathy = clamp(Math.min(countEmpathyMentions(allPeriodEntries) * 15, 85));
  const readiness = calcConversationReadiness(oxytocin, self_regulation, empathy);

  return { oxytocin, self_regulation, empathy, readiness };
}

export function calcConversationReadiness(
  oxytocin: number,
  self_regulation: number,
  empathy: number
): number {
  return clamp(self_regulation * 0.4 + empathy * 0.35 + oxytocin * 0.25);
}

export function getReadinessLabel(readiness: number): string {
  if (readiness >= 80) return 'Siap — kondisi optimal untuk percakapan ini';
  if (readiness >= 60) return 'Cukup siap — perhatikan tone saat membuka';
  return 'Pertimbangkan timing — mungkin belum saat terbaik';
}

export function calcHistoricalForMode(
  mode: Mode,
  modeEntries: ChatEntry[],
  allPeriodEntries: ChatEntry[]
): ModeScoreData | null {
  if (modeEntries.length === 0) return null;

  switch (mode) {
    case 'reflect':
      return calcHistoricalReflect(modeEntries, allPeriodEntries);
    case 'analisis':
      return calcHistoricalAnalisis(modeEntries, allPeriodEntries);
    case 'plan':
      return calcHistoricalPlan(modeEntries, allPeriodEntries);
    case 'conversation':
      return calcHistoricalConversation(modeEntries, allPeriodEntries);
    case 'growth':
      return null;
    default:
      return null;
  }
}

export function calcSessionScore(
  mode: Mode,
  scoreData: Record<string, number | string | string[]> | null,
  historical: ModeScoreData | null
): ModeScoreData | null {
  if (!scoreData && !historical) return null;

  const num = (key: string, fallback = 0) => {
    const v = scoreData?.[key];
    return typeof v === 'number' ? v : fallback;
  };

  const base = (field: string, histVal: number) =>
    clamp(histVal + num(`${field}_delta`, 0));

  switch (mode) {
    case 'reflect': {
      const h = historical as ReflectScore | null;
      return {
        oxytocin: base('oxytocin', h?.oxytocin ?? 50),
        serotonin: base('serotonin', h?.serotonin ?? 50),
        signals: Array.isArray(scoreData?.signals)
          ? (scoreData!.signals as string[])
          : [],
      } satisfies ReflectScore;
    }
    case 'analisis': {
      const h = historical as AnalisisScore | null;
      return {
        cortisol: base('cortisol', h?.cortisol ?? 70),
        self_regulation: base('self_regulation', h?.self_regulation ?? 50),
        resolution_rate: h?.resolution_rate ?? 0,
        signals: Array.isArray(scoreData?.signals)
          ? (scoreData!.signals as string[])
          : [],
      } satisfies AnalisisScore & { signals?: string[] };
    }
    case 'plan': {
      const h = historical as PlanScore | null;
      return {
        dopamine: base('dopamine', h?.dopamine ?? 50),
        social_skill: base('social_skill', h?.social_skill ?? 50),
        effectiveness: 'pending' as const,
        signals: Array.isArray(scoreData?.signals)
          ? (scoreData!.signals as string[])
          : [],
      } satisfies PlanScore & { signals?: string[] };
    }
    case 'conversation': {
      const h = historical as ConversationScore | null;
      const oxytocin = base('oxytocin', h?.oxytocin ?? 50);
      const self_regulation = base('self_regulation', h?.self_regulation ?? 50);
      const empathy = base('empathy', h?.empathy ?? 50);
      return {
        oxytocin,
        self_regulation,
        empathy,
        readiness: calcConversationReadiness(oxytocin, self_regulation, empathy),
        signals: Array.isArray(scoreData?.signals)
          ? (scoreData!.signals as string[])
          : [],
      } satisfies ConversationScore & { signals?: string[] };
    }
    case 'growth': {
      if (
        typeof scoreData?.self_awareness === 'number' &&
        typeof scoreData?.self_regulation === 'number'
      ) {
        return {
          self_awareness: clamp(scoreData.self_awareness as number),
          self_regulation: clamp(scoreData.self_regulation as number),
          empathy: clamp(num('empathy', 50)),
          social_skill: clamp(num('social_skill', 50)),
          narrative: String(scoreData.narrative ?? ''),
          focus_next: String(scoreData.focus_next ?? ''),
        };
      }
      return null;
    }
    default:
      return null;
  }
}

export function buildScoreDeltas(
  mode: Mode,
  session: ModeScoreData,
  historical: ModeScoreData | null
): ScoreDelta[] {
  if (!historical) return [];

  const dims: Record<Mode, string[]> = {
    reflect: ['oxytocin', 'serotonin'],
    analisis: ['cortisol', 'self_regulation'],
    plan: ['dopamine', 'social_skill'],
    conversation: ['oxytocin', 'self_regulation', 'empathy'],
    growth: ['self_awareness', 'self_regulation', 'empathy', 'social_skill'],
  };

  return dims[mode].map((dim) => {
    const h = (historical as unknown as Record<string, number>)[dim] ?? 0;
    const s = (session as unknown as Record<string, number>)[dim] ?? 0;
    const delta = s - h;
    return {
      dimension: dim,
      historical: h,
      session: s,
      delta,
      trend: delta > 2 ? 'up' : delta < -2 ? 'down' : 'same',
    };
  });
}

export function computeModeTrend(
  modeEntries: ChatEntry[],
  mode: Mode,
  allPeriodEntries: ChatEntry[]
): 'improving' | 'stable' | 'declining' {
  if (modeEntries.length < 2) return 'stable';
  const recent = modeEntries.slice(0, 3);
  const older = modeEntries.slice(3, 6);
  if (older.length === 0) return 'stable';

  const recentAvg = calcHistoricalForMode(mode, recent, allPeriodEntries);
  const olderAvg = calcHistoricalForMode(mode, older, allPeriodEntries);
  if (!recentAvg || !olderAvg) return 'stable';

  const recentVal = Object.values(recentAvg).find((v) => typeof v === 'number') as number;
  const olderVal = Object.values(olderAvg).find((v) => typeof v === 'number') as number;
  if (recentVal > olderVal + 3) return 'improving';
  if (recentVal < olderVal - 3) return 'declining';
  return 'stable';
}

export function buildModeHistoricalResponse(
  userId: UserId,
  mode: Mode,
  modeEntries: ChatEntry[],
  allPeriodEntries: ChatEntry[],
  limit: number
): ModeHistoricalResponse {
  const periodEntries = modeEntries.slice(0, limit);
  const historicalAvg = calcHistoricalForMode(mode, periodEntries, allPeriodEntries);
  const lastSession =
    periodEntries.length > 0
      ? calcHistoricalForMode(mode, [periodEntries[0]], allPeriodEntries)
      : null;

  return {
    userId,
    mode,
    historicalAvg,
    lastSession,
    trend: computeModeTrend(modeEntries, mode, allPeriodEntries),
    sessionCount: modeEntries.length,
  };
}

export function checkPlanEffectiveness(
  planEntry: ChatEntry,
  allEntries: ChatEntry[]
): 'executed' | 'unknown' | 'pending' {
  const planDate = new Date(planEntry.created_at);
  const oneWeekLater = new Date(planDate.getTime() + 604800000);
  if (new Date() < oneWeekLater) return 'pending';

  const hasReflect = allEntries.some(
    (e) =>
      e.mode === 'reflect' &&
      new Date(e.created_at) > planDate &&
      new Date(e.created_at) <= oneWeekLater
  );
  return hasReflect ? 'executed' : 'unknown';
}

export function getPeriodModeEntries(
  entries: ChatEntry[],
  mode: Mode
): ChatEntry[] {
  const periodStart = getMondayOfWeek();
  const periodEnd = getSundayOfWeek();
  return filterEntriesInPeriod(entries, periodStart, periodEnd).filter(
    (e) => e.mode === mode
  );
}
