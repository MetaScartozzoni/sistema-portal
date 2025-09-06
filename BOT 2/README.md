# BotConversa - Painel de Atendimento Inteligente

Bem-vindo ao **BotConversa**, um sistema inteligente e moderno para gerenciamento de conversas e atendimento ao cliente. Este painel foi desenvolvido para otimizar a comunicação e a organização das interações, oferecendo uma experiência de usuário fluida e eficiente.

## ✨ Funcionalidades Principais

*   **Dashboard Intuitivo:** Visão geral das conversas, estatísticas e atividades em tempo real.
*   **Gerenciamento de Conversas:** Atendimento e acompanhamento de mensagens com detalhes do paciente, prioridade e etiquetas.
*   **Gerenciamento de Contatos:** Adicione, visualize e organize os contatos dos seus pacientes.
*   **Sistema de Auditoria:** Para usuários administradores, um painel completo de logs e atividades do sistema.
*   **Temas Claro e Escuro (Dark/Light Mode):** Alterne entre um visual moderno e elegante (escuro) e um design limpo e profissional (claro) para se adaptar às suas preferências.
*   **Notificações em Tempo Real:** Mantenha-se atualizado com as novas mensagens e eventos importantes.
*   **Interface Responsiva:** Design otimizado para diferentes tamanhos de tela, garantindo uma ótima experiência em qualquer dispositivo.
*   **Animações Suaves:** Transições e micro-interações que tornam a navegação mais agradável e intuitiva.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias de ponta:

*   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
*   **React 18.2.0:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **React Router 6.16.0:** Para navegação e roteamento entre as páginas.
*   **TailwindCSS 3.3.2:** Framework CSS utilitário para estilização rápida e responsiva.
*   **shadcn/ui:** Componentes de UI reutilizáveis e acessíveis, construídos com Radix UI.
*   **Lucide React 0.292.0:** Biblioteca de ícones moderna e personalizável.
*   **Framer Motion 10.16.4:** Para animações e transições fluidas.
*   **JavaScript:** Linguagem de programação principal.

---

# 📖 Manual de Integração do Backend

**LEIA COM ATENÇÃO:** Este documento é a fonte da verdade para a construção do backend que servirá este painel.

## 1. Visão Geral da Arquitetura

O **BotConversa** foi projetado para ser o frontend de uma API robusta. Atualmente, ele opera com dados locais (`localStorage`), mas está preparado para ser conectado a um backend real. Para que a integração seja bem-sucedida, a API deve seguir as especificações de endpoints, estruturas de dados (JSON) e autenticação detalhadas abaixo.

## 2. Fluxo de Autenticação (JWT)

A autenticação deve ser centralizada e baseada em JSON Web Tokens (JWT).

1.  **Endpoint de Login:** A API deve expor um endpoint (ex: `POST /api/auth/login`) que recebe `email` e `password`.
2.  **Geração do Token:** Em caso de sucesso, a API retorna um token JWT contendo as informações do usuário (ID, nome, email, `role`, etc.).
3.  **Armazenamento no Frontend:** O painel armazenará este token no `localStorage`.
4.  **Requisições Autenticadas:** Todas as chamadas subsequentes para endpoints protegidos devem incluir o token no cabeçalho `Authorization`: `Authorization: Bearer SEU_TOKEN_JWT`.

**Exemplo de Resposta do Login:**
```json
{
  "token": "SEU_TOKEN_JWT_AQUI",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Atendente",
    "email": "atendente@email.com",
    "role": "admin" 
  }
}
```

## 3. Estrutura da API (Endpoints Necessários)

A API deve implementar os seguintes endpoints. O frontend já está preparado para consumi-los.

| Método | Endpoint Sugerido            | Descrição                                                                      |
| :----- | :--------------------------- | :----------------------------------------------------------------------------- |
| **POST** | `/webhook/botconversa`     | **Ponto de entrada principal.** Recebe dados do fluxo do bot para criar contatos e mensagens. |
| **POST** | `/api/auth/login`            | Autentica um usuário e retorna um token JWT.                                   |
| **GET**  | `/api/messages`              | Retorna a lista de todas as conversas/mensagens.                               |
| **POST** | `/api/messages`              | Cria uma nova mensagem (usado para respostas de atendentes no painel).         |
| **GET**  | `/api/contacts`              | Retorna a lista de todos os contatos (pacientes).                              |
| **GET**  | `/api/users`                 | Retorna a lista de todos os usuários (atendentes).                             |
| **GET**  | `/api/tags`                  | Retorna a lista de todas as etiquetas de classificação.                        |
| **GET**  | `/api/logs`                  | Retorna os logs de auditoria do sistema.                                       |
| **PUT**  | `/api/messages/{id}`         | Atualiza o status, prioridade ou atendente de uma mensagem.                    |
| **PUT**  | `/api/users/{id}`            | Atualiza os dados de um usuário (atendente).                                   |


## 4. Estrutura dos Dados (JSON)

### Webhook Principal (`POST /webhook/botconversa`)

Este é o endpoint que seu bot (ou sistema de URA) deve chamar para inserir uma nova conversa no painel.

**Corpo da Requisição (Exemplo):**
```json
{
  "patientId": "5511999998888",
  "patientName": "Nome do Paciente",
  "message": "Olá, gostaria de agendar uma consulta.",
  "email": "paciente@email.com",
  "tags": ["Primeira Consulta", "Orçamento"],
  "current_journey_step": "Agendamento Solicitado",
  "priority": "alta",
  "contact_status": "patient"
}
```

## 5. Estrutura do Banco de Dados (PostgreSQL)

Para garantir a compatibilidade, o banco de dados deve seguir a estrutura abaixo. O script SQL completo para criação das tabelas está disponível no painel em **Configurações > Banco de Dados**.

### Tabela: `users` (Atendentes)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `name` | `VARCHAR(255)` | Nome do atendente. |
| `sector`| `VARCHAR(100)`| Setor do atendente. |
| `role` | `VARCHAR(50)` | "admin" ou "agent". |
| `email` | `VARCHAR(255)`| Email para login. |
| `password_hash`| `VARCHAR(255)`| Hash da senha. |
| `created_at`| `TIMESTAMPTZ`| Data de criação. |

### Tabela: `contacts` (Pacientes)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `patient_id` | `VARCHAR(255)` | ID único do paciente (telefone, CPF). |
| `name` | `VARCHAR(255)` | Nome do paciente. |
| `last_activity` | `TIMESTAMPTZ` | Data da última interação. |

### Tabela: `messages` (Mensagens)
| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. |
| `patient_id` | `VARCHAR(255)`| ID do paciente (chave estrangeira de `contacts`).|
| `message` | `TEXT` | Conteúdo da mensagem. |
| `status` | `VARCHAR(100)`| "pendente", "em_andamento", "resolvido". |
| `priority`| `VARCHAR(50)` | "baixa", "media", "alta". |
| `assigned_to_id`| `UUID` | ID do atendente responsável (chave estrangeira de `users`). |
| `created_at` | `TIMESTAMPTZ` | Data de criação. |

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.