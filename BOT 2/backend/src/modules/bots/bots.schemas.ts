import { z } from 'zod';

export const createBotBody = z.object({
  name: z.string().min(1),
  projectId: z.string()
});

export const updateBotBody = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED']).optional()
});

