# BOT Backend

Production-ready REST API for the React dashboard with Fastify + Prisma + JWT.

## Stack

- Node.js + TypeScript
- Fastify, Zod, JWT (cookies httpOnly)
- Prisma ORM (SQLite dev, PostgreSQL optional)
- Pino logs, Helmet, Rate limit, CORS
- OpenAPI docs at `/docs` and `/openapi.json`
- Vitest + Supertest
- Dockerfile + docker-compose

## Quick Start (Local)

1) Install dependencies

```
npm i
```

2) Configure environment

Copy `.env.example` to `.env` and adjust values if needed (defaults are fine for dev).

3) Initialize DB and seed admin

```
npx prisma db push && npm run db:seed
```

4) Run dev server

```
npm run dev
```

API runs on `http://localhost:3001`. Swagger UI at `http://localhost:3001/docs`.

Admin user seeded: `admin@local` / `admin123`.

## NPM Scripts

- `dev`: watch and run with tsx + nodemon
- `build`: compile TypeScript
- `start`: run compiled server
- `db:push`, `db:migrate`, `db:seed`, `db:studio`
- `test`, `test:watch`
- `lint`, `format`

## Database

- Dev by default uses SQLite: set in `.env`:

```
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./dev.db"
```

- For Postgres (docker-compose):

```
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bot?schema=public
```

Then `npx prisma db push`.

## Auth

- `POST /auth/register` → creates user
- `POST /auth/login` → returns JWT and sets httpOnly cookie `token`
- `POST /auth/logout` → clears cookie
- `GET /me` → current user (send cookie or `Authorization: Bearer <token>`)

## Core Routes (todas agora sob prefixo `/api`)

- Health/Metrics: `GET /api/health`, `GET /api/metrics`
- Projects: `GET/POST /api/projects`, `GET/PUT/PATCH/DELETE /api/projects/:id`
- Bots: `GET/POST /api/bots`, `GET/PUT/PATCH/DELETE /api/bots/:id`, `POST /api/bots/:id/activate`, `POST /api/bots/:id/pause`
- Flows: `GET/POST /api/bots/:botId/flows`, `GET/PUT/PATCH/DELETE /api/flows/:id`
- Messages: `GET /api/bots/:botId/messages?direction=IN|OUT&limit=50&patientId=...&tag=...`, `POST /api/bots/:botId/messages`, `POST /api/webhooks/messages`
- BotConversa Webhook: `POST /api/webhook/botconversa` (payload abaixo) → cria mensagem IN vinculada a um bot.

RBAC: `ADMIN` can access all; `USER` limited to own resources.

## Tests

Run:

```
npm test
```

Uses isolated SQLite file per run.

## Docker

Build and run:

```
docker build -t bot-api .
docker run -p 3001:3001 --env-file .env bot-api
```

Or with Postgres via docker-compose:

```
docker compose up --build
```

## Frontend Integration

- Set `CORS_ORIGIN` in `.env` to your frontend origin (e.g., `http://localhost:5173`).
- The API sets `httpOnly` cookie. In dev you can also send `Authorization: Bearer <token>`.
- Swagger UI: `GET /docs` and `GET /openapi.json` for codegen.

### BotConversa Webhook Payload (`POST /api/webhook/botconversa`)

```
POST /api/webhook/botconversa
Content-Type: application/json
{
	"botId": "<id de um bot existente>",
	"patientId": "5511999998888",
	"patientName": "Nome do Paciente",
	"message": "Texto enviado pelo paciente",
	"email": "paciente@example.com",
	"tags": ["Primeira Consulta", "Orçamento"],
	"current_journey_step": "Agendamento Solicitado",
	"priority": "alta",
	"contact_status": "patient"
		,"statusAppointment": "AGENDADO"
}
```

Resposta `202 Accepted`:
```
{
	"id": "...",
	"botId": "...",
	"direction": "IN",
	"content": "Texto enviado pelo paciente",
	"metadata": { ...campos adicionais... },
	"createdAt": "2025-09-02T12:34:56.000Z"
}

### Contatos & statusAppointment

Agora existe a entidade `Contact` criada automaticamente no primeiro webhook recebido para um `patientId` (armazenado como `externalId`).

`statusAppointment` (enum):
- `LEAD` (padrão)
- `AGENDADO`
- `CONFIRMADO`
- `REALIZADO`
- `CANCELADO`

Regras atuais:
- Se o webhook trouxer `statusAppointment`, o contato é atualizado para esse valor.
- Uma mensagem sempre referencia (`contactId`) além de manter `patientId` denormalizado para retrocompatibilidade.
- Endpoints: `GET /api/contacts` e `GET /api/contacts/:id`.
```

## Notes / Decisions

- Idempotency: endpoints accept `Idempotency-Key` conceptually, but a durable store is not implemented in this version.
- Webhook signature verification is left as TODO.

