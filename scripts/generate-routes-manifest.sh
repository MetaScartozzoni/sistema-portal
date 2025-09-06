#!/usr/bin/env bash
set -euo pipefail

# Gera api/routes-manifest.json com endpoints conhecidos (Edge Functions + RPC)

WORKDIR=$(cd "$(dirname "$0")/.." && pwd)
CONF="$WORKDIR/supabase/config.toml"
OUT="$WORKDIR/api/routes-manifest.json"

if [ ! -f "$CONF" ]; then
  echo "Arquivo supabase/config.toml não encontrado" >&2
  exit 1
fi

PROJECT_REF=$(sed -nE 's/^\s*project_id\s*=\s*"([^"]+)".*/\1/p' "$CONF" | head -n1 || true)
if [ -z "$PROJECT_REF" ]; then
  PROJECT_REF="hcimldvemwlscilvejli"
fi

BASE="https://$PROJECT_REF.supabase.co"

cat > "$OUT" <<JSON
{
  "project_ref": "$PROJECT_REF",
  "base_url": "$BASE",
  "edge_functions": [
    {
      "name": "worker",
      "method": "POST",
      "path": "/functions/v1/worker",
      "headers": ["Authorization: Bearer <EDGE_CRON_TOKEN>", "x-edge-token: <EDGE_CRON_TOKEN>"]
    },
    {
      "name": "appointment-actions",
      "method": "POST",
      "path": "/functions/v1/appointment-actions",
      "headers": ["Authorization: Bearer <USER_JWT>"]
    },
    {
      "name": "get-user-painel",
      "method": "POST",
      "path": "/functions/v1/get-user-painel",
      "headers": ["Authorization: Bearer <USER_JWT>"]
    },
    {
      "name": "health",
      "method": "GET",
      "path": "/functions/v1/health",
      "query": ["deep=1"]
    },
    {
      "name": "auth-accept-invite",
      "method": "POST",
      "path": "/functions/v1/auth-accept-invite",
      "headers": ["Authorization: Bearer <USER_JWT>"]
    },
    {
      "name": "auth-webhook-users-sync",
      "method": "POST",
      "path": "/functions/v1/auth-webhook-users-sync",
      "headers": ["X-Supabase-Signature: <HMAC>"]
    }
    ,
    {
      "name": "get-feature-flags",
      "method": "POST",
      "path": "/functions/v1/get-feature-flags",
      "headers": ["Authorization: Bearer <USER_JWT>"]
    }
  ],
  "rpc": [
    { "name": "ensure_patient_self", "notes": "cria patient para auth.uid() se não existir" }
  ],
  "cron": [
    { "job": "lead-alert-worker-5m", "schedule": "*/5 * * * *", "triggers": "POST /functions/v1/worker" }
  ],
  "express_api": []
}
JSON

echo "Manifest gerado em: $OUT"
