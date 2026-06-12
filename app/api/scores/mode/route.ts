import { NextRequest, NextResponse } from 'next/server';
import { isValidUserId } from '@/lib/auth';
import { getEntries } from '@/lib/storage';
import {
  buildModeHistoricalResponse,
  getPeriodModeEntries,
} from '@/lib/mode-scoring';
import { filterEntriesInPeriod, getMondayOfWeek, getSundayOfWeek } from '@/lib/scoring';
import type { Mode } from '@/types';

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
  const limit = limitParam ? parseInt(limitParam, 10) : 5;

  if (!isValidUserId(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  if (!mode || !VALID_MODES.includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  const result = await getEntries({ userId, limit: 100 });
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const modeEntries = getPeriodModeEntries(result, mode);
  const allInPeriod = filterEntriesInPeriod(
    result,
    getMondayOfWeek(),
    getSundayOfWeek()
  );

  const response = buildModeHistoricalResponse(
    userId,
    mode,
    modeEntries,
    allInPeriod,
    limit
  );

  return NextResponse.json(response);
}
