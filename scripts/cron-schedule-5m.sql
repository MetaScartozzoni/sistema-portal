-- Agendamento do Lead Alert Worker a cada 5 minutos via pg_cron + pg_net
-- Pré-requisitos: extensões habilitadas: pg_cron, pg_net (net/http_post)
-- Ajuste <ANON_KEY> e garanta que edge_url / edge_token já existam no Vault.

-- 1. Verificar extensões
SELECT * FROM pg_extension WHERE extname IN ('pg_cron','pg_net');

-- 2. (Opcional) Criar/atualizar secrets se ainda não criados
-- select vault.create_secret('edge_url','https://hcimldvemwlscilvejli.functions.supabase.co/worker');
-- select vault.create_secret('edge_token','<SEU_TOKEN>');

-- 3. Agendar job (substitua <ANON_KEY>)
SELECT cron.schedule(
  'lead-alert-worker-5m',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := vault.read_secret('edge_url'),
    headers := jsonb_build_object(
      'Authorization','Bearer ' || '<ANON_KEY>',
      'x-edge-token', vault.read_secret('edge_token'),
      'Content-Type','application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
Observação: se você quiser desligar módulos para um usuário, insira scope='user', subject_id=<UUID>, key='module.X', value='false'.
-- 4. Verificar job
SELECT * FROM cron.job WHERE jobname = 'lead-alert-worker-5m';

-- 5. Consultar últimas execuções
SELECT * FROM cron.job_run_details WHERE jobname = 'lead-alert-worker-5m' ORDER BY start_time DESC LIMIT 10;

-- 6. Remover job (se necessário)
-- SELECT cron.unschedule('lead-alert-worker-5m');
