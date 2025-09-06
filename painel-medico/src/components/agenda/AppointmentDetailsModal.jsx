import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, User, Calendar, Clock, ExternalLink, Stethoscope, Scissors, StickyNote, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentDetailsModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  const handleJoinCall = () => {
    if (event.whereby_link) {
      window.open(event.whereby_link, '_blank');
    }
  };

  const getIcon = () => {
    switch(event.type) {
      case 'consulta': return <Stethoscope className="text-blue-400" />;
      case 'cirurgia': return <Scissors className="text-green-400" />;
      case 'pessoal': return <MapPin className="text-purple-400" />;
      default: return <Calendar className="text-slate-400" />;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getIcon()}
            Detalhes do Compromisso
          </DialogTitle>
          <DialogDescription className="text-slate-400 capitalize flex items-center gap-2">
            {event.type}
            {event.whereby_link && <span className="text-xs font-bold text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded-full flex items-center gap-1"><Video size={12}/>TELECONSULTA</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 mt-1" />
            <div>
              <p className="text-sm text-slate-400">{event.type === 'pessoal' ? 'Título' : 'Paciente'}</p>
              <p className="font-medium text-white">{event.title}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 mt-1" />
            <div>
              <p className="text-sm text-slate-400">Data</p>
              <p className="font-medium text-white capitalize">{format(event.date, "eeee, dd 'de' MMMM", { locale: ptBR })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 mt-1" />
            <div>
              <p className="text-sm text-slate-400">Horário</p>
              <p className="font-medium text-white">{format(event.date, 'HH:mm')}</p>
            </div>
          </div>
          {event.notes && (
             <div className="flex items-start gap-3">
                <StickyNote className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-400">Observações</p>
                  <p className="font-medium text-white whitespace-pre-wrap">{event.notes}</p>
                </div>
              </div>
          )}
          {event.whereby_link && (
            <div className="pt-4 border-t border-slate-700">
              <Button onClick={handleJoinCall} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <Video className="w-4 h-4 mr-2" />
                Entrar na Consulta
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;