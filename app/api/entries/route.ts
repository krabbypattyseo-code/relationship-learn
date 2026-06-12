import { NextRequest, NextResponse } from 'next/server';
import { isValidUserId } from '@/lib/auth';
import { createEntry, deleteEntry, getEntries } from '@/lib/storage';
import {
  recalculateAfterDelete,
  syncHormoneScores,
} from '@/lib/score-storage';
import type { Mode, Message } from '@/types';

const VALID_MODES: Mode[] = [
  'reflect',
  'analisis',
  'plan',
  'conversation',
  'growth',
];

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const mode = req.nextUrl.searchParams.get('mode') as Mode | null;
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  if (!isValidUserId(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  const result = await getEntries({
    userId,
    mode: mode && VALID_MODES.includes(mode) ? mode : undefined,
    limit,
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, mode, messages, title, scoreData } = body as {
      userId: unknown;
      mode: unknown;
      messages: Message[];
      title?: string;
      scoreData?: unknown;
    };

    if (!isValidUserId(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    if (!VALID_MODES.includes(mode as Mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const result = await createEntry({
      userId,
      mode: mode as Mode,
      messages,
      title,
      scoreData: scoreData as import('@/types').ModeScoreData | null | undefined,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const allEntriesResult = await getEntries({ userId, limit: 100 });
    let scores = null;
    let snapshot = null;

    if (!('error' in allEntriesResult)) {
      const sync = await syncHormoneScores(userId, allEntriesResult);
      scores = sync.hormone;
      snapshot = sync.snapshot;
    }

    return NextResponse.json({
      id: result.id,
      created_at: result.created_at,
      entryId: result.id,
      scores,
      snapshot,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, id } = body as { userId: unknown; id: unknown };

    if (!isValidUserId(userId) || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const deleted = await deleteEntry(id, userId);
    if ('error' in deleted) {
      return NextResponse.json({ error: deleted.error }, { status: 500 });
    }

    const remainingResult = await getEntries({ userId, limit: 100 });
    const remaining = 'error' in remainingResult ? [] : remainingResult;
    const snapshot = await recalculateAfterDelete(userId, remaining);

    return NextResponse.json({ ok: true, snapshot });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
