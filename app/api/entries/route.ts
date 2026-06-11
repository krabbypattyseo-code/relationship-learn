import { NextRequest, NextResponse } from 'next/server';
import { isValidUserId } from '@/lib/auth';
import { createEntry, getEntries } from '@/lib/storage';
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
    const { userId, mode, messages, title } = body as {
      userId: unknown;
      mode: unknown;
      messages: Message[];
      title?: string;
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
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
