-- wrap of db/030_appointments.sql
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
  constraint chk_appt_time check (end_time > start_time),
  constraint chk_appt_status check (status in ('scheduled','confirmed','checked_in','completed','no_show','cancelled'))
);

create index if not exists idx_appt_doctor_time on public.appointments(doctor_id, start_time);
create index if not exists idx_appt_patient_time on public.appointments(patient_id, start_time);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

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

-- wrap of db/031_appointments_rpcs.sql
create or replace function public.book_appointment_atomic(doctor_id uuid, patient_id uuid, start_time timestamptz, end_time timestamptz)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  appt public.appointments;
  key bigint;
begin
  if end_time <= start_time then
    raise exception 'invalid time window' using errcode='22007';
  end if;

  key := ('x'||substr(md5(doctor_id::text|| date_trunc('minute', start_time)::text),1,15))::bit(60)::bigint;
  perform pg_advisory_xact_lock(key);

  if exists (
    select 1 from public.appointments a
    where a.doctor_id = doctor_id
      and a.status not in ('cancelled','no_show')
      and tstzrange(a.start_time, a.end_time, '[)') && tstzrange(start_time, end_time, '[)')
  ) then
    raise exception 'conflict: overlapping' using errcode='40001';
  end if;

  insert into public.appointments(patient_id, doctor_id, start_time, end_time)
  values (patient_id, doctor_id, start_time, end_time)
  returning * into appt;

  return appt;
end;
$$;

create or replace function public.appointment_confirm(id bigint)
returns void language sql security definer as $$
  update public.appointments set status='confirmed' where appointments.id = id;
$$;
create or replace function public.appointment_check_in(id bigint)
returns void language sql security definer as $$
  update public.appointments set status='checked_in' where appointments.id = id;
$$;
create or replace function public.appointment_complete(id bigint)
returns void language sql security definer as $$
  update public.appointments set status='completed' where appointments.id = id;
$$;
create or replace function public.appointment_no_show(id bigint)
returns void language sql security definer as $$
  update public.appointments set status='no_show' where appointments.id = id;
$$;
create or replace function public.appointment_cancel(id bigint)
returns void language sql security definer as $$
  update public.appointments set status='cancelled' where appointments.id = id;
$$;
create or replace function public.appointment_reschedule(id bigint, start_time timestamptz, end_time timestamptz)
returns void language plpgsql security definer as $$
begin
  if end_time <= start_time then
    raise exception 'invalid time window' using errcode='22007';
  end if;
  update public.appointments set start_time=start_time, end_time=end_time where appointments.id = id;
end; $$;

grant execute on function public.book_appointment_atomic(uuid, uuid, timestamptz, timestamptz) to authenticated;
grant execute on function public.appointment_confirm(bigint) to authenticated;
grant execute on function public.appointment_check_in(bigint) to authenticated;
grant execute on function public.appointment_complete(bigint) to authenticated;
grant execute on function public.appointment_no_show(bigint) to authenticated;
grant execute on function public.appointment_cancel(bigint) to authenticated;
grant execute on function public.appointment_reschedule(bigint, timestamptz, timestamptz) to authenticated;

