#!/usr/bin/env bash
set -euo pipefail

# Applies migrations to local (if running) and remote (if DB URL provided or configured).

PROJECT_REF="hcimldvemwlscilvejli"
REMOTE_DB_URL=${REMOTE_DB_URL:-}
DB_PASSWORD=${DB_PASSWORD:-}

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI não encontrado. Instale: brew install supabase/tap/supabase ou npm i -g supabase" >&2
  exit 1
fi

if ! supabase projects list >/dev/null 2>&1; then
  echo "Faça login no CLI: supabase login --token <ACCESS_TOKEN>" >&2
  exit 2
fi

echo "==> [LOCAL] Aplicando migrations no banco local (se disponível)"
if supabase status >/dev/null 2>&1; then
  supabase db push || { echo "Aviso: falha ao aplicar no local." >&2; }
else
  echo "Stack local não está ativo. Inicie com: supabase start (opcional)" >&2
fi

echo "==> [REMOTE] Aplicando migrations no projeto ${PROJECT_REF}"

# Prefer DB URL explícita se fornecida; caso contrário tenta usar config/link
if [ -n "$REMOTE_DB_URL" ]; then
  supabase db push --db-url "$REMOTE_DB_URL"
else
  echo "Nenhuma REMOTE_DB_URL fornecida. Tentando usar projeto linkado..."
  # Tenta linkar para garantir contexto
  supabase link --project-ref "$PROJECT_REF" >/dev/null 2>&1 || true
  # Se senha estiver disponível, passamos via -p para evitar prompt
  if [ -n "$DB_PASSWORD" ]; then
    supabase db push --linked -p "$DB_PASSWORD"
  else
    echo "Dica: exporte DB_PASSWORD=... para não-interativo, ou REMOTE_DB_URL=postgres://..." >&2
    # Tenta sem senha (pode abrir prompt interativo)
    supabase db push --linked || {
      echo "Falha ao aplicar no remoto. Informe DB_PASSWORD ou REMOTE_DB_URL." >&2
      exit 5
    }
  fi
fi

echo "OK: migrations aplicadas (onde disponível)."
