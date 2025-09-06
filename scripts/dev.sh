#!/usr/bin/env bash
set -euo pipefail

panel="${1:-}"

if [[ -z "$panel" ]]; then
  echo "Usage: $0 <admin|funcionario|login|medico|secretaria>" >&2
  exit 1
fi

case "$panel" in
  admin) dir="painel-admin" ;;
  funcionario) dir="painel-funcionario" ;;
  login) dir="painel-login" ;;
  medico) dir="painel-medico" ;;
  secretaria) dir="painel-secretaria" ;;
  *) echo "Unknown panel: $panel" >&2; exit 1 ;;
esac

if [[ ! -d "$dir" ]]; then
  echo "Directory not found: $dir" >&2
  exit 1
fi

echo "==> Starting dev for $dir"
cd "$dir"

# Quick shared build helper for medico if needed
if [[ "$dir" == "painel-medico" ]]; then
  if [[ ! -f packages/shared/dist/index.mjs ]]; then
    echo "-- Building @portal/shared (first run)"
    (cd packages/shared && npm ci && npm run build && npm run build:types)
  fi
fi

# Run env check if available
if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['lint:env']?0:1)"; then
  echo "-- Running env check (lint:env)"
  npm run lint:env
else
  echo "-- No lint:env script; skipping env check"
fi

echo "-- Launching dev server"
npm run dev

