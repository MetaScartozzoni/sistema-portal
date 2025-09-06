import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function logConsent(input: { patientId: string; consent: boolean; scope?: string }) {
  // Opcional: modelo Consent no Prisma. Aqui apenas ecoa.
  return { ok: true, logged: { patientId: input.patientId, consent: input.consent, scope: input.scope || "default" } };
}
