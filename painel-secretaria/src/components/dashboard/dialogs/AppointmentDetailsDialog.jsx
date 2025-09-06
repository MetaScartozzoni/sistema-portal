import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Clock, Stethoscope, Pencil, Trash2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentDetailsDialog = ({ open, onOpenChange, appointment, patient, onEdit, onCancel }) => {
  if (!open || !appointment || !patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Detalhes do Agendamento</h3>
          <Badge className="capitalize mb-6">{appointment.status}</Badge>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Paciente</p>
                <p className="font-medium text-white">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Tipo de Consulta</p>
                <p className="font-medium text-white">{appointment.consultation_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Data</p>
                <p className="font-medium text-white">{format(new Date(appointment.start_time), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Horário</p>
                <p className="font-medium text-white">{format(new Date(appointment.start_time), 'HH:mm')} - {format(new Date(appointment.end_time), 'HH:mm')}</p>
              </div>
            </div>
          </div>

          {appointment.secretary_notes && (
            <div className="mt-6 bg-blue-900/30 border-l-4 border-blue-500 text-blue-200 p-4 rounded-md">
                <div className="flex items-start">
                    <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold mb-1">Observações para o Médico</p>
                        <p className="text-sm text-blue-200/90 whitespace-pre-wrap">{appointment.secretary_notes}</p>
                    </div>
                </div>
            </div>
          )}

          <div className="flex space-x-3 mt-8">
            <Button onClick={onEdit} variant="outline" className="flex-1 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10">
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </Button>
            <Button onClick={onCancel} variant="outline" className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;