export async function listAvailability(input: {
  doctorId?: string;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  turno?: "manhã"|"tarde"|"noite";
}) {
  // TODO: consultar agenda real; aqui devolve slots fictícios
  const base = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00"];
  return { ok: true, slots: base, filter: input };
}
