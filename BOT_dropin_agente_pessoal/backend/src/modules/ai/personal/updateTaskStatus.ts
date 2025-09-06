import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateTaskStatus(input: { taskId: string; status: "open"|"done" }) {
  const task = await prisma.personalTask.update({ where: { id: input.taskId }, data: { status: input.status } });
  return { ok: true, task };
}
