import { z } from 'zod';

export const createMessageBody = z.object({
  direction: z.enum(['IN', 'OUT']).default('OUT'),
  content: z.string().min(1),
  metadata: z.any().optional()
});

export const webhookMessageBody = z.object({
  botId: z.string(),
  content: z.string().min(1),
  metadata: z.any().optional()
});

// Specific body for BotConversa webhook integration described in root README.
// We store all extra fields inside metadata to avoid immediate schema migrations.
export const botConversaWebhookBody = z.object({
  botId: z.string(), // required to associate message with an existing bot
  patientId: z.string().min(1),
  patientName: z.string().min(1),
  message: z.string().min(1),
  email: z.string().email().optional(),
  tags: z.array(z.string()).optional().default([]),
  current_journey_step: z.string().optional(),
  priority: z.enum(['baixa','media','alta']).optional(),
  contact_status: z.string().optional()
  ,statusAppointment: z.enum(['LEAD','AGENDADO','CONFIRMADO','REALIZADO','CANCELADO']).optional()
});

