# Portal Médico - Manual do Desenvolvedor

Bem-vindo ao Portal Médico! Esta é uma aplicação web robusta desenvolvida em React para auxiliar na gestão de clínicas e consultórios médicos, com foco especial na cirurgia plástica. Ele oferece ferramentas para agendamento, acompanhamento da jornada do paciente, teleconsultas, comunicação e muito mais.

Este documento serve como um guia técnico completo para o desenvolvimento, manutenção e integração do Portal Médico com o ecossistema de portais da clínica.

---

## 1. Visão Geral da Arquitetura

O Portal do Médico funciona como um **aplicativo satélite**. Ele é projetado para ser um cliente inteligente que consome dados de uma API central, gerenciada pelo **Portal Administrativo**. A autenticação, os dados dos pacientes e as regras de negócio são centralizadas, garantindo consistência e segurança em todo o ecossistema.

- **Frontend (Este Projeto):** Interface reativa e rica em funcionalidades para o médico.
- **Backend (API Central):** Ponto único de verdade para todos os dados. Gerencia a lógica de negócio e a comunicação com o banco de dados.

---

## 2. Configuração do Ambiente (`.env`)

O projeto utiliza um arquivo `.env` na raiz para gerenciar as variáveis de ambiente. Isso permite configurar a aplicação para diferentes cenários (desenvolvimento, produção) sem alterar o código.

### Como Funciona:

1.  **Carregamento Automático:** O Vite (nosso build tool) carrega automaticamente as variáveis do arquivo `.env` no início da execução.
2.  **Prefixo `VITE_`:** Para que uma variável seja acessível no código do frontend, seu nome **obrigatoriamente** deve começar com o prefixo `VITE_`. Isso é uma medida de segurança para evitar o vazamento acidental de chaves sensíveis.
3.  **Acesso no Código:** Todas as variáveis de ambiente são importadas e exportadas pelo arquivo `src/config.js`. Para usar uma configuração em qualquer parte do sistema, importe-a deste arquivo central.

### Atualizando as Configurações:
Para modificar uma variável (como a URL da API), edite o valor correspondente no arquivo `.env`. Em ambiente de desenvolvimento, **será necessário reiniciar o servidor** para que as novas configurações sejam aplicadas.

---

## 3. Guia de Integração e Uso da API

Para que o Portal do Médico funcione corretamente, ele precisa se conectar a uma API de backend que siga as especificações de endpoints e estruturas de dados detalhadas abaixo.

### 3.1. Autenticação Centralizada (Cookie / Sessão)

Agora o modelo usa um **Portal de Login dedicado** (`/portal-login`) que estabelece a sessão via cookies HTTP-only definidos pelo backend (`api.marcioplasticsurgery.com`). O Portal Médico não gerencia credenciais diretamente.

Fluxo atual:
1. Usuário acessa Portal Médico sem sessão válida.
2. `ProtectedRoute` redireciona para `VITE_LOGIN_PORTAL_URL` anexando `?redirect=<URL_ORIGINAL>`.
3. Portal de Login autentica (`/auth/login`) e, após sucesso, identifica a role. Caso role seja `medico`, redireciona para a URL de retorno (callback) enviada na query.
4. Cookie de sessão já está presente para o domínio permitido (CORS + credentials=true). Portal Médico então chama `/auth/check` e `/auth/me` para hidratar o estado.

Não há mais fragmento `#access_token` nem armazenamento manual de JWT. Segurança reforçada (tokens não ficam expostos ao JS). Qualquer invalidação de sessão é tratada via logout central ou expiração do cookie.

Variáveis relevantes neste portal:
```
VITE_API_BASE_URL=https://api.marcioplasticsurgery.com/api
VITE_LOGIN_PORTAL_URL=https://portal.marcioplasticsurgery.com/portal-login
VITE_AUTH_DISABLED=false
```

Fallback de desenvolvimento: se `VITE_AUTH_DISABLED=true`, um usuário convidado (role `medico`) é injetado para acelerar UI.

### Checklist de Variáveis Obrigatórias
Validadas via script `npm run lint:env`:
```
VITE_API_BASE_URL
VITE_LOGIN_PORTAL_URL
VITE_ROLE_REQUIRED
VITE_FEATURES
```

### Referências Não Sensíveis (Banco / Infra)
```
API_BASE=http://api.marcioplasticsurgery.com
DB_PRIMARY_NAME=horizon_main
DB_BOT_NAME=horizon_bot
DB_HOST=hostinger.mysql.internal
DB_PORT=3306
```
Esses nomes são apenas informativos no frontend; credenciais reais vivem só no backend.

### Pacote Compartilhado `@portal/shared`
O portal consome autenticação e mapeadores de domínio do pacote workspaces `packages/shared`.
Alias configurado em `vite.config.js`:
```
alias: {
	'@': path.resolve(__dirname, './src'),
	'@portal/shared': path.resolve(__dirname, './packages/shared/src')
}
```
Scripts úteis:
```
npm run build:shared  # build do pacote compartilhado
npm run build:all     # build shared + portal
npm run lint:env      # valida variáveis obrigatórias
```

---
## 4. Estrutura do Banco de Dados (Exemplo)

O backend que serve a este portal deve ter uma estrutura de banco de dados similar a esta. As tabelas são projetadas para serem relacionais e escaláveis.

#### Tabela: `users`
*Armazena informações de todos os usuários do sistema (médicos, secretárias, administradores).*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária única. | `"user_123"` |
| `name` | `string` | Nome completo do usuário. | `"Dr. Márcio"` |
| `email` | `string` | Endereço de email (usado para login). | `"marcio@clinica.com"` |
| `role` | `string` | Papel do usuário ("medico", "secretaria", "admin"). | `"medico"` |
| `avatar` | `string` (URL) | URL da imagem de perfil. | `"https://.../avatar.png"` |
| `status` | `string` | "active" ou "inactive". | `"active"` |
| `created_at` | `timestamp` | Data de criação do registro. | `"2025-08-25T10:00:00Z"` |
| `last_login` | `timestamp` | Data do último login. | `"2025-08-26T14:30:00Z"` |

#### Tabela: `patients`
*Armazena dados específicos dos pacientes.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"patient_abc"` |
| `full_name` | `string` | Nome completo do paciente. | `"Ana Beatriz Silva"` |
| `email` | `string` | Email do paciente. | `"ana.silva@example.com"`|
| `phone` | `string` | Telefone de contato. | `"+5511987654321"` |
| `cpf` | `string` | CPF do paciente. | `"123.456.789-00"` |
| `birth_date` | `date` | Data de nascimento. | `"1990-05-15"` |
| `address` | `jsonb` | Endereço completo. | `{ "rua": "...", "cidade": "..." }`|
| `surgery_date`| `date` | Data da cirurgia (se aplicável). | `"2025-09-20"` |
| `doctor_id` | `UUID` | Chave estrangeira para `users(id)`. | `"user_123"` |
| `created_at` | `timestamp` | Data de criação do registro. | `"2025-08-01T11:00:00Z"`|

#### Tabela: `schedules`
*Armazena todos os tipos de agendamentos.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"sched_456"` |
| `doctor_id`| `UUID` | ID do médico responsável (de `users`). | `"user_123"` |
| `patient_id`| `UUID` | ID do paciente (de `patients`), pode ser nulo. | `"patient_abc"` |
| `start_time` | `timestamp` | Data e hora de início. | `"2025-09-10T14:00:00Z"` |
| `end_time` | `timestamp` | Data e hora de fim. | `"2025-09-10T15:00:00Z"` |
| `type` | `string` | "Consulta", "Cirurgia", "Retorno", "Pessoal". | `"Consulta"` |
| `status` | `string` | "confirmed", "cancelled", "completed". | `"confirmed"` |
| `title` | `string` | Título ou motivo do agendamento. | `"Consulta de avaliação"` |
| `whereby_link`| `string` (URL)| Link da sala de teleconsulta (se aplicável). | `"https://.../sala"` |

#### Tabela: `protocols`
*Define os modelos de jornada do paciente.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"proto_xyz"` |
| `name` | `string` | Nome do protocolo. | `"Protocolo Padrão - Pós-operatório"` |
| `description`| `string` | Descrição do que o protocolo cobre. | `"Acompanhamento padrão..."`|
| `total_stages`| `integer`| Número total de etapas no protocolo. | `15` |
| `is_active` | `boolean` | Se o protocolo está ativo para uso. | `true` |

#### Tabela: `protocol_stages`
*Define cada etapa (checklist) de um protocolo.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"stage_1"` |
| `protocol_id`| `UUID` | Chave estrangeira para `protocols(id)`. | `"proto_xyz"` |
| `name` | `string` | Nome da etapa. | `"1º Retorno Pós-Operatório"` |
| `position` | `integer`| Ordem da etapa dentro do protocolo. | `12` |
| `checklist` | `jsonb` | Lista de tarefas para a etapa. | `[{"item": "Verificar curativos"}, ...]` |
| `deadline_rules` | `jsonb`| Regras para o prazo (e.g., 7 dias após a cirurgia). | `{"type": "post_op", "days": 7}` |

#### Tabela: `patient_journeys`
*Rastreia o progresso de um paciente em um protocolo específico.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"journey_ab1"` |
| `patient_id`| `UUID` | Chave estrangeira para `patients(id)`. | `"patient_abc"` |
| `protocol_id`| `UUID` | Chave estrangeira para `protocols(id)`. | `"proto_xyz"` |
| `current_stage_id` | `UUID` | Chave estrangeira para `protocol_stages(id)`. | `"stage_1"` |
| `status` | `string` | "on-track", "delayed", "completed". | `"on-track"` |
| `completed_stages`| `jsonb` | Log de etapas concluídas e suas datas. | `[{"stage_id": "...", "completed_at": "..."}]`|

#### Tabela: `evolutions`
*Registra cada entrada de evolução pós-operatória.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"evo_t5y"` |
| `patient_id`| `UUID` | Chave estrangeira para `patients(id)`. | `"patient_abc"` |
| `doctor_id`| `UUID` | Chave estrangeira para `users(id)`. | `"user_123"` |
| `evolution_date`| `date` | Data da evolução. | `"2025-08-10"` |
| `days_post_op`| `integer`| Dias de pós-operatório. | `9` |
| `data` | `jsonb` | Dados da evolução (peso, edema, dor, etc.). | `{"weight": "84", "edema": "2+"...}`|
| `notes` | `text` | Anotações sobre o estado da ferida, queixas, etc. | `"Apresenta boa cicatrização..."` |

---

## 5. API do Ecossistema (Endpoints Essenciais)

A API central deve expor os seguintes endpoints para que o Portal do Médico e outros satélites possam operar.

| Método | Endpoint Sugerido | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Verifica o status da API. | Opcional |
| **GET** | `/api/users/me` | Retorna os dados do usuário autenticado (logado). | Obrigatória |
| | | **Gestão de Pacientes** | |
| **GET** | `/api/patients` | Lista todos os pacientes associados ao médico logado. | Obrigatória |
| **GET** | `/api/patients/{id}` | Retorna os detalhes de um paciente específico. | Obrigatória |
| | | **Agenda e Consultas** | |
| **GET** | `/api/schedules` | Lista agendamentos (permite filtros por data e tipo). | Obrigatória |
| **POST**| `/api/schedules` | Cria um novo agendamento (consulta, cirurgia, etc.).| Obrigatória |
| **POST**| `/api/meetings/whereby` | Gera um link de teleconsulta para um agendamento. | Obrigatória |
| | | **Jornada do Paciente** | |
| **GET** | `/api/journeys` | Lista as jornadas de todos os pacientes do médico. | Obrigatória |
| **POST**| `/api/journeys/{id}/advance`| Avança o paciente para a próxima etapa da jornada. | Obrigatória |
| **GET** | `/api/protocols` | Lista todos os protocolos de jornada disponíveis. | Obrigatória |
| **POST**| `/api/protocols` | Cria um novo protocolo de jornada (Admin). | Obrigatória |
| | | **Evolução e Caderno Digital** | |
| **GET** | `/api/patients/{id}/evolutions` | Lista o histórico de evolução de um paciente. | Obrigatória |
| **POST**| `/api/patients/{id}/evolutions`| Adiciona um novo registro de evolução. | Obrigatória |
| **GET** | `/api/patients/{id}/documents` | Lista os documentos do caderno digital do paciente. | Obrigatória |
| **POST**| `/api/documents` | Salva um novo documento no caderno digital. | Obrigatória |
| | | **Comunicação** | |
| **POST**| `/api/messages/sms` | Envia uma mensagem SMS para um paciente. | Obrigatória |
| **POST**| `/api/messages/email`| Envia um email para um paciente (suporta anexos). | Obrigatória |

---

## 6. Próximos Passos

1.  **Desenvolvimento do Backend:** Utilizar este documento como guia para construir a API central.
2.  **Conexão Real:** Substituir os dados de fallback em `src/services/api.js` por chamadas `fetch` aos endpoints reais da API.
3.  **Testes de Integração:** Validar se o fluxo de autenticação e a troca de dados entre o portal e a API estão funcionando perfeitamente.
4.  **Refatoração Concluída:** AuthContext removido—toda autenticação agora via `src/store/authStore.js` (Zustand) + cookies de sessão.
5.  **Interceptor 401:** Requisições com resposta 401 redirecionam automaticamente ao portal de login preservando URL atual.
6.  **Centralização de Tipos:** Helpers de domínio adicionados em `src/types/patient.js` e `src/types/agenda.js` para padronizar mapeamentos.
7.  **Export Único:** `src/types/index.js` exporta todos os helpers (patient, agenda, user, evolution) facilitando futura extração para pacote compartilhado entre portais.
8.  **Pacote Compartilhado (experimental):** Diretório `shared/` inclui esboço de pacote `@portal/shared` com `createAuthStore` reutilizável e re-export de tipos para padronizar em outros portais.
9.  **Workspaces:** Configurado `workspaces` no `package.json` raiz. Pacote fonte agora em `packages/shared` com build via Rollup (`npm run build` dentro do pacote ou `npm -w @portal/shared run build`).