#!/usr/bin/env bash
set -euo pipefail

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI não encontrado. Instale: brew install supabase/tap/supabase ou npm i -g supabase" >&2
  exit 1
fi

ENV_FILE="supabase/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo $ENV_FILE não encontrado. Crie e preencha as variáveis necessárias." >&2
  exit 2
fi

echo "Servindo Edge Functions localmente com env-file: $ENV_FILE"
echo "Dica: endpoints em http://localhost:54321/functions/v1/<name> (quando stack local estiver ativa)"
supabase functions serve --env-file "$ENV_FILE"

