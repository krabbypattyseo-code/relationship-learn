import type { ChatEntry, ERScoreRaw, HormoneScore } from '@/types';

const PERIOD_DAYS = 7;

export function getMondayOfWeek(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function getSundayOfWeek(date = new Date()): string {
  const monday = new Date(getMondayOfWeek(date));
  monday.setDate(monday.getDate() + 6);
  return monday.toISOString().split('T')[0];
}

export function filterEntriesInPeriod(
  entries: ChatEntry[],
  periodStart: string,
  periodEnd: string
): ChatEntry[] {
  const start = new Date(`${periodStart}T00:00:00`).getTime();
  const end = new Date(`${periodEnd}T23:59:59`).getTime();
  return entries.filter((e) => {
    const t = new Date(e.created_at).getTime();
    return t >= start && t <= end;
  });
}

export function getPreviousWeekRange(date = new Date()): {
  start: string;
  end: string;
} {
  const monday = new Date(getMondayOfWeek(date));
  monday.setDate(monday.getDate() - 7);
  const start = monday.toISOString().split('T')[0];
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return { start, end: sunday.toISOString().split('T')[0] };
}

/** Senin minggu lalu (ISO) */
export function getLastMondayOfWeek(date = new Date()): string {
  return getPreviousWeekRange(date).start;
}

/** Minggu minggu lalu (ISO) */
export function getLastSundayOfWeek(date = new Date()): string {
  return getPreviousWeekRange(date).end;
}

function checkDailyRitual(entries: ChatEntry[]): boolean {
  const today = new Date().toDateString();
  return entries.some((e) => new Date(e.created_at).toDateString() === today);
}

function getActiveDays(entries: ChatEntry[], periodDays: number): number {
  const days = new Set(entries.map((e) => new Date(e.created_at).toDateString()));
  return Math.min(days.size, periodDays);
}

function calcStdDev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function getDailyActivityCounts(entries: ChatEntry[], days: number): number[] {
  const counts = new Array(days).fill(0);
  entries.forEach((e) => {
    const daysAgo = Math.floor(
      (Date.now() - new Date(e.created_at).getTime()) / 86400000
    );
    if (daysAgo >= 0 && daysAgo < days) counts[daysAgo]++;
  });
  return counts;
}

function getLongestGap(entries: ChatEntry[]): number {
  if (entries.length === 0) return 7;
  const sorted = [...entries].sort(
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
  return maxGap;
}

function countUnresolvedAnalisis(entries: ChatEntry[]): number {
  let count = 0;
  const analisisEntries = entries.filter((e) => e.mode === 'analisis');
  analisisEntries.forEach((a) => {
    const aTime = new Date(a.created_at).getTime();
    const hasFollowUp = entries.some(
      (e) =>
        e.mode === 'plan' &&
        new Date(e.created_at).getTime() > aTime &&
        new Date(e.created_at).getTime() < aTime + 172800000
    );
    if (!hasFollowUp) count++;
  });
  return count;
}

function countRecoveries(entries: ChatEntry[]): number {
  let count = 0;
  entries.filter((e) => e.mode === 'analisis').forEach((a) => {
    const aTime = new Date(a.created_at).getTime();
    const hasReflect = entries.some(
      (e) =>
        e.mode === 'reflect' &&
        new Date(e.created_at).getTime() > aTime &&
        new Date(e.created_at).getTime() < aTime + 86400000
    );
    if (hasReflect) count++;
  });
  return count;
}

export function calcWeekStreak(entries: ChatEntry[]): number {
  if (entries.length === 0) return 0;
  const days = new Set(
    entries.map((e) => new Date(e.created_at).toDateString())
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
}

/** Streak hari aktif minggu ini dari entri periode berjalan */
export function getUserStreak(entries: ChatEntry[]): number {
  return calcWeekStreak(entries);
}

export function calcOxytocinScore(
  entries: ChatEntry[],
  periodDays = PERIOD_DAYS
): number {
  const ritualScore = checkDailyRitual(entries) ? 30 : 0;
  const reflectEntries = entries.filter((e) => e.mode === 'reflect').length;
  const reflectScore = Math.min(reflectEntries * 5, 25);
  const planScore = entries.some((e) => e.mode === 'plan') ? 20 : 0;
  const activeDays = getActiveDays(entries, periodDays);
  const checkInScore = Math.round((activeDays / periodDays) * 15);
  const convScore = entries.some((e) => e.mode === 'conversation') ? 10 : 0;
  return Math.min(
    ritualScore + reflectScore + planScore + checkInScore + convScore,
    100
  );
}

export function calcDopamineScore(entries: ChatEntry[], streak: number): number {
  const streakScore = Math.min(streak * 5, 35);
  const volumeScore = Math.min(entries.length * 3, 30);
  const uniqueModes = new Set(entries.map((e) => e.mode)).size;
  const varietyScore = Math.min(uniqueModes * 4, 20);
  const growthScore = entries.some((e) => e.mode === 'growth') ? 15 : 0;
  return Math.min(streakScore + volumeScore + varietyScore + growthScore, 100);
}

export function calcSerotoninScore(
  currentEntries: ChatEntry[],
  prevEntries: ChatEntry[],
  periodDays = PERIOD_DAYS
): number {
  const dailyCounts = getDailyActivityCounts(currentEntries, periodDays);
  const stdDev = calcStdDev(dailyCounts);
  const regularScore = Math.round(Math.max(0, 40 - stdDev * 8));
  const positiveCount = currentEntries.filter((e) =>
    ['reflect', 'plan', 'conversation'].includes(e.mode)
  ).length;
  const ratio =
    currentEntries.length > 0 ? positiveCount / currentEntries.length : 0;
  const moodScore = Math.round(ratio * 30);
  const trend = currentEntries.length >= prevEntries.length ? 30 : 15;
  return Math.min(regularScore + moodScore + trend, 100);
}

export function calcCortisolScore(entries: ChatEntry[]): number {
  let score = 100;
  const analisisCount = entries.filter((e) => e.mode === 'analisis').length;
  score -= analisisCount * 15;
  const gaps = getLongestGap(entries);
  if (gaps >= 3) score -= 20;
  const unresolved = countUnresolvedAnalisis(entries);
  score -= unresolved * 10;
  const recoveries = countRecoveries(entries);
  score += recoveries * 10;
  return Math.max(0, Math.min(score, 100));
}

export function computeHormoneScores(
  weekEntries: ChatEntry[],
  prevWeekEntries: ChatEntry[]
): HormoneScore {
  const streak = calcWeekStreak(weekEntries);
  return {
    oxytocin: calcOxytocinScore(weekEntries),
    dopamine: calcDopamineScore(weekEntries, streak),
    serotonin: calcSerotoninScore(weekEntries, prevWeekEntries),
    cortisol: calcCortisolScore(weekEntries),
  };
}

export function computeERComposite(raw: ERScoreRaw): number {
  return Math.round(
    raw.self_awareness * 0.25 +
      raw.self_regulation * 0.3 +
      raw.empathy * 0.2 +
      raw.social_skill * 0.25
  );
}
