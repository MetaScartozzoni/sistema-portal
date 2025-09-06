
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Briefcase as BriefcaseMedical, AlertTriangle } from 'lucide-react';
import { appointmentTypes, getAppointmentTypeDetails } from '@/lib/schedulingConfig';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { getAvailableSlotsForDate, getNextPostOpReturnDate } from '@/lib/calendarUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const postOpStages = [
  { value: '1', label: '1º Retorno - Próxima Segunda-feira', isMandatoryPresential: true },
  { value: '2', label: '2º Retorno - 7 dias após o 1º', isMandatoryPresential: true },
  { value: '3', label: '3º Retorno - 7 dias após o 2º', isMandatoryPresential: true },
  { value: '4', label: '4º Retorno - 2 semanas após o 3º', isMandatoryPresential: false },
  { value: '5', label: '5º Retorno - 4-5 semanas após o 4º', isMandatoryPresential: false },
  { value: 'Alta', label: 'Retorno de Alta', isMandatoryPresential: false },
  { value: 'Extra', label: 'Retorno Extra', isMandatoryPresential: false },
];

const NewPostOpAppointmentDialog = ({ open, onOpenChange, onSubmit, patients, doctors, appointments, defaultValues }) => {
  const { toast } = useToast();
  const { scheduleConfig } = useContext(ScheduleConfigContext);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    consultation_type: appointmentTypes.RETORNO_POS_OPERATORIO.label,
    post_op_stage: '1',
    date: '',
    time: '',
    service_type: 'Presencial',
    secretary_notes: '',
  });

  const surgeryAppointment = useMemo(() => {
    if (!defaultValues?.patient_id) return null;
    return defaultValues.surgeryAppointment || appointments
      .filter(app => app.patient_id === defaultValues.patient_id && app.consultation_type.startsWith(appointmentTypes.CIRURGIA.label))
      .sort((a,b) => new Date(b.start_time) - new Date(a.start_time))[0];
  }, [defaultValues, appointments]);

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      consultation_type: appointmentTypes.RETORNO_POS_OPERATORIO.label,
      post_op_stage: '1',
      date: '',
      time: '',
      service_type: 'Presencial',
      secretary_notes: '',
    });
  };
  
  useEffect(() => {
    if (defaultValues && open) {
      const patientAppointments = appointments.filter(app => app.patient_id === defaultValues.patient_id);
      const postOpReturns = patientAppointments
        .filter(app => app.consultation_type.includes(appointmentTypes.RETORNO_POS_OPERATORIO.label))
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
      
      const lastReturnStageMatch = postOpReturns[0]?.consultation_type.match(/(\d+)º Retorno/);
      const lastReturnStage = lastReturnStageMatch ? parseInt(lastReturnStageMatch[1], 10) : 0;
      const nextStage = defaultValues.stage || String(lastReturnStage + 1);

      const surgeryDate = surgeryAppointment ? parseISO(surgeryAppointment.start_time) : null;
      const suggestedDate = getNextPostOpReturnDate(nextStage, surgeryDate, patientAppointments);

      setFormData(prev => ({
        ...prev,
        patient_id: defaultValues.patient_id || '',
        doctor_id: surgeryAppointment?.doctor_id || '',
        date: format(suggestedDate, 'yyyy-MM-dd'),
        time: '',
        post_op_stage: nextStage,
        service_type: 'Presencial',
      }));
    } else if (!open) {
      resetForm();
    }
  }, [defaultValues, open, surgeryAppointment, appointments]);

  const availableTimeSlots = useMemo(() => {
    if (!formData.date) return [];
    const selectedDate = parseISO(formData.date);
    return getAvailableSlotsForDate(selectedDate, appointments, scheduleConfig, formData.consultation_type);
  }, [formData.date, appointments, scheduleConfig, formData.consultation_type]);

  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.full_name }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStageChange = (stageValue) => {
    handleChange('post_op_stage', stageValue);
    
    if (surgeryAppointment) {
      const surgeryDate = parseISO(surgeryAppointment.start_time);
      const patientAppointments = appointments.filter(app => app.patient_id === formData.patient_id);
      const suggestedDate = getNextPostOpReturnDate(stageValue, surgeryDate, patientAppointments);
      handleChange('date', format(suggestedDate, 'yyyy-MM-dd'));
      handleChange('time', '');
    }

    const selectedStage = postOpStages.find(s => s.value === stageValue);
    if(selectedStage?.isMandatoryPresential) {
        handleChange('service_type', 'Presencial');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.doctor_id || !formData.date || !formData.time) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos do agendamento.",
        });
        return;
    }

    const typeDetails = getAppointmentTypeDetails(formData.consultation_type);
    const duration = typeDetails.duration;
    const start_time = new Date(`${formData.date}T${formData.time}`).toISOString();
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000).toISOString();
    
    const stageLabel = postOpStages.find(s => s.value === formData.post_op_stage)?.label || 'Retorno';

    onSubmit({
      ...formData,
      consultation_type: `${formData.consultation_type} - ${stageLabel} (${formData.service_type})`,
      start_time,
      end_time,
    });
  };
  
  const patient = patients.find(p => p.id === formData.patient_id);
  const selectedStageDetails = postOpStages.find(s => s.value === formData.post_op_stage);
  const isBreakingProtocol = selectedStageDetails?.isMandatoryPresential && formData.service_type === 'Online';

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-xl border border-white/20"
        >
          <div className="flex items-center text-white mb-6">
            <BriefcaseMedical className="w-6 h-6 mr-3 text-emerald-400" />
            <h3 className="text-xl font-semibold">Agendar Retorno Pós-Operatório</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="p-3 bg-white/5 rounded-md">
                <p className="text-white font-semibold">{patient?.name}</p>
                <p className="text-sm text-gray-400">
                    Cirurgia: {surgeryAppointment?.consultation_type || 'Não encontrada'} em {surgeryAppointment ? format(parseISO(surgeryAppointment.start_time), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Etapa do Retorno</Label>
                <Select onValueChange={handleStageChange} value={formData.post_op_stage} required>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione a etapa" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-white/20">
                        {postOpStages.map(stage => (
                          <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Médico</Label>
                <Select onValueChange={(value) => handleChange('doctor_id', value)} value={formData.doctor_id} required>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione um médico" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                    {doctorOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Data do Retorno</Label>
                    <Input type="date" required value={formData.date} onChange={e => handleChange('date', e.target.value)} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Horário</Label>
                  <Select onValueChange={(value) => handleChange('time', value)} value={formData.time} required disabled={!formData.date || availableTimeSlots.length === 0}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder={!formData.date ? "Selecione uma data" : "Selecione um horário"} /></SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-white/20">
                          {availableTimeSlots.map(slot => (
                            <SelectItem key={format(slot.time, 'HH:mm')} value={format(slot.time, 'HH:mm')}>
                              {format(slot.time, 'HH:mm')}
                            </SelectItem>
                          ))}
                          {availableTimeSlots.length === 0 && formData.date && (
                            <div className="p-2 text-center text-sm text-gray-400">Nenhum horário disponível.</div>
                          )}
                      </SelectContent>
                  </Select>
                </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Atendimento</Label>
              <RadioGroup value={formData.service_type} onValueChange={(value) => handleChange('service_type', value)} className="flex space-x-4 pt-2 text-white">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Presencial" id="r-presencial-postop" /><Label htmlFor="r-presencial-postop">Presencial</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Online" id="r-online-postop" /><Label htmlFor="r-online-postop">Online</Label></div>
              </RadioGroup>
              {isBreakingProtocol && (
                 <div className="mt-2 p-2 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 rounded-md text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Atenção: Protocolo recomenda retorno presencial nesta etapa.</span>
                </div>
              )}
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Observações</Label>
              <Textarea value={formData.secretary_notes} onChange={e => handleChange('secretary_notes', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Informações importantes para o médico..."/>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">Agendar Retorno</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default NewPostOpAppointmentDialog;
