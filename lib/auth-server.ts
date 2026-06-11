import { getPin } from '@/lib/pins';
import type { UserId } from '@/types';

export async function validatePin(userId: UserId, pin: string): Promise<boolean> {
  const expected = await getPin(userId);
  if (!expected) return false;
  return pin === expected;
}
