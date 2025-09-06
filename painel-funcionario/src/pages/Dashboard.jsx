import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, BarChart2, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useApi } from '@/contexts/ApiContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AppointmentInfoModal from '@/components/dashboard/AppointmentInfoModal';
import { useNavigate } from 'react-router-dom';
import RecentActivities from '@/components/dashboard/RecentActivities';

const StatCard = ({ title, value, icon, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={onClick ? "cursor-pointer" : ""}
    onClick={onClick}
  >
    <Card className="glass-effect card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {icon && React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const { getAppointmentsForDay } = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ today: 0, concluded: 0, pending: 0, total: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date();
      const data = await getAppointmentsForDay(today);
      if (data) {
        const concluded = data.filter(a => a.status === 'concluido').length;
        const pending = data.filter(a => a.status === 'agendado').length;
        setStats({ today: data.length, concluded, pending, total: data.length });
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [getAppointmentsForDay]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluido': return 'bg-green-500/20 text-green-300';
      case 'agendado': return 'bg-blue-500/20 text-blue-300';
      case 'cancelado': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Portal Secretaria</title>
        <meta name="description" content="Visão geral do dia, incluindo agendamentos, pacientes e atividades recentes." />
      </Helmet>
      <div className="space-y-8">
        <motion.h1 
            className="text-3xl font-bold gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            Dashboard
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Consultas Hoje" value={loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.today} icon={<Calendar />} color="text-blue-400" delay={0.1} onClick={() => navigate('/agenda')} />
          <StatCard title="Concluídas" value={loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.concluded} icon={<Users />} color="text-green-400" delay={0.2} />
          <StatCard title="Pendentes" value={loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.pending} icon={<Clock />} color="text-yellow-400" delay={0.3} />
          <StatCard title="Atividade Geral" value={loading ? <Loader2 className="h-8 w-8 animate-spin" /> : "75%"} icon={<BarChart2 />} color="text-purple-400" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card className="glass-effect overflow-hidden h-full">
              <CardHeader>
                <CardTitle>Agenda do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
                    {appointments.map(appointment => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="font-mono text-lg text-blue-300">
                            {new Date(appointment.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div>
                            <p className="font-semibold">{appointment.patient.full_name}</p>
                            <p className="text-sm text-gray-400 capitalize">{appointment.visit_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                                {appointment.status}
                            </span>
                            <ArrowRight className="w-5 h-5 text-gray-500" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum agendamento para hoje. Um dia tranquilo!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-1">
             <RecentActivities />
          </div>

        </div>
      </div>
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl">
                <AppointmentInfoModal 
                    appointment={selectedAppointment} 
                    onClose={() => setIsModalOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </>
  );
};

export default Dashboard;