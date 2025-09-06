#!/usr/bin/env bash
set -euo pipefail

# Provisiona migrações, segredos do Vault e cron no projeto Supabase

PROJECT_REF="${PROJECT_REF:-hcimldvemwlscilvejli}"
EDGE_CRON_TOKEN="${EDGE_CRON_TOKEN:-}"
REMOTE_DB_URL="${REMOTE_DB_URL:-}"
DB_PASSWORD="${DB_PASSWORD:-}"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI não encontrado. Instale: brew install supabase/tap/supabase ou npm i -g supabase" >&2
  exit 1
fi

if ! supabase projects list >/dev/null 2>&1; then
  echo "Faça login no CLI: supabase login --token <ACCESS_TOKEN>" >&2
  exit 2
fi

echo "Linkando projeto (se necessário): $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF" >/dev/null 2>&1 || true

echo "==> [REMOTE] Aplicando migrações"
if [ -n "$REMOTE_DB_URL" ]; then
  supabase db push --db-url "$REMOTE_DB_URL"
else
  if [ -n "$DB_PASSWORD" ]; then
    supabase db push --linked -p "$DB_PASSWORD"
  else
    echo "Informe a senha do banco para o projeto $PROJECT_REF (input oculto)"
    read -s -p "DB password: " DB_PASSWORD
    echo
    supabase db push --linked -p "$DB_PASSWORD"
  fi
fi

# Preparar EDGE token
if [ -z "$EDGE_CRON_TOKEN" ]; then
  read -s -p "Cole o EDGE_CRON_TOKEN a ser salvo no Vault: " EDGE_CRON_TOKEN
  echo
fi

EDGE_URL="https://$PROJECT_REF.functions.supabase.co/worker"

echo "==> [REMOTE] Configurando Vault (edge_url / edge_token) e pg_cron (*/5)"
supabase db query <<SQL
create extension if not exists pg_net;
-- criar/atualizar segredos
select vault.create_secret('edge_url', '$EDGE_URL');
select vault.create_secret('edge_token', '$EDGE_CRON_TOKEN');

do $$
declare has_cron boolean;
begin
  select exists(select 1 from pg_extension where extname='pg_cron') into has_cron;
  if has_cron then
    perform cron.schedule(
      'lead-alert-worker-5m',
      '*/5 * * * *',
      $$
      select net.http_post(
        url := vault.read_secret('edge_url'),
        headers := jsonb_build_object(
          'Authorization','Bearer '||vault.read_secret('edge_token'),
          'Content-Type','application/json'
        ),
        body := '{}'::jsonb
      );
      $$
    );
  else
    raise notice 'pg_cron não está habilitado neste projeto. Pulei o agendamento.';
  end if;
end$$;
SQL

echo "OK: Migrações aplicadas, segredos definidos e cron (se disponível) configurado."

