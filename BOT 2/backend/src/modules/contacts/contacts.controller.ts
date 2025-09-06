import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middlewares/auth-guard';
import { prisma } from '../../libs/db';

export function contactsRoutes(app: FastifyInstance) {
  app.get('/contacts', { preHandler: authGuard }, async (_req: any, reply) => {
    const contacts = await prisma.contact.findMany({ orderBy: { updatedAt: 'desc' }, take: 200 });
    reply.send({ items: contacts });
  });

  app.get('/contacts/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const contact = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!contact) return reply.status(404).send({ error: { message: 'Not found' } });
    reply.send(contact);
  });
}