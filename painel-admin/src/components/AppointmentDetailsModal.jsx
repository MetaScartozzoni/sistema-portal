import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { Calendar, Clock, User, Stethoscope, Users, FileText, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AppointmentDetailsModal = ({ appointment, isOpen, onClose }) => {
  const { users } = useData();

  if (!appointment) return null;

  const professional = users.find(u => u.id === appointment.professionalId);
  const participants = appointment.participantIds?.map(id => users.find(u => u.id === id)).filter(Boolean) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">{appointment.type}: {appointment.reason}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Detalhes do agendamento.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="font-medium">{format(new Date(`${appointment.date}T00:00:00`), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-medium">{appointment.time}</span>
          </div>
          <div className="border-t border-white/10 my-4"></div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2"><Stethoscope className="w-5 h-5 text-green-400" /> Profissional</h4>
            {professional && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={professional.avatar} alt={professional.name} />
                  <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{professional.name}</p>
                  <p className="text-sm text-gray-400">{professional.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> Participantes</h4>
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={p.avatar} alt={p.name} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-400">{p.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {appointment.justification && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg flex items-center gap-2"><Info className="w-5 h-5 text-yellow-400" /> Justificativa</h4>
              <p className="text-sm bg-white/5 p-3 rounded-md">{appointment.justification}</p>
            </div>
          )}

          {appointment.files && appointment.files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> Arquivos Anexados</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {appointment.files.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;