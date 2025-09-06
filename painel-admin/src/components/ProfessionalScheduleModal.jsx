import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

const ProfessionalScheduleModal = ({ professional, isOpen, onClose }) => {
  const { calendarSettings, updateCalendarSettings, addLog } = useData();
  const { toast } = useToast();
  
  const professionalHours = calendarSettings?.workingHours?.find(wh => wh.professionalId === professional?.id);
  const [workingHours, setWorkingHours] = useState(professionalHours?.days || []);

  const handleDayToggle = (dayIndex) => {
    const updatedHours = [...workingHours];
    updatedHours[dayIndex].active = !updatedHours[dayIndex].active;
    setWorkingHours(updatedHours);
  };

  const handleTimeChange = (dayIndex, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[dayIndex][field] = value;
    setWorkingHours(updatedHours);
  };

  const handleSave = () => {
    const updatedSettings = {
      ...calendarSettings,
      workingHours: calendarSettings.workingHours.map(wh => 
        wh.professionalId === professional.id ? { ...wh, days: workingHours } : wh
      )
    };
    updateCalendarSettings(updatedSettings);
    addLog({
      action: 'schedule.professional.update',
      user: 'Admin',
      description: `Horários de trabalho de ${professional.name} atualizados.`,
      level: 'info',
    });
    toast({
      title: 'Horários Salvos!',
      description: `Os horários de trabalho de ${professional.name} foram atualizados.`,
    });
    onClose();
  };

  if (!professional) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Horários de {professional.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Gerencie os dias e horários de atendimento do profissional.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {workingHours.map((day, index) => (
            <div key={day.day} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-4">
                <Switch
                  checked={day.active}
                  onCheckedChange={() => handleDayToggle(index)}
                  id={`active-${day.day}`}
                />
                <Label htmlFor={`active-${day.day}`} className="w-20 text-base">{day.day}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={day.start}
                  onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                  disabled={!day.active}
                  className="bg-white/5 border-white/10 w-28"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={day.end}
                  onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                  disabled={!day.active}
                  className="bg-white/5 border-white/10 w-28"
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">Cancelar</Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalScheduleModal;