// Centralized appointment types and helpers for the Secretary panel

export const appointmentTypes = {
  PRIMEIRA_CONSULTA: {
    label: 'Primeira Consulta',
    color: 'bg-blue-500',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-400',
    duration: 30,
  },
  RETORNO_POS_CONSULTA: {
    label: 'Retorno de Consulta',
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-400',
    duration: 20,
  },
  RETORNO_POS_OPERATORIO: {
    label: 'Retorno Pós-Operatório',
    color: 'bg-amber-500',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-400',
    duration: 20,
  },
  CONSULTA_ONLINE: {
    label: 'Consulta Online',
    color: 'bg-purple-500',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-400',
    duration: 30,
  },
  BATE_PAPO: {
    label: 'Bate-Papo',
    color: 'bg-green-500',
    borderColor: 'border-green-400',
    textColor: 'text-green-400',
    duration: 15,
  },
  CIRURGIA: {
    label: 'Cirurgia',
    color: 'bg-red-500',
    borderColor: 'border-red-400',
    textColor: 'text-red-400',
    duration: 120,
  },
  ALMOCO_FUNCIONARIOS: {
    label: 'Almoço Funcionários',
    color: 'bg-slate-500',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-400',
    duration: 60,
  },
  ALMOCO_MEDICO: {
    label: 'Almoço Médico',
    color: 'bg-slate-600',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-500',
    duration: 60,
  },
};

export function getAppointmentTypeDetails(typeLabel) {
  const entry = Object.values(appointmentTypes).find((t) => t.label === typeLabel);
  return (
    entry || {
      label: typeLabel,
      color: 'bg-gray-500',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-400',
      duration: 30,
    }
  );
}

