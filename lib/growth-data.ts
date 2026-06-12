import { getEntries } from '@/lib/storage';
import {
  emptySnapshot,
  getLatestScores,
  syncHormoneScores,
} from '@/lib/score-storage';
import type { ChatEntry, GrowthScoreSnapshot, UserId } from '@/types';

/** Dashboard load: baca DB, hormone refresh on-demand jika belum ada snapshot */
export async function loadGrowthData(userId: UserId): Promise<{
  entries: ChatEntry[];
  snapshot: GrowthScoreSnapshot;
}> {
  const result = await getEntries({ userId, limit: 100 });
  const entries: ChatEntry[] = 'error' in result ? [] : result;

  let snapshot = await getLatestScores(userId);

  if (!snapshot && entries.length > 0) {
    const sync = await syncHormoneScores(userId, entries);
    snapshot = sync.snapshot;
  }

  if (!snapshot) {
    snapshot = emptySnapshot(userId);
  }

  return { entries, snapshot };
}

/** Manual refresh — hormone only, no Claude */
export async function refreshGrowthScores(userId: UserId): Promise<GrowthScoreSnapshot> {
  const result = await getEntries({ userId, limit: 100 });
  const entries: ChatEntry[] = 'error' in result ? [] : result;
  if (entries.length === 0) return emptySnapshot(userId);
  const { snapshot } = await syncHormoneScores(userId, entries);
  return snapshot;
}
