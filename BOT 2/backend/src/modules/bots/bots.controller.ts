import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middlewares/auth-guard';
import { createBotBody, updateBotBody } from './bots.schemas';
import { createBot, deleteBot, getBot, listBots, setBotStatus, updateBot } from './bots.service';

export function botsRoutes(app: FastifyInstance) {
  app.get('/bots', { preHandler: authGuard }, async (req: any, reply) => {
    const { page = '1', limit = '10', search } = req.query as Record<string, string>;
    const res = await listBots(req.user.id, req.user.role, parseInt(page, 10), parseInt(limit, 10), search);
    reply.send(res);
  });

  app.post('/bots', { preHandler: authGuard }, async (req: any, reply) => {
    const body = createBotBody.parse(req.body);
    const bot = await createBot(req.user.id, req.user.role, body);
    reply.status(201).send(bot);
  });

  app.get('/bots/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const bot = await getBot(req.params.id, req.user.id, req.user.role);
    if (!bot) return reply.status(404).send({ error: { message: 'Not found' } });
    reply.send(bot);
  });

  app.put('/bots/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateBotBody.parse(req.body);
    const bot = await updateBot(req.params.id, req.user.id, req.user.role, body);
    reply.send(bot);
  });

  app.patch('/bots/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateBotBody.parse(req.body);
    const bot = await updateBot(req.params.id, req.user.id, req.user.role, body);
    reply.send(bot);
  });

  app.delete('/bots/:id', { preHandler: authGuard }, async (req: any, reply) => {
    await deleteBot(req.params.id, req.user.id, req.user.role);
    reply.status(204).send();
  });

  app.post('/bots/:id/activate', { preHandler: authGuard }, async (req: any, reply) => {
    const bot = await setBotStatus(req.params.id, req.user.id, req.user.role, 'ACTIVE');
    reply.send(bot);
  });

  app.post('/bots/:id/pause', { preHandler: authGuard }, async (req: any, reply) => {
    const bot = await setBotStatus(req.params.id, req.user.id, req.user.role, 'PAUSED');
    reply.send(bot);
  });
}

