#!/usr/bin/env bash
set -euo pipefail

PROJECT_REF="hcimldvemwlscilvejli"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI não encontrado. Instale com: brew install supabase/tap/supabase || npm i -g supabase" >&2
  exit 1
fi

echo "Verificando config: supabase/config.toml"
if [ ! -f supabase/config.toml ]; then
  echo "Arquivo supabase/config.toml não encontrado. Crie-o ou rode este repositório com os arquivos adicionados." >&2
  exit 1
fi

echo "Tentando linkar projeto: ${PROJECT_REF}"
supabase link --project-ref "${PROJECT_REF}"

echo "OK: projeto linkado. Você pode agora rodar: supabase functions deploy worker --project-ref ${PROJECT_REF}"

