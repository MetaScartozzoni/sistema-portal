import { z } from 'zod';

export const createFlowBody = z.object({
  name: z.string().min(1),
  jsonDefinition: z.any()
});

export const updateFlowBody = createFlowBody.partial();

