// Budget domain mappers & type guards
// shape normalization for budgets across portals
import { normalizeBudgetStatus, BUDGET_STATUS } from './constants.js';

export const mapRawBudget = (raw) => {
  let status = (raw.status || 'pending').toLowerCase();
  if (status === 'sent' && (raw?.negotiations_count > 0 || raw?.hasNegotiation)) {
    status = BUDGET_STATUS.NEGOTIATION;
  }
  status = normalizeBudgetStatus(status);
  return {
    id: raw.id,
    title: raw.title || raw.nome || 'Orçamento',
    total: Number(raw.total ?? raw.valor_total ?? 0),
    status,
    created_at: raw.created_at || raw.createdAt,
    updated_at: raw.updated_at || raw.updatedAt,
    patient: raw.patient || raw.paciente || (raw.patient_id ? { id: raw.patient_id, full_name: raw.patient_name } : undefined),
    doctor: raw.doctor || raw.medico || (raw.doctor_id ? { id: raw.doctor_id, name: raw.doctor_name } : undefined)
  };
};

export const isBudget = (obj) => obj && typeof obj === 'object' && 'total' in obj && 'status' in obj;
