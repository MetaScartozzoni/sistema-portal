import { Router } from "express";
import { z } from "zod";

export const personal = Router();

const ChatSchema = z.object({
  message: z.string().min(1),
  userId: z.string().optional(),
  context: z.record(z.any()).optional()
});

personal.post("/chat", async (req, res, next) => {
  try {
    const { message, userId, context } = ChatSchema.parse(req.body);
    // TODO: policy: interpretar intenção (tasks/memória/pesquisa)
    return res.json({
      reply: "Entendi. Posso criar uma tarefa, buscar algo nos docs, ou registrar uma preferência. O que você prefere?",
      echo: { message, userId, context }
    });
  } catch (e) { next(e); }
});

// Tools (exponha via services ou import direto)
const CreateTaskSchema = z.object({
  title: z.string().min(1),
  due: z.string().optional(),
  priority: z.enum(["low","normal","high"]).default("normal"),
  notes: z.string().optional()
});
personal.post("/tools/create-task", async (req, res, next) => {
  try {
    const input = CreateTaskSchema.parse(req.body);
    // @ts-ignore
    const r = await req.services.personal.createTask(input);
    res.json(r);
  } catch (e) { next(e); }
});

const ListTasksSchema = z.object({
  status: z.enum(["open","done","all"]).default("open"),
  query: z.string().optional()
});
personal.get("/tools/list-tasks", async (req, res, next) => {
  try {
    const input = ListTasksSchema.parse({ status: req.query.status || "open", query: req.query.query });
    // @ts-ignore
    const r = await req.services.personal.listTasks(input);
    res.json(r);
  } catch (e) { next(e); }
});

const UpdateStatusSchema = z.object({
  taskId: z.string(),
  status: z.enum(["open","done"])
});
personal.post("/tools/update-task-status", async (req, res, next) => {
  try {
    const input = UpdateStatusSchema.parse(req.body);
    // @ts-ignore
    const r = await req.services.personal.updateTaskStatus(input);
    res.json(r);
  } catch (e) { next(e); }
});

const AddMemorySchema = z.object({
  userId: z.string(),
  key: z.string(),
  value: z.string()
});
personal.post("/tools/add-memory", async (req, res, next) => {
  try {
    const input = AddMemorySchema.parse(req.body);
    // @ts-ignore
    const r = await req.services.personal.addMemory(input);
    res.json(r);
  } catch (e) { next(e); }
});

const GetMemorySchema = z.object({
  userId: z.string(),
  key: z.string().optional()
});
personal.get("/tools/get-memory", async (req, res, next) => {
  try {
    const input = GetMemorySchema.parse({ userId: req.query.userId, key: req.query.key });
    // @ts-ignore
    const r = await req.services.personal.getMemory(input);
    res.json(r);
  } catch (e) { next(e); }
});

const SearchDocsSchema = z.object({ query: z.string().min(2) });
personal.get("/tools/search-docs", async (req, res, next) => {
  try {
    const input = SearchDocsSchema.parse({ query: req.query.query });
    // @ts-ignore
    const r = await req.services.personal.searchDocs(input);
    res.json(r);
  } catch (e) { next(e); }
});

export default personal;
