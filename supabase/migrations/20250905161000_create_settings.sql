-- Feature Flags / Settings (global e por usuário)
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  constraint uq_settings_global unique (key) where user_id is null,
  constraint uq_settings_user unique (user_id, key)
);

create index if not exists idx_settings_user on public.settings(user_id);

