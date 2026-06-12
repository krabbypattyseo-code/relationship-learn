import { NextRequest, NextResponse } from 'next/server';
import { getEntries } from '@/lib/storage';
import { snapshotPreviousWeek } from '@/lib/score-storage';
import type { UserId } from '@/types';

const USERS: UserId[] = ['harist', 'dian'];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let processed = 0;

  for (const userId of USERS) {
    const result = await getEntries({ userId, limit: 200 });
    if ('error' in result) continue;

    await snapshotPreviousWeek(userId, result);
    processed++;
  }

  return NextResponse.json({ ok: true, processed });
}
