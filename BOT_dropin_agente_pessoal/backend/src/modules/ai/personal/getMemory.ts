import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMemory(input: { userId: string; key?: string }) {
  if (input.key) {
    const m = await prisma.agentMemory.findUnique({ where: { userId_key: { userId: input.userId, key: input.key } } });
    return { ok: true, memory: m };
  }
  const list = await prisma.agentMemory.findMany({ where: { userId: input.userId } });
  return { ok: true, memories: list };
}
