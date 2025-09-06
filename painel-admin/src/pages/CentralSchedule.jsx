import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, Lock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { addDays, format, startOfWeek, eachDayOfInterval, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddAppointmentModal from '@/components/AddAppointmentModal';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import ProfessionalScheduleModal from '@/components/ProfessionalScheduleModal';

const hours = Array.from({ length: 13 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

const CentralSchedule = () => {
  const { schedules, users, calendarSettings } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isProfScheduleModalOpen, setIsProfScheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const professionals = useMemo(() => users.filter(u => u.role === 'medico'), [users]);

  const week = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleProfessionalAction = (prof) => {
    setSelectedProfessional(prof);
    setIsProfScheduleModalOpen(true);
  };

  const getAppointmentStyle = (appointment) => {
    const professional = professionals.find(p => p.id === appointment.professionalId);
    const appointmentTypeData = calendarSettings?.appointmentTypes?.find(at => at.name === appointment.type);
    const color = appointmentTypeData?.color || professional?.color || '#a8a29e';
    
    const startTime = parse(appointment.time, 'HH:mm', new Date());
    const duration = appointmentTypeData?.duration || 60;
    const top = ((startTime.getHours() - 7) * 60 + startTime.getMinutes()) / (13 * 60) * 100;
    const height = (duration / (13 * 60)) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: `${color}40`,
      borderColor: color,
    };
  };

  return (
    <>
      <Helmet>
        <title>Agenda Central - Portal Admin Clínica</title>
        <meta name="description" content="Gerencie a agenda central da clínica com uma visão de calendário semanal." />
      </Helmet>

      <AddAppointmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <AppointmentDetailsModal appointment={selectedAppointment} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
      <ProfessionalScheduleModal professional={selectedProfessional} isOpen={isProfScheduleModalOpen} onClose={() => setIsProfScheduleModalOpen(false)} />

      <div className="flex h-[calc(100vh-100px)] gap-6">
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h1>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                  <ChevronLeft className="w-5 h-5 text-white" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                  <ChevronRight className="w-5 h-5 text-white" />
                </Button>
              </div>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agendamento
            </Button>
          </motion.div>

          <div className="flex-1 grid grid-cols-[auto,1fr] overflow-hidden">
            <div className="pr-4 flex flex-col text-sm text-gray-400">
              <div className="h-16"></div>
              {hours.map(hour => (
                <div key={hour} className="flex-1 -mt-px flex items-start justify-end">
                  <span>{hour}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 flex-1 border-l border-white/10 overflow-auto scrollbar-hide">
              {week.map(day => (
                <div key={day.toString()} className="border-r border-white/10">
                  <div className="sticky top-0 z-10 p-2 text-center bg-slate-900/50 backdrop-blur-sm border-b border-white/10">
                    <p className="font-semibold text-white capitalize">{format(day, 'eee', { locale: ptBR })}</p>
                    <p className="text-2xl font-bold text-white">{format(day, 'd')}</p>
                  </div>
                  <div className="relative h-[calc(13*60px)]">
                    {hours.map(hour => (
                      <div key={hour} className="h-[60px] border-t border-white/10"></div>
                    ))}
                    {schedules
                      .filter(app => format(new Date(`${app.date}T00:00:00`), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                      .map(app => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={getAppointmentStyle(app)}
                          className="absolute w-full p-2 rounded-lg border-l-4 cursor-pointer overflow-hidden"
                          onClick={() => handleAppointmentClick(app)}
                        >
                          <p className="font-bold text-white text-xs truncate">{app.reason || app.type}</p>
                          <p className="text-gray-300 text-xs truncate">{app.doctorName}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0 space-y-6 overflow-y-auto scrollbar-hide"
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><User className="w-5 h-5 text-blue-400" /> Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {professionals.map(prof => (
                <div key={prof.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prof.color }}></div>
                    <span className="text-sm text-white">{prof.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-effect border-white/10 text-white">
                      <DropdownMenuItem onClick={() => handleProfessionalAction(prof)}>Ver/Editar Horários</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Lock className="w-5 h-5 text-red-400" /> Bloqueios e Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Bloqueio
              </Button>
               <div className="text-center text-gray-400 text-sm pt-4">
                <p>Nenhum bloqueio para esta semana.</p>
              </div>
            </CardContent>
          </Card>
          
           <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Clock className="w-5 h-5 text-green-400" /> Horários da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {calendarSettings?.general?.clinicWorkingHours?.map(wh => (
                <div key={wh.day} className="flex justify-between items-center text-white">
                  <span>{wh.day}</span>
                  <span className={`font-mono ${wh.active ? 'text-green-400' : 'text-red-400'}`}>
                    {wh.active ? `${wh.start} - ${wh.end}` : 'Fechado'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default CentralSchedule;