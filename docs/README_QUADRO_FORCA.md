# Portal Admin — Quadro de Força

Admin central com “disjuntores” (feature toggles), “fusis” (logs/estado de falha) e automação. Todo tráfego sensível passa por Supabase (Auth/DB/RLS/Realtime) e Edge Functions. Painéis satélites obedecem às regras daqui.

## 1) Conceito: Quadro de Força

- Módulos como “circuitos”: Secretaria/Agenda, Médico/Prontuário, Orçamento, Financeiro, Bot.
- Disjuntor: liga/desliga módulo (manutenção/sobrecarga) via flags (settings.module.X).
- Fusil: log/alerta de falha; se “queimado”, só o módulo afetado desativa, os demais seguem ativos.
- Admin visualiza saúde, ativa/desativa, “troca fusil”, configura SMTP/Calendário/Regras, tudo auditado.

## 2) Arquitetura (alto nível)

- Auth: Supabase Auth (JWT) — sessão do usuário no front.
- Perfis/Papéis: `public.profiles` (SoT) com VIEW `public.user_profiles` para compat.
- Flags/Config: `public.settings` (ex.: `module.agenda = true|false`) com RLS e RPCs.
- Permissões: tabela de permissões por papel/usuário (opcional, já suportada na função de flags).
- Estado dos módulos: tabela de “saúde” (futuro) + Realtime para dashboards de estado.
- Edge Functions (admin-only e público autenticado):
  - Público autenticado: `get-user-painel` (role + url + modules), `get-feature-flags` (flags efetivas).
  - Admin-only (planejadas): `admin-toggle-module`, `admin-revive-fuse`, `admin-system-health`.
- Painéis satélites: sempre consultam status/flags antes de liberar qualquer feature; se off ⇒ bloqueiam rota e exibem aviso.

## 3) Fluxos críticos

### 3.1 Login e redirecionamento

- Usuário loga → front chama `get-user-painel` → resposta `{ role, url, modules }`.
- Front navega para `/portal/{admin|doctor|secretary|patient}` conforme `url`.
- Prioridade quando múltiplos papéis: `admin > medico > secretaria > orcamento > financeiro > bot > patient`.

### 3.2 Gate de funcionalidades (front)

- Antes de renderizar cada card/rota, o front lê:
  - `modules` (get-user-painel) + `flags` (get-feature-flags) + (opcional) permissões.
- Governança: se `module.X=false` ou permissão ausente ⇒ esconder/bloquear rota.

### 3.3 Disjuntor/Fusil (admin)

- Desligar módulo: `admin-toggle-module` grava `settings.module.<nome>=false` e registra auditoria.
- Trocar “fusil”: `admin-revive-fuse` limpa falhas/latches do módulo e reativa se possível.
- Saúde: `admin-system-health` agrega métricas (uptime, erros, filas) para o dashboard.

## Referências de Implementação (já no projeto)

- Edge `get-user-painel`: decide papel/url e retorna `modules` default por role.
- Edge `get-feature-flags`: combina defaults por role + permissões (se existirem) + `public.settings` via RPC.
- Tabela `public.settings` + RPCs `get_effective_settings` e `get_feature_flags` (migradas).
- Front: hooks `usePortalInfo` e `useFeatureFlags`; gating unificado com Skeleton enquanto carrega.

## Próximos passos (admin)

- Expor endpoints admin-only para toggle/health/audit e UI correspondente no painel Admin.
- Adicionar Realtime/cron para saúde dos módulos (atualizações em tempo real no “quadro”).
- Finalizar tabela de permissões e UI de gerenciamento (se necessário).

