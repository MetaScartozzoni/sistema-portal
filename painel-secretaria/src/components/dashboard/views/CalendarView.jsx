
import React, { useMemo, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Scissors, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  isSameMonth,
  isToday,
  isSameDay,
  format,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCalendarDays, getAvailableSlotsForDate } from '@/lib/calendarUtils';
import { appointmentTypes, getAppointmentTypeDetails } from '@/lib/schedulingConfig';
import AppointmentDetailsDialog from '@/components/dashboard/dialogs/AppointmentDetailsDialog';
import { useToast } from '@/components/ui/use-toast';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';

const CalendarView = ({ appointments, patients, onNewAppointment, onNewSurgery, currentMonth, onMonthChange, selectedDate: initialSelectedDate }) => {
  const { toast } = useToast();
  const { scheduleConfig, loading: configLoading } = useContext(ScheduleConfigContext);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate || new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDate(initialSelectedDate);
    }
  }, [initialSelectedDate]);

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const slotsForSelectedDate = useMemo(() => {
    if (configLoading) return [];
    return getAvailableSlotsForDate(selectedDate, appointments, scheduleConfig);
  }, [selectedDate, appointments, scheduleConfig, configLoading]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    if (!isSameMonth(day, currentMonth)) {
      onMonthChange(day);
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.booked) {
      setSelectedAppointment(slot.booked);
      setShowDetails(true);
    } else if (slot.type === appointmentTypes.CIRURGIA.label) {
      onNewSurgery({
        date: slot.time,
        time: format(slot.time, 'HH:mm'),
      });
    } else {
      onNewAppointment({
        date: slot.time,
        time: format(slot.time, 'HH:mm'),
        type: slot.type,
      });
    }
  };

  const getPatientForAppointment = (appointment) => {
    return patients.find(p => p.id === appointment.patient_id);
  };
  
  const handleEdit = () => {
     toast({ title: "🚧 Editar Agendamento", description: "Esta funcionalidade ainda não foi implementada." });
     setShowDetails(false);
  }

  const handleCancel = () => {
    toast({ title: "🚧 Cancelar Agendamento", description: "Esta funcionalidade ainda não foi implementada." });
    setShowDetails(false);
  }

  return (
    <>
      <motion.div
        key="calendar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]"
      >
        <div className="flex-grow bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/20 text-white hover:bg-white/10" onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 px-3 border-white/20 text-white hover:bg-white/10" onClick={() => onMonthChange(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/20 text-white hover:bg-white/10" onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 grid-rows-6 flex-grow gap-1">
            {days.map((day) => {
              const daySlots = getAvailableSlotsForDate(day, appointments, scheduleConfig);
              const availableTypes = [...new Set(daySlots.filter(s => !s.booked).map(s => s.type))];
              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors flex flex-col
                    ${!isSameMonth(day, currentMonth) ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20'}
                    ${isSameDay(day, selectedDate) ? '!bg-purple-500/30 border border-purple-400' : ''}
                    ${isToday(day) ? 'border border-blue-400' : ''}`}
                >
                  <span className="font-semibold">{format(day, 'd')}</span>
                  <div className="flex flex-wrap -ml-1 mt-auto pt-1">
                    {availableTypes.slice(0, 4).map(type => {
                      const details = getAppointmentTypeDetails(type);
                      return <Dot key={type} className={`w-4 h-4 ${details.textColor || 'text-gray-400'}`} />
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-80 lg:max-w-sm flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">
              {format(selectedDate, "eeee, dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {configLoading ? (
                  <div className="text-center text-gray-400 pt-10">
                    <p>Carregando configurações da agenda...</p>
                  </div>
                ) : slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map((slot, index) => {
                  const details = getAppointmentTypeDetails(slot.type);
                  return (
                    <motion.div
                      key={`${format(slot.time, 'HH:mm')}-${slot.type}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSlotClick(slot)}
                      className="cursor-pointer"
                    >
                      {slot.booked ? (
                        <div className="p-3 rounded-lg bg-white/5 border-l-4 border-gray-500 hover:bg-white/10">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-400">{format(slot.time, 'HH:mm')}</span>
                            <Badge variant="secondary" className="capitalize bg-gray-600/50 text-gray-300">{slot.booked.status}</Badge>
                          </div>
                          <p className="text-sm font-medium text-white mt-1">{getPatientForAppointment(slot.booked)?.name || 'Paciente'}</p>
                          <p className="text-xs text-gray-400">{slot.booked.consultation_type}</p>
                        </div>
                      ) : (
                         <div
                          className={`p-3 rounded-lg bg-white/10 border-l-4 hover:bg-white/20 transition-colors ${details.borderColor}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-white">{format(slot.time, 'HH:mm')}</span>
                            <Badge className={`${details.color} text-white`}>Disponível</Badge>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 flex items-center">
                            {slot.type === appointmentTypes.CIRURGIA.label && <Scissors className="w-4 h-4 mr-2 text-red-400" />}
                            {slot.type}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )
                }) : (
                  <div className="text-center text-gray-400 pt-10">
                    <p>Nenhum horário disponível ou definido para este dia.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      
      <AppointmentDetailsDialog 
        open={showDetails}
        onOpenChange={setShowDetails}
        appointment={selectedAppointment}
        patient={selectedAppointment ? getPatientForAppointment(selectedAppointment) : null}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />
    </>
  );
};

export default CalendarView;
