import type { UserId } from '@/types';

export const AUTH_COOKIE = 'rgp_user';

export function isValidUserId(value: unknown): value is UserId {
  return value === 'harist' || value === 'dian';
}

export function getUserIdFromCookie(value: string | undefined): UserId | null {
  if (value === 'harist' || value === 'dian') return value;
  return null;
}
