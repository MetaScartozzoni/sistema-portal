-- RPCs para agendamento

-- tentativa de evitar corrida via advisory lock no par (doctor_id, time bucket)
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

  -- lock por médico em janela de 15min
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
returns void
language plpgsql
security definer
as $$
begin
  if end_time <= start_time then
    raise exception 'invalid time window' using errcode='22007';
  end if;
  update public.appointments set start_time=start_time, end_time=end_time where appointments.id = id;
end;
$$;

grant execute on function public.book_appointment_atomic(uuid, uuid, timestamptz, timestamptz) to authenticated;
grant execute on function public.appointment_confirm(bigint) to authenticated;
grant execute on function public.appointment_check_in(bigint) to authenticated;
grant execute on function public.appointment_complete(bigint) to authenticated;
grant execute on function public.appointment_no_show(bigint) to authenticated;
grant execute on function public.appointment_cancel(bigint) to authenticated;
grant execute on function public.appointment_reschedule(bigint, timestamptz, timestamptz) to authenticated;

