#!/bin/bash

# Script para gerenciar o Lead Alert Worker como Edge Function

echo "🚀 Lead Alert Worker - Edge Function Manager"
echo "============================================="

PROJECT_REF="hcimldvemwlscilvejli"
FUNCTION_URL="https://${PROJECT_REF}.supabase.co/functions/v1/worker"

# O token NÃO deve ficar hardcoded. Tente carregar da variável de ambiente ou de um arquivo local (.env ou supabase/.env)
# Prioridade: variável de ambiente > supabase/.env > .env > fallback vazio (erro)
if [ -z "$EDGE_CRON_TOKEN" ]; then
    if [ -f "supabase/.env" ]; then
        EDGE_CRON_TOKEN=$(grep -E '^EDGE_CRON_TOKEN=' supabase/.env | head -n1 | cut -d= -f2-)
    fi
fi
if [ -z "$EDGE_CRON_TOKEN" ] && [ -f ".env" ]; then
    EDGE_CRON_TOKEN=$(grep -E '^EDGE_CRON_TOKEN=' .env | head -n1 | cut -d= -f2-)
fi

# Carrega ANON key (necessária para Authorization exigido pelo gateway do Supabase Functions)
if [ -z "$SUPABASE_ANON_KEY" ]; then
    # tenta em supabase/.env primeiro
    if [ -f "supabase/.env" ]; then
        SUPABASE_ANON_KEY=$(grep -E '^(SUPABASE_ANON_KEY|ANON_KEY)=' supabase/.env | head -n1 | cut -d= -f2-)
    fi
fi
if [ -z "$SUPABASE_ANON_KEY" ]; then
    # tenta em api/.env (onde já vimos a chave)
    if [ -f "api/.env" ]; then
        SUPABASE_ANON_KEY=$(grep -E '^SUPABASE_ANON_KEY=' api/.env | head -n1 | cut -d= -f2-)
    fi
fi
SUPABASE_ANON_KEY=$(echo "$SUPABASE_ANON_KEY" | tr -d '"' | tr -d "'")

# Sanitiza espaços
EDGE_CRON_TOKEN=$(echo "$EDGE_CRON_TOKEN" | tr -d '"' | tr -d "'" | tr -d '\r')

DEPENDENCIES=(curl jq supabase)
for dep in "${DEPENDENCIES[@]}"; do
    if ! command -v "$dep" >/dev/null 2>&1; then
        echo "❌ Dependência ausente: $dep" >&2
        MISSING_DEPS=1
    fi
done
if [ "$MISSING_DEPS" = "1" ]; then
    echo "Instale as dependências antes de continuar." >&2
    exit 2
fi

case "$1" in
    "deploy")
        echo "📦 Deployando Edge Function..."
        supabase functions deploy worker --project-ref $PROJECT_REF
        echo "✅ Deploy concluído!"
        ;;
    
        "test")
                if [ -z "$EDGE_CRON_TOKEN" ]; then
                    echo "❌ EDGE_CRON_TOKEN não definido. Exporte com: export EDGE_CRON_TOKEN=seu_token" >&2
                    exit 3
                fi
                echo "🧪 Testando Edge Function..."
                        if [ -z "$SUPABASE_ANON_KEY" ]; then
                            echo "❌ SUPABASE_ANON_KEY não encontrado (.env) ou não exportado." >&2
                            exit 4
                        fi
                        curl -s -X POST "$FUNCTION_URL" \
                            -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
                            -H "x-edge-token: $EDGE_CRON_TOKEN" \
                    -H "Content-Type: application/json" \
                    | jq '.'
                ;;
    
    "logs")
        echo "📋 Visualizando logs..."
        supabase functions logs worker --project-ref $PROJECT_REF
        ;;
    
    "serve")
        echo "🏠 Servindo localmente..."
        supabase functions serve worker --env-file supabase/.env
        ;;
    
        "invoke")
                if [ -z "$EDGE_CRON_TOKEN" ]; then
                    echo "❌ EDGE_CRON_TOKEN não definido. Exporte com: export EDGE_CRON_TOKEN=seu_token" >&2
                    exit 3
                fi
                echo "⚡ Executando verificação de SLA..."
                START_TS=$(date +%s%3N 2>/dev/null || date +%s)
                        if [ -z "$SUPABASE_ANON_KEY" ]; then
                            echo "❌ SUPABASE_ANON_KEY não encontrado (.env) ou não exportado." >&2
                            exit 4
                        fi
                        HTTP_CODE=$(curl -s -w "%{http_code}" -o /tmp/_invoke_out.json -X POST "$FUNCTION_URL" \
                            -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
                            -H "x-edge-token: $EDGE_CRON_TOKEN" \
                    -H "Content-Type: application/json")
                END_TS=$(date +%s%3N 2>/dev/null || date +%s)
                DURATION=$((END_TS-START_TS))
                echo "Status HTTP: $HTTP_CODE (${DURATION}ms)"; jq '.' /tmp/_invoke_out.json 2>/dev/null || cat /tmp/_invoke_out.json
                if [ "$HTTP_CODE" = "200" ]; then
                    echo "✅ Verificação concluída!"
                else
                    echo "⚠️  Retorno não OK" >&2
                fi
                ;;
    
    "cron")
        echo "⏰ Configurando execução periódica..."
        echo "Para configurar execução automática, use:"
    echo "1. Cron job no servidor (salvar logs):"
    echo "   */15 * * * * EDGE_CRON_TOKEN=*** SUPABASE_ANON_KEY=*** curl -s -X POST '$FUNCTION_URL' -H 'Authorization: Bearer $SUPABASE_ANON_KEY' -H 'x-edge-token: $EDGE_CRON_TOKEN' -H 'Content-Type: application/json' >> /var/log/lead-alert-worker.log 2>&1"
        echo ""
        echo "2. GitHub Actions (exemplo em scripts/GUIA-AUTOMACAO.md)"
        echo ""
        echo "3. Supabase pg_cron (se disponível) - ver scripts/pg-cron-setup.sql"
        echo ""
        echo "4. Vault + pg_cron (recomendado) - evita expor token no crontab"
        ;;
    
    "vault")
        echo "🔐 Configurando Supabase Vault..."
        echo "(Use tokens diferentes para cada serviço, rotate periodicamente)"
        echo "-- Criar secrets"
        echo "select vault.create_secret('edge_url', '$FUNCTION_URL');"
    echo "select vault.create_secret('edge_token', '<COLOQUE_SEU_TOKEN_AQUI>'); -- não use service role aqui"
        echo "-- Verificar"
        echo "select vault.read_secret('edge_url');"
        echo "select vault.read_secret('edge_token');"
        echo "Guia completo: scripts/GUIA-AUTOMACAO.md"
        ;;
    
    "sql")
        echo "💾 Testando via SQL (substitua token no Vault antes):"
    echo "SELECT net.http_post("
    echo "  url := vault.read_secret('edge_url'),"
    echo "  headers := jsonb_build_object('Authorization', 'Bearer ' || '<ANON_KEY_AQUI>', 'x-edge-token', vault.read_secret('edge_token'), 'Content-Type', 'application/json'),"
    echo "  body := '{}'::jsonb"
    echo "); -- substitua <ANON_KEY_AQUI> ou armazene anon key também no vault se preferir"
        ;;
    
    *)
    echo "📖 Uso: $0 {deploy|test|logs|serve|invoke|cron|vault|sql}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  deploy  - Faz deploy da função para produção"
        echo "  test    - Testa a função em produção (formato JSON)"
        echo "  logs    - Visualiza logs da função"
        echo "  serve   - Executa localmente para desenvolvimento"
        echo "  invoke  - Executa uma verificação de SLA imediatamente"
        echo "  cron    - Mostra opções para execução automática"
        echo "  vault   - Comandos para configurar Supabase Vault"
        echo "  sql     - Comando SQL para testar via PostgreSQL"
    echo ""
    echo "Variáveis suportadas: EDGE_CRON_TOKEN, SUPABASE_ANON_KEY, PROJECT_REF"
        exit 1
        ;;
esac
