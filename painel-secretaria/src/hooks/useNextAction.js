import { useMemo } from 'react';
import { CalendarPlus, Scissors, Undo2 } from 'lucide-react';
import { appointmentTypes } from '@/lib/schedulingConfig';

export function useNextAction({ patient, appointments, onNewAppointment, onNewSurgery, onNewPostOpAppointment, onClose, onPauseJourney }) {
  return useMemo(() => {
    if (!patient) return null;

    const patientAppointments = (appointments || []).filter(a => a.patient_id === patient.id);
    const hasSurgery = patientAppointments.some(a => String(a.consultation_type || '').startsWith(appointmentTypes.CIRURGIA.label));

    if (hasSurgery) {
      return {
        isUrgent: false,
        label: 'Agendar Retorno Pós-Operatório',
        buttonLabel: 'Agendar Retorno',
        icon: Undo2,
        handler: () => {
          onNewPostOpAppointment?.({ patient_id: patient.id });
          onClose?.();
        },
      };
    }

    if (patientAppointments.length === 0) {
      return {
        isUrgent: false,
        label: 'Agendar Primeira Consulta',
        buttonLabel: 'Novo Agendamento',
        icon: CalendarPlus,
        handler: () => {
          onNewAppointment?.({ patient_id: patient.id });
          onClose?.();
        },
      };
    }

    return {
      isUrgent: false,
      label: 'Agendar Cirurgia',
      buttonLabel: 'Agendar Cirurgia',
      icon: Scissors,
      handler: () => {
        onNewSurgery?.({ patient_id: patient.id });
        onClose?.();
      },
    };
  }, [patient, appointments, onNewAppointment, onNewSurgery, onNewPostOpAppointment, onClose]);
}

