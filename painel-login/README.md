# Portal Login (Marcio Plastic Surgery)

Portal dedicado exclusivamente ao fluxo de autenticação (login, recuperação e redefinição de senha, atualização de senha) e redirecionamento imediato para os portais específicos por função (admin, médico, secretaria, paciente). Todas as rotas internas de dashboard foram removidas — este projeto atua agora apenas como "Gateway de Autenticação" do ecossistema.

## Visão Geral do Projeto

Este projeto tem como objetivo fornecer um portal médico com funcionalidades de autenticação robustas e dashboards personalizados para diferentes tipos de usuários (administrador e médico).

## Tecnologias Essenciais

- **Vite / React 18**
- **React Router 6**
- **Tailwind CSS** (design utilitário)
- **Zustand** (estado de autenticação persistido)
- **Axios** (chamadas à API própria PHP/MySQL)
- (Opcional futuro) shadcn/ui, Framer Motion, Toaster

Removed: Qualquer dependência de Supabase. A autenticação agora é 100% via API própria (PHP/MySQL) em `api.marcioplasticsurgery.com`.

## Configuração e Instalação

# 🌐 CONFIGURAÇÃO SUBDOMÍNIO API - api.marcioplasticsurgery.com

## 📋 NOVA ARQUITETURA COM SUBDOMÍNIO

```
https://api.marcioplasticsurgery.com     ← Backend PHP API
https://portal.marcioplasticsurgery.com  ← Frontend React portais
```

## 🔧 CONFIGURAÇÃO DNS HOSTINGER

### Passo 1: Adicionar Subdomínio
No painel da Hostinger:
1. **Domínios** → **Gerenciar** → **Subdomínios**
2. **Criar subdomínio:** `api`
3. **Pasta de destino:** `public_html/api`

### Passo 2: Configurar DNS
```
Tipo: CNAME
Nome: api
Valor: portal.marcioplasticsurgery.com
TTL: 300
```

## 📁 ESTRUTURA DE PASTAS ATUALIZADA

```
public_html/
├── api/                           # ← https://api.marcioplasticsurgery.com
│   ├── config/
│   ├── auth/
│   ├── users/
│   ├── patients/
│   ├── schedules/
│   ├── index.php
│   └── .htaccess
├── portal-login/                  # ← https://portal.marcioplasticsurgery.com/portal-login/
├── portal-admin/                  # ← https://portal.marcioplasticsurgery.com/portal-admin/
├── portal-medico/                 # ← https://portal.marcioplasticsurgery.com/portal-medico/
└── .htaccess
```

## 🔧 CONFIGURAÇÃO CORS ATUALIZADA

Preciso atualizar o arquivo CORS para permitir o novo domínio:

```php
// config/cors.php - ATUALIZADO
$allowed_origins = [
    'https://portal.marcioplasticsurgery.com',
    'https://www.marcioplasticsurgery.com',
    'https://api.marcioplasticsurgery.com',
    'http://localhost:3000',
    'http://localhost:5173'
];
```

## 🚀 VANTAGENS DO SUBDOMÍNIO API

✅ **Organização:** API separada dos frontends
✅ **Performance:** Cache e CDN otimizados
✅ **Segurança:** Isolamento de responsabilidades  
✅ **Escalabilidade:** Facilita load balancing
✅ **SSL:** Certificado dedicado para API

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ **DNS e Subdomínio**
- [ ] Criar subdomínio `api` no painel Hostinger
- [ ] Configurar CNAME no DNS
- [ ] Aguardar propagação (15-30 min)
- [ ] Testar acesso: `https://api.marcioplasticsurgery.com`

### ✅ **Configuração Servidor**
- [ ] Upload backend PHP para `/public_html/api/`
- [ ] Configurar .htaccess com novos domínios
- [ ] Atualizar CORS com origins corretas
- [ ] Configurar SSL para subdomínio

### ✅ **Teste de Funcionamento**
- [ ] `https://api.marcioplasticsurgery.com/health`
- [ ] `https://api.marcioplasticsurgery.com/auth/login`
- [ ] Verificar headers CORS nos frontends

## 🧪 SCRIPTS DE TESTE

### Teste 1: Health Check
```bash
curl https://api.marcioplasticsurgery.com/health
```

### Teste 2: CORS Headers
```bash
curl -H "Origin: https://portal.marcioplasticsurgery.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.marcioplasticsurgery.com/auth/login
```

### Teste 3: Login via JavaScript
```javascript
fetch('https://api.marcioplasticsurgery.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'admin@marcioplasticsurgery.com',
    password: 'password'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## ⚡ DEPLOY RÁPIDO

### Opção 1: Via cPanel File Manager
1. Upload backend para `public_html/api/`
2. Configurar subdomínio no painel
3. Testar endpoints

### Opção 2: Via SSH/SCP
```bash
# Comprimir backend
tar -czf api-backend.tar.gz backend-php/

# Upload para servidor
scp api-backend.tar.gz user@server:/home/user/

# Extrair no servidor
ssh user@server "cd public_html && tar -xzf ~/api-backend.tar.gz && mv backend-php api"
```

## 🔒 CONFIGURAÇÃO SSL

O SSL será automaticamente aplicado pelo Let's Encrypt da Hostinger para:
- ✅ `https://api.marcioplasticsurgery.com`
- ✅ `https://portal.marcioplasticsurgery.com`

## 📊 MONITORAMENTO

### Logs importantes:
- `/logs/api_access.log` - Requisições da API
- `/logs/api_error.log` - Erros da API
- `/logs/cors.log` - Problemas de CORS

### Métricas:
- Tempo de resposta da API
- Taxa de erro por endpoint
- Uso de recursos do servidor

# 🌐 CONFIGURAÇÃO SUBDOMÍNIO API - api.marcioplasticsurgery.com

# 🚀 Setup Completo - Portal Marcio Plastic Surgery

## 📝 Ordem de Execução

### 1. Deploy Básico
Use: `QUICK-DEPLOY.md`

### 2. Configuração Avançada
Use: `ADVANCED-CONFIG.md`

## ⚡ Script Completo - Cole tudo de uma vez

```bash
# 1. FIREWALL
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# 2. NGINX
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# 3. CONFIGURAR SITE
cat > /etc/nginx/sites-available/portal.marcioplasticsurgery.com << 'EOF'
server {
    listen 80;
    server_name portal.marcioplasticsurgery.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/portal.marcioplasticsurgery.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 4. SSL (CERTBOT)
apt install snapd -y
snap install core
snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

# 5. GERAR CERTIFICADO SSL
certbot --nginx -d portal.marcioplasticsurgery.com --non-interactive --agree-tos --email admin@marcioplasticsurgery.com

# 6. SYSTEMD SERVICE
cat > /etc/systemd/system/horizon-api.service << 'EOF'
[Unit]
Description=Horizon API Node.js
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/horizon
ExecStart=/usr/bin/node server-dual.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable horizon-api
systemctl start horizon-api

echo "✅ CONFIGURAÇÃO COMPLETA!"
echo "🌐 HTTP: http://portal.marcioplasticsurgery.com"
echo "🔒 HTTPS: https://portal.marcioplasticsurgery.com"
echo ""
echo "📊 Verificar status:"
echo "systemctl status horizon-api"
echo "systemctl status nginx"
echo "ufw status"
```

## 🔍 Comandos de Verificação

```bash
# Status dos serviços
systemctl status nginx horizon-api

# Testar localmente
curl http://localhost:3000
curl http://localhost:80

# Ver logs
journalctl -u horizon-api -f
tail -f /var/log/nginx/error.log

# Firewall
ufw status verbose

# Certificado SSL
certbot certificates
```

## 📋 Checklist Final

- [ ] DNS configurado (portal.marcioplasticsurgery.com → 46.202.147.172)
- [ ] Projeto extraído em `/var/www/horizon`
- [ ] Node.js rodando na porta 3000
- [ ] Nginx proxy reverso configurado
- [ ] Firewall ativo e configurado
- [ ] SSL/HTTPS funcionando
- [ ] Serviço systemd ativo
- [ ] Testes de acesso externos

## 🆘 Resolução de Problemas

### Site não carrega:
```bash
systemctl status nginx
systemctl status horizon-api
netstat -tulpn | grep :80
```

### SSL não funciona:
```bash
certbot certificates
nginx -t
systemctl reload nginx
```

### Node.js para:
```bash
journalctl -u horizon-api -n 50
systemctl restart horizon-api
```

Para configurar e rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd portal-medico
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3."Configure o Portal de Login para utilizar o novo banco de dados MySQL hospedado no meu VPS como fonte principal de dados. 
Implemente autenticação própria, onde o login e senha dos usuários são validados diretamente neste banco. Certifique-se de que 
todas as operações de autenticação, permissões e sessões sejam geridas pelo banco de dados configurado. Mantenha as variáveis de conexão 
seguras e facilmente editáveis. Garanta que o sistema esteja preparado para futuras integrações e atualizações."

    ```sql
    CREATE TABLE public.user_profiles (
      id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
      user_id uuid NOT NULL,
      role text NOT NULL,
      created_at timestamp with time zone NULL DEFAULT now(),
      updated_at timestamp with time zone NULL DEFAULT now(),
      CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
      CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
    );
    ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    ```

4.  
    
5.  **Rodar o ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```

    O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Fluxos de Autenticação Implementados

- Login (email + senha)
- Verificação de sessão (`/auth/check`)
- Obter usuário (`/auth/me`)
- Atualização de senha (`/auth/update-password`)
- Solicitação de reset (`/auth/password/reset-request`)
- Redefinição de senha via token (`/auth/password/reset`)

Política de senha: mínimo 8 caracteres, incluir maiúscula, minúscula, número e símbolo.

Opcional futuro: invalidação de outras sessões após alteração de senha (parâmetro reservado no backend).

### Redirecionamento Imediato por Função
Assim que o usuário autentica (ou ao acessar `/` já autenticado), o portal faz redirect externo conforme tabela:

| Função       | Destino Externo |
|--------------|-----------------|
| admin        | https://portal.marcioplasticsurgery.com/portal-admin |
| medico       | https://portal.marcioplasticsurgery.com/portal-medico |
| secretaria   | https://portal.marcioplasticsurgery.com/portal-secretaria |
| paciente     | https://portal.marcioplasticsurgery.com/portal-paciente |

Rotas internas de dashboard foram removidas (eram placeholders). A rota `/dashboard` permanece apenas como fallback transitório e nunca exibirá conteúdo persistente.

Query `?redirect=` ainda tem precedência caso fornecida explicitamente (desde que seja segura). Caso a API retorne `redirect_url`, ela também tem prioridade.

### Variáveis de Ambiente Frontend
Arquivo `.env` / `.env.example`:

```
VITE_API_BASE_URL=https://api.marcioplasticsurgery.com/api
VITE_AUTH_DISABLED=false      # true somente para desenvolvimento sem backend
VITE_FORCE_EXTERNAL_REDIRECT=true
```

`VITE_FORCE_EXTERNAL_REDIRECT` garante que após login válido, mesmo sem rota interna, o usuário saia direto para o portal de função.

## Estrutura de Pastas (Atual)

- `src/App.jsx` (rotas + RootRedirect)
- `src/pages/` (Login, UpdatePassword, RequestPasswordReset, ResetPassword)
- `src/components/` (LoginForm, Layout, ProtectedRoute)
- `src/services/` (api.js + auth/authApi.js)
- `src/store/authStore.js` (Zustand: user, login, logout, checkSession, etc.)
- `src/types/` (documentação auxiliar – não obrigatório)

Removidos: contextos Supabase, páginas internas de dashboard (`AdminDashboardPage.jsx`, `DoctorDashboardPage.jsx`, `DashboardPage.jsx`, `SimpleLoginPage.jsx`).

## Preparação para Integração

O projeto está configurado para fácil integração com APIs externas e serviços de backend. Para adicionar novas funcionalidades ou integrar com outros serviços:

1.  **Chaves de API/Credenciais**: Se necessário, adicione novas credenciais como variáveis de ambiente no seu ambiente Hostinger Horizons ou configure-as no Supabase Vault.
2.  **Novas Rotas/Páginas**: Crie novas rotas em `src/App.jsx` e novos componentes de página em `src/pages/`.
3.  **Lógica de Negócio**: Implemente a lógica de negócio dentro dos componentes ou em serviços separados.
4.  **Estilo**: Utilize Tailwind CSS para estilizar e manter a consistência do design. Componentes shadcn/ui já oferecem uma base sólida.
5.  **Animações**: Use Framer Motion para adicionar animações e transições, melhorando a experiência do usuário.

---

## Próximos Passos (Outros Portais)

Para aplicar o mesmo padrão em outro portal:
1. Garantir mesmas variáveis de ambiente (`VITE_API_BASE_URL`).
2. Reutilizar `authStore` + `authApi` (ou extrair para pacote compartilhado).
3. Implementar `ProtectedRoute` e mapping externo somente se o portal precisar encaminhar o usuário a OUTRO portal; caso contrário, manter rotas internas.
4. Adicionar UI específica do portal (dashboard, menus, etc.) – deixando o login centralizado aqui.

## Checklist Resumido

- [x] Remoção Supabase
- [x] Rotas internas de dashboard removidas
- [x] Redirecionamento externo imediato por função
- [x] Fluxos de recuperação e redefinição de senha
- [x] `.env` e `.env.example` criados
- [x] Atualização README

---

Este portal agora funciona como camada de autenticação unificada pronta para replicação em outros frontends.


LEIA COM Autenticação

# Portal Admin Clínica - Manual do Desenvolvedor

## 1. Visão Geral

Este documento serve como um guia técnico completo para o desenvolvimento, manutenção e integração do Portal Admin da Clínica. Ele foi construído com as mais modernas tecnologias de frontend para garantir uma experiência de usuário fluida, reativa e visualmente impactante.

O portal centraliza a gestão de usuários, agendamentos, permissões, configurações, documentos e integrações com outros sistemas satélites (Portal do Médico, Portal da Secretária, etc.).

---

## 2. Guia para Desenvolvedores de Portais Satélites (Médico, Secretária, etc.)

**Esta é a seção mais importante para equipes externas.** Para garantir uma integração perfeita, siga os passos abaixo:

1.  **Leia este `README.md` por completo.** Ele é a fonte única da verdade sobre a arquitetura de dados e autenticação.
2.  **Siga a Arquitetura de API:** A seção `Guia de Integração` abaixo detalha os endpoints e as estruturas de dados que o backend central deve fornecer. Seu portal deve consumir esses mesmos endpoints.
3.  **Implemente o Fluxo de Autenticação JWT:** A seção `Fluxo de Autenticação` explica como seu portal deve se integrar ao sistema de login centralizado. **Este é um passo crítico.**
4.  **Utilize os Componentes como Referência:** Sinta-se à vontade para usar a estrutura de componentes deste projeto como inspiração para construir uma UI consistente em todo o ecossistema.

---

## 3. Tecnologias Aplicadas

A seleção de tecnologias foi feita para garantir performance, escalabilidade e uma excelente experiência de desenvolvimento.

| Tecnologia | Versão | Propósito e Observações |
| :--- | :--- | :--- |
| **Vite** | `~4.4.5` | Build tool e servidor de desenvolvimento extremamente rápido. Proporciona Hot Module Replacement (HMR) instantâneo, agilizando o desenvolvimento. |
| **React** | `^18.2.0` | Biblioteca principal para a construção da interface de usuário. Utilizamos hooks como `useState`, `useEffect`, `useContext`, `useMemo` e `useCallback` para gerenciar estado e otimizar performance. |
| **React Router DOM** | `^6.16.0` | Para roteamento e navegação entre as páginas da aplicação. O hook `useLocation` foi usado no componente `Layout` para animar as transições de página. |
| **TailwindCSS** | `^3.3.3` | Framework CSS utility-first para estilização rápida e responsiva. Permite criar designs complexos diretamente no JSX sem sair do contexto. |
| **shadcn/ui** | N/A | Coleção de componentes de UI reusáveis, acessíveis e customizáveis, construídos sobre Radix UI e TailwindCSS. **Importante:** Cada componente foi criado manualmente no projeto para total controle. |
| **Framer Motion** | `^10.16.4` | Biblioteca de animação para React. Usada extensivamente para criar transições de página, animações de entrada de componentes e microinterações, tornando a UI mais viva e intuitiva. |
| **Lucide React** | `^0.285.0` | Pacote de ícones SVG limpos, consistentes e otimizados. |
| **React Helmet** | `^6.1.0` | Para gerenciar o `<head>` do documento, permitindo a definição de `títulos` e `meta tags` de SEO para cada página. |
| **date-fns** | `^2.30.0` | Biblioteca moderna para manipulação de datas em JavaScript, usada para formatar datas e horas em agendamentos e logs. |
| **React Dropzone** | `^14.2.3` | Hook para criar uma área de arrastar e soltar (drag'n'drop) para upload de arquivos. |
| **jwt-decode** | `^4.0.0` | Biblioteca para decodificar tokens JWT no lado do cliente de forma segura. |

---

## 4. Guia de Integração com Portais Satélites

Para que os portais satélites (Médico, Secretária, Paciente, etc.) se comuniquem de forma eficaz com este painel administrativo, eles devem seguir a arquitetura de API e a estrutura de dados definidas abaixo.

### 4.1. Fluxo de Autenticação (JWT via Supabase)

A autenticação é centralizada no `portal.marcioplasticsurgery.com`, que utiliza o sistema de Auth do Supabase.

1.  **Redirecionamento para Login:** O seu portal **NÃO DEVE** ter uma tela de login própria. Em vez disso, ao detectar um usuário não autenticado, ele deve redirecioná-lo para o portal central, passando a URL de callback:
    `https://portal.marcioplasticsurgery.com?redirectTo=URL_DE_CALLBACK_DO_SEU_PORTAL`
2.  **Recebimento do Token:** Após o login bem-sucedido, o portal central redirecionará o usuário de volta para a `URL_DE_CALLBACK_DO_SEU_PORTAL`, incluindo o token JWT na URL (ex: `.../callback#access_token=SEU_TOKEN_JWT`).
3.  **Armazenamento e Decodificação:** Sua aplicação deve capturar este token, armazená-lo no `localStorage` e usar a biblioteca `jwt-decode` para extrair as informações do usuário (ID, nome, email, role, permissões).
4.  **Requisições Autenticadas:** Todas as chamadas subsequentes para a API devem incluir o token no cabeçalho `Authorization`:
    `Authorization: Bearer SEU_TOKEN_JWT`

### 4.2. Funcionalidades e Endpoints da API (Estrutura Backend Recomendada)

Para que o frontend funcione corretamente, o backend (seja ele um conjunto de Edge Functions no Supabase, ou uma API externa) deve prover os seguintes endpoints. A estrutura de dados deve ser consistente com as tabelas definidas na seção 4.3.

#### Módulo: Gestão de Usuários e Perfis
- **`GET /api/users`**: Listar todos os usuários com filtros (por `role`, `status`, etc.).
- **`GET /api/users/{id}`**: Obter detalhes de um usuário específico.
- **`POST /api/users`**: Criar um novo usuário (e seu perfil associado em `user_profiles`).
- **`PUT /api/users/{id}`**: Atualizar dados de um usuário.
- **`DELETE /api/users/{id}`**: Desativar ou excluir um usuário.

#### Módulo: Agendamentos (Appointments)
- **`GET /api/appointments`**: Listar agendamentos com filtros (por `data`, `doctor_id`, `patient_id`, `status`).
- **`GET /api/appointments/{id}`**: Obter detalhes de um agendamento.
- **`POST /api/appointments`**: Criar um novo agendamento.
- **`PUT /api/appointments/{id}`**: Atualizar um agendamento (remarcar, cancelar, confirmar).
- **`DELETE /api/appointments/{id}`**: Excluir um agendamento.

#### Módulo: Pacientes
- **`GET /api/patients`**: Listar todos os pacientes.
- **`GET /api/patients/{id}`**: Obter o prontuário completo de um paciente, incluindo `medical_notes`, `patient_photos`, `budgets`, etc.
- **`POST /api/patients/{id}/photos`**: Adicionar uma nova foto ao prontuário do paciente.
- **`PUT /api/patients/{id}/notes`**: Adicionar ou atualizar uma nota médica.

#### Módulo: Orçamentos (Budgets)
- **`GET /api/budgets`**: Listar orçamentos com filtros (por `patient_id`, `status`).
- **`POST /api/budgets`**: Criar um novo orçamento para um paciente/procedimento.
- **`PUT /api/budgets/{id}`**: Atualizar o status de um orçamento (aprovado, rejeitado).

#### Módulo: Configurações e Logs
- **`GET /api/settings`**: Obter as configurações gerais do sistema.
- **`PUT /api/settings`**: Atualizar as configurações gerais.
- **`GET /api/audit-log`**: Listar os logs de auditoria com filtros (por `user_id`, `action`).

### 4.3. Estrutura de Tabelas (Banco de Dados)

O backend que servirá a este painel deve ter tabelas (ou coleções) que correspondam às seguintes estruturas, já presentes no seu banco de dados Supabase.

#### Tabela: `user_profiles` (Essencial para Autenticação)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `user_id` | `UUID` | Chave estrangeira para `auth.users.id`. |
| `role` | `text` | Função do usuário ('admin', 'doctor', 'secretary', 'patient'). |

#### Tabela: `patients`
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `bigint` | Chave primária. |
| `user_id` | `bigint` | Chave estrangeira para a tabela de usuários do sistema. |
| `registration_date` | `date` | Data de cadastro do paciente. |

#### Tabela: `appointments`
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `integer` | Chave primária. |
| `patient_id` | `integer` | ID do paciente. |
| `doctor_id` | `integer` | ID do médico. |
| `appointment_date` | `date` | Data da consulta. |
| `appointment_start_at` | `time` | Hora de início. |

*(As demais tabelas como `doctors`, `medical_notes`, `budgets`, `patient_photos` seguem a estrutura já definida no seu schema do Supabase).*

### 4.4. Notificações

O sistema de notificações é reativo. Para que o "sininho" exiba novas notificações em tempo real, o backend deve, idealmente, fornecer um mecanismo de push (como WebSockets ou Realtime do Supabase). Alternativamente, a aplicação pode fazer polling a um endpoint como `GET /api/notifications`.

**Estrutura da Notificação:**

```json
{
  "id": "notif_abc",
  "title": "Novo Paciente Cadastrado",
  "description": "Maria Souza foi adicionada ao sistema.",
  "type": "info",
  "timestamp": "2025-08-26T15:00:00Z",
  "read": false,
  "link": "/users/user_xyz" 
}
```

---

## 5. Próximos Passos e Expansão

1.  **Conectar ao Backend:** Substituir as chamadas a dados mockados (se houver) por chamadas `fetch` ou com o cliente Supabase para a API real, usando os endpoints definidos na seção 4.2.
2.  **Implementar Autenticação Real:** O `AuthContext.jsx` já está preparado para o fluxo de autenticação JWT descrito acima.
3.  **Expandir Funcionalidades:** Utilizar a base sólida e os componentes reutilizáveis para adicionar novas telas e funcionalidades conforme a necessidade da clínica.

Este manual garante que qualquer desenvolvedor possa rapidamente entender a arquitetura do projeto e contribuir de forma produtiva.