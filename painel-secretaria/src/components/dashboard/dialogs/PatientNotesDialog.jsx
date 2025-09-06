import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { StickyNote } from 'lucide-react';

const PatientNotesDialog = ({ open, onOpenChange, patient }) => {
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (patient) {
      const savedNotes = localStorage.getItem(`patient_notes_${patient.id}`);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes('');
      }
    }
  }, [patient]);

  const handleSave = () => {
    if (patient) {
      localStorage.setItem(`patient_notes_${patient.id}`, notes);
      toast({
        title: 'Notas Salvas!',
        description: `As anotações para ${patient.name} foram salvas com sucesso.`,
      });
      onOpenChange(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <StickyNote className="w-5 h-5 mr-2 text-yellow-400" />
            Notas Rápidas: {patient.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Adicione lembretes ou informações importantes sobre este paciente. Estas notas são visíveis apenas para você.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Digite suas anotações aqui..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white min-h-[150px] focus:ring-purple-500"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">Salvar Notas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientNotesDialog;