import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginBody, registerBody } from './auth.schemas';
import { authenticateUser, registerUser } from './auth.service';
import { authGuard } from '../../middlewares/auth-guard';
import { env } from '../../env';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../libs/db';

export function authController(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const body = registerBody.parse(req.body);
    const user = await registerUser(body.name, body.email, body.password);
    reply.status(201).send({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  app.post('/auth/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = loginBody.parse(req.body);
    const { user, payload } = await authenticateUser(body.email, body.password);
    const token = await reply.jwtSign(payload, { expiresIn: '7d' });
    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        path: '/'
      })
      .send({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post('/auth/logout', async (_req, reply) => {
    reply.clearCookie('token', { path: '/' }).send({ ok: true });
  });

  app.get('/me', { preHandler: authGuard }, async (req: any, reply) => {
    reply.send({ user: req.user });
  });

  // Lightweight session check that never throws
  app.get('/auth/check', async (req: any, reply) => {
    try {
      // Try to verify token from cookie or Authorization header
      await (req as any).jwtVerify();
      return reply.send({ success: true, user: (req as any).user });
    } catch {
      return reply.send({ success: false });
    }
  });

  // Dev-only: fast login without password bureaucracy
  if (env.nodeEnv !== 'production') {
    app.post('/auth/dev-login', async (req: FastifyRequest, reply: FastifyReply) => {
      const body = z.object({ email: z.string().email(), name: z.string().optional(), role: z.enum(['ADMIN','USER']).optional() }).parse((req as any).body);
      let user = await prisma.user.findUnique({ where: { email: body.email } });
      if (!user) {
        const passwordHash = await bcrypt.hash('devpass', 10);
        user = await prisma.user.create({ data: { name: body.name || 'Dev User', email: body.email, passwordHash, role: (body.role as any) || 'USER' } });
      }
      const token = await reply.jwtSign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '7d' });
      reply
        .setCookie('token', token, {
          httpOnly: true,
          secure: env.nodeEnv === 'production',
          sameSite: 'lax',
          path: '/'
        })
        .send({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  }
}
