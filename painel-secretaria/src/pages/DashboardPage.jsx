
import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { useClinicData } from '@/hooks/useClinicData';
import { useDialogManager } from '@/hooks/useDialogManager';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import DashboardView from '@/components/dashboard/views/DashboardView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import PatientsView from '@/components/dashboard/views/PatientsView';
import CommunicationView from '@/components/dashboard/views/CommunicationView';
import AuditoriaView from '@/components/dashboard/views/AuditoriaView';
import SettingsView from '@/components/dashboard/views/SettingsView';
import NewAppointmentDialog from '@/components/dashboard/dialogs/NewAppointmentDialog';
import NewSurgeryDialog from '@/components/dashboard/dialogs/NewSurgeryDialog';
import NewPostOpAppointmentDialog from '@/components/dashboard/dialogs/NewPostOpAppointmentDialog';
import NewPatientDialog from '@/components/dashboard/dialogs/NewPatientDialog';
import NewContactDialog from '@/components/dashboard/dialogs/NewContactDialog';
import QuickActions from '@/components/dashboard/QuickActions';
import ShareLinkFormDialog from '@/components/dashboard/dialogs/ShareLinkFormDialog';
import SendExternalMessageDialog from '@/components/dashboard/dialogs/SendExternalMessageDialog';
import RequestExamDialog from '@/components/dashboard/dialogs/RequestExamDialog';
import SendDocumentDialog from '@/components/dashboard/dialogs/SendDocumentDialog';
import SelectDocumentTemplatesDialog from '@/components/dashboard/dialogs/SelectDocumentTemplatesDialog';
import PatientJourneyDialog from '@/components/dashboard/dialogs/PatientJourneyDialog';
import PauseJourneyDialog from '@/components/dashboard/dialogs/PauseJourneyDialog';

function DashboardPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { loading: configLoading } = useContext(ScheduleConfigContext);
  const { dialogs, openDialog, closeDialog } = useDialogManager();
  const {
    appointments,
    patients,
    doctors,
    auditLogs,
    loading: dataLoading,
    fetchData,
    handleNewAppointment,
    handleNewSurgery,
    handleNewPatient,
    handleNewContact,
    handleUpdatePatient,
    handlePauseJourney,
    handleResumeJourney,
    handleRequestExam,
    handleSendDocument,
  } = useClinicData(user, profile);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [patientToPause, setPatientToPause] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCall = (patient, callType) => {
    toast({ title: 'Função de chamada (local)', description: `Simulando ${callType} para ${patient.name}` });
  };

  const handleSendExternalMessage = async (data) => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Falha ao enviar mensagem.');
      }
      toast({
        title: 'Mensagem Enviada (Simulação)',
        description: `Mensagem para ${data.to} foi processada.`,
      });
      closeDialog('sendExternalMessage');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Enviar Mensagem',
        description: error.message,
      });
    }
  };
  
  const handleDocumentSelected = (document, patientId) => {
    closeDialog('sendDocument'); 
    openDialog('sendDocument', { document, patient: patients.find(p => p.id === patientId) });
  };

  const filteredPatients = (patients || []).filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    if (dataLoading || configLoading) {
      return <div className="flex justify-center items-center h-64"><p className="text-white">Carregando dados...</p></div>;
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView 
                  appointments={appointments} 
                  patients={patients} 
                  onNewAppointment={() => openDialog('newAppointment')}
                  onNewPatient={() => openDialog('newPatient')}
                  onNewSurgery={() => openDialog('newSurgery')}
                />;
      case 'calendar':
        return <CalendarView 
                  appointments={appointments} 
                  patients={patients}
                  onNewAppointment={(defaults) => openDialog('newAppointment', defaults)}
                  onNewSurgery={(defaults) => openDialog('newSurgery', defaults)}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                />;
      case 'patients':
        return <PatientsView 
                  patients={filteredPatients} 
                  appointments={appointments}
                  onNewPatient={() => openDialog('newPatient')}
                  onCall={handleCall}
                  user={user}
                  onNewAppointment={(defaults) => openDialog('newAppointment', defaults)}
                  onNewSurgery={(defaults) => openDialog('newSurgery', defaults)}
                  onNewPostOpAppointment={(defaults) => openDialog('newPostOp', defaults)}
                  onUpdatePatient={handleUpdatePatient}
                  onPauseJourney={(patient) => setPatientToPause(patient)}
                  onResumeJourney={handleResumeJourney}
                  onRequestExam={(defaults) => openDialog('requestExam', defaults)}
                  onSendDocument={(defaults) => openDialog('sendDocument', defaults)}
                  onSendMessage={(defaults) => openDialog('sendExternalMessage', defaults)}
                />;
      case 'communication':
        return <CommunicationView />;
      case 'auditoria':
        return <AuditoriaView auditLogs={auditLogs} />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  const getDashboardTitle = () => {
    if (!profile) return "Dashboard";
    if (profile.app_role === 'admin') return "Painel do Administrador";
    if (profile.app_role === 'medico') return "Painel Médico";
    if (profile.app_role === 'comercial' || profile.app_role === 'admin_financeiro') return "Painel da Clínica";
    return "Dashboard";
  }

  return (
    <>
      <Helmet>
        <title>{getDashboardTitle()} - Clínica Médica</title>
        <meta name="description" content="Sistema de gestão para secretaria da clínica médica com agendamentos, cadastro de pacientes e comunicação." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <DashboardHeader 
          title={getDashboardTitle()}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onShareLink={() => openDialog('shareLink')}
        />
        <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>

        <QuickActions 
          onNewAppointment={() => openDialog('newAppointment')}
          onNewPatient={() => openDialog('newPatient')}
          onNewContact={() => openDialog('newContact')}
          onSendMessage={() => openDialog('sendExternalMessage')}
        />

        <NewAppointmentDialog
          open={dialogs.newAppointment.open}
          onOpenChange={() => closeDialog('newAppointment')}
          onSubmit={(data) => handleNewAppointment(data, () => closeDialog('newAppointment'))}
          patients={patients}
          doctors={doctors}
          appointments={appointments}
          onNewPatientClick={() => {
            closeDialog('newAppointment');
            openDialog('newPatient');
          }}
          onCall={handleCall}
          defaultValues={dialogs.newAppointment.defaults}
        />
        
        <NewSurgeryDialog
            open={dialogs.newSurgery.open}
            onOpenChange={() => closeDialog('newSurgery')}
            onSubmit={(data) => {
                closeDialog('newSurgery');
                handleNewSurgery(data, (defaults) => openDialog('newPostOp', defaults));
            }}
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            defaultValues={dialogs.newSurgery.defaults}
        />

        <NewPostOpAppointmentDialog
          open={dialogs.newPostOp.open}
          onOpenChange={() => closeDialog('newPostOp')}
          onSubmit={(data) => handleNewAppointment(data, () => closeDialog('newPostOp'))}
          patients={patients}
          doctors={doctors}
          appointments={appointments}
          defaultValues={dialogs.newPostOp.defaults}
        />

        <NewPatientDialog
          open={dialogs.newPatient.open}
          onOpenChange={() => closeDialog('newPatient')}
          onSubmit={(data) => handleNewPatient(data, () => closeDialog('newPatient'))}
          onCall={handleCall}
        />

        <NewContactDialog
          open={dialogs.newContact.open}
          onOpenChange={() => closeDialog('newContact')}
          onSubmit={(data) => handleNewContact(data, () => closeDialog('newContact'))}
        />

        <ShareLinkFormDialog
          open={dialogs.shareLink.open}
          onOpenChange={() => closeDialog('shareLink')}
        />

        <SendExternalMessageDialog
          open={dialogs.sendExternalMessage.open}
          onOpenChange={() => closeDialog('sendExternalMessage')}
          onSubmit={handleSendExternalMessage}
          patients={patients}
          appointments={appointments}
          defaultValues={dialogs.sendExternalMessage.defaults}
        />
        
        <RequestExamDialog
          open={dialogs.requestExam.open}
          onOpenChange={() => closeDialog('requestExam')}
          onSubmit={(data) => {
            handleRequestExam({ ...data, patientId: dialogs.requestExam.defaults.patientId });
            closeDialog('requestExam');
          }}
          patient={patients.find(p => p.id === (dialogs.requestExam.defaults && dialogs.requestExam.defaults.patientId))}
        />
        
        <SelectDocumentTemplatesDialog
            open={dialogs.sendDocument.open && (!dialogs.sendDocument.defaults || !dialogs.sendDocument.defaults.document)}
            onOpenChange={() => closeDialog('sendDocument')}
            onSubmit={(data) => {
                handleSendDocument({ ...data, patientId: dialogs.sendDocument.defaults.patientId });
                closeDialog('sendDocument');
            }}
            patient={patients.find(p => p.id === (dialogs.sendDocument.defaults && dialogs.sendDocument.defaults.patientId))}
        />

        <SendDocumentDialog
            open={dialogs.sendDocument.open && (dialogs.sendDocument.defaults && dialogs.sendDocument.defaults.document)}
            onOpenChange={() => closeDialog('sendDocument')}
            onSubmit={(data) => {
                handleSendDocument({ ...data, patientId: dialogs.sendDocument.defaults.patient.id, document: dialogs.sendDocument.defaults.document });
                closeDialog('sendDocument');
            }}
            patient={dialogs.sendDocument.defaults?.patient}
            document={dialogs.sendDocument.defaults?.document}
        />

        <PatientJourneyDialog
            open={dialogs.patientJourney.open}
            onOpenChange={() => closeDialog('patientJourney')}
            patient={dialogs.patientJourney.defaults}
            appointments={appointments}
        />

        <PauseJourneyDialog
          open={!!patientToPause}
          onOpenChange={() => setPatientToPause(null)}
          patient={patientToPause}
          onSubmit={(data) => {
            handlePauseJourney(patientToPause, data);
            setPatientToPause(null);
          }}
        />
      </div>
    </>
  );
}

export default DashboardPage;
