import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Send, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

const SendExternalMessageDialog = ({ open, onOpenChange, onSubmit, patients, appointments, defaultValues }) => {
  const { toast } = useToast();
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open && defaultValues?.patientId) {
      const selectedPatient = patients.find(p => p.id === defaultValues.patientId);
      setPatient(selectedPatient || null);
    } else if (!open) {
      setPatient(null);
      setMessage('');
    }
  }, [open, defaultValues, patients]);

  const getUpcomingAppointment = () => {
    if (!patient) return null;
    return appointments
      .filter(a => a.patient_id === patient.id && new Date(a.start_time) > new Date())
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];
  };

  const templates = [
    {
      id: 'appointment_reminder',
      label: 'Lembrete de Consulta',
      icon: MessageSquare,
      generate: () => {
        const appointment = getUpcomingAppointment();
        if (!appointment) {
          toast({ variant: 'destructive', title: 'Nenhuma consulta futura encontrada.' });
          return '';
        }
        const date = format(new Date(appointment.start_time), "dd/MM/yyyy 'às' HH:mm");
        return `Olá, ${patient.name}. Lembrete da sua consulta em ${date}. Por favor, confirme sua presença.`;
      },
    },
    {
      id: 'online_consultation_link',
      label: 'Link da Consulta Online',
      icon: LinkIcon,
      generate: () => {
        const appointment = getUpcomingAppointment();
        if (!appointment || !appointment.video_call_link) {
          toast({ variant: 'destructive', title: 'Nenhuma consulta online futura com link encontrada.' });
          return '';
        }
        return `Olá, ${patient.name}. Sua consulta online está agendada. Acesse pelo link: ${appointment.video_call_link}`;
      },
    },
  ];

  const handleUseTemplate = (template) => {
    if (!patient) {
      toast({ variant: 'destructive', title: 'Selecione um paciente primeiro.' });
      return;
    }
    const generatedMessage = template.generate();
    if (generatedMessage) {
      setMessage(generatedMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !message) {
      toast({ variant: 'destructive', title: 'Paciente e mensagem são obrigatórios.' });
      return;
    }
    // Formato E.164 (ex: +5511999998888) - Simulação simples
    const to = `+55${patient.phone.replace(/\D/g, '')}`;
    onSubmit({ to, message });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Enviar Mensagem Externa (SMS/WhatsApp)</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Paciente</Label>
              <Select
                value={patient?.id || ''}
                onValueChange={(id) => setPatient(patients.find(p => p.id === id))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-white/20">
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Modelos Rápidos</Label>
              <div className="flex flex-wrap gap-2">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    <template.icon className="w-4 h-4 mr-2" />
                    {template.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</Label>
              <Textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Digite sua mensagem..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default SendExternalMessageDialog;