import { promises as fs } from 'fs';
import path from 'path';
import { getServiceClient } from '@/lib/supabase';
import type { UserId } from '@/types';

const PINS_FILE = path.join(process.cwd(), 'data', 'pins.json');

function envPin(userId: UserId): string | null {
  return userId === 'harist'
    ? process.env.PIN_HARIST ?? null
    : process.env.PIN_DIAN ?? null;
}

async function readFilePins(): Promise<Partial<Record<UserId, string>>> {
  try {
    const raw = await fs.readFile(PINS_FILE, 'utf-8');
    return JSON.parse(raw) as Partial<Record<UserId, string>>;
  } catch {
    return {};
  }
}

async function writeFilePin(userId: UserId, pin: string): Promise<void> {
  await fs.mkdir(path.dirname(PINS_FILE), { recursive: true });
  const current = await readFilePins();
  await fs.writeFile(
    PINS_FILE,
    JSON.stringify({ ...current, [userId]: pin }, null, 2),
    'utf-8'
  );
}

async function getPinFromSupabase(userId: UserId): Promise<string | null> {
  const client = getServiceClient();
  if (!client) return null;

  const { data, error } = await client
    .from('user_settings')
    .select('pin')
    .eq('user_id', userId)
    .single();

  if (error || !data?.pin) return null;
  return data.pin;
}

async function setPinInSupabase(
  userId: UserId,
  pin: string
): Promise<{ ok: true } | { error: string }> {
  const client = getServiceClient();
  if (!client) return { error: 'Supabase not configured' };

  const { error } = await client.from('user_settings').upsert(
    { user_id: userId, pin, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );

  if (error) return { error: error.message };
  return { ok: true };
}

export async function getPin(userId: UserId): Promise<string | null> {
  const fromDb = await getPinFromSupabase(userId);
  if (fromDb) return fromDb;

  const fromFile = (await readFilePins())[userId];
  if (fromFile) return fromFile;

  return envPin(userId);
}

export async function setPin(
  userId: UserId,
  pin: string
): Promise<{ ok: true } | { error: string }> {
  const supabaseResult = await setPinInSupabase(userId, pin);
  if ('ok' in supabaseResult) return supabaseResult;

  try {
    await writeFilePin(userId, pin);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save PIN';
    return { error: message };
  }
}

export function isValidNewPin(pin: string): boolean {
  return /^\d{4,8}$/.test(pin);
}
