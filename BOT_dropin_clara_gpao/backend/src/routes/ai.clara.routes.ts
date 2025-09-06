import { Router } from "express";
import { z } from "zod";

export const clara = Router();

const ChatSchema = z.object({
  message: z.string().min(1),
  channel: z.enum(["whatsapp","web","telefone","email"]).default("web"),
  userId: z.string().optional(),
  context: z.record(z.any()).optional()
});

clara.post("/chat", async (req, res, next) => {
  try {
    const { message, channel, userId, context } = ChatSchema.parse(req.body);
    // TODO: chamar GP-AO → classificar intenção; invocar tools conforme necessidade
    return res.json({
      reply: `Recebi sua mensagem no ${channel}. Como posso ajudar?`,
      echo: { message, channel, userId, context }
    });
  } catch (err) {
    next(err);
  }
});

// Tools (mínimo — delega para services)
const ScheduleSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:mm
  reason: z.string().optional(),
  insurance: z.string().optional()
});
clara.post("/tools/schedule", async (req, res, next) => {
  try {
    const input = ScheduleSchema.parse(req.body);
    // @ts-ignore
    const result = await req.services.tools.scheduleAppointment(input);
    res.json(result);
  } catch (e) { next(e); }
});

const AvailabilitySchema = z.object({
  doctorId: z.string().optional(),
  from: z.string(),
  to: z.string(),
  turno: z.enum(["manhã","tarde","noite"]).optional()
});
clara.get("/tools/availability", async (req, res, next) => {
  try {
    const input = AvailabilitySchema.parse(req.query);
    // @ts-ignore
    const result = await req.services.tools.listAvailability(input);
    res.json(result);
  } catch (e) { next(e); }
});

clara.get("/tools/prices", async (req, res, next) => {
  try {
    // @ts-ignore
    const result = await req.services.tools.getPrices({ procedure: req.query.procedure as string, convenio: req.query.convenio as string });
    res.json(result);
  } catch (e) { next(e); }
});

clara.get("/tools/insurances", async (_req, res, next) => {
  try {
    // @ts-ignore
    const result = await _req.services.tools.getInsurances();
    res.json(result);
  } catch (e) { next(e); }
});

clara.get("/tools/clinic-info", async (_req, res, next) => {
  try {
    // @ts-ignore
    const result = await _req.services.tools.getClinicInfo();
    res.json(result);
  } catch (e) { next(e); }
});

const EscalateSchema = z.object({ conversationId: z.string(), reason: z.string().optional() });
clara.post("/tools/escalate", async (req, res, next) => {
  try {
    const input = EscalateSchema.parse(req.body);
    // @ts-ignore
    const result = await req.services.tools.escalateHuman(input);
    res.json(result);
  } catch (e) { next(e); }
});

const ConsentSchema = z.object({ patientId: z.string(), consent: z.boolean(), scope: z.string().optional() });
clara.post("/tools/consent", async (req, res, next) => {
  try {
    const input = ConsentSchema.parse(req.body);
    // @ts-ignore
    const result = await req.services.tools.logConsent(input);
    res.json(result);
  } catch (e) { next(e); }
});

export default clara;
