import { prisma } from '../../libs/db';

export async function listBots(userId: string, role: 'ADMIN'|'USER', page = 1, limit = 10, search?: string) {
  const where: any = {};
  if (role !== 'ADMIN') where.project = { ownerId: userId };
  if (search) where.name = { contains: search, mode: 'insensitive' };
  const [items, total] = await Promise.all([
    prisma.bot.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.bot.count({ where })
  ]);
  return { items, total, page, limit };
}

export async function createBot(userId: string, role: 'ADMIN'|'USER', data: { name: string; projectId: string }) {
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) throw Object.assign(new Error('Project not found'), { statusCode: 404 });
  if (role !== 'ADMIN' && project.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return prisma.bot.create({ data: { name: data.name, projectId: data.projectId } });
}

export async function getBot(id: string, userId: string, role: 'ADMIN'|'USER') {
  const bot = await prisma.bot.findUnique({ where: { id }, include: { project: true } });
  if (!bot) return null;
  if (role !== 'ADMIN' && bot.project.ownerId !== userId) return null;
  return bot;
}

export async function updateBot(id: string, userId: string, role: 'ADMIN'|'USER', data: any) {
  const bot = await getBot(id, userId, role);
  if (!bot) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return prisma.bot.update({ where: { id }, data });
}

export async function deleteBot(id: string, userId: string, role: 'ADMIN'|'USER') {
  const bot = await getBot(id, userId, role);
  if (!bot) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  await prisma.bot.delete({ where: { id } });
}

export async function setBotStatus(id: string, userId: string, role: 'ADMIN'|'USER', status: 'ACTIVE'|'PAUSED') {
  const bot = await getBot(id, userId, role);
  if (!bot) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return prisma.bot.update({ where: { id }, data: { status } });
}

