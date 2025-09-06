import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  FileBarChart2,
  FileCheck2,
  CalendarClock,
  MessageSquare,
  Bot,
  Send,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import CommunicationModal from '@/components/CommunicationModal';
import ReportSelectionModal from '@/components/ReportSelectionModal';
import DashboardScheduleModal from '@/components/DashboardScheduleModal';

const Dashboard = () => {
  const { users, logs, schedules } = useData();
  const [isCommModalOpen, setCommModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalType, setScheduleModalType] = useState('');

  const getJourneyCount = (status) => {
    return users.filter(u => u.journeyStatus === status).length;
  };

  const getScheduleCount = (type) => {
    return schedules.filter(s => s.type === type).length;
  };

  const handleCardClick = (type) => {
    setScheduleModalType(type);
    setScheduleModalOpen(true);
  };

  const journeyCards = [
    {
      title: 'Pós Consulta x Orçamentos',
      value: getScheduleCount('Consulta'),
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-500',
      action: () => handleCardClick('consultation')
    },
    {
      title: 'Orçamentos Aceitos x Ag. Cirurgia',
      value: getJourneyCount('Em Tratamento'),
      icon: FileCheck2,
      color: 'from-green-500 to-emerald-500',
      link: 'https://orcamento.marcioplasticsurgery.com'
    },
    {
      title: 'Cirurgias Agendadas',
      value: getScheduleCount('Cirurgia'),
      icon: CalendarClock,
      color: 'from-purple-500 to-indigo-500',
      action: () => handleCardClick('surgery')
    }
  ];

  const recentActivities = logs.slice(0, 5);

  const internalMessages = [
    { id: 1, user: 'Dra. Ana Rodrigues', message: 'Lembrete: Reunião de equipe amanhã às 9h.', timestamp: '2025-08-25T10:30:00Z' },
    { id: 2, user: 'Mariana Lima', message: 'O fornecedor ABC confirmou a entrega dos materiais para sexta-feira.', timestamp: '2025-08-25T09:15:00Z' },
  ];

  const getActivityIcon = (level) => {
    switch (level) {
      case 'error': return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
      case 'warning': return <Activity className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
      default: return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Portal Admin Clínica</title>
        <meta name="description" content="Painel principal do portal administrativo com estatísticas e atividades recentes do sistema da clínica." />
      </Helmet>
      <CommunicationModal open={isCommModalOpen} onOpenChange={setCommModalOpen} />
      <ReportSelectionModal open={isReportModalOpen} onOpenChange={setReportModalOpen} />
      <DashboardScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
        scheduleType={scheduleModalType} 
      />

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral dos processos e ações rápidas.</p>
        </motion.div>

        {/* Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeyCards.map((card, index) => {
            const Icon = card.icon;
            const isLink = !!card.link;
            const CardElement = isLink ? 'a' : 'div';
            
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardElement 
                  href={isLink ? card.link : undefined}
                  target={isLink ? '_blank' : undefined}
                  rel={isLink ? 'noopener noreferrer' : undefined}
                  onClick={!isLink ? card.action : undefined}
                  className={`block glass-effect border-white/10 card-hover h-full ${!isLink ? 'cursor-pointer' : ''}`}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mt-4">{card.value}</p>
                      <p className="text-sm text-gray-300 mt-1">{card.title}</p>
                    </div>
                  </CardContent>
                </CardElement>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities & Messages */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white">Central de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="messages" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="messages">Mensagens Internas</TabsTrigger>
                    <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
                  </TabsList>
                  <TabsContent value="messages" className="space-y-4">
                     {internalMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                        <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{msg.message}</p>
                          <p className="text-xs text-gray-400">{msg.user} • {new Date(msg.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400">
                      <Send className="w-4 h-4 mr-2" /> Nova Mensagem Interna
                    </Button>
                  </TabsContent>
                  <TabsContent value="logs" className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                        {getActivityIcon(activity.level)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-400">{activity.user} • {new Date(activity.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <a href="https://bot.marcioplasticsurgery.com" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full h-16 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg">
                    <Bot className="w-6 h-6 mr-3" />
                    Mensagens no ChatBot
                  </Button>
                </a>
                <Button onClick={() => setCommModalOpen(true)} className="w-full h-16 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-lg">
                  <Send className="w-6 h-6 mr-3" />
                  Enviar Comunicado
                </Button>
                <Button onClick={() => setReportModalOpen(true)} className="w-full h-16 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-lg">
                  <FileText className="w-6 h-6 mr-3" />
                  Gerar Relatórios
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;