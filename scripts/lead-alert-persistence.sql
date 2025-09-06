-- Persistência para o Lead Alert Worker
-- Execute este script no SQL Editor do Supabase.
-- Cria tabelas de execuções e eventos de alertas para auditoria e métricas.

-- Requisitos: extensão pgcrypto ou pguuid para gen_random_uuid() (já habilitada normalmente). Caso não exista, usar uuid-ossp.

-- Tabela de execuções do worker
CREATE TABLE IF NOT EXISTS lead_alert_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  request_id text,
  total_messages int,
  needing_response int,
  alerts_triggered int,
  status text,
  duration_ms int,
  sla_1h numeric,
  sla_4h numeric,
  sla_24h numeric
);

CREATE INDEX IF NOT EXISTS idx_lead_alert_runs_created_at ON lead_alert_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_alert_runs_status ON lead_alert_runs(status);

-- Tabela de eventos (cada alerta gerado)
CREATE TABLE IF NOT EXISTS lead_alert_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references lead_alert_runs(id) on delete cascade,
  created_at timestamptz default now(),
  level text,
  message_id text,
  conversation_id text,
  channel text,
  hours_elapsed numeric,
  received_at timestamptz,
  preview text
);

CREATE INDEX IF NOT EXISTS idx_lead_alert_events_run_id ON lead_alert_events(run_id);
CREATE INDEX IF NOT EXISTS idx_lead_alert_events_conversation ON lead_alert_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_lead_alert_events_hours ON lead_alert_events(hours_elapsed);

-- Consulta de últimas execuções
-- select * from lead_alert_runs order by created_at desc limit 20;

-- Consulta de eventos de uma execução
-- select * from lead_alert_events where run_id = '<RUN_ID>' order by hours_elapsed desc;

-- Limpeza (exemplo: manter 30 dias)
-- delete from lead_alert_runs where created_at < now() - interval '30 days';

-- Possível futura métrica agregada:
-- select date_trunc('hour', created_at) as hora, avg(alerts_triggered) from lead_alert_runs group by 1 order by 1 desc;
