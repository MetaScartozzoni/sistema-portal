-- Configuração de secrets no Supabase Vault para automação do Lead Alert Worker
-- Execute estes comandos no SQL Editor do Supabase Dashboard

-- 1. Criar secret com URL da Edge Function
select vault.create_secret('edge_url', 'https://hcimldvemwlscilvejli.functions.supabase.co/worker');

-- 2. Criar secret com token de autenticação (usando SERVICE_ROLE_KEY para máxima permissão)
select vault.create_secret('edge_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaW1sZHZlbXdsc2NpbHZlamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgzOTIwMSwiZXhwIjoyMDcxNDE1MjAxfQ.U_O6AP7adSRtkowhWK8eGFTQjGORff41TE9mcPnc-uU');

-- 3. (Opcional) Verificar se os secrets foram criados corretamente
select vault.read_secret('edge_url');
select vault.read_secret('edge_token');

-- 4. Exemplo de função para invocar o worker automaticamente via pg_cron
-- (Requer extensão pg_cron habilitada no projeto)
CREATE OR REPLACE FUNCTION invoke_lead_alert_worker()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_url text;
  edge_token text;
  response_status int;
BEGIN
  -- Buscar secrets do vault
  edge_url := vault.read_secret('edge_url');
  edge_token := vault.read_secret('edge_token');
  
  -- Invocar Edge Function
  SELECT status INTO response_status
  FROM http((
    'POST',
    edge_url,
    ARRAY[
      http_header('Authorization', 'Bearer ' || edge_token),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    '{}'
  )::http_request);
  
  -- Log do resultado (opcional)
  RAISE NOTICE 'Lead Alert Worker invoked. Status: %', response_status;
END;
$$;

-- 5. Agendar execução automática a cada 15 minutos (requer pg_cron)
-- SELECT cron.schedule('lead-alert-worker', '*/15 * * * *', 'SELECT invoke_lead_alert_worker();');

-- 6. Para verificar jobs agendados (se pg_cron estiver habilitado)
-- SELECT * FROM cron.job;

-- 7. Para remover agendamento (se necessário)
-- SELECT cron.unschedule('lead-alert-worker');
