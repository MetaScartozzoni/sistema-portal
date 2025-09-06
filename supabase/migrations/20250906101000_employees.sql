-- wrap db/050_employees.sql
create table if not exists public.employees (
  id bigserial primary key,
  user_id uuid not null,
  email text,
  role text not null,
  department text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_employees_user on public.employees(user_id);
create unique index if not exists uq_employees_user on public.employees(user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_employees_updated on public.employees;
create trigger trg_employees_updated before update on public.employees
for each row execute function public.set_updated_at();

alter table public.employees enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='emp_self_read') then
    create policy emp_self_read on public.employees for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='emp_admin_all') then
    create policy emp_admin_all on public.employees for all to authenticated
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'))
      with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='emp_secretary_read') then
    create policy emp_secretary_read on public.employees for select to authenticated
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','secretary')));
  end if;
end $$;

create or replace function public.upsert_employee(_user_id uuid, _email text, _role text, _department text, _status text)
returns public.employees
language plpgsql security definer set search_path = public as $$
declare rec public.employees;
begin
  insert into public.employees(user_id, email, role, department, status)
  values (_user_id, _email, coalesce(_role,'secretary'), _department, coalesce(_status,'active'))
  on conflict (user_id) do update set
    email = excluded.email,
    role = excluded.role,
    department = excluded.department,
    status = excluded.status,
    updated_at = now()
  returning * into rec;
  return rec;
end; $$;

grant execute on function public.upsert_employee(uuid, text, text, text, text) to authenticated;

