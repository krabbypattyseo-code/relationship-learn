import type { ChatEntry, Message, Mode, ModeScoreData, UserId } from '@/types';
import { getServiceClient } from '@/lib/supabase';

function rowToEntry(row: {
  id: string;
  user_id: string;
  mode: string;
  title: string | null;
  messages: unknown;
  score_data?: unknown;
  created_at: string;
  updated_at: string;
}): ChatEntry {
  return {
    id: row.id,
    user_id: row.user_id as UserId,
    mode: row.mode as Mode,
    title: row.title,
    messages: row.messages as Message[],
    score_data: (row.score_data as ModeScoreData | null) ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function createEntry(params: {
  userId: UserId;
  mode: Mode;
  messages: Message[];
  title?: string;
  scoreData?: ModeScoreData | null;
}): Promise<{ id: string; created_at: string } | { error: string }> {
  const client = getServiceClient();

  if (!client) {
    return { error: 'Supabase not configured' };
  }

  const title =
    params.title?.trim() ||
    params.messages.find((m) => m.role === 'user')?.content.slice(0, 80) ||
    'Untitled entry';

  const { data, error } = await client
    .from('chat_entries')
    .insert({
      user_id: params.userId,
      mode: params.mode,
      title,
      messages: params.messages as unknown as import('@/types/database').Json,
      score_data: params.scoreData
        ? (params.scoreData as unknown as import('@/types/database').Json)
        : null,
    })
    .select('id, created_at')
    .single();

  if (error) {
    return { error: error.message };
  }

  return { id: data.id, created_at: data.created_at };
}

export async function getEntries(params: {
  userId: UserId;
  mode?: Mode;
  limit?: number;
}): Promise<ChatEntry[] | { error: string }> {
  const client = getServiceClient();

  if (!client) {
    return { error: 'Supabase not configured' };
  }

  let query = client
    .from('chat_entries')
    .select('*')
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false })
    .limit(params.limit ?? 20);

  if (params.mode) {
    query = query.eq('mode', params.mode);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return (data ?? []).map(rowToEntry);
}

export async function getEntryById(id: string): Promise<ChatEntry | null> {
  const client = getServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('chat_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return rowToEntry(data);
}

export async function deleteEntry(
  id: string,
  userId: UserId
): Promise<{ ok: true } | { error: string }> {
  const client = getServiceClient();

  if (!client) {
    return { error: 'Supabase not configured' };
  }

  const { error } = await client
    .from('chat_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
