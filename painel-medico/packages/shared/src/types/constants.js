// Shared domain constants (status enums, value lists)
// Central definition to avoid drift between portals.

export const BUDGET_STATUS = Object.freeze({
  PENDING: 'pending',
  SENT: 'sent', // enviado ao paciente
  NEGOTIATION: 'negotiation', // fase ativa de negociação (coluna dedicada)
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
});

export const BUDGET_STATUS_ORDER = [
  BUDGET_STATUS.PENDING,
  BUDGET_STATUS.SENT,
  BUDGET_STATUS.NEGOTIATION,
  BUDGET_STATUS.APPROVED,
  BUDGET_STATUS.REJECTED,
  BUDGET_STATUS.EXPIRED,
];

// Human friendly labels (pt-BR)
export const BUDGET_STATUS_LABEL = {
  [BUDGET_STATUS.PENDING]: 'Recém Orçado',
  [BUDGET_STATUS.SENT]: 'Enviado',
  [BUDGET_STATUS.NEGOTIATION]: 'Em Negociação',
  [BUDGET_STATUS.APPROVED]: 'Aceito',
  [BUDGET_STATUS.REJECTED]: 'Rejeitado',
  [BUDGET_STATUS.EXPIRED]: 'Expirado',
};

// Utility: normalize / validate status string
export function normalizeBudgetStatus(status) {
  if (!status) return BUDGET_STATUS.PENDING;
  const s = String(status).toLowerCase();
  return BUDGET_STATUS_ORDER.includes(s) ? s : BUDGET_STATUS.PENDING;
}
