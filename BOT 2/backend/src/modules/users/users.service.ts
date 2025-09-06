import { prisma } from '../../libs/db';

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true } });
}

