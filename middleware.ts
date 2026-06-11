import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

const PROTECTED_PREFIXES = ['/harist', '/dian'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginRoute =
    pathname === '/harist/login' || pathname === '/dian/login';

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected || isLoginRoute) {
    return NextResponse.next();
  }

  const user = request.cookies.get(AUTH_COOKIE)?.value;
  const expectedUser = pathname.startsWith('/harist') ? 'harist' : 'dian';

  if (user !== expectedUser) {
    const loginUrl = new URL(`/${expectedUser}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/harist/:path*', '/dian/:path*'],
};
