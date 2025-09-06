# Portal Admin Clínica - Manual do Desenvolvedor

## 1. Visão Geral

Este documento serve como um guia técnico completo para o desenvolvimento, manutenção e integração do Portal Admin da Clínica. Ele foi construído com as mais modernas tecnologias de frontend para garantir uma experiência de usuário fluida, reativa e visualmente impactante.

O portal centraliza a gestão de usuários, agendamentos, permissões, configurações, documentos e integrações com outros sistemas satélites (Portal do Médico, Portal da Secretária, etc.).

---

## 2. Checklist de Integração para Portais Satélites

Este checklist é o guia definitivo para qualquer equipe que precise integrar um novo portal (Médico, Secretária, Paciente, etc.) ao ecossistema da clínica.

### Fase 1: Configuração e Alinhamento
- [ ] **Ler este `README.md` por completo.** É a fonte única da verdade.
- [ ] **Analisar a UI do Portal Admin.** Use-o como referência para manter a consistência visual e de experiência do usuário.
- [ ] **Configurar o ambiente de desenvolvimento frontend** com as tecnologias listadas na seção "Tecnologias Aplicadas".

### Fase 2: Implementação da Autenticação
- [ ] **Implementar o redirecionamento para o portal de login centralizado.** Nenhum portal satélite deve ter sua própria tela de login.
- [ ] **Criar a página de callback** para receber e processar o token JWT.
- [ ] **Armazenar o token JWT de forma segura** no `localStorage`.
- [ ] **Implementar o envio do token** no cabeçalho `Authorization: Bearer <token>` em todas as requisições para a API.

### Fase 3: Desenvolvimento do Backend
- [ ] **Escolher a tecnologia de backend.** Recomendamos Node.js com Express/Fastify, mas qualquer tecnologia que possa criar uma API REST é válida.
- [ ] **Estruturar o banco de dados** seguindo o modelo da seção "Estrutura de Tabelas".
- [ ] **Desenvolver os endpoints da API** conforme especificado no "Catálogo de APIs".
- [ ] **Implementar a validação do token JWT** em todos os endpoints protegidos.

### Fase 4: Conexão e Testes
- [ ] **Substituir os dados mockados** do seu portal frontend por chamadas `fetch` para o backend.
- [ ] **Testar o fluxo completo de autenticação.**
- [ ] **Testar todas as operações CRUD** (Criar, Ler, Atualizar, Deletar) para cada funcionalidade.
- [ ] **Validar a comunicação entre os portais** através do backend compartilhado.

---

## 3. Catálogo de APIs (Endpoints Sugeridos)

O backend deve implementar os seguintes endpoints para garantir a compatibilidade com o Portal Admin e outros portais.

| API | Método | Endpoint | Funcionalidade Breve |
| :--- | :--- | :--- | :--- |
| **Usuários** | `GET` | `/api/users` | Lista todos os usuários. |
| | `POST` | `/api/users` | Cria um novo usuário. |
| | `PUT` | `/api/users/{id}` | Atualiza um usuário existente. |
| | `DELETE` | `/api/users/{id}` | Remove um usuário. |
| **Agendamentos** | `GET` | `/api/schedules` | Lista todos os agendamentos (com filtros). |
| | `POST` | `/api/schedules` | Cria um novo agendamento. |
| | `PUT` | `/api/schedules/{id}` | Atualiza um agendamento. |
| **Configurações** | `GET` | `/api/settings` | Retorna as configurações gerais do sistema. |
| | `PUT` | `/api/settings` | Atualiza as configurações gerais. |
| **Logs** | `GET` | `/api/logs` | Lista os logs de atividade do sistema. |
| | `POST` | `/api/logs` | Registra uma nova atividade. |
| **Protocolos** | `GET` | `/api/protocols` | Lista os protocolos de notificação. |
| | `POST` | `/api/protocols` | Cria um novo protocolo. |
| `PUT` | `/api/protocols/{id}` | Atualiza um protocolo. |
| **Notificações** | `GET` | `/api/notifications` | Retorna as notificações para o usuário logado. |
| | `POST` | `/api/notifications/read`| Marca notificações como lidas. |

---

## 4. Dicas de Boas Práticas para Estrutura de Backend

Para um backend robusto, seja ele em uma **VPS** ou utilizando serviços como o **Supabase**, recomendamos a seguinte estrutura e práticas:

1.  **Arquitetura em Camadas (Layered Architecture):**
    *   **Camada de Roteamento (Routes):** Define os endpoints da API e os associa aos controllers. Ex: `user.routes.js`.
    *   **Camada de Controle (Controllers):** Recebe as requisições, valida os dados de entrada e chama os serviços. Não deve conter lógica de negócio. Ex: `user.controller.js`.
    *   **Camada de Serviço (Services):** Contém a lógica de negócio principal da aplicação. Ex: `user.service.js`.
    *   **Camada de Acesso a Dados (Data Access Layer / Repository):** Responsável por toda a comunicação com o banco de dados. Ex: `user.repository.js`.

2.  **Validação de Dados:** Utilize uma biblioteca como `Zod` ou `Joi` para validar todos os dados que chegam nas requisições, garantindo a integridade antes de processá-los.

3.  **Gerenciamento de Configuração:** Use variáveis de ambiente (arquivos `.env`) para armazenar informações sensíveis como chaves de API, segredos de JWT e credenciais de banco de dados. **Nunca** coloque esses dados diretamente no código.

4.  **Tratamento de Erros Centralizado:** Crie um *middleware* de erro para capturar todas as exceções da aplicação, formatando e enviando respostas de erro consistentes para o cliente.

5.  **Segurança:**
    *   **CORS:** Configure o CORS (Cross-Origin Resource Sharing) para permitir requisições apenas dos domínios dos seus portais.
    *   **Hashing de Senhas:** Se for gerenciar senhas (o que não é o caso aqui, pois usamos Supabase Auth), sempre use algoritmos fortes como `bcrypt`.
    *   **RLS (Row-Level Security) no Supabase:** Se usar Supabase, ative e configure o RLS para garantir que um usuário só possa acessar os dados que tem permissão para ver, diretamente no nível do banco de dados.

---

## 5. Tecnologias Aplicadas

A seleção de tecnologias foi feita para garantir performance, escalabilidade e uma excelente experiência de desenvolvimento.

| Tecnologia | Versão | Propósito e Observações |
| :--- | :--- | :--- |
| **Vite** | `~4.4.5` | Build tool e servidor de desenvolvimento extremamente rápido. |
| **React** | `^18.2.0` | Biblioteca principal para a construção da interface de usuário. |
| **React Router DOM** | `^6.16.0` | Para roteamento e navegação entre as páginas da aplicação. |
| **TailwindCSS** | `^3.3.3` | Framework CSS utility-first para estilização rápida e responsiva. |
| **shadcn/ui** | N/A | Coleção de componentes de UI reusáveis, acessíveis e customizáveis. |
| **Framer Motion** | `^10.16.4` | Biblioteca de animação para criar uma UI mais viva e intuitiva. |
| **Lucide React** | `^0.285.0` | Pacote de ícones SVG limpos, consistentes e otimizados. |
| **jwt-decode** | `^4.0.0` | Biblioteca para decodificar tokens JWT no lado do cliente de forma segura. |

---

## 6. Estrutura de Tabelas (Banco de Dados)

O backend que servirá a este painel deve ter tabelas (ou coleções) que correspondam às seguintes estruturas.

#### Tabela: `users`

| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária única. |
| `name` | `string` | Nome completo do usuário. |
| `email` | `string` | Endereço de email (usado para login). |
| `role` | `string` | Nome da função (e.g., "medico", "secretaria"). |
| `avatar` | `string` (URL) | URL da imagem de perfil. |
| `status` | `string` | "active" ou "inactive". |
| `permissions` | `array` de `string`| Lista de permissões herdadas da função. |
| `createdAt` | `timestamp` | Data de criação do registro. |

#### Tabela: `schedules`

| Coluna | Tipo de Dados | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` / `string` | Chave primária. |
| `participantIds`| `array` de `string`| IDs dos usuários participantes (pacientes). |
| `professionalId`| `string` | ID do profissional (médico) responsável. |
| `date` | `date` | Data do agendamento (formato `YYYY-MM-DD`). |
| `time` | `time` | Hora do agendamento (formato `HH:MM`). |
| `type` | `string` | "Consulta", "Cirurgia", "Reunião", etc. |
| `status` | `string` | "confirmed", "cancelled", "completed". |
| `reason` | `string` | Motivo principal do agendamento. |

---

## 7. Gerenciamento de Variáveis de Ambiente (`.env`)

Para centralizar e proteger informações sensíveis, este projeto utiliza um arquivo `.env` na raiz. É crucial entender como ele funciona para garantir a segurança e a correta configuração da aplicação.

### Como Funciona:
- O Vite, nosso build tool, carrega automaticamente as variáveis definidas no arquivo `.env`.
- **IMPORTANTE:** Por segurança, apenas variáveis que começam com o prefixo `VITE_` são expostas ao código do frontend. Isso previne que chaves de API secretas, senhas de banco de dados ou outras informações sensíveis sejam acidentalmente enviadas para o navegador do usuário.

### Como Usar:
1.  **Crie/Edite o arquivo `.env`** na raiz do projeto.
2.  **Adicione suas variáveis** usando o prefixo `VITE_`. Por exemplo:
    ```
    VITE_AUTH_PORTAL_URL=https://seusubdominio.com/auth
    VITE_API_BASE_URL=https://api.seuservidor.com
    ```
3.  **Acesse as variáveis no código** através do objeto `import.meta.env`:
    ```javascript
    const authPortalUrl = import.meta.env.VITE_AUTH_PORTAL_URL;
    ```
4.  Após modificar o `.env`, o servidor de desenvolvimento do Vite irá recarregar automaticamente para aplicar as mudanças.

### Variáveis Utilizadas no Frontend:
- `VITE_AUTH_PORTAL_URL`: URL do sistema de autenticação centralizado.
- `VITE_API_BASE_URL`: URL base para as chamadas à API do backend.
- `VITE_GA_TRACKING_ID` (Opcional): ID de rastreamento do Google Analytics.

### Segurança e Boas Práticas:
- **NUNCA comite o arquivo `.env` para o controle de versão (Git).** Adicione `.env` ao seu arquivo `.gitignore` para evitar que dados sensíveis sejam expostos.
- As variáveis de backend (como senhas de banco de dados) devem residir **apenas** no arquivo `.env` do seu servidor backend e **nunca** devem ter o prefixo `VITE_`.
- Para ambientes de produção, as variáveis de ambiente devem ser configuradas diretamente na plataforma de hospedagem (Hostinger, Vercel, etc.).