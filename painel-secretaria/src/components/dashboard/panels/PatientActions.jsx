
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, FilePlus, MessageSquare, Phone, Scissors, HeartPulse, PauseCircle, PlayCircle, FileText, Send, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PatientActions = ({
  patient,
  onNewAppointment,
  onNewSurgery,
  onNewPostOpAppointment,
  onSendDocument,
  onPauseJourney,
  onResumeJourney,
  onRequestExam,
  onSendMessage,
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const canManageJourney = profile?.app_role === 'admin' || profile?.app_role === 'medico';

  const journeyStatus = patient.journey_status;

  const handleSendBudgetLink = () => {
    const budgetLink = `${window.location.origin}/budget-response/${patient.id}`;
    toast({
      title: "Link de Orçamento Gerado",
      description: `Envie este link para o paciente: ${budgetLink}`,
      duration: 5000,
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-slate-800/50 rounded-b-lg">
      <Button variant="outline" className="flex-col h-20 border-blue-500/50 text-blue-300 hover:bg-blue-500/10" onClick={onNewAppointment}>
        <CalendarPlus className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Agendar Consulta</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-pink-500/50 text-pink-300 hover:bg-pink-500/10" onClick={onNewSurgery}>
        <Scissors className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Agendar Cirurgia</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10" onClick={onNewPostOpAppointment}>
        <HeartPulse className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Agendar Pós-Op</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10" onClick={onSendDocument}>
        <FilePlus className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Enviar Documento</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10" onClick={onRequestExam}>
        <FileText className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Solicitar Exame</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-purple-500/50 text-purple-300 hover:bg-purple-500/10" onClick={onSendMessage}>
        <Send className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Enviar Mensagem</span>
      </Button>
      <Button variant="outline" className="flex-col h-20 border-green-500/50 text-green-300 hover:bg-green-500/10" onClick={handleSendBudgetLink}>
        <DollarSign className="w-6 h-6 mb-1" />
        <span className="text-xs text-center">Enviar Link Orçamento</span>
      </Button>
      {canManageJourney && journeyStatus !== 'JORNADA_PAUSADA' && (
        <Button variant="outline" className="flex-col h-20 border-orange-500/50 text-orange-300 hover:bg-orange-500/10" onClick={onPauseJourney}>
          <PauseCircle className="w-6 h-6 mb-1" />
          <span className="text-xs text-center">Pausar Jornada</span>
        </Button>
      )}
      {canManageJourney && journeyStatus === 'JORNADA_PAUSADA' && (
        <Button variant="outline" className="flex-col h-20 border-green-500/50 text-green-300 hover:bg-green-500/10" onClick={onResumeJourney}>
          <PlayCircle className="w-6 h-6 mb-1" />
          <span className="text-xs text-center">Reativar Jornada</span>
        </Button>
      )}
    </div>
  );
};

export default PatientActions;
