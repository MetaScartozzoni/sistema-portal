
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PauseCircle } from 'lucide-react';

const pauseReasons = [
  'Aguardando exames do paciente',
  'Paciente solicitou tempo para pensar',
  'Aguardando aprovação de convênio',
  'Aguardando documentação do paciente',
  'Aguardando confirmação de pagamento',
  'Outro (especificar nas notas)',
];

const PauseJourneyDialog = ({ open, onOpenChange, patient, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ reason, notes });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
            <PauseCircle className="w-5 h-5 mr-3 text-orange-400"/>
            Pausar Jornada do Paciente
          </h3>
          <p className="text-gray-400 mb-6">Para o paciente: {patient.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Motivo da Pausa</Label>
              <Select onValueChange={setReason} value={reason} required>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione um motivo..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-white/20">
                  {pauseReasons.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Notas Adicionais</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Descreva mais detalhes sobre a pausa, se necessário..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" disabled={!reason}>
                <PauseCircle className="w-4 h-4 mr-2" /> Confirmar Pausa
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default PauseJourneyDialog;
