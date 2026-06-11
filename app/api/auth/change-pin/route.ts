import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE,
  getUserIdFromCookie,
  isValidUserId,
} from '@/lib/auth';
import { validatePin } from '@/lib/auth-server';
import { isValidNewPin, setPin } from '@/lib/pins';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = getUserIdFromCookie(
      req.cookies.get(AUTH_COOKIE)?.value
    );

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, currentPin, newPin } = body as {
      userId: unknown;
      currentPin: string;
      newPin: string;
    };

    if (!isValidUserId(userId) || userId !== sessionUser) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    if (!(await validatePin(userId, currentPin))) {
      return NextResponse.json({ error: 'PIN saat ini salah' }, { status: 401 });
    }

    if (!isValidNewPin(newPin)) {
      return NextResponse.json(
        { error: 'PIN baru harus 4–8 digit angka' },
        { status: 400 }
      );
    }

    if (currentPin === newPin) {
      return NextResponse.json(
        { error: 'PIN baru harus berbeda dari PIN lama' },
        { status: 400 }
      );
    }

    const result = await setPin(userId, newPin);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to change PIN';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
