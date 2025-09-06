-- AUTOMAÇÃO COM PG_CRON (somente se pg_cron estiver habilitado no projeto)

-- 1. Verificar se pg_cron está disponível
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- 2. Se pg_cron estiver disponível, agendar execução a cada 15 minutos
-- IMPORTANTE: Usando token customizado ao invés de service key (mais seguro)
SELECT cron.schedule(
  'lead-alert-worker',                    -- nome do job
  '*/15 * * * *',                         -- a cada 15 minutos
  $$
  SELECT net.http_post(
    url := vault.read_secret('edge_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || vault.read_secret('edge_token'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 3. Verificar jobs agendados
SELECT * FROM cron.job;

-- 4. Para remover o agendamento (se necessário)
-- SELECT cron.unschedule('lead-alert-worker');

-- 5. Verificar logs de execução
SELECT * FROM cron.job_run_details WHERE jobname = 'lead-alert-worker' ORDER BY start_time DESC LIMIT 10;
