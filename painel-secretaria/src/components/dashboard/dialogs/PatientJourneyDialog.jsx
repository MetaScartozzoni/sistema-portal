import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map as MapIcon, CheckCircle, Clock, XCircle, Coins, CalendarCheck2, UserPlus, Stethoscope, Briefcase as BriefcaseMedical, HeartHandshake as Handshake, ShieldCheck, Banknote, Scissors, PauseCircle, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAppointmentTypeDetails, appointmentTypes } from '@/lib/schedulingConfig';

const PatientJourneyDialog = ({ open, onOpenChange, patient, appointments }) => {
  if (!open || !patient) return null;

  const journeyEvents = [];

  const journeyStatusOrder = [
    'NOVO_CONTATO',
    'CONSULTA_AGENDADA',
    'CONSULTA_REALIZADA',
    'JORNADA_PAUSADA',
    'ORCAMENTO_ENVIADO',
    'ORCAMENTO_ACEITO',
    'AGUARDANDO_CONFIRMACOES',
    'PAGAMENTO_CONFIRMADO',
    'CIRURGIA_AGENDADA',
    'EM_ACOMPANHAMENTO',
    'CIRURGIA_REALIZADA',
    'RETORNO_AGENDADO',
  ];

  const currentStatusIndex = journeyStatusOrder.indexOf(patient.journey_status);

  // Add past and current events
  journeyEvents.push({
    id: 'contact',
    type: 'contact',
    date: patient.created_at,
    data: { status: 'Completo' }
  });

  const firstConsultation = appointments.find(app => app.consultation_type === appointmentTypes.PRIMEIRA_CONSULTA.label && app.patient_id === patient.id && app.status === 'Realizada');
  if (firstConsultation) {
    journeyEvents.push({
      id: `app-${firstConsultation.id}`,
      type: 'appointment',
      date: firstConsultation.start_time,
      data: firstConsultation,
    });
  }

  if (patient.journey_status === 'JORNADA_PAUSADA' && patient.journey_pause_date) {
    journeyEvents.push({
      id: 'journey-paused',
      type: 'journey-paused',
      date: patient.journey_pause_date,
      data: { reason: patient.journey_pause_reason, notes: patient.journey_pause_notes }
    });
  }

  if (patient.budget_sent_date) {
    journeyEvents.push({
      id: 'budget',
      type: 'budget',
      date: patient.budget_sent_date,
      data: { status: patient.budget_status || 'Enviado', date: patient.budget_sent_date },
    });
  }
  
  if (patient.budget_status === 'Aceito' && patient.budget_accepted_date) {
    journeyEvents.push({
      id: 'budget-accepted',
      type: 'budget-accepted',
      date: patient.budget_accepted_date,
      data: { date: patient.budget_accepted_date }
    });
  }

  if (patient.payment_confirmed_date) {
    journeyEvents.push({
      id: 'payment-confirmed',
      type: 'payment-confirmed',
      date: patient.payment_confirmed_date,
      data: { date: patient.payment_confirmed_date }
    });
  }
  
  const surgery = appointments.find(app => app.consultation_type.startsWith(appointmentTypes.CIRURGIA.label) && app.patient_id === patient.id);
  if (surgery) {
    journeyEvents.push({
      id: `app-${surgery.id}`,
      type: 'appointment',
      date: surgery.start_time,
      data: surgery,
    });
  }
  
  const postOpAppointments = appointments.filter(app => app.consultation_type.includes(appointmentTypes.RETORNO_POS_OPERATORIO.label) && app.patient_id === patient.id);
  postOpAppointments.forEach(app => {
      journeyEvents.push({
        id: `app-${app.id}`,
        type: 'appointment',
        date: app.start_time,
        data: app,
      });
  });


  // Add future placeholder events
  if (currentStatusIndex < journeyStatusOrder.indexOf('CONSULTA_AGENDADA') && !firstConsultation) {
    journeyEvents.push({ id: 'placeholder-consulta', type: 'placeholder', data: { title: 'Agendar Primeira Consulta', icon: Stethoscope } });
  }
  if (currentStatusIndex < journeyStatusOrder.indexOf('ORCAMENTO_ENVIADO') && patient.journey_status === 'CONSULTA_REALIZADA' && !patient.budget_sent_date) {
    journeyEvents.push({ id: 'placeholder-orcamento', type: 'placeholder', data: { title: 'Pendente de Orçamento', icon: Coins } });
  }
  if (currentStatusIndex < journeyStatusOrder.indexOf('AGUARDANDO_CONFIRMACOES') && patient.journey_status === 'ORCAMENTO_ACEITO') {
    journeyEvents.push({ id: 'placeholder-confirmations', type: 'placeholder', data: { title: 'Aguardando Pagamento/Termos', icon: Banknote } });
  }
  if (currentStatusIndex < journeyStatusOrder.indexOf('PAGAMENTO_CONFIRMADO') && patient.journey_status === 'AGUARDANDO_CONFIRMACOES') {
    journeyEvents.push({ id: 'placeholder-payment-confirm', type: 'placeholder', data: { title: 'Confirmar Pagamento e Termos', icon: ShieldCheck } });
  }
  if (currentStatusIndex < journeyStatusOrder.indexOf('CIRURGIA_AGENDADA') && patient.journey_status === 'PAGAMENTO_CONFIRMADO') {
    journeyEvents.push({ id: 'placeholder-cirurgia', type: 'placeholder', data: { title: 'Agendar Cirurgia', icon: Scissors } });
  }
  if (patient.journey_status === 'CIRURGIA_AGENDADA') {
      const firstPostOp = appointments.find(app =>
          app.patient_id === patient.id &&
          app.consultation_type.includes(appointmentTypes.RETORNO_POS_OPERATORIO.label)
      );
      if(!firstPostOp) {
          journeyEvents.push({ id: 'placeholder-retorno', type: 'placeholder', data: { title: 'Agendar 1º Retorno', icon: BriefcaseMedical } });
      }
  }

  // Sort all events chronologically (newest first)
  const uniqueEvents = Array.from(new Map(journeyEvents.map(e => [e.id, e])).values());

  uniqueEvents.sort((a, b) => {
    const aIsPlaceholder = a.type === 'placeholder';
    const bIsPlaceholder = b.type === 'placeholder';

    if (aIsPlaceholder && !bIsPlaceholder) return -1;
    if (!aIsPlaceholder && bIsPlaceholder) return 1;
    if (aIsPlaceholder && bIsPlaceholder) return 0;

    return new Date(b.date) - new Date(a.date);
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmado':
      case 'Aceito':
      case 'Realizada':
      case 'Completo':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Pendente':
      case 'A Confirmar':
      case 'Aguardando Resposta':
      case 'Em Negociação':
      case 'Enviado':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'Cancelado':
      case 'Recusado':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'Pausada':
        return <PauseCircle className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const renderEvent = (event) => {
    let icon, color, title, date, status, statusIcon, description;

    if (event.type === 'placeholder') {
        const IconComponent = event.data.icon;
        icon = <IconComponent className="w-5 h-5 text-white" />;
        color = 'bg-gray-500';
        title = event.data.title;
        date = 'Próxima Etapa';
        status = 'Pendente';
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'contact') {
        icon = <UserPlus className="w-5 h-5 text-white" />;
        color = 'bg-purple-500';
        title = 'Primeiro Contato';
        date = format(new Date(event.date), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        status = event.data.status;
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'appointment') {
        const details = getAppointmentTypeDetails(event.data.consultation_type);
        icon = <details.icon className="w-5 h-5 text-white" />;
        color = details.color;
        title = event.data.consultation_type;
        date = format(new Date(event.data.start_time), "eeee, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
        status = event.data.status;
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'budget') {
        icon = <Coins className="w-5 h-5 text-white" />;
        color = 'bg-amber-500';
        title = 'Orçamento';
        date = format(new Date(event.data.date), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        status = event.data.status;
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'budget-accepted') {
        icon = <Handshake className="w-5 h-5 text-white" />;
        color = 'bg-emerald-500';
        title = 'Orçamento Aceito';
        date = format(new Date(event.date), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        status = 'Aceito';
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'payment-confirmed') {
        icon = <ShieldCheck className="w-5 h-5 text-white" />;
        color = 'bg-teal-500';
        title = 'Pagamento e Termos Confirmados';
        date = format(new Date(event.date), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        status = 'Confirmado';
        statusIcon = getStatusIcon(status);
    } else if (event.type === 'journey-paused') {
        icon = <AlertTriangle className="w-5 h-5 text-white" />;
        color = 'bg-orange-500';
        title = 'Jornada Pausada';
        date = format(new Date(event.date), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        status = 'Pausada';
        statusIcon = getStatusIcon(status);
        description = `Motivo: ${event.data.reason}. ${event.data.notes ? `Notas: ${event.data.notes}` : ''}`;
    } else {
        return null;
    }

    return (
        <motion.div
          key={event.id}
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: uniqueEvents.indexOf(event) * 0.1 }}
        >
          <div className="absolute left-0 top-1.5 flex items-center justify-center w-12 h-12">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
              {icon}
            </div>
          </div>
          <div className="ml-16 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-400 capitalize">{date}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                {statusIcon}
                <span>{status}</span>
              </div>
            </div>
            {description && (
              <p className="mt-2 text-sm text-orange-300 bg-orange-900/30 p-2 rounded-md">{description}</p>
            )}
          </div>
        </motion.div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-white/20 flex flex-col"
          style={{ maxHeight: '85vh' }}
        >
          <div className="flex items-center text-white mb-2">
            <MapIcon className="w-6 h-6 mr-3 text-purple-400" />
            <h3 className="text-xl font-semibold">Jornada do Paciente</h3>
          </div>
          <p className="text-gray-400 mb-6">Histórico de eventos para: {patient.name}</p>
          
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="relative pl-6">
              <div className="absolute left-[34px] top-0 h-full w-0.5 bg-white/10" aria-hidden="true"></div>
              
              {uniqueEvents.length > 0 ? (
                uniqueEvents.map(event => renderEvent(event))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p>Nenhum evento encontrado para este paciente.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-6">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default PatientJourneyDialog;