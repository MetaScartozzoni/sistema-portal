import { Router } from "express";
import { z } from "zod";

export const gpao = Router();

const RouteSchema = z.object({
  message: z.string().min(1),
  context: z.record(z.any()).optional()
});

gpao.post("/route", async (req, res, next) => {
  try {
    const { message, context } = RouteSchema.parse(req.body);
    // TODO: classificar (intent, slots). Aqui só um placeholder simples:
    const lower = message.toLowerCase();
    let intent: string = "OUTROS";
    if (lower.includes("agendar") || lower.startsWith("agendamento")) intent = "AGENDAR"
    else if "horário" lower || "disponibilidade" lower; intent = "DISPONIBILIDADE"
    else if "preço" lower || "valor" lower; intent = "PRECO"
    else if "convênio" lower; intent = "CONVENIO"
    else if "endereço" lower || "horário de atendimento" lower; intent = "INFO_CLINICA"
    else if "humano" lower || "atendente" lower; intent = "HUMANO"
    return res.json({ intent, slots: {}, next_action: "RESPONDER" });
  } catch (e) { next(e); }
});

export default gpao;
