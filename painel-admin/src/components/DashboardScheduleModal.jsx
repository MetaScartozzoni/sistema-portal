import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, User, Stethoscope, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardScheduleModal = ({ isOpen, onClose, scheduleType }) => {
  const { schedules, users } = useData();
  const { toast } = useToast();

  const title = scheduleType === 'consultation' ? 'Consultas Agendadas' : 'Cirurgias Agendadas';
  const typeFilter = scheduleType === 'consultation' ? 'Consulta' : 'Cirurgia';

  const filteredSchedules = schedules
    .filter(s => s.type === typeFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleChecklistClick = (schedule) => {
    toast({
      title: "Checklist em breve!",
      description: `A funcionalidade de checklist para a cirurgia de ${schedule.patientName} será implementada em breve.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Lista de {typeFilter.toLowerCase()}s agendadas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="py-4 space-y-4">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map(schedule => {
                const professional = users.find(u => u.id === schedule.professionalId);
                const patient = users.find(u => schedule.participantIds.includes(u.id));
                return (
                  <div key={schedule.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                      <p className="font-bold text-lg text-white">{schedule.reason}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <User className="w-4 h-4" />
                        <span>{patient?.name || 'Paciente não encontrado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Stethoscope className="w-4 h-4" />
                        <span>{professional?.name || 'Profissional não encontrado'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(`${schedule.date}T00:00:00`), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{schedule.time}</span>
                        </div>
                      </div>
                    </div>
                    {scheduleType === 'surgery' && (
                      <Button 
                        onClick={() => handleChecklistClick(schedule)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Checklist
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">Nenhuma {typeFilter.toLowerCase()} agendada encontrada.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardScheduleModal;