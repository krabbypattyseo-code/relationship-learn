import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, isValidUserId } from '@/lib/auth';
import { validatePin } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, pin } = body as { userId: unknown; pin: string };

    if (!isValidUserId(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    if (!(await validatePin(userId, pin))) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, userId });

    response.cookies.set(AUTH_COOKIE, userId, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Auth failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
