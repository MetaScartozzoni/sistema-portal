import { prisma } from '../../libs/db';

export async function listMessages(botId: string, userId: string, role: 'ADMIN'|'USER', direction?: 'IN'|'OUT', limit = 50, patientId?: string, tag?: string) {
  const bot = await prisma.bot.findUnique({ where: { id: botId }, include: { project: true } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });
  if (role !== 'ADMIN' && bot.project.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return prisma.message.findMany({
    where: {
      botId,
      direction,
      ...(patientId ? { patientId } : {}),
      ...(tag ? { tags: { contains: tag } } : {})
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
}

export async function createMessage(botId: string, userId: string, role: 'ADMIN'|'USER', data: { direction: 'IN'|'OUT'; content: string; metadata?: any }) {
  const bot = await prisma.bot.findUnique({ where: { id: botId }, include: { project: true } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });
  if (role !== 'ADMIN' && bot.project.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  return prisma.message.create({ data: { botId, direction: data.direction, content: data.content, metadata: data.metadata } });
}

export async function receiveWebhookMessage(data: { botId: string; content: string; metadata?: any }) {
  const bot = await prisma.bot.findUnique({ where: { id: data.botId } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });
  return prisma.message.create({ data: { botId: data.botId, direction: 'IN', content: data.content, metadata: data.metadata } });
}

export async function receiveBotConversaWebhook(data: {
  botId: string;
  patientId: string;
  patientName: string;
  message: string;
  email?: string;
  tags?: string[];
  current_journey_step?: string;
  priority?: string;
  contact_status?: string;
  statusAppointment?: 'LEAD' | 'AGENDADO' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO';
}) {
  const bot = await prisma.bot.findUnique({ where: { id: data.botId } });
  if (!bot) throw Object.assign(new Error('Bot not found'), { statusCode: 404 });

  // For now we only persist a message row; contact/user tables not modeled yet for this payload.
  const metadata = {
    patientId: data.patientId,
    patientName: data.patientName,
    email: data.email,
    tags: data.tags,
    current_journey_step: data.current_journey_step,
    priority: data.priority,
    contact_status: data.contact_status,
    source: 'botconversa-webhook'
  };

  // Upsert contact based on patientId (externalId)
  const contact = await prisma.contact.upsert({
    where: { externalId: data.patientId },
    update: {
      name: data.patientName || undefined,
      email: data.email || undefined,
      statusAppointment: data.statusAppointment || undefined
    },
    create: {
      externalId: data.patientId,
      name: data.patientName,
      email: data.email,
      statusAppointment: data.statusAppointment || 'LEAD'
    }
  });

  return prisma.message.create({
    data: {
      botId: data.botId,
      direction: 'IN',
      content: data.message,
      metadata,
      patientId: data.patientId,
      tags: data.tags && data.tags.length ? JSON.stringify(data.tags) : undefined,
      contactId: contact.id
    }
  });
}
