
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Mail, Phone, AlertCircle, CheckCircle, Clock, FileText, FileQuestion, HeartHandshake as Handshake, ShieldCheck, Scissors, PauseCircle, Briefcase as BriefcaseMedical } from 'lucide-react';
import PatientActionsPanel from '@/components/dashboard/panels/PatientActionsPanel';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import PatientJourneyDialog from '@/components/dashboard/dialogs/PatientJourneyDialog';
import { useDialogManager } from '@/hooks/useDialogManager';

const getStatusInfo = (patient) => {
  const journeyStatus = patient.journey_status;
  const budgetStatus = patient.budget_status;

  switch (journeyStatus) {
    case 'NOVO_CONTATO':
      return { text: 'Novo Contato', icon: AlertCircle, color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
    case 'CONSULTA_REALIZADA':
      if (budgetStatus === 'Não Realizado') {
        return { text: 'Pendente Orçamento', icon: FileQuestion, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      }
      if (budgetStatus === 'Realizado') {
        return { text: 'Orçamento Pronto', icon: FileText, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      }
      if (budgetStatus === 'Aguardando Resposta') {
        return { text: 'Aguardando Resposta', icon: Clock, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      }
      return { text: 'Pós-Consulta', icon: CheckCircle, color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
    case 'AGUARDANDO_CONFIRMACOES':
      return { text: 'Aguardando Confirmações', icon: Handshake, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    case 'PAGAMENTO_CONFIRMADO':
      return { text: 'Pronto para Cirurgia', icon: ShieldCheck, color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
    case 'CIRURGIA_AGENDADA':
      return { text: 'Cirurgia Agendada', icon: Scissors, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    case 'EM_ACOMPANHAMENTO':
      return { text: 'Em Acompanhamento', icon: BriefcaseMedical, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    case 'ORCAMENTO_ACEITO': // Should transition to AGUARDANDO_CONFIRMACOES
      return { text: 'Orçamento Aceito', icon: CheckCircle, color: 'bg-green-500/20 text-green-300 border-green-500/30' };
    case 'JORNADA_PAUSADA':
      return { text: 'Jornada Pausada', icon: PauseCircle, color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    default:
      return { text: journeyStatus.replace(/_/g, ' '), icon: AlertCircle, color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
  }
};

const PatientsView = ({ patients, appointments, onNewPatient, onCall, user, onNewAppointment, onNewSurgery, onNewPostOpAppointment, onUpdatePatient, onPauseJourney, onResumeJourney, onRequestExam, onSendDocument, onSendMessage }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { dialogs, openDialog, closeDialog } = useDialogManager();

  const handleSelectPatient = useCallback((patient) => {
    setSelectedPatient(patient);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedPatient(null);
  }, []);

  const handleViewJourney = useCallback((patient) => {
    openDialog('patientJourney', patient);
    setSelectedPatient(null);
  }, [openDialog]);

  return (
    <div className="relative pb-20">
      <motion.div
        key="patients-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Pacientes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.length > 0 ? patients.map((patient) => {
            const statusInfo = getStatusInfo(patient);
            return (
            <motion.div
              key={patient.id}
              layoutId={`patient-card-${patient.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => handleSelectPatient(patient)}
              className="cursor-pointer"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-colors flex flex-col h-full min-h-[220px]">
                <CardContent className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage alt="Avatar do paciente" src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-white font-semibold truncate" title={patient.name}>{patient.name}</h4>
                      <p className="text-gray-400 text-sm truncate">Origem: {patient.contact_reason || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm flex-grow">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate" title={patient.email}>{patient.email || 'E-mail não cadastrado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{patient.phone || 'Telefone não cadastrado'}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className={`w-full justify-center ${statusInfo.color}`}>
                            <statusInfo.icon className="w-3 h-3 mr-2" />
                            <span className="truncate">{statusInfo.text}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white border-white/20">
                          <p>{statusInfo.text}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}) : <p className="text-center text-gray-400 col-span-full py-10">Nenhum paciente encontrado.</p>}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedPatient && (
          <PatientActionsPanel
            selectedPatient={selectedPatient}
            appointments={appointments}
            onClose={handleClosePanel}
            onCall={onCall}
            onNewAppointment={onNewAppointment}
            onNewSurgery={onNewSurgery}
            onNewPostOpAppointment={onNewPostOpAppointment}
            onUpdatePatient={onUpdatePatient}
            onPauseJourney={onPauseJourney}
            onResumeJourney={onResumeJourney}
            onRequestExam={onRequestExam}
            onSendDocument={onSendDocument}
            onSendMessage={onSendMessage}
            onViewJourney={handleViewJourney}
          />
        )}
      </AnimatePresence>

      <PatientJourneyDialog
        open={dialogs.patientJourney.open}
        onOpenChange={() => closeDialog('patientJourney')}
        patient={dialogs.patientJourney.defaults}
        appointments={appointments}
      />
    </div>
  );
};

export default PatientsView;
