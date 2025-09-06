Rotas e Endpoints — Portal Backend

Projeto Supabase: hcimldvemwlscilvejli
Base Supabase: https://hcimldvemwlscilvejli.supabase.co

Edge Functions
- POST: /functions/v1/worker
  - Headers: Authorization: Bearer <EDGE_CRON_TOKEN> ou x-edge-token: <EDGE_CRON_TOKEN>
  - Uso: processamento periódico de leads (cron a cada 5 min)
  - Secrets: SERVICE_ROLE_KEY (function), EDGE_CRON_TOKEN (Vault/Secrets)

- GET: /functions/v1/health
  - Query: ?deep=1 para checagem de DB
  - Headers: (opcional)
  - Uso: verificação de saúde do ambiente

- POST: /functions/v1/auth-accept-invite
  - Headers: Authorization: Bearer <JWT usuário>
  - Body opcional: { role: 'admin'|'employee'|'receptionist'|'doctor'|'patient', crm?, specialty? }
  - Ação: cria/garante employees/doctors/patients conforme role

- POST: /functions/v1/auth-webhook-users-sync
  - Headers: X-Supabase-Signature: <HMAC>, Content-Type: application/json
  - Secret: AUTH_WEBHOOK_SECRET (definido via secrets)
  - Evento: Auth Hooks (user.created, user.confirmed)
  - Ação: sincroniza employees/doctors/patients conforme role (profile.role > user_metadata.role > 'patient')

- POST: /functions/v1/get-feature-flags
  - Headers: Authorization: Bearer <JWT usuário>
  - Saída: { ok, role, flags: { 'module.agenda': true, ... } }
  - Ação: flags efetivas combinando defaults por role + permissions (se existir) + settings (global/user via RPC)

RPC (PostgREST)
- ensure_patient_self
  - Chamada app: await supabase.rpc('ensure_patient_self')
  - Efeito: cria patient vinculado ao auth.uid() se não existir

Cron (pg_cron)
- lead-alert-worker-5m: */5 * * * *
  - Aciona: POST /functions/v1/worker com EDGE_CRON_TOKEN
  - Secrets no Vault: edge_url, edge_token

Observações de Configuração
- SUPABASE_URL e SUPABASE_ANON_KEY são injetados pela plataforma (não definir via secrets)
- As functions usam SERVICE_ROLE_KEY (segredo configurado) para operações server-side
- verify_jwt = false nas functions (config.toml) e controle via tokens/secrets próprios

Pendências/Back-end Express
- A pasta api/ contém arquivos de rotas vazios no momento (admin.js, auth.js, health.js, integration.js, messages.js, whatsapp.js)
- Ao implementar, alinhar com estes padrões:
  - Autenticação via middleware e/ou Service Role apenas no servidor
  - Variáveis sensíveis em .env (não comitar) e validação via scripts/lint:env
  - Documentar endpoints futuros em openapi.yaml ou atualizar este arquivo
