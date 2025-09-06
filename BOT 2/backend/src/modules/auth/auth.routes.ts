import { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
  authController(app);
}

