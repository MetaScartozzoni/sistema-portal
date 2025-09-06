-- SETTINGS + RPCs (idempotente)
-- Extensões
create extension if not exists pgcrypto with schema public;

-- Tabela settings (criacao inicial ou evolucao do esquema anterior)
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema='public' and table_name='settings'
  ) then
    create table public.settings (
      id          uuid primary key default gen_random_uuid(),
      scope       text not null check (scope in ('global','user','clinic')),
      subject_id  uuid, -- null para global; user_id para user; (reservado clinic)
      key         text not null,
      value       jsonb not null,
      is_active   boolean not null default true,
      valid_from  timestamptz not null default now(),
      valid_to    timestamptz,
      created_by  uuid references public.profiles(id),
      created_at  timestamptz not null default now(),
      updated_at  timestamptz not null default now()
    );
  else
    -- Evolução de colunas (se vier de um esquema minimalista anterior)
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='scope') then
      alter table public.settings add column scope text;
      update public.settings set scope = 'user' where scope is null;
      alter table public.settings alter column scope set not null;
      alter table public.settings add constraint settings_scope_chk check (scope in ('global','user','clinic'));
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='subject_id') then
      alter table public.settings add column subject_id uuid;
    end if;
    -- Migrar user_id -> subject_id se existir a coluna legada
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='user_id') then
      update public.settings set subject_id = coalesce(subject_id, user_id);
      -- assumimos que registros legados eram por-usuário
      update public.settings set scope = 'user' where scope is distinct from 'user' and subject_id is not null;
      alter table public.settings drop column user_id;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='is_active') then
      alter table public.settings add column is_active boolean not null default true;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='valid_from') then
      alter table public.settings add column valid_from timestamptz not null default now();
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='valid_to') then
      alter table public.settings add column valid_to timestamptz;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='created_by') then
      alter table public.settings add column created_by uuid references public.profiles(id);
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='created_at') then
      alter table public.settings add column created_at timestamptz not null default now();
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='settings' and column_name='updated_at') then
      alter table public.settings add column updated_at timestamptz not null default now();
    end if;
  end if;
end$$;

-- Unicidade (parciais) e índices
do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='uq_settings_global_key'
  ) then
    create unique index uq_settings_global_key
      on public.settings(scope, key)
      where scope='global' and subject_id is null;
  end if;
  if not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='uq_settings_scope_subject_key'
  ) then
    create unique index uq_settings_scope_subject_key
      on public.settings(scope, subject_id, key);
  end if;
end$$;

create index if not exists idx_settings_key on public.settings(key);
create index if not exists idx_settings_scope_subject on public.settings(scope, subject_id);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end$$;

drop trigger if exists trg_settings_updated_at on public.settings;
create trigger trg_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- RLS + policies
alter table public.settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename='settings' and p.policyname='settings_select_global') then
    create policy settings_select_global on public.settings
      for select to authenticated
      using (
        scope='global' and is_active
        and valid_from <= now()
        and (valid_to is null or valid_to > now())
      );
  end if;

  if not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename='settings' and p.policyname='settings_select_self') then
    create policy settings_select_self on public.settings
      for select to authenticated
      using (
        scope='user'
        and subject_id = auth.uid()
        and is_active
        and valid_from <= now()
        and (valid_to is null or valid_to > now())
      );
  end if;

  if not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename='settings' and p.policyname='settings_admin_all') then
    create policy settings_admin_all on public.settings
      for all to authenticated
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'))
      with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
  end if;
end$$;

-- RPCs
create or replace function public.get_effective_settings(_user_id uuid)
returns jsonb
language sql
stable
as $$
with g as (
  select key, value
  from public.settings
  where scope='global' and is_active
    and valid_from <= now()
    and (valid_to is null or valid_to > now())
),
u as (
  select key, value
  from public.settings
  where scope='user' and subject_id=_user_id and is_active
    and valid_from <= now()
    and (valid_to is null or valid_to > now())
)
select coalesce( (select jsonb_object_agg(key,value) from g), '{}'::jsonb)
     || coalesce( (select jsonb_object_agg(key,value) from u), '{}'::jsonb);
$$;

grant execute on function public.get_effective_settings(uuid) to authenticated;

create or replace function public.get_feature_flags(_user_id uuid)
returns jsonb
language sql
stable
as $$
with mods as (
  select key, value
  from public.settings
  where scope in ('global','user')
    and (subject_id is null or subject_id=_user_id)
    and is_active
    and key like 'module.%'
    and valid_from <= now()
    and (valid_to is null or valid_to > now())
)
select coalesce(
  (select jsonb_object_agg(m.key, coalesce((m.value->>0)::boolean, (m.value)::boolean)) from mods m),
  '{}'::jsonb
);
$$;

grant execute on function public.get_feature_flags(uuid) to authenticated;

-- Seed global (idempotente)
insert into public.settings(scope, subject_id, key, value, is_active)
values
 ('global', null, 'module.orcamento',  'true'::jsonb, true),
 ('global', null, 'module.financeiro', 'true'::jsonb, true),
 ('global', null, 'module.bot',        'true'::jsonb, true),
 ('global', null, 'module.agenda',     'true'::jsonb, true),
 ('global', null, 'module.prontuario', 'true'::jsonb, true)
on conflict do nothing;

