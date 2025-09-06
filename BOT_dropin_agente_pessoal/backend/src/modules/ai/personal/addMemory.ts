import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function addMemory(input: { userId: string; key: string; value: string }) {
  const m = await prisma.agentMemory.upsert({
    where: { userId_key: { userId: input.userId, key: input.key } },
    update: { value: input.value },
    create: { userId: input.userId, key: input.key, value: input.value }
  });
  return { ok: true, memory: m };
}
