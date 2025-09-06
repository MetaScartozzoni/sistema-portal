import { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/auth/auth.routes';
import { projectsRoutes } from './modules/projects/projects.controller';
import { botsRoutes } from './modules/bots/bots.controller';
import { flowsRoutes } from './modules/flows/flows.controller';
import { messagesRoutes } from './modules/messages/messages.controller';
import { contactsRoutes } from './modules/contacts/contacts.controller';

export async function registerRoutes(app: FastifyInstance) {
  await authRoutes(app);
  projectsRoutes(app);
  botsRoutes(app);
  flowsRoutes(app);
  messagesRoutes(app);
  contactsRoutes(app);

  app.get('/health', async () => ({ ok: true }));
  app.get('/metrics', async () => ({ requests: 'placeholder' }));
}

