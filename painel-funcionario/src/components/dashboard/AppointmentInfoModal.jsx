import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, User, Phone, Mail, StickyNote } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const AppointmentInfoModal = ({ appointment, onClose }) => {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    toast({
        title: '🚧 Funcionalidade Desconectada',
        description: 'A conexão com o banco de dados foi removida.',
    });
    setTimeout(() => {
        setNewNote('');
        setSubmitting(false);
    }, 1000);
  };

  if (!appointment || !appointment.patient) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detalhes do Agendamento</DialogTitle>
        <DialogDescription>Informações do paciente e anotações internas.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-400" /> Informações do Paciente
          </h3>
          <p className="font-bold text-xl">{appointment.patient.full_name}</p>
          <p className="flex items-center text-gray-300">
            <Phone className="mr-2 h-4 w-4" />
            {appointment.patient.phone || 'Não informado'}
          </p>
          <p className="flex items-center text-gray-300">
            <Mail className="mr-2 h-4 w-4" />
            {appointment.patient.email || 'Não informado'}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center">
            <StickyNote className="mr-2 h-5 w-5 text-yellow-400" /> Anotações (Post-it)
          </h3>
          <ScrollArea className="h-40 w-full pr-4">
            <p className="text-sm text-gray-400 text-center pt-8">
              Nenhuma nota para este agendamento.
            </p>
          </ScrollArea>
        </div>
      </div>

      <form onSubmit={handleSubmitNote} className="space-y-4 pt-4 border-t border-white/10">
        <textarea
          className="input-field w-full h-20"
          placeholder="Escreva uma nova nota aqui..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={submitting}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="input-field w-full sm:w-1/2"
            disabled={submitting}
          >
            <option value="">Enviar para... (opcional)</option>
          </select>
          <Button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={submitting || !newNote.trim()}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Salvar Nota
          </Button>
        </div>
      </form>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </DialogFooter>
    </>
  );
};

export default AppointmentInfoModal;