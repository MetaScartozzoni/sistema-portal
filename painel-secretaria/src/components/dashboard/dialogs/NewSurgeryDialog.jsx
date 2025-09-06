
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, getDay, nextThursday } from 'date-fns';
import { Scissors, AlertTriangle, Send, CalendarPlus } from 'lucide-react';
import { appointmentTypes, getAppointmentTypeDetails } from '@/lib/schedulingConfig';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { getAvailableSlotsForDate } from '@/lib/calendarUtils';

const NewSurgeryDialog = ({ open, onOpenChange, onSubmit, patients, doctors, appointments, defaultValues }) => {
  const { toast } = useToast();
  const { scheduleConfig } = useContext(ScheduleConfigContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isNonStandardDate, setIsNonStandardDate] = useState(false);
  const [scheduleFirstReturn, setScheduleFirstReturn] = useState(true);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    surgery_type: '',
    hospital: '',
    date: '',
    time: '',
    duration: '',
    equipment: '',
    secretary_notes: '',
    terms_accepted: false,
  });

  const patientsReadyForSurgery = useMemo(() => 
    patients.filter(p => p.journey_status === 'PAGAMENTO_CONFIRMADO'),
    [patients]
  );
  
  const patientOptions = patientsReadyForSurgery.map(p => ({ 
    value: p.id, 
    label: p.name,
  }));

  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.full_name }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        resetForm();
        return;
    }

    setSelectedPatient(patient);
    
    const surgeryDetails = patient.surgery_details || {};
    const probableDate = patient.probable_surgery_date ? parseISO(patient.probable_surgery_date) : new Date();
    
    let suggestedDate = probableDate;
    if (getDay(probableDate) !== 4) { // 4 is Thursday
        suggestedDate = nextThursday(probableDate);
    }

    setFormData(prev => ({
      ...prev,
      patient_id: patientId,
      doctor_id: surgeryDetails.doctor_id || '',
      surgery_type: surgeryDetails.type || 'Tipo não definido',
      hospital: surgeryDetails.hospital || 'Hospital não definido',
      duration: String(surgeryDetails.duration || 120),
      equipment: surgeryDetails.equipment || '',
      date: format(suggestedDate, 'yyyy-MM-dd'),
      time: '',
      secretary_notes: '',
      terms_accepted: !!patient.terms_accepted,
    }));
  };

  const resetForm = () => {
    setFormData({
        patient_id: '',
        doctor_id: '',
        surgery_type: '',
        hospital: '',
        date: '',
        time: '',
        duration: '',
        equipment: '',
        secretary_notes: '',
        terms_accepted: false,
    });
    setSelectedPatient(null);
    setIsNonStandardDate(false);
    setScheduleFirstReturn(true);
  }

  useEffect(() => {
    if (defaultValues && open) {
      setFormData(prev => ({
        ...prev,
        patient_id: defaultValues.patient_id || '',
        date: defaultValues.date ? format(defaultValues.date, 'yyyy-MM-dd') : '',
        time: defaultValues.time || '',
      }));
      if (defaultValues.patient_id) {
        handlePatientSelect(defaultValues.patient_id);
      }
    } else if (!open) {
      resetForm();
    }
  }, [defaultValues, open, patients]);

  useEffect(() => {
    if(formData.date) {
        const dayOfWeek = getDay(parseISO(formData.date));
        const ruleExists = scheduleConfig.some(rule => rule.day_of_week === dayOfWeek && rule.event_type === appointmentTypes.CIRURGIA.label);
        setIsNonStandardDate(!ruleExists);
    } else {
        setIsNonStandardDate(false);
    }
  }, [formData.date, scheduleConfig]);


  const availableTimeSlots = useMemo(() => {
    if (!formData.date) return [];
    
    const surgeryType = appointmentTypes.CIRURGIA.label;
    const surgeryDuration = parseInt(formData.duration, 10);
    if (isNaN(surgeryDuration)) return [];

    const customSurgeryTypeDetails = {
        ...getAppointmentTypeDetails(surgeryType),
        duration: surgeryDuration,
    };

    const slots = getAvailableSlotsForDate(
        parseISO(formData.date), 
        appointments, 
        scheduleConfig,
        surgeryType,
        customSurgeryTypeDetails
    );
    
    return slots;
  }, [formData.date, formData.duration, appointments, scheduleConfig]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.doctor_id || !formData.date || !formData.time || !formData.surgery_type || !formData.hospital) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos da cirurgia.",
        });
        return;
    }

    if (!formData.terms_accepted) {
        toast({
            variant: "destructive",
            title: "Termos não aceitos",
            description: "O paciente precisa aceitar os termos de consentimento cirúrgico.",
        });
        return;
    }

    const start_time = new Date(`${formData.date}T${formData.time}`).toISOString();
    const durationMinutes = parseInt(formData.duration, 10);
    const end_time = new Date(new Date(start_time).getTime() + durationMinutes * 60000).toISOString();
    
    onSubmit({
      ...formData,
      consultation_type: `${appointmentTypes.CIRURGIA.label}: ${formData.surgery_type}`,
      start_time,
      end_time,
      schedule_post_op: scheduleFirstReturn,
    });
  };
  
  const handleRequestApproval = () => {
    if (!isNonStandardDate) return;
    toast({
        title: "Solicitação Enviada!",
        description: "Um recado foi enviado para aprovação da data da cirurgia."
    })
  }

  const handleSendTerms = () => {
    if (!selectedPatient) {
      toast({
        variant: "destructive",
        title: "Nenhum paciente selecionado",
        description: "Por favor, selecione um paciente para enviar os termos.",
      });
      return;
    }
    toast({
      title: "Envio Simulado",
      description: `Link do consentimento cirúrgico enviado para ${selectedPatient.name}.`,
    });
  };

  const patientHasAcceptedTerms = selectedPatient?.terms_accepted;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-white/20"
        >
          <div className="flex items-center text-white mb-6">
            <Scissors className="w-6 h-6 mr-3 text-red-400" />
            <h3 className="text-xl font-semibold">Agendar Cirurgia</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Paciente (Pagamento OK)</Label>
                 <Combobox
                  options={patientOptions}
                  value={formData.patient_id}
                  onChange={handlePatientSelect}
                  placeholder="Selecione um paciente..."
                  searchPlaceholder="Buscar paciente..."
                  emptyPlaceholder="Nenhum paciente apto."
                />
                {selectedPatient?.probable_surgery_date && (
                  <p className="text-xs text-gray-400 mt-2">Data provável da cirurgia: {format(parseISO(selectedPatient.probable_surgery_date), 'dd/MM/yyyy')}</p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Médico Responsável</Label>
                <Select value={formData.doctor_id} onValueChange={(value) => handleChange('doctor_id', value)} required disabled={!formData.patient_id}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white disabled:opacity-70 disabled:cursor-not-allowed"><SelectValue placeholder="Selecione um paciente primeiro" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                    {doctorOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Cirurgia</Label>
                  <Input required value={formData.surgery_type} onChange={e => handleChange('surgery_type', e.target.value)} className="bg-white/10 border-white/20 text-white disabled:opacity-70" placeholder="Selecione um paciente" disabled={!formData.patient_id} />
              </div>
              <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Hospital</Label>
                  <Input required value={formData.hospital} onChange={e => handleChange('hospital', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Nome do hospital" />
              </div>
            </div>
            
            <AnimatePresence>
            {isNonStandardDate && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 rounded-md text-sm flex items-center gap-3"
                >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>A data selecionada não tem uma regra de cirurgia. Será necessária aprovação.</span>
                </motion.div>
            )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Data da Cirurgia</Label>
                    <Input type="date" required value={formData.date} onChange={e => handleChange('date', e.target.value)} className="bg-white/10 border-white/20 text-white" disabled={!formData.patient_id} />
                </div>
                <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Duração (min)</Label>
                    <Input type="number" step="15" required value={formData.duration} onChange={e => handleChange('duration', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="ex: 180" disabled={!formData.patient_id} />
                </div>
                <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Horário de Início</Label>
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
              <Label className="block text-sm font-medium text-gray-300 mb-2">Observações e Solicitações</Label>
              <div className="relative">
                <Textarea value={formData.secretary_notes} onChange={e => handleChange('secretary_notes', e.target.value)} className="bg-white/10 border-white/20 text-white pr-28" placeholder="Caso precise de aprovação para a data, descreva o motivo aqui..."/>
                <Button 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white disabled:bg-gray-500 disabled:opacity-50"
                    onClick={handleRequestApproval}
                    disabled={!isNonStandardDate}
                >
                    <Send className="w-3 h-3 mr-2"/>
                    Aprovação
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms-surgery" 
                  checked={formData.terms_accepted} 
                  onCheckedChange={(checked) => handleChange('terms_accepted', checked)}
                  disabled={patientHasAcceptedTerms}
                />
                <Label htmlFor="terms-surgery" className="text-sm font-medium text-gray-300">
                  Paciente ciente e aceitou os termos de consentimento cirúrgico.
                </Label>
              </div>
              {!patientHasAcceptedTerms && (
                <Button type="button" variant="outline" size="sm" onClick={handleSendTerms} className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10">
                  <Send className="w-3 h-3 mr-2" />
                  Enviar Consentimento
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="schedule-return" 
                checked={scheduleFirstReturn} 
                onCheckedChange={setScheduleFirstReturn}
              />
              <Label htmlFor="schedule-return" className="text-sm font-medium text-gray-300 flex items-center">
                <CalendarPlus className="w-4 h-4 mr-2 text-emerald-400"/>
                Agendar 1º retorno agora
              </Label>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600">Agendar Cirurgia</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default NewSurgeryDialog;
