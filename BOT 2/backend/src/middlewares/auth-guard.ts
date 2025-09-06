import { FastifyReply, FastifyRequest } from 'fastify';
import { authenticate, JwtUser } from '../libs/auth';

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    await authenticate(req);
  } catch (e) {
    return reply.status(401).send({ error: { message: 'Unauthorized' } });
  }
}

export function requireAdmin(req: FastifyRequest, reply: FastifyReply, done: () => void) {
  const user = req.user as JwtUser | undefined;
  if (!user || user.role !== 'ADMIN') {
    reply.status(403).send({ error: { message: 'Forbidden' } });
    return;
  }
  done();
}

