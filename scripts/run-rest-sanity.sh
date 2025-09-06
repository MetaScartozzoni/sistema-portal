#!/usr/bin/env bash
set -euo pipefail

PROJECT_REF="hcimldvemwlscilvejli"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI não encontrado. Instale: brew install supabase/tap/supabase ou npm i -g supabase" >&2
  exit 1
fi

if ! supabase projects list >/dev/null 2>&1; then
  echo "Faça login no CLI: supabase login --token <ACCESS_TOKEN>" >&2
  exit 2
fi

# Token do usuário (JWT) para testar Auth e RLS via REST
ACCESS_TOKEN_2=${ACCESS_TOKEN_2:-}
if [ -z "${ACCESS_TOKEN_2}" ]; then
  read -s -p "Cole o ACCESS_TOKEN_2 (JWT): " ACCESS_TOKEN_2
  echo
fi

echo "[1/3] Preparando sessão (pg_net + placeholder)..."
supabase db query <<'SQL'
create extension if not exists pg_net;
do $$
declare
  ref           text := 'hcimldvemwlscilvejli';
  anon_key      text := vault.get_secret('anon_key');
  access_token  text := current_setting('app.access_token', true);
  base_url      text := 'https://'||ref||'.supabase.co';
  auth_user_url text := base_url||'/auth/v1/user';
  rest_profiles text := base_url||'/rest/v1/profiles';
  http_get_ret  text; http_post_ret text;
  st int; h jsonb; b jsonb; uid uuid; rows_all int; rows_self int; job_id bigint;
  now_ts text := to_char(clock_timestamp(),'YYYYMMDDHH24MISS');
begin
  perform set_config('app.access_token','__ACCESS_TOKEN_PLACEHOLDER__', true);
end$$;
SQL

echo "[2/3] Injetando token na sessão atual..."
supabase db query "select set_config('app.access_token', '${ACCESS_TOKEN_2}', true);"

echo "[3/3] Executando sanity (auth + select + upsert guard)..."
supabase db query <<'SQL'
do $$
declare
  ref           text := 'hcimldvemwlscilvejli';
  anon_key      text := vault.get_secret('anon_key');
  access_token  text := current_setting('app.access_token', true);
  base_url      text := 'https://'||ref||'.supabase.co';
  auth_user_url text := base_url||'/auth/v1/user';
  rest_profiles text := base_url||'/rest/v1/profiles';
  http_get_ret  text; http_post_ret text;
  st int; h jsonb; b jsonb; uid uuid; rows_all int; rows_self int; job_id bigint;
  now_ts text := to_char(clock_timestamp(),'YYYYMMDDHH24MISS');

  function is_async(name text) returns boolean language sql stable as $f$
    select t.typname in ('int8','bigint')
    from pg_proc p join pg_type t on t.oid=p.prorettype join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='net' and p.proname=name limit 1;
  $f$;
begin
  -- AUTH
  if is_async('http_get') then
    select net.http_get(url:=auth_user_url, headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) into job_id;
    select (res).status,(res).headers,(res).body into st,h,b from (select net.http_collect(job_id) as res) t;
  else
    select (res).status,(res).headers,(res).body into st,h,b
    from (select net.http_get(url:=auth_user_url, headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) as res) t;
  end if;
  if st<>200 then raise exception 'AUTH FAIL: % %', st, b; end if;
  uid := (b->>'id')::uuid;
  raise notice 'AUTH OK uid=% email=%', uid, b->>'email';

  -- SELECT ALL
  if is_async('http_get') then
    select net.http_get(url:=rest_profiles||'?select=id,email,role', headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) into job_id;
    select (res).status,(res).body into st,b from (select net.http_collect(job_id) as res) t;
  else
    select (res).status,(res).body into st,b
    from (select net.http_get(url:=rest_profiles||'?select=id,email,role', headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) as res) t;
  end if;
  if st<>200 then raise exception 'SELECT ALL FAIL: % %', st, b; end if;
  raise notice 'SELECT ALL rows=%', coalesce(jsonb_array_length(b),0);

  -- SELECT SELF
  if is_async('http_get') then
    select net.http_get(url:=rest_profiles||'?select=id,email,role&id=eq.'||uid::text, headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) into job_id;
    select (res).status,(res).body into st,b from (select net.http_collect(job_id) as res) t;
  else
    select (res).status,(res).body into st,b
    from (select net.http_get(url:=rest_profiles||'?select=id,email,role&id=eq.'||uid::text, headers:=jsonb_build_object(
      'apikey',anon_key,'Authorization','Bearer '||access_token,'Accept','application/json'
    )) as res) t;
  end if;
  if st<>200 then raise exception 'SELECT SELF FAIL: % %', st, b; end if;
  raise notice 'SELECT SELF rows=% (esperado 1)', coalesce(jsonb_array_length(b),0);

  -- UPDATE self (esperado: bloqueado para não-admin)
  if is_async('http_post') then
    select net.http_post(
      url:=rest_profiles,
      headers:=jsonb_build_object(
        'apikey',anon_key,'Authorization','Bearer '||access_token,
        'Content-Type','application/json','Prefer','resolution=merge-duplicates,return=representation'
      ),
      body:=jsonb_build_array(jsonb_build_object('id',uid::text,'last_name','RLS_TEST_'||now_ts))
    ) into job_id;
    select (res).status,(res).body into st,b from (select net.http_collect(job_id) as res) t;
  else
    select (res).status,(res).body into st,b
    from (select net.http_post(
      url:=rest_profiles,
      headers:=jsonb_build_object(
        'apikey',anon_key,'Authorization','Bearer '||access_token,
        'Content-Type','application/json','Prefer','resolution=merge-duplicates,return=representation'
      ),
      body:=jsonb_build_array(jsonb_build_object('id',uid::text,'last_name','RLS_TEST_'||now_ts))
    ) as res) t;
  end if;

  if st in (200,201) then
    raise notice 'UPSERT/UPDATE PERMITIDO (provável admin) status=%', st;
  else
    raise notice 'UPSERT/UPDATE BLOQUEADO (ok p/ não-admin) status=%', st;
  end if;
end$$;
SQL

echo "Sanity concluído. Verifique os NOTICEs acima."

