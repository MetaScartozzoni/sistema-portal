import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  PersonIcon, 
  CalendarIcon, 
  FileTextIcon, 
  BarChartIcon, 
  ClockIcon,
  CheckCircledIcon,
  ListBulletIcon,
  ChatBubbleIcon,
  FilePlusIcon,
  ExclamationTriangleIcon,
  ActivityLogIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { getAppointmentsForDay, getRecentActivities, saveDocument } from '@/services/api';
import SurgicalDocumentModal from '@/components/caderno/SurgicalDocumentModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        const today = format(new Date(), 'yyyy-MM-dd');
        
        const [appointmentsResponse, activitiesResponse] = await Promise.all([
          getAppointmentsForDay(user.id, today),
          getRecentActivities()
        ]);

        const appointmentsData = appointmentsResponse?.data || [];
        const activitiesData = activitiesResponse?.data || [];

        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);

      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: err.message || "Não foi possível buscar a agenda e atividades. Verifique a conexão com a API.",
        });
        setAppointments([]);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, toast]);

  const handleSaveDocument = async (docData) => {
    try {
  await saveDocument(docData);
      toast({ title: "Documento salvo!", description: "Ação registrada com sucesso."});
    } catch(err) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: err.message || "Não foi possível salvar o documento. Verifique a API.",
      });
    }
  };
  
  const handleShowAllActivities = () => {
    toast({
        title: "Funcionalidade em desenvolvimento",
        description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la em sua próxima mensagem! 🚀",
    });
  };


  const quickActions = [
    {
      title: 'Agenda',
      icon: CalendarIcon,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/agenda'),
      component: null
    },
    {
      title: 'Gerar Documento',
      icon: FilePlusIcon,
      color: 'from-purple-500 to-purple-600',
      action: null,
      component: <SurgicalDocumentModal 
        onSave={handleSaveDocument}
        trigger={
            <div className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-700/50 transition-all w-full h-full">
              <div className={`relative p-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-4 group-hover:scale-110 transition-transform`}>
                <FilePlusIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-white">Gerar Documento</p>
            </div>
        }
       />
    },
    {
      title: 'Novas Mensagens',
      icon: ChatBubbleIcon,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/messages'),
      component: null
    },
    {
      title: 'Verificar Prazos',
      icon: ClockIcon,
      color: 'from-red-500 to-red-600',
      action: () => navigate('/journey'),
      component: null
    }
  ];

  const ActivityIconComponent = ({ type }) => {
    switch (type) {
      case 'document_created': return <FileTextIcon className="w-4 h-4 text-slate-400" />;
      case 'evolution_updated': return <BarChartIcon className="w-4 h-4 text-slate-400" />;
      case 'appointment_scheduled': return <CalendarIcon className="w-4 h-4 text-slate-400" />;
      default: return <ListBulletIcon className="w-4 h-4 text-slate-400" />;
    }
  };

  const isLoading = authLoading || loading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">Bem-vindo ao Portal do Médico</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Hoje</p>
          <p className="text-lg font-semibold text-white capitalize">
            {format(new Date(), "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {action.component ? (
                action.component
            ) : (
                <div
                    className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-700/50 transition-all h-full"
                    onClick={action.action}
                >
                    <div className={`relative p-4 rounded-full bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-8 h-8 text-white" />
                    {action.title === 'Novas Mensagens' && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-800"></span>
                        </span>
                    )}
                    </div>
                    <p className="text-lg font-semibold text-white">{action.title}</p>
                </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/patients">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-effect rounded-xl p-6 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer group h-full flex flex-col"
          >
            <PersonIcon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Gerenciar Pacientes</h3>
            <p className="text-slate-400 text-sm">Visualizar e gerenciar todos os pacientes cadastrados</p>
          </motion.div>
        </Link>

        <Link to="/journey">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-effect rounded-xl p-6 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group h-full flex flex-col"
          >
            <BarChartIcon className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Jornada do Paciente</h3>
            <p className="text-slate-400 text-sm">Acompanhar o progresso e timeline dos pacientes</p>
          </motion.div>
        </Link>

        <Link to="/evolution">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-effect rounded-xl p-6 hover:bg-green-500/10 transition-all duration-300 cursor-pointer group h-full flex flex-col"
          >
            <CheckCircledIcon className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Quadro Evolutivo</h3>
            <p className="text-slate-400 text-sm">Monitorar evolução clínica dos pacientes</p>
          </motion.div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <ListBulletIcon className="text-blue-400"/>
            Agenda e Atividades Recentes
        </h2>
        <div className="space-y-4">
          {isLoading && <p className="text-slate-400 text-center">Carregando agenda...</p>}
          {error && <p className="text-yellow-400 text-center flex items-center justify-center gap-2"><ExclamationTriangleIcon className="w-4 h-4" /> {error}</p>}
          {!isLoading && !error && appointments.length === 0 && <p className="text-slate-400 text-center">Nenhum agendamento para hoje.</p>}
          
          {Array.isArray(appointments) && appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/30 border border-blue-700/50">
                <div className="p-2 bg-slate-700 rounded-lg">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{appointment.reason || `Consulta com ${appointment.patient?.full_name || 'Paciente não identificado'}`}</p>
                  <p className="text-xs text-slate-400 mt-1">Horário: {format(new Date(appointment.appointment_time), 'HH:mm')}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/patients/${appointment.patient.id}/caderno`)} 
                  variant="shine"
                  disabled={!appointment.patient?.id}
                >
                  Atender
                </Button>
              </div>
          ))}
          {Array.isArray(activities) && activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
              <div className="p-2 bg-slate-700 rounded-lg">
                <ActivityIconComponent type={activity.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-1">{format(new Date(activity.occurred_at), "dd/MM/yyyy 'às' HH:mm")}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-6 border-slate-600 hover:border-blue-500" onClick={handleShowAllActivities}>
          Ver Todas as Atividades
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;