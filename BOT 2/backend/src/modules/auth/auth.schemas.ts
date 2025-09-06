import { z } from 'zod';

export const registerBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterBody = z.infer<typeof registerBody>;
export type LoginBody = z.infer<typeof loginBody>;

