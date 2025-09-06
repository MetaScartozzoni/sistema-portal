import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middlewares/auth-guard';
import { createMessage, listMessages, receiveWebhookMessage, receiveBotConversaWebhook } from './messages.service';
import { createMessageBody, webhookMessageBody, botConversaWebhookBody } from './messages.schemas';

export function messagesRoutes(app: FastifyInstance) {
  app.get('/bots/:botId/messages', { preHandler: authGuard }, async (req: any, reply) => {
    const { direction, limit = '50', patientId, tag } = req.query as Record<string, string>;
    const items = await listMessages(
      req.params.botId,
      req.user.id,
      req.user.role,
      direction as any,
      parseInt(limit, 10),
      patientId,
      tag
    );
    reply.send({ items });
  });

  app.post('/bots/:botId/messages', { preHandler: authGuard }, async (req: any, reply) => {
    const body = createMessageBody.parse(req.body);
    const msg = await createMessage(req.params.botId, req.user.id, req.user.role, body);
    reply.status(201).send(msg);
  });

  app.post('/webhooks/messages', async (req: any, reply) => {
    const body = webhookMessageBody.parse(req.body);
    // TODO: validate signature if provided (assumed out of scope now)
    const msg = await receiveWebhookMessage(body);
    reply.status(202).send(msg);
  });

  // BotConversa legacy/new webhook endpoint (as per frontend README manual section)
  app.post('/webhook/botconversa', async (req: any, reply) => {
    const body = botConversaWebhookBody.parse(req.body);
    const msg = await receiveBotConversaWebhook(body);
    reply.status(202).send(msg);
  });
}

