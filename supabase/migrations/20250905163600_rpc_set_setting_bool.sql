-- RPC utilitária para upsert de boolean em settings
create or replace function public.set_setting_bool(_scope text, _subject_id uuid, _key text, _value boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings(scope, subject_id, key, value, is_active)
  values (_scope, _subject_id, _key, to_jsonb(_value), true)
  on conflict (scope, subject_id, key)
  do update set value = excluded.value, is_active = true, updated_at = now();
end;
$$;

-- opcional: permitir execucao para authenticated; Edge admin usa service role
grant execute on function public.set_setting_bool(text, uuid, text, boolean) to authenticated;

