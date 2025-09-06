import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createTask(input: { title: string; due?: string; priority: "low"|"normal"|"high"; notes?: string }) {
  const task = await prisma.personalTask.create({
    data: {
      title: input.title,
      due: input.due ? new Date(input.due) : null,
      priority: input.priority,
      notes: input.notes || null,
      status: "open"
    }
  });
  return { ok: true, task };
}
