import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listTasks(input: { status: "open"|"done"|"all", query?: string }) {
  const where: any = {};
  if (input.status !== "all") where.status = input.status;
  if (input.query) where.title = { contains: input.query, mode: "insensitive" };
  const tasks = await prisma.personalTask.findMany({ where, orderBy: [{ due: "asc" }, { createdAt: "desc" }] });
  return { ok: true, tasks };
}
