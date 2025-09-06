import { z } from 'zod';

export const createProjectBody = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const updateProjectBody = createProjectBody.partial();

