import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import DashboardView from '@/components/dashboard/views/DashboardView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import PatientsView from '@/components/dashboard/views/PatientsView';
import CommunicationView from '@/components/dashboard/views/CommunicationView';
import AuditoriaView from '@/components/dashboard/views/AuditoriaView';
import NewAppointmentDialog from '@/components/dashboard/dialogs/NewAppointmentDialog';
import NewPatientDialog from '@/components/dashboard/dialogs/NewPatientDialog';
import SendMessageDialog from '@/components/dashboard/dialogs/SendMessageDialog';
import QuickActions from '@/components/dashboard/QuickActions';
import ShareLinkFormDialog from '@/components/dashboard/dialogs/ShareLinkFormDialog';
import HelpDialog from '@/components/dashboard/dialogs/HelpDialog';
import { addDays, setHours, setMinutes } from 'date-fns';

const generateMockData = () => {
  const today = new Date();
  const mockPatients = [
    { id: '1', name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', contact_reason: 'Indicação' },
    { id: '2', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', contact_reason: 'Mídias Sociais' },
    { id: '3', name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-8888', contact_reason: 'Site' },
    { id: '4', name: 'Daniel Faria', email: 'daniel.faria@example.com', phone: '(41) 94444-7777', contact_reason: 'Campanha' },
  ];

  const mockDoctors = [
    { id: 'doc1', full_name: 'Dr. Ricardo Alves', app_role: 'medico' },
    { id: 'doc2', full_name: 'Dra. Fernanda Lima', app_role: 'medico' },
  ];

  const mockAppointments = [
    { id: 'app1', patient_id: '1', doctor_id: 'doc1', start_time: setMinutes(setHours(today, 9), 0).toISOString(), end_time: setMinutes(setHours(today, 9), 30).toISOString(), consultation_type: 'Consulta Presencial', status: 'Confirmado' },
    { id: 'app2', patient_id: '2', doctor_id: 'doc2', start_time: setMinutes(setHours(today, 11), 0).toISOString(), end_time: setMinutes(setHours(today, 11), 30).toISOString(), consultation_type: 'Cirurgia', status: 'Pendente' },
    { id: 'app3', patient_id: '3', doctor_id: 'doc1', start_time: setMinutes(setHours(addDays(today, 1), 14), 0).toISOString(), end_time: setMinutes(setHours(addDays(today, 1), 14), 30).toISOString(), consultation_type: 'Retorno Pós-Operatório', status: 'Confirmado' },
    { id: 'app4', patient_id: '4', doctor_id: 'doc2', start_time: setMinutes(setHours(addDays(today, 2), 16), 0).toISOString(), end_time: setMinutes(setHours(addDays(today, 2), 16), 30).toISOString(), consultation_type: 'Bate-papo com Médico', status: 'Confirmado' },
  ];
  
  const mockAuditLogs = [
      { id: 'log1', action: 'login_success', user_full_name: 'Secretária Teste', user_role: 'secretaria', created_at: new Date().toISOString(), details: { ip: '192.168.1.1' } },
      { id: 'log2', action: 'appointment_created', user_full_name: 'Secretária Teste', user_role: 'secretaria', created_at: new Date().toISOString(), details: { patient_id: '1', doctor_id: 'doc1' } },
      { id: 'log3', action: 'patient_updated', user_full_name: 'Admin', user_role: 'admin', created_at: new Date().toISOString(), details: { patient_id: '2', fields_updated: ['phone'] } },
  ];

  return { mockPatients, mockDoctors, mockAppointments, mockAuditLogs };
};


function SecretaryDashboardPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { setNotifications } = useNotificationContext();
  const { loading: configLoading } = useContext(ScheduleConfigContext);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointmentDefaults, setAppointmentDefaults] = useState(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const { mockPatients, mockDoctors, mockAppointments, mockAuditLogs } = generateMockData();
    setPatients(mockPatients);
    setDoctors(mockDoctors);
    setAppointments(mockAppointments);
    setAuditLogs(mockAuditLogs);
    if (setNotifications) {
        setNotifications([
            { id: 1, message: 'Novo agendamento para Ana Silva.', type: 'appointment', read: false, created_at: new Date().toISOString() },
            { id: 2, message: 'Documento enviado para Bruno Costa.', type: 'document', read: true, created_at: new Date().toISOString() },
        ]);
    }
    setLoading(false);
  }, [setNotifications]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showWipToast = () => {
    toast({
      variant: "destructive",
      title: "Modo de Demonstração",
      description: "Esta funcionalidade requer conexão com o banco de dados. Por favor, complete a integração com o Supabase.",
    });
  };

  const handleCall = (patient, callType) => {
    if (!patient || !patient.phone) {
      toast({ title: 'Paciente sem telefone cadastrado.' });
      return;
    }
    const phoneNumber = patient.phone.replace(/\D/g, '');
    if (callType === 'phone') {
        window.open(`tel:${phoneNumber}`);
    } else if (callType === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}`);
    }
    toast({ title: 'Iniciando contato...', description: `Simulando ${callType} com ${patient.name}` });
  };

  const handleOpenNewAppointment = (defaultValues = null) => {
    setAppointmentDefaults(defaultValues);
    setShowNewAppointment(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    if (loading || configLoading) {
      return <div className="flex justify-center items-center h-64"><p className="text-white">Carregando dados da clínica...</p></div>;
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView 
                  appointments={appointments} 
                  patients={patients} 
                  onNewAppointment={() => handleOpenNewAppointment()}
                  onNewPatient={() => setShowNewPatient(true)}
                />;
      case 'calendar':
        return <CalendarView 
                  appointments={appointments} 
                  patients={patients}
                  onNewAppointment={handleOpenNewAppointment}
                />;
      case 'patients':
        return <PatientsView 
                  patients={filteredPatients} 
                  onNewPatient={() => setShowNewPatient(true)}
                  onCall={handleCall}
                  user={user}
                />;
      case 'communication':
        return <CommunicationView />;
      case 'auditoria':
        return <AuditoriaView auditLogs={auditLogs} />;
      default:
        return <DashboardView 
                  appointments={appointments} 
                  patients={patients} 
                  onNewAppointment={() => handleOpenNewAppointment()}
                  onNewPatient={() => setShowNewPatient(true)}
                />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard da Secretaria - Clínica Médica</title>
        <meta name="description" content="Sistema de gestão para secretaria da clínica médica com agendamentos, cadastro de pacientes e comunicação." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-24">
        <DashboardHeader 
          title="Dashboard Secretaria"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onShareLink={() => setShowShareLink(true)}
          onHelp={() => setShowHelp(true)}
          user={profile}
        />
        <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>

        <QuickActions 
          onNewAppointment={() => handleOpenNewAppointment()}
          onNewPatient={() => setShowNewPatient(true)}
          onSendMessage={() => setShowSendMessage(true)}
        />

        <NewAppointmentDialog
          open={showNewAppointment}
          onOpenChange={setShowNewAppointment}
          onSubmit={showWipToast}
          patients={patients}
          doctors={doctors}
          onNewPatientClick={() => {
            setShowNewAppointment(false);
            setShowNewPatient(true);
          }}
          onCall={handleCall}
          defaultValues={appointmentDefaults}
        />

        <NewPatientDialog
          open={showNewPatient}
          onOpenChange={setShowNewPatient}
          onSubmit={showWipToast}
          onCall={handleCall}
        />

        <SendMessageDialog
          open={showSendMessage}
          onOpenChange={setShowSendMessage}
          onSubmit={showWipToast}
        />

        <ShareLinkFormDialog
          open={showShareLink}
          onOpenChange={setShowShareLink}
        />

        <HelpDialog
          open={showHelp}
          onOpenChange={setShowHelp}
        />
      </div>
    </>
  );
}

export default SecretaryDashboardPage;