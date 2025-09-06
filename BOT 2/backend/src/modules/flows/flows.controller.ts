import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middlewares/auth-guard';
import { createFlow, deleteFlow, getFlow, listFlows, updateFlow } from './flows.service';
import { createFlowBody, updateFlowBody } from './flows.schemas';

export function flowsRoutes(app: FastifyInstance) {
  app.get('/bots/:botId/flows', { preHandler: authGuard }, async (req: any, reply) => {
    const items = await listFlows(req.params.botId, req.user.id, req.user.role);
    reply.send({ items });
  });

  app.post('/bots/:botId/flows', { preHandler: authGuard }, async (req: any, reply) => {
    const body = createFlowBody.parse(req.body) as { name: string; jsonDefinition: any };
    const flow = await createFlow(req.params.botId, req.user.id, req.user.role, body);
    reply.status(201).send(flow);
  });

  app.get('/flows/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const flow = await getFlow(req.params.id, req.user.id, req.user.role);
    if (!flow) return reply.status(404).send({ error: { message: 'Not found' } });
    reply.send(flow);
  });

  app.put('/flows/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateFlowBody.parse(req.body);
    const flow = await updateFlow(req.params.id, req.user.id, req.user.role, body);
    reply.send(flow);
  });

  app.patch('/flows/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateFlowBody.parse(req.body);
    const flow = await updateFlow(req.params.id, req.user.id, req.user.role, body);
    reply.send(flow);
  });

  app.delete('/flows/:id', { preHandler: authGuard }, async (req: any, reply) => {
    await deleteFlow(req.params.id, req.user.id, req.user.role);
    reply.status(204).send();
  });
}
