# Portal Médico — Autenticação & Redirecionamento (Horizon)

Guia de implantação e operação do sistema de login central com Supabase + Edge Function get-user-painel e SPA React (Vite) hospedada no Horizon.

## TL;DR (Passos Rápidos)

### Supabase Auth

- Site URL = https://<seu-dominio> (produção).
- Additional Redirect URLs = http://localhost:5173, http://localhost:3000 (dev).

### Horizon (Front)

Variáveis de ambiente:

- `VITE_SUPABASE_URL=https://hcimldvemwlscilvejli.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<ANON_2>`
- `VITE_APP_URL=https://<seu-dominio>`

Build: `npm run build` (Vite).

Output: `dist/`.

SPA fallback → servir sempre index.html (todas as rotas).

### Edge Function (Supabase)

- Nome: get-user-painel (não renomear).
- Retorna: `{ ok, role, url, panel, modules }`.

Deploy:

```
supabase link --project-ref hcimldvemwlscilvejli
supabase functions deploy get-user-painel --no-verify-jwt
```

### Frontend

`/portal` usa AuthGuard → chama get-user-painel → redireciona:
`/portal/{admin|doctor|secretary|patient}`.

Reset de senha via SDK:

- `/auth/reset` → resetPasswordForEmail
- `/auth/reset/confirm` → updateUser({ password })

---

## 1) Arquitetura (resumo)

- Fonte de verdade para perfis/roles: `public.profiles` (id uuid = auth.users.id).
- View de compat (se houver legado): `public.user_profiles` espelha `profiles` (somente leitura).
- Edge get-user-painel decide painel e módulos (usa RLS com JWT do usuário).
- SPA React no Horizon com fallback 200 para todas as rotas.
- Reset de senha 100% com Supabase SDK (sem levar service_role ao front).

## 2) Supabase — Configurações de Auth

Authentication → URL Configuration

- Site URL: `https://<seu-dominio>`
- Additional Redirect URLs:
  - `http://localhost:5173`
  - `http://localhost:3000`

E-mails de reset/confirm: o link deve cair em:

- Reset: `https://<seu-dominio>/auth/reset/confirm`
- Login/callback (se usar magic link): `https://<seu-dominio>/auth/callback` (opcional)

Se o link abrir em domínio errado → faltou incluir o domínio em Additional Redirect URLs ou o redirectTo está incorreto no front.

## 3) Banco de Dados (fonte de verdade)

### 3.1 profiles (SoT)

- `id uuid = auth.users.id`
- `role text ∈ admin|doctor|secretary|patient` (ou variações internas)
- Demais colunas: email, first_name, last_name, etc.

### 3.2 VIEW user_profiles (compat)

Só se algum código legar consultar esse nome. É uma VIEW que espelha profiles.

```
create or replace view public.user_profiles as
select
  p.id        as user_id,
  p.role      as role,
  p.email,
  p.first_name,
  p.last_name,
  p.created_at,
  p.updated_at
from public.profiles p;
```

### 3.3 RPC auxiliar (paciente self-service)

Chamar após login de paciente público.

```
create or replace function public.ensure_patient_self()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth required';
  end if;

  insert into public.patients (user_id)
  select auth.uid()
  where not exists (select 1 from public.patients where user_id = auth.uid());
end;
$$;

grant execute on function public.ensure_patient_self() to authenticated;
```

## 4) Edge Function — get-user-painel

Entrada: Header `Authorization: Bearer <access_token>` (token do usuário).

Saída:

```
{
  "ok": true,
  "role": "doctor",
  "panel": "/doctor-dashboard",    // legado
  "url": "/portal/doctor",         // usar este
  "modules": {
    "orcamento": true,
    "bot": true,
    "financeiro": true,
    "agenda": true,
    "prontuario": true
  }
}
```

Regra:

- Tenta `profiles.role` via RLS (JWT).
- Fallback: `user_metadata.role` → `profiles` via service_role → `user_profiles` (compat).
- `modules` vem de permissions (se existir) ou por default baseado em role.

Deploy

```
supabase link --project-ref hcimldvemwlscilvejli
supabase functions deploy get-user-painel --no-verify-jwt
```

Teste (troque `<ACCESS_TOKEN>`)

```
curl -s https://hcimldvemwlscilvejli.functions.supabase.co/get-user-painel \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```

## 5) Horizon — Configurações do Frontend (React/Vite)

### 5.1 Variáveis de ambiente (hPanel)

```
VITE_SUPABASE_URL=https://hcimldvemwlscilvejli.supabase.co
VITE_SUPABASE_ANON_KEY=<ANON_2>
VITE_APP_URL=https://<seu-dominio>
```

### 5.2 Build e Deploy

- Build Command: `npm run build`
- Output Directory: `dist/`
- SPA / Fallback: “Single Page Application” habilitado (todas as rotas → index.html)

## 6) Frontend — Integração

### 6.1 Client Supabase

`src/lib/supabaseClient.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

### 6.2 AuthGuard (rota hub /portal)

`src/lib/AuthGuard.tsx`

```tsx
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export function AuthGuard({ children }: { children: JSX.Element }) {
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return nav('/auth/login', { replace: true });

      const { data, error } = await supabase.functions.invoke('get-user-painel');
      if (error || !data?.url) return nav('/portal/patient', { replace: true });
      nav(data.url, { replace: true }); // /portal/{admin|doctor|secretary|patient}
    })().finally(() => setReady(true));
  }, [nav]);

  if (!ready) return null;
  return children;
}
```

### 6.3 Rotas principais

`src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './lib/AuthGuard';
import Login from './pages/auth/Login';
import ResetRequest from './pages/auth/ResetRequest';
import ResetConfirm from './pages/auth/ResetConfirm';
import Admin from './pages/dashboards/Admin';
import Doctor from './pages/dashboards/Doctor';
import Secretary from './pages/dashboards/Secretary';
import Patient from './pages/dashboards/Patient';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/reset" element={<ResetRequest />} />
        <Route path="/auth/reset/confirm" element={<ResetConfirm />} />

        <Route path="/portal" element={
          <AuthGuard><div /></AuthGuard>
        } />

        <Route path="/portal/admin" element={<Admin />} />
        <Route path="/portal/doctor" element={<Doctor />} />
        <Route path="/portal/secretary" element={<Secretary />} />
        <Route path="/portal/patient" element={<Patient />} />

        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 6.4 Reset de senha (SDK)

`src/pages/auth/ResetRequest.tsx`

```tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResetRequest() {
  const [email, setEmail] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset/confirm`,
    });
    alert('Se existir, enviamos e-mail com instruções.');
  }
  return (
    <form onSubmit={submit}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu e-mail" />
      <button type="submit">Enviar reset</button>
    </form>
  );
}
```

`src/pages/auth/ResetConfirm.tsx`

```tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResetConfirm() {
  const [password, setPassword] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);
    alert('Senha alterada!');
    window.location.href = '/auth/login';
  }
  return (
    <form onSubmit={submit}>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nova senha" />
      <button type="submit">Salvar</button>
    </form>
  );
}
```

## 7) Testes de Aceite (Checklist)

- Deslogado em /portal → redireciona para /auth/login.
- Logado patient → /portal → /portal/patient.
- Logado doctor → /portal → /portal/doctor.
- Logado secretary/employee → /portal/secretary.
- Logado admin → /portal/admin.
- modules do response controlam o que aparece nos dashboards (botões/cards).
- Reset de senha: /auth/reset envia e-mail; link abre /auth/reset/confirm; troca de senha com sucesso.
- SPA no Horizon serve index.html em todas as rotas.

## 8) Troubleshooting

- 401 na função: faltou Authorization: Bearer <access_token> (usuário não logado) ou sessão expirada.
- Redirect de reset cai no domínio errado: ajustar Additional Redirect URLs e o redirectTo no front.
- 405/OPTIONS: verifique CORS/OPTIONS na function (get-user-painel trata OPTIONS).
- CORS: a Edge inclui Access-Control-Allow-*; garanta que o front chama a URL correta.
- SPA 404 em rotas internas: faltou fallback index.html no Horizon.

## 9) Operação & Segurança

- Nunca expor SERVICE_ROLE no frontend.
- Logs de função: Supabase Dashboard → Functions → Logs.
- Manter profiles como SoT; user_profiles apenas como VIEW de compat.
- Atualizar Additional Redirect URLs sempre que usar novo domínio/ambiente.

## 10) Comandos úteis (CLI)

```
# Linkar projeto
supabase link --project-ref hcimldvemwlscilvejli

# Secrets (se ainda não setadas)
supabase secrets set SUPABASE_URL="https://hcimldvemwlscilvejli.supabase.co" \
  SUPABASE_ANON_KEY="<ANON_2>"

# Deploy function
supabase functions deploy get-user-painel --no-verify-jwt

# Testar function (troque <ACCESS_TOKEN>)
curl -s https://hcimldvemwlscilvejli.functions.supabase.co/get-user-painel \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```

## 11) Mudanças relevantes (changelog curto)

- v2: Login central + get-user-painel (RLS-first), SPA fallback, reset via SDK, profiles = SoT.
- Compat: VIEW user_profiles para código legado que ainda lê esse nome.
- Módulos: resposta da Edge inclui modules para gate visual nos dashboards.

