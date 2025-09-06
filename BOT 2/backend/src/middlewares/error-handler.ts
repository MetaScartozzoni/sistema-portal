import { FastifyInstance } from 'fastify';
import { env } from '../env';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const status = (error as any).statusCode || 500;
    const message = error.message || 'Internal Server Error';
    request.log.error({ err: error }, 'Request error');
    const payload: any = { error: { message, status } };
    if (env.nodeEnv !== 'production') {
      payload.error.stack = (error as any).stack;
    }
    reply.status(status).send(payload);
  });
}
