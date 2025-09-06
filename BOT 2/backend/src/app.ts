import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';
import { env } from './env';
import { registerErrorHandler } from './middlewares/error-handler';
import { registerRateLimit } from './middlewares/rate-limit';
import { registerAuth } from './libs/auth';
import { registerRoutes } from './routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined
    }
  });

  await app.register(cors, { origin: env.corsOrigin, credentials: true });
  await app.register(helmet, { crossOriginResourcePolicy: false });
  await app.register(cookie, {});
  registerAuth(app);
  await registerRateLimit(app);

  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const yamlPathCandidates = [
    path.resolve(process.cwd(), 'src/docs/openapi.yaml'),
    path.resolve(thisDir, 'docs/openapi.yaml')
  ];
  let openapiSpec: any = { info: { title: 'BOT API', version: '0.1.0' } };
  for (const p of yamlPathCandidates) {
    try {
      const content = readFileSync(p, 'utf8');
      openapiSpec = parseYaml(content);
      break;
    } catch {}
  }

  await app.register(swagger, { openapi: openapiSpec });
  await app.register(swaggerUI, { routePrefix: '/docs' });

  registerErrorHandler(app);
  // Group all API routes under /api prefix for public consumption
  await app.register(async (apiScope) => {
    await registerRoutes(apiScope);
  }, { prefix: '/api' });

  app.get('/openapi.json', async () => app.swagger());

  return app;
}
