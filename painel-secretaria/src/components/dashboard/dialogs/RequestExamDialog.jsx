import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Stethoscope } from 'lucide-react';

const standardExams = [
  { id: 'hemograma', label: 'Hemograma Completo' },
  { id: 'coagulograma', label: 'Coagulograma' },
  { id: 'eletrocardiograma', label: 'Eletrocardiograma (ECG)' },
  { id: 'glicemia', label: 'Glicemia de Jejum' },
  { id: 'ureia_creatinina', label: 'Ureia e Creatinina' },
  { id: 'risco_cirurgico', label: 'Avaliação de Risco Cirúrgico' },
];

const RequestExamDialog = ({ open, onOpenChange, patient, onSubmit }) => {
  const [selectedExams, setSelectedExams] = useState([]);
  const [notes, setNotes] = useState('');

  const handleCheckboxChange = (examId, checked) => {
    if (checked) {
      setSelectedExams(prev => [...prev, examId]);
    } else {
      setSelectedExams(prev => prev.filter(id => id !== examId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedExams.length === 0) return;
    onSubmit({ exams: selectedExams, notes });
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
          <h3 className="text-xl font-semibold text-white mb-2">Solicitar Exames</h3>
          <p className="text-gray-400 mb-6">Para o paciente: {patient.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Exames Padrão</Label>
              <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-md">
                {standardExams.map(exam => (
                  <div key={exam.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exam-${exam.id}`}
                      onCheckedChange={(checked) => handleCheckboxChange(exam.label, checked)}
                    />
                    <Label htmlFor={`exam-${exam.id}`} className="text-white font-normal">{exam.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Observações Adicionais</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Exames específicos, urgência, ou outras informações para o médico..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" disabled={selectedExams.length === 0}>
                <Stethoscope className="w-4 h-4 mr-2" /> Enviar Solicitação
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default RequestExamDialog;