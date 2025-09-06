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

echo "Linkando projeto (se necessário): $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF" >/dev/null 2>&1 || true

echo "Deploy das functions (verify_jwt=false via config.toml)"
supabase functions deploy worker --project-ref "$PROJECT_REF"
supabase functions deploy health --project-ref "$PROJECT_REF"

echo "OK: Functions deploy concluído."
