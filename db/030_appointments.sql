-- Appointments core (idempotente)
create extension if not exists pgcrypto with schema public;

create table if not exists public.appointments (
  id bigserial primary key,
  patient_id uuid not null,
  doctor_id uuid not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_appt_time positive check (end_time > start_time),
  constraint chk_appt_status check (status in ('scheduled','confirmed','checked_in','completed','no_show','cancelled'))
);

create index if not exists idx_appt_doctor_time on public.appointments(doctor_id, start_time);
create index if not exists idx_appt_patient_time on public.appointments(patient_id, start_time);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end$$;

drop trigger if exists trg_appt_updated on public.appointments;
create trigger trg_appt_updated before update on public.appointments
for each row execute function public.set_updated_at();

alter table public.appointments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='appointments' and policyname='appt_select_self_patient_doctor') then
    create policy appt_select_self_patient_doctor on public.appointments
      for select to authenticated
      using (
        patient_id = auth.uid()
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','secretary','doctor'))
      );
  end if;
  if not exists (select 1 from pg_policies where tablename='appointments' and policyname='appt_admin_all') then
    create policy appt_admin_all on public.appointments
      for all to authenticated
      using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'))
      with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
  end if;
end $$;

