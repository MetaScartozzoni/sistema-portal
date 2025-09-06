export const mapRawEvolution = (raw) => ({
  id: raw.id,
  evolution_date: raw.evolution_date,
  days_post_op: raw.days_post_op,
  status: raw.status,
  vitals: raw.vitals,
  wound_state: raw.wound_state,
  complaint: raw.complaint,
});
export const isEvolutionEntry = (obj) => obj && typeof obj === 'object' && 'evolution_date' in obj;
