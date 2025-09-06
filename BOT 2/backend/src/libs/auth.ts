import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { env } from '../env';

export type JwtUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

export function registerAuth(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: env.jwtSecret,
    cookie: { cookieName: 'token', signed: false }
  });
}

export async function authenticate(request: FastifyRequest) {
  try {
    // Verify JWT from either Authorization header or cookie automatically
    if (request.cookies?.token || request.headers.authorization?.startsWith('Bearer ')) {
      await request.jwtVerify();
    } else {
      throw new Error('No auth token');
    }
  } catch (err) {
    throw err;
  }
}
