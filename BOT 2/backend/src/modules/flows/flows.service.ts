import { prisma } from '../../libs/db';

export async function listFlows(botId: string, userId: string, role: 'ADMIN'|'USER') {
  const bot = await prisma.bot.findUnique({ where: { id: botId }, include: { project: true } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });
  if (role !== 'ADMIN' && bot.project.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return prisma.flow.findMany({ where: { botId }, orderBy: { createdAt: 'desc' } });
}

export async function createFlow(botId: string, userId: string, role: 'ADMIN'|'USER', data: { name: string; jsonDefinition: any }) {
  const bot = await prisma.bot.findUnique({ where: { id: botId }, include: { project: true } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });
  if (role !== 'ADMIN' && bot.project.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return prisma.flow.create({ data: { botId, name: data.name, jsonDefinition: data.jsonDefinition } });
}

export async function getFlow(id: string, userId: string, role: 'ADMIN'|'USER') {
  const flow = await prisma.flow.findUnique({ where: { id }, include: { bot: { include: { project: true } } } });
  if (!flow) return null;
  if (role !== 'ADMIN' && flow.bot.project.ownerId !== userId) return null;
  return flow;
}

export async function updateFlow(id: string, userId: string, role: 'ADMIN'|'USER', data: any) {
  const flow = await getFlow(id, userId, role);
  if (!flow) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return prisma.flow.update({ where: { id }, data });
}

export async function deleteFlow(id: string, userId: string, role: 'ADMIN'|'USER') {
  const flow = await getFlow(id, userId, role);
  if (!flow) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  await prisma.flow.delete({ where: { id } });
}

