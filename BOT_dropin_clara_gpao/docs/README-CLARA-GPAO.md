# Clara + GP-AO (drop-in)
Arquivos prontos para adicionar **assistente Clara** e **orquestrador GP-AO** ao seu monorepo.

## Passos
1. Copie o conteúdo deste pacote para a raiz `BOT/` preservando a estrutura de pastas.
2. **Rotas (backend)**: importe e monte em `app.ts`:
```ts
import clara from "./src/routes/ai.clara.routes";
import gpao from "./src/routes/ai.gpao.routes";
import webhooks from "./src/routes/common.webhooks.routes";
app.use("/ai/clara", clara);
app.use("/ai/gp-ao", gpao);
app.use("/common/webhooks", webhooks);
```
3. **Services em DI**: exponha em `req.services.tools` as funções de `backend/src/modules/ai/tools` (ou importe direto nas rotas se preferir).
4. **Prisma**: mescle `backend/prisma/schema.extend.prisma` ao seu `schema.prisma` e rode:
```
npx prisma db push
```
5. **Painéis**: chame os endpoints:
- `POST /ai/clara/chat`
- `POST /ai/clara/tools/schedule`
- `GET  /ai/clara/tools/availability`
- `GET  /ai/clara/tools/prices`
- `GET  /ai/clara/tools/insurances`
- `GET  /ai/clara/tools/clinic-info`
- `POST /ai/clara/tools/escalate`
- `POST /ai/clara/tools/consent`
- `POST /ai/gp-ao/route`
- `POST /common/webhooks/botconversa`

## Observações
- Ajuste CORS para os 5 painéis.
- Cookies httpOnly em produção (Secure + SameSite adequado).
- Substitua os *stubs* dos tools por integrações reais (agenda, convênios, etc.).

Gerado em 2025-09-02T08:28:29.
