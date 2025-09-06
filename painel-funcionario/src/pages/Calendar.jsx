import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Stethoscope,
  Scissors,
  Plus,
  Calendar as CalendarIcon,
  View,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useApi } from '@/contexts/ApiContext';
import AppointmentForm from '@/components/calendar/AppointmentForm';
import SurgeryModal from '@/components/calendar/SurgeryModal';
import AppointmentDetails from '@/components/calendar/AppointmentDetails';
import { ScrollArea } from '@/components/ui/scroll-area';

const Calendar = () => {
  const { toast } = useToast();
  const { getAppointmentsForDay, addAppointment, updateAppointment, addSurgery, createPatientJourney } = useApi();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [eventsByDay, setEventsByDay] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSurgeryModalOpen, setIsSurgeryModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  
  const [weekAppointments, setWeekAppointments] = useState([]);
  const [weekLoading, setWeekLoading] = useState(false);

  const fetchAppointments = useCallback(async (date) => {
    setLoading(true);
    toast({ title: "Modo Demonstração", description: "Exibindo dados de exemplo." });
    setAppointments([]);
    setLoading(false);
  }, [toast]);
  
  const fetchMonthEvents = useCallback(async (date) => {
      setEventsByDay({});
  }, []);
  
  const fetchWeekAppointments = useCallback(async () => {
      setWeekLoading(true);
      toast({ title: "Modo Demonstração", description: "Exibindo dados de exemplo para a semana." });
      setWeekAppointments([]);
      setWeekLoading(false);
  }, [toast]);

  useEffect(() => {
    if (viewMode === 'month') {
        fetchMonthEvents(currentDate);
        fetchAppointments(selectedDate);
    }
  }, [selectedDate, currentDate, viewMode, fetchAppointments, fetchMonthEvents]);
  
  useEffect(() => {
      if (viewMode === 'week') {
          fetchWeekAppointments();
      }
  }, [selectedDate, viewMode, fetchWeekAppointments]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) days.push(new Date(year, month, day));
    return days;
  };
  
    const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    startOfWeek.setDate(date.getDate() - dayOfWeek); // start on Sunday
    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7 * direction);
    setSelectedDate(newDate);
  };

  const handleSaveAppointment = async (appointmentData) => {
    toast({ title: '🚧 Funcionalidade Desconectada', description: 'A conexão com o banco de dados foi removida.' });
    setIsFormOpen(false);
  };

  const handleSaveSurgery = async (surgeryData) => {
    toast({ title: '🚧 Funcionalidade Desconectada', description: 'A conexão com o banco de dados foi removida.' });
    setIsSurgeryModalOpen(false);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    if (appointment.visit_type === 'cirurgia') {
      setIsSurgeryModalOpen(true);
    } else {
      setIsFormOpen(true);
    }
  };
  
  const handleDayClick = (date) => {
    if (date) {
        setSelectedDate(date);
    }
  };

  const handleQuickUpdate = async (id, status) => {
    toast({ title: '🚧 Funcionalidade Desconectada', description: 'A conexão com o banco de dados foi removida.' });
  };
  
  const openNewAppointmentModal = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };

  const isToday = (date) => date && date.toDateString() === new Date().toDateString();
  const isSelected = (date) => date && date.toDateString() === selectedDate.toDateString();

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map(day => <div key={day} className="text-center font-semibold text-gray-400 text-sm">{day}</div>)}
      {getDaysInMonth(currentDate).map((day, index) => (
        <div 
          key={index}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between group relative ${day ? 'glass-effect hover:bg-slate-700/50' : 'bg-transparent'} ${isSelected(day) ? 'bg-blue-600/30 border-2 border-blue-500' : 'border border-transparent'}`}
          onClick={() => handleDayClick(day)}
        >
          {day && (
            <>
              <span className={`font-medium ${isToday(day) ? 'text-blue-400' : 'text-white'}`}>{day.getDate()}</span>
              {eventsByDay[day.toISOString().split('T')[0]] > 0 && 
                <span className="text-xs text-cyan-300 self-end">{eventsByDay[day.toISOString().split('T')[0]]} evento(s)</span>
              }
              <Button size="sm" variant="ghost" className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); openNewAppointmentModal(day); }}>
                  <Plus className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const WeekView = () => {
    const week = getWeekDays(selectedDate);
    const weekApptsByDay = weekAppointments.reduce((acc, appt) => {
        const dateKey = new Date(appt.appointment_time).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(appt);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 h-full">
            {week.map((day) => {
                const dateKey = day.toISOString().split('T')[0];
                const dayAppointments = weekApptsByDay[dateKey] || [];
                return (
                    <div key={dateKey} className={`rounded-lg p-2 flex flex-col glass-effect ${isToday(day) ? 'border-2 border-blue-500' : ''}`}>
                       <div className="text-center font-semibold mb-2 pb-2 border-b border-white/10">
                            <span className="text-gray-400 text-sm">{weekDays[day.getDay()]}</span>
                            <p className={`text-lg ${isToday(day) ? 'text-blue-400' : 'text-white'}`}>{day.getDate()}</p>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="space-y-2 pr-2">
                                {weekLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4" /> : 
                                dayAppointments.length > 0 ? (
                                    dayAppointments.map(appt => (
                                        <AppointmentDetails key={appt.id} appointment={appt} onEdit={handleEditAppointment} onQuickUpdate={handleQuickUpdate} />
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 text-sm pt-4">Nenhum evento</div>
                                )}
                            </div>
                        </ScrollArea>
                        <Button size="sm" variant="ghost" className="w-full mt-2" onClick={() => openNewAppointmentModal(day)}>
                            <Plus className="w-4 h-4 mr-2" /> Agendar
                        </Button>
                    </div>
                );
            })}
        </div>
    );
};

  const DailyDetails = () => (
    <Card className="glass-effect h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : appointments.length > 0 ? (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {appointments.map(app => (
                <AppointmentDetails key={app.id} appointment={app} onEdit={handleEditAppointment} onQuickUpdate={handleQuickUpdate} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-gray-400 h-full flex items-center justify-center">Nenhum agendamento para este dia.</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Agenda - Portal Secretaria</title>
        <meta name="description" content="Gerencie seus agendamentos, visualize o calendário e organize o dia." />
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => (viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold text-center w-64">
              {viewMode === 'month' ? 
                `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : 
                `Semana de ${getWeekDays(selectedDate)[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`}
            </h2>
            <Button variant="outline" onClick={() => (viewMode === 'month' ? navigateMonth(1) : navigateWeek(1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className={viewMode === 'month' ? 'bg-blue-600/30' : ''} onClick={() => setViewMode('month')}><CalendarIcon className="w-4 h-4 mr-2"/> Mês</Button>
            <Button variant="outline" className={viewMode === 'week' ? 'bg-blue-600/30' : ''} onClick={() => setViewMode('week')}><View className="w-4 h-4 mr-2"/> Semana</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button className="btn-secondary" onClick={() => { setSelectedDate(new Date()); setSelectedAppointment(null); setIsFormOpen(true); }}>
              <Stethoscope className="w-4 h-4 mr-2" /> Nova Consulta
            </Button>
            <Button className="btn-primary" onClick={() => setIsSurgeryModalOpen(true)}>
              <Scissors className="w-4 h-4 mr-2" /> Agendar Cirurgia
            </Button>
          </div>
        </div>

        <div className={`flex-1 overflow-hidden grid ${viewMode === 'month' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {viewMode === 'month' && (
                <>
                    <div className="md:col-span-2">{renderMonthView()}</div>
                    <div className="hidden md:block"><DailyDetails /></div>
                </>
            )}
            {viewMode === 'week' && (
                <div className="col-span-1"><WeekView /></div>
            )}
        </div>
      </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <AppointmentForm
            appointment={selectedAppointment}
            selectedDate={selectedDate}
            onSave={handleSaveAppointment}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSurgeryModalOpen} onOpenChange={setIsSurgeryModalOpen}>
        <DialogContent className="max-w-3xl">
          <SurgeryModal
            appointment={selectedAppointment}
            selectedDate={selectedDate}
            onSave={handleSaveSurgery}
            onClose={() => setIsSurgeryModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;