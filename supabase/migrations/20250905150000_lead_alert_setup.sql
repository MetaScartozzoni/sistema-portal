-- Lead Alert setup: indexes and persistence tables
-- Safe to re-run; guarded with IF NOT EXISTS

-- Index to speed up scans by direction + created_at
create index if not exists idx_ai_messages_direction_created
  on public.ai_messages(direction, created_at);

-- Persistence tables for worker runs and alert events
create table if not exists public.lead_alert_runs (
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

create index if not exists idx_lead_alert_runs_created_at
  on public.lead_alert_runs(created_at desc);
create index if not exists idx_lead_alert_runs_status
  on public.lead_alert_runs(status);

create table if not exists public.lead_alert_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.lead_alert_runs(id) on delete cascade,
  created_at timestamptz default now(),
  level text,
  message_id text,
  conversation_id text,
  channel text,
  hours_elapsed numeric,
  received_at timestamptz,
  preview text
);

create index if not exists idx_lead_alert_events_run_id
  on public.lead_alert_events(run_id);
create index if not exists idx_lead_alert_events_conversation
  on public.lead_alert_events(conversation_id);
create index if not exists idx_lead_alert_events_hours
  on public.lead_alert_events(hours_elapsed);

