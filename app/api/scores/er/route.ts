import { NextRequest, NextResponse } from 'next/server';
import { isValidUserId } from '@/lib/auth';
import { generateERScoreForUser } from '@/lib/score-storage';
import { getEntries } from '@/lib/storage';

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

    const result = await generateERScoreForUser(userId, entriesResult);

    if (!result.ok) {
      const status = result.code === 'no_entries' ? 400 : 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status });
    }

    return NextResponse.json({
      snapshot: result.snapshot,
      er: result.er,
      cached: result.cached,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate ER score';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
