import { NextRequest, NextResponse } from 'next/server';
import { isValidUserId } from '@/lib/auth';
import { getEntries } from '@/lib/storage';
import {
  emptySnapshot,
  getLatestScores,
  getScoreHistory,
  syncHormoneScores,
} from '@/lib/score-storage';
import { formatWeekLabel } from '@/lib/scoring-ui';
import type { ChatEntry } from '@/types';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const type = req.nextUrl.searchParams.get('type') ?? 'latest';
  const refresh = req.nextUrl.searchParams.get('refresh') === 'hormone';
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 8;

  if (!isValidUserId(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  if (type === 'history') {
    const snapshots = await getScoreHistory(userId, limit);
    return NextResponse.json({
      snapshots,
      weeks: snapshots.map((s) => formatWeekLabel(s.periodStart)),
    });
  }

  const entriesResult = await getEntries({ userId, limit: 100 });
  const entries: ChatEntry[] = 'error' in entriesResult ? [] : entriesResult;

  let snapshot = await getLatestScores(userId);

  if (refresh && entries.length > 0) {
    const sync = await syncHormoneScores(userId, entries);
    snapshot = sync.snapshot;
  } else if (!snapshot && entries.length > 0) {
    const sync = await syncHormoneScores(userId, entries);
    snapshot = sync.snapshot;
  } else if (!snapshot) {
    snapshot = emptySnapshot(userId);
  }

  return NextResponse.json({
    snapshot,
    hasERScore: snapshot.er != null,
    lastUpdated: snapshot.lastUpdated,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body as { userId: unknown };

    if (!isValidUserId(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const entriesResult = await getEntries({ userId, limit: 100 });
    if ('error' in entriesResult) {
      return NextResponse.json({ error: entriesResult.error }, { status: 500 });
    }

    if (entriesResult.length === 0) {
      return NextResponse.json({ snapshot: emptySnapshot(userId) });
    }

    const { snapshot, hormone } = await syncHormoneScores(userId, entriesResult);
    return NextResponse.json({ snapshot, scores: hormone });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to refresh scores';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
