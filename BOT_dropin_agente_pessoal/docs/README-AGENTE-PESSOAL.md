# Agente Pessoal — Drop-in
Pacote para adicionar um **agente pessoal** ao seu monorepo (BOT).

## Passos de integração
1. Copie estas pastas/arquivos para o projeto mantendo caminhos.
2. Monte as rotas no `app.ts` do backend:
```ts
import personal from "./src/routes/ai.personal.routes";
app.use("/ai/pessoal", personal);
```
3. Exponha os services em `req.services.personal` (ou importe diretamente nas rotas):
- createTask, listTasks, updateTaskStatus, addMemory, getMemory, searchDocs

4. Prisma: mescle `backend/prisma/schema.agente_pessoal.prisma` no seu `schema.prisma` e rode:
```
npx prisma db push
```
(opcional: `npx prisma migrate dev`)

5. Front-ends: chame os endpoints:
- `POST /ai/pessoal/chat`
- `POST /ai/pessoal/tools/create-task`
- `GET  /ai/pessoal/tools/list-tasks?status=open|done|all&query=`
- `POST /ai/pessoal/tools/update-task-status`
- `POST /ai/pessoal/tools/add-memory`
- `GET  /ai/pessoal/tools/get-memory?userId=...&key=`
- `GET  /ai/pessoal/tools/search-docs?query=...`

## Observações
- Garanta autenticação no gateway (JWT/cookies) e aplique rate-limit.
- Para RAG, conecte `searchDocs` ao seu índice (vector DB).
- Para lembretes, crie um scheduler/cron que consulte `PersonalTask` e dispare notificações.

Gerado em 2025-09-02T08:34:37.
