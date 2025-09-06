-- Tabela para armazenar alertas do sistema
-- Execute no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_key VARCHAR(255) UNIQUE NOT NULL,
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID,
  alert_level INTEGER NOT NULL CHECK (alert_level IN (1, 2, 3)),
  time_since_message BIGINT NOT NULL,
  retry_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_system_alerts_alert_key ON system_alerts(alert_key);
CREATE INDEX IF NOT EXISTS idx_system_alerts_conversation_id ON system_alerts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON system_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_system_alerts_level ON system_alerts(alert_level);

-- RLS (Row Level Security)
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Política para service_role (API backend)
CREATE POLICY "service_role_all_access" ON system_alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Política para usuários autenticados (apenas leitura)
CREATE POLICY "authenticated_read_alerts" ON system_alerts
  FOR SELECT
  TO authenticated
  USING (true);

-- Comentários
COMMENT ON TABLE system_alerts IS 'Alertas do sistema para monitoramento de SLA de leads';
COMMENT ON COLUMN system_alerts.alert_key IS 'Chave única para identificar o tipo e contexto do alerta';
COMMENT ON COLUMN system_alerts.alert_level IS '1=Amarelo(1h), 2=Laranja(4h), 3=Vermelho(24h)';
COMMENT ON COLUMN system_alerts.time_since_message IS 'Tempo em milissegundos desde a mensagem original';
COMMENT ON COLUMN system_alerts.retry_count IS 'Número de vezes que este alerta foi disparado';
