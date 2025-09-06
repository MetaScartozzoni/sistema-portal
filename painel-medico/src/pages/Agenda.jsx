import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon, VideoIcon, PersonIcon, ReaderIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { getAppointmentsForMonth, getSurgeriesForMonth } from '@/services/api';
import { mergeAgendaLists } from '@portal/shared';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import AddEventModal from '@/components/agenda/AddEventModal';
import AppointmentDetailsModal from '@/components/agenda/AppointmentDetailsModal';

const Agenda = () => {
    const { user } = useAuthStore();
    const { toast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('monthly');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const firstDayOfScope = useMemo(() => viewMode === 'monthly' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 0 }), [viewMode, currentDate]);
    const lastDayOfScope = useMemo(() => viewMode === 'monthly' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 0 }), [viewMode, currentDate]);

    const fetchEvents = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const startDate = format(firstDayOfScope, 'yyyy-MM-dd');
            const endDate = format(lastDayOfScope, 'yyyy-MM-dd');

            const [appointmentsResponse, surgeriesResponse] = await Promise.all([
                getAppointmentsForMonth(user.id, startDate, endDate),
                getSurgeriesForMonth(user.id, startDate, endDate)
            ]);

            const appointments = appointmentsResponse?.data || [];
            const surgeries = surgeriesResponse?.data || [];

            const mappedEvents = mergeAgendaLists(appointments, surgeries);

            setEvents(mappedEvents);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao buscar eventos',
                description: error.message || 'Não foi possível carregar os dados da agenda.',
            });
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user, firstDayOfScope, lastDayOfScope, toast]);
    
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const days = useMemo(() => {
        return eachDayOfInterval({ start: firstDayOfScope, end: lastDayOfScope });
    }, [firstDayOfScope, lastDayOfScope]);

    const startingDayIndex = getDay(firstDayOfScope);

    const selectedDayEvents = useMemo(() => {
        return events
            .filter(event => isSameDay(event.date, selectedDate))
            .sort((a, b) => a.date - b.date);
    }, [events, selectedDate]);
    
    const onEventAdded = useCallback(async () => {
        await fetchEvents();
    }, [fetchEvents]);
    
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };

    const changeDate = (amount, unit) => {
        if (unit === 'month') {
            setCurrentDate(addMonths(currentDate, amount));
        } else if (unit === 'week') {
            setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7 * amount)));
        }
    };
    
    const navigateDate = (direction) => {
        const amount = direction === 'next' ? 1 : -1;
        if(viewMode === 'monthly') {
            changeDate(amount, 'month');
        } else {
            changeDate(amount, 'week');
        }
    }

    const renderCalendarGrid = () => (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                    {day}
                </div>
            ))}

            {viewMode === 'monthly' && Array.from({ length: startingDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
            ))}

            {days.map(day => {
                const dayEvents = events.filter(event => isSameDay(event.date, day));
                const hasConsultas = dayEvents.some(e => e.type === 'consulta');
                const hasCirurgias = dayEvents.some(e => e.type === 'cirurgia');
                const hasPessoal = dayEvents.some(e => e.type === 'pessoal');
                const hasTeleconsult = dayEvents.some(e => e.whereby_link);

                return (
                    <motion.div
                        key={day.toString()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "relative aspect-square p-2 flex flex-col justify-between rounded-lg cursor-pointer transition-all duration-300",
                            "bg-slate-800/50 shadow-md",
                            isSameDay(day, selectedDate) && "bg-blue-900/60 ring-2 ring-blue-500 shadow-blue-500/30",
                            !isSameDay(currentDate, day) && viewMode === 'monthly' && "opacity-50",
                        )}
                        onClick={() => setSelectedDate(day)}
                    >
                        <time
                            dateTime={format(day, 'yyyy-MM-dd')}
                            className={cn(
                                "text-sm font-bold self-end",
                                isToday(day) ? "text-blue-400" : "text-slate-200",
                                isSameDay(day, selectedDate) && "text-white"
                            )}
                        >
                            {format(day, 'd')}
                        </time>
                        <div className="flex justify-center items-center gap-1.5 h-4">
                            {hasConsultas && <div className="w-2 h-2 rounded-full bg-blue-500" title="Consulta"></div>}
                            {hasCirurgias && <div className="w-2 h-2 rounded-full bg-green-500" title="Cirurgia"></div>}
                            {hasPessoal && <div className="w-2 h-2 rounded-full bg-purple-500" title="Pessoal"></div>}
                            {hasTeleconsult && <VideoIcon className="w-3 h-3 text-teal-400" title="Teleconsulta"/>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>
    );

    return (
        <>
            <AddEventModal
                isOpen={isAddEventModalOpen}
                onClose={() => setIsAddEventModalOpen(false)}
                selectedDate={selectedDate}
                onEventAdded={onEventAdded}
            />
            <AppointmentDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                event={selectedEvent}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white capitalize">
                            {format(currentDate, viewMode === 'monthly' ? 'MMMM yyyy' : "'Semana de' dd 'de' MMMM", { locale: ptBR })}
                        </h1>
                        <p className="text-slate-400 mt-1">Visualize e gerencie seus compromissos.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}>Hoje</Button>
                        <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                         <div className="flex items-center ml-4 bg-slate-800 p-1 rounded-lg">
                            <Button size="sm" variant={viewMode === 'monthly' ? 'secondary' : 'ghost'} onClick={() => setViewMode('monthly')} className={cn(viewMode === 'monthly' && "bg-blue-600 hover:bg-blue-700")}>Mês</Button>
                            <Button size="sm" variant={viewMode === 'weekly' ? 'secondary' : 'ghost'} onClick={() => setViewMode('weekly')} className={cn(viewMode === 'weekly' && "bg-blue-600 hover:bg-blue-700")}>Semana</Button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 flex-col lg:flex-row">
                    <div className="flex-grow lg:w-2/3 glass-effect rounded-xl overflow-hidden">
                        {loading ? <div className="h-full flex items-center justify-center text-slate-300">Carregando agenda...</div> : renderCalendarGrid()}
                    </div>
                    <div className="lg:w-1/3">
                        <div className="glass-effect rounded-xl p-6 h-full min-h-[400px]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {format(selectedDate, "eeee, dd 'de' MMMM", { locale: ptBR })}
                                    </h3>
                                    {isToday(selectedDate) && <p className="text-sm text-blue-400">Hoje</p>}
                                </div>
                                <Button size="icon" variant="shine" onClick={() => setIsAddEventModalOpen(true)}>
                                    <PlusIcon className="w-5 h-5" />
                                </Button>
                            </div>
                            
                            <div className="mt-4 space-y-3 overflow-y-auto max-h-[32rem] pr-2">
                                {selectedDayEvents.length > 0 ? (
                                    selectedDayEvents.map(event => {
                                        const eventColor = event.type === 'consulta' ? 'var(--tw-color-blue-500)' : event.type === 'cirurgia' ? 'var(--tw-color-green-500)' : 'var(--tw-color-purple-500)';
                                        const EventIcon = event.type === 'consulta' ? PersonIcon : event.type === 'cirurgia' ? ReaderIcon : CalendarIcon;
                                        
                                        return (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition-colors duration-200 border-l-4 cursor-pointer"
                                                style={{ borderColor: eventColor }}
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        {event.whereby_link && <VideoIcon className="w-4 h-4 text-teal-400 flex-shrink-0"/>}
                                                        <div>
                                                            <p className="font-semibold text-white">{event.title}</p>
                                                            <p className="text-sm text-slate-300 flex items-center gap-2">
                                                                <EventIcon className="w-3 h-3" style={{ color: eventColor }}/>
                                                                {format(new Date(event.date), "HH:mm")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {event.whereby_link && (
                                                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); window.open(event.whereby_link, '_blank'); }}>
                                                            <VideoIcon className="w-4 h-4 mr-2"/> Entrar
                                                        </Button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-10">
                                        <CalendarIcon className="mx-auto text-slate-500 w-8 h-8"/>
                                        <p className="mt-2 text-slate-400">Nenhum evento para este dia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Agenda;