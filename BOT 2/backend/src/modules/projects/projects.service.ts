import { prisma } from '../../libs/db';

export async function listProjects(userId: string, role: 'ADMIN'|'USER', page = 1, limit = 10, search?: string) {
  const where: any = {};
  if (role !== 'ADMIN') where.ownerId = userId;
  if (search) where.name = { contains: search, mode: 'insensitive' };
  const [items, total] = await Promise.all([
    prisma.project.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where })
  ]);
  return { items, total, page, limit };
}

export async function createProject(userId: string, data: { name: string; description?: string }) {
  return prisma.project.create({ data: { ...data, ownerId: userId } });
}

export async function getProject(id: string, userId: string, role: 'ADMIN'|'USER') {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return null;
  if (role !== 'ADMIN' && project.ownerId !== userId) return null;
  return project;
}

export async function updateProject(id: string, userId: string, role: 'ADMIN'|'USER', data: any) {
  const project = await getProject(id, userId, role);
  if (!project) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string, userId: string, role: 'ADMIN'|'USER') {
  const project = await getProject(id, userId, role);
  if (!project) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  await prisma.project.delete({ where: { id } });
}

