# Guia: Configurar Automação do Lead Alert Worker no Supabase

## 📋 Passo a Passo

### 1. Acessar o SQL Editor
- Vá para: https://supabase.com/dashboard/project/hcimldvemwlscilvejli/sql
- Ou Dashboard → SQL Editor

### 2. Criar Secrets no Vault

**Execute um comando por vez:**

```sql
-- Criar URL da Edge Function
select vault.create_secret('edge_url', 'https://hcimldvemwlscilvejli.functions.supabase.co/worker');
```

```sql
-- Criar token de autenticação
select vault.create_secret('edge_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaW1sZHZlbXdsc2NpbHZlamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgzOTIwMSwiZXhwIjoyMDcxNDE1MjAxfQ.U_O6AP7adSRtkowhWK8eGFTQjGORff41TE9mcPnc-uU');
```

### 3. Verificar Secrets

```sql
-- Verificar URL
select vault.read_secret('edge_url');
```

```sql
-- Verificar Token
select vault.read_secret('edge_token');
```

### 4. Testar Invocação Manual

```sql
-- Invocar Edge Function diretamente do PostgreSQL
SELECT net.http_post(
  url := 'https://hcimldvemwlscilvejli.functions.supabase.co/worker',
  headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaW1sZHZlbXdsc2NpbHZlamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgzOTIwMSwiZXhwIjoyMDcxNDE1MjAxfQ.U_O6AP7adSRtkowhWK8eGFTQjGORff41TE9mcPnc-uU", "Content-Type": "application/json"}'::jsonb,
  body := '{}'::jsonb
);
```

### 5. Automação com pg_cron (se disponível)

**Primeiro verificar se pg_cron está habilitado:**

```sql
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

**Se pg_cron estiver disponível, agendar execução:**

```sql
SELECT cron.schedule(
  'lead-alert-worker',
  '*/15 * * * *',
  'SELECT net.http_post(url := ''https://hcimldvemwlscilvejli.functions.supabase.co/worker'', headers := ''{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaW1sZHZlbXdsc2NpbHZlamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgzOTIwMSwiZXhwIjoyMDcxNDE1MjAxfQ.U_O6AP7adSRtkowhWK8eGFTQjGORff41TE9mcPnc-uU", "Content-Type": "application/json"}''::jsonb, body := ''{}''::jsonb);'
);
```

### 6. Verificar Automação

```sql
-- Ver jobs agendados
SELECT * FROM cron.job;
```

```sql
-- Ver execuções recentes
SELECT * FROM cron.job_run_details WHERE jobname = 'lead-alert-worker' ORDER BY start_time DESC LIMIT 5;
```

### 7. Para Remover Automação (se necessário)

```sql
SELECT cron.unschedule('lead-alert-worker');
```

## ⚠️ Observações

1. **Vault**: Sempre disponível no Supabase
2. **pg_cron**: Pode não estar habilitado em todos os planos
3. **net.http_post**: Extensão HTTP do PostgreSQL
4. **Frequência**: Ajuste `*/15 * * * *` conforme necessário

## 🎯 Resultado Esperado

Após a configuração, o Lead Alert Worker será executado automaticamente e você pode monitorar via:
- Dashboard Functions → Logs
- SQL Editor → Execução manual
- Cron job logs (se pg_cron estiver ativo)
