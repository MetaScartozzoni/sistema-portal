-- Module health + audit logs (idempotente)

create table if not exists public.module_health (
  module text primary key,
  status text not null,
  last_incident_at timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_module_health(_m text, _status text)
returns void language sql as $$
  insert into public.module_health(module, status, last_incident_at, updated_at)
  values(_m, _status, case when _status<>'ok' then now() end, now())
  on conflict (module) do update
  set status = excluded.status,
      last_incident_at = case when excluded.status<>'ok' then now() else public.module_health.last_incident_at end,
      updated_at = now();
$$;

create table if not exists public.audit_logs (
  id bigserial primary key,
  user_id uuid,
  action text not null,
  target text,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.module_health enable row level security;
alter table public.audit_logs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='module_health' and policyname='mh_select_all') then
    create policy mh_select_all on public.module_health for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='audit_logs' and policyname='al_select_admin') then
    create policy al_select_admin on public.audit_logs for select to authenticated
      using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
  end if;
end $$;

