import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middlewares/auth-guard';
import { createProjectBody, updateProjectBody } from './projects.schemas';
import { createProject, deleteProject, getProject, listProjects, updateProject } from './projects.service';

export function projectsRoutes(app: FastifyInstance) {
  app.get('/projects', { preHandler: authGuard }, async (req: any, reply) => {
    const { page = '1', limit = '10', search } = req.query as Record<string, string>;
    const res = await listProjects(req.user.id, req.user.role, parseInt(page, 10), parseInt(limit, 10), search);
    reply.send(res);
  });

  app.post('/projects', { preHandler: authGuard }, async (req: any, reply) => {
    const body = createProjectBody.parse(req.body);
    const project = await createProject(req.user.id, body);
    reply.status(201).send(project);
  });

  app.get('/projects/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const project = await getProject(req.params.id, req.user.id, req.user.role);
    if (!project) return reply.status(404).send({ error: { message: 'Not found' } });
    reply.send(project);
  });

  app.put('/projects/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateProjectBody.parse(req.body);
    const project = await updateProject(req.params.id, req.user.id, req.user.role, body);
    reply.send(project);
  });

  app.patch('/projects/:id', { preHandler: authGuard }, async (req: any, reply) => {
    const body = updateProjectBody.parse(req.body);
    const project = await updateProject(req.params.id, req.user.id, req.user.role, body);
    reply.send(project);
  });

  app.delete('/projects/:id', { preHandler: authGuard }, async (req: any, reply) => {
    await deleteProject(req.params.id, req.user.id, req.user.role);
    reply.status(204).send();
  });
}

