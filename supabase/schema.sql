-- Run this in Supabase SQL Editor

create table if not exists chat_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null check (user_id in ('harist', 'dian')),
  mode text not null check (mode in ('reflect', 'analisis', 'plan', 'conversation', 'growth')),
  title text,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_entries_user_id_idx on chat_entries (user_id);
create index if not exists chat_entries_created_at_idx on chat_entries (created_at desc);

alter table chat_entries enable row level security;

-- MVP: allow all (tighten before production)
create policy "Allow all for MVP"
  on chat_entries
  for all
  using (true)
  with check (true);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger chat_entries_updated_at
  before update on chat_entries
  for each row
  execute function update_updated_at();

-- PIN storage (overrides .env PIN when set)
create table if not exists user_settings (
  user_id text primary key check (user_id in ('harist', 'dian')),
  pin text not null,
  updated_at timestamptz not null default now()
);

alter table user_settings enable row level security;

create policy "Allow all for MVP on user_settings"
  on user_settings
  for all
  using (true)
  with check (true);
