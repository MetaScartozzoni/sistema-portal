import { Router } from "express";

export const webhooks = Router();

webhooks.post("/botconversa", async (req, res) => {
  // TODO: validar assinatura (ex: req.headers['x-signature'])
  const event = req.body;
  // Normalizar → salvar em Conversation/Message (Prisma) e chamar Clara se necessário
  return res.status(200).json({ ok: true });
});

export default webhooks;
