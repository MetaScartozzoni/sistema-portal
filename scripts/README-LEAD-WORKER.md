# Lead Alert Worker - Operação & Observabilidade

## 1. Fluxo Geral
1. Edge Function `worker` é invocada a cada 5 minutos (cron) ou manualmente.
2. Autenticação: `Authorization: Bearer <ANON_KEY>` + `x-edge-token: <EDGE_CRON_TOKEN>`.
3. Processa até `MAX_MESSAGES` (default 500) e respeita `SAFE_TIMEOUT_MS` (default 9min) para evitar exceder limites do Supabase.
4. Gera alertas de SLA (1h,4h,24h) e dispara webhook consolidado se configurado.
5. Registra logs estruturados (json/text) com `request_id` para rastreabilidade.
6. Em caso de erro fatal: log + Sentry (se ativo) + webhook de erro (se `ALERT_WEBHOOK_URL`).

## 2. Variáveis / Secrets Importantes
| Nome | Tipo | Descrição |
|------|------|-----------|
| EDGE_CRON_TOKEN | Secret | Token custom de invocação (não usar service role) |
| SUPABASE_ANON_KEY | Secret | Necessária para header Authorization |
| LEAD_ALERT_WEBHOOK_URL | Secret | Webhook que recebe lote de alertas |
| ALERT_WEBHOOK_URL | Secret | Webhook rápido de erro fatal |
| LOG_FORMAT | Secret | `json` ou `text` (default text) |
| LOG_LEVEL | Secret | `debug|info|warn|error` (default info) |
| MAX_MESSAGES | Secret | Limite mensagens por execução (default 500) |
| SAFE_TIMEOUT_MS | Secret | Soft timeout (default 540000 ms) |
| SENTRY_DSN | Secret | Habilita Sentry se definido |

## 3. Comandos (CLI)
```bash
# Definir secrets (exemplos)
supabase secrets set EDGE_CRON_TOKEN="$(openssl rand -hex 32)"
supabase secrets set LOG_FORMAT=json LOG_LEVEL=debug MAX_MESSAGES=500 SAFE_TIMEOUT_MS=540000
supabase secrets set LEAD_ALERT_WEBHOOK_URL="https://example.com/alerts"

# Deploy
supabase functions deploy worker --project-ref hcimldvemwlscilvejli

# Teste manual
curl -X POST "https://hcimldvemwlscilvejli.supabase.co/functions/v1/worker" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-edge-token: $EDGE_CRON_TOKEN" \
  -H "Content-Type: application/json"

# Teste com alerta fake + overrides de SLA
curl -X POST "https://hcimldvemwlscilvejli.supabase.co/functions/v1/worker" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-edge-token: $EDGE_CRON_TOKEN" \
  -H "x-debug-fake-alert: 1" \
  -H "x-sla-1h: 0.05" \
  -H "Content-Type: application/json"
```

## 4. Agendamento (pg_cron)
Arquivo: `scripts/cron-schedule-5m.sql` (substitua `<ANON_KEY>` / `<SEU_TOKEN>`).

## 5. Logs no Dashboard
| Origem | Conteúdo |
|--------|----------|
| function_logs | console.log / console.error estruturados |
| edge_logs | Metadata de rede / cold starts |
| function_edge_logs | Execuções e status HTTP |

## 6. Formato de Log (JSON)
```json
{
  "level": "info",
  "time": "2025-09-05T00:00:00.000Z",
  "event": "analysis.summary",
  "meta": { "request_id": "...", "total_messages": 10, "alerts": 2 }
}
```

## 7. Webhook de Alertas (payload)
```json
{
  "type": "lead_alerts",
  "project": "https://<project>.supabase.co",
  "total_alerts": 2,
  "generated_at": "2025-09-05T00:00:00.000Z",
  "sla": {"SLA_1H":1,"SLA_4H":4,"SLA_24H":24},
  "alerts": [
    { "level": "ALTO (4h+)", "message_id": "...", "hours_elapsed": 4.5, "preview": "..." }
  ]
}
```

## 8. Webhook de Erro (payload)
```json
{
  "type": "worker_error",
  "level": "error",
  "event": "fatal",
  "time": "2025-09-05T00:00:01.000Z",
  "error": "Detalhe do erro"
}
```

## 9. Boas Práticas
- Rotacionar EDGE_CRON_TOKEN mensalmente.
- Monitorar taxa de alertas anormais (pode indicar SLA desalinhado).
- Reduzir MAX_MESSAGES se tempo de execução se aproximar de 10 min.
- Usar Sentry para stack traces completos.
- Evitar enviar dados sensíveis nos previews de mensagens.

## 10. Próximos Passos (Sugestões)
- Persistir histórico de alertas em tabela `lead_alert_events`.
- Implementar reentrega com backoff (webhook HTTP 5xx).
- Adicionar métrica de distribuição de tempos (p50/p95/p99).
- Expor endpoint /health para ping externo.
