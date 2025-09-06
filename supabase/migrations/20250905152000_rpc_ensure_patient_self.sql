-- 063_rpc_ensure_patient_self.sql
-- Garante patients(row) para o usuário autenticado; idempotente.

create or replace function public.ensure_patient_self()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth required';
  end if;

  insert into public.patients (user_id)
  select auth.uid()
  where not exists (
    select 1 from public.patients where user_id = auth.uid()
  );
end;
$$;

grant execute on function public.ensure_patient_self() to authenticated;

