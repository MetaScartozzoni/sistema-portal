-- VERSÃO SIMPLES - Execute no SQL Editor do Supabase Dashboard

-- 1. Criar secret com URL da Edge Function
select vault.create_secret('edge_url', 'https://hcimldvemwlscilvejli.functions.supabase.co/worker');

-- 2. Criar secret com token customizado para automação (mais seguro que service key)
-- Gere um token seguro localmente (ex: openssl rand -hex 32) e substitua <SEU_TOKEN>
select vault.create_secret('edge_token', '<SEU_TOKEN>');

-- 3. Verificar se os secrets foram criados
select vault.read_secret('edge_url');
select vault.read_secret('edge_token');
