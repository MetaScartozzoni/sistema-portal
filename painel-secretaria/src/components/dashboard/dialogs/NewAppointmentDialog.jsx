
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { appointmentTypes, getAppointmentTypeDetails } from '@/lib/schedulingConfig';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { getAvailableSlotsForDate } from '@/lib/calendarUtils';

const NewAppointmentDialog = ({ open, onOpenChange, onSubmit, patients, doctors, appointments, onNewPatientClick, onCall, defaultValues }) => {
  const { toast } = useToast();
  const { scheduleConfig } = useContext(ScheduleConfigContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableTypesForDate, setAvailableTypesForDate] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    consultation_type: '',
    duration: '30',
    service_type: 'Presencial',
    date: '',
    time: '',
    patient_origin: '',
    patient_origin_details: '',
    terms_accepted: false,
    secretary_notes: '',
    video_call_link: '',
  });

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      consultation_type: '',
      duration: '30',
      service_type: 'Presencial',
      date: '',
      time: '',
      patient_origin: '',
      patient_origin_details: '',
      terms_accepted: false,
      secretary_notes: '',
      video_call_link: '',
    });
    setSelectedPatient(null);
    setAvailableTypesForDate([]);
  };
  
  useEffect(() => {
    if (defaultValues && open) {
      const initialDate = defaultValues.date ? format(defaultValues.date, 'yyyy-MM-dd') : '';
      setFormData(prev => ({
        ...prev,
        patient_id: defaultValues.patient_id || '',
        date: initialDate,
        time: defaultValues.time || '',
        consultation_type: defaultValues.type || '',
        service_type: defaultValues.type === 'Consulta Online' ? 'Online' : 'Presencial',
      }));
      if (defaultValues.patient_id) {
        const patient = patients.find(p => p.id === defaultValues.patient_id);
        if (patient) {
          setSelectedPatient(patient);
          handleChange('terms_accepted', !!patient.terms_accepted);
        }
      }
    } else if (!open) {
      resetForm();
    }
  }, [defaultValues, open, patients]);

  useEffect(() => {
    if (formData.date) {
      const selectedDate = parseISO(formData.date);
      const dayOfWeek = selectedDate.getUTCDay();
      const types = scheduleConfig
        .filter(rule => rule.event_type !== appointmentTypes.CIRURGIA.label && !rule.event_type.includes(appointmentTypes.RETORNO_POS_OPERATORIO.label) && !rule.is_hidden)
        .map(rule => rule.event_type);
      const uniqueTypes = [...new Set(types)];
      setAvailableTypesForDate(uniqueTypes);

      if (!uniqueTypes.includes(formData.consultation_type)) {
        handleChange('consultation_type', '');
        handleChange('time', '');
      }
    } else {
      setAvailableTypesForDate([]);
      handleChange('consultation_type', '');
      handleChange('time', '');
    }
  }, [formData.date, scheduleConfig]);

  const availableTimeSlots = useMemo(() => {
    if (!formData.date || !formData.consultation_type) {
      return [];
    }
    const selectedDate = parseISO(formData.date);
    return getAvailableSlotsForDate(selectedDate, appointments, scheduleConfig, formData.consultation_type);
  }, [formData.date, formData.consultation_type, appointments, scheduleConfig]);

  const patientOptions = patients.map(p => ({ value: p.id, label: p.name }));
  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.full_name }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (patientId) => {
    handleChange('patient_id', patientId);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      handleChange('terms_accepted', !!patient.terms_accepted);
    } else {
      setSelectedPatient(null);
      handleChange('terms_accepted', false);
    }
  };

  useEffect(() => {
    if (formData.service_type === 'Online' && !formData.video_call_link) {
      handleChange('video_call_link', `https://meet.jit.si/Consulta-${crypto.randomUUID().slice(0, 12)}`);
    } else if (formData.service_type === 'Presencial') {
      handleChange('video_call_link', '');
    }
  }, [formData.service_type]);

  const handleCall = (type) => {
    if (onCall && selectedPatient) {
      onCall(selectedPatient, type);
    }
  };

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
      description: `Link dos termos de privacidade enviado para ${selectedPatient.name}.`,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.doctor_id || !formData.date || !formData.time || !formData.consultation_type) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos principais do agendamento.",
        });
        return;
    }

    if (!formData.terms_accepted) {
        toast({
            variant: "destructive",
            title: "Termos não aceitos",
            description: "O paciente precisa aceitar os termos de privacidade para continuar.",
        });
        return;
    }

    const typeDetails = getAppointmentTypeDetails(formData.consultation_type);
    const duration = typeDetails.duration;
    const start_time = new Date(`${formData.date}T${formData.time}`).toISOString();
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000).toISOString();

    onSubmit({
      ...formData,
      start_time,
      end_time,
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
          <h3 className="text-xl font-semibold text-white mb-6">Novo Agendamento</h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Paciente</Label>
                 <Combobox
                  options={patientOptions}
                  value={formData.patient_id}
                  onChange={handlePatientChange}
                  placeholder="Selecione um paciente..."
                  searchPlaceholder="Buscar paciente..."
                  emptyPlaceholder="Nenhum paciente encontrado."
                  onAddNew={onNewPatientClick}
                />
                {selectedPatient && (
                  <div className="mt-2 flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                    <span className="text-sm text-gray-300 truncate pr-2">
                      Tel: {selectedPatient.phone || 'Não cadastrado'}
                    </span>
                    {selectedPatient.phone && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 border-white/20 text-white hover:bg-white/10">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-white/20 text-white">
                          <DropdownMenuItem onSelect={() => handleCall('phone')} className="cursor-pointer hover:!bg-white/10">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>Chamada de Voz</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleCall('whatsapp')} className="cursor-pointer hover:!bg-white/10">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            <span>WhatsApp</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Médico</Label>
                <Select onValueChange={(value) => handleChange('doctor_id', value)} required>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione um médico" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                    {doctorOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Data</Label>
                    <Input type="date" required value={formData.date} onChange={e => handleChange('date', e.target.value)} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Consulta</Label>
                  <Select onValueChange={(value) => { handleChange('consultation_type', value); handleChange('time', ''); }} value={formData.consultation_type} required disabled={!formData.date || availableTypesForDate.length === 0}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder={!formData.date ? "Selecione uma data" : "Selecione o tipo"} /></SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-white/20">
                          {availableTypesForDate.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Horário</Label>
              <Select onValueChange={(value) => handleChange('time', value)} value={formData.time} required disabled={!formData.consultation_type || availableTimeSlots.length === 0}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder={!formData.consultation_type ? "Selecione um tipo" : "Selecione um horário"} /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                      {availableTimeSlots.map(slot => (
                        <SelectItem key={format(slot.time, 'HH:mm')} value={format(slot.time, 'HH:mm')}>
                          {format(slot.time, 'HH:mm')}
                        </SelectItem>
                      ))}
                      {availableTimeSlots.length === 0 && formData.consultation_type && (
                        <div className="p-2 text-center text-sm text-gray-400">Nenhum horário disponível.</div>
                      )}
                  </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Atendimento</Label>
              <RadioGroup value={formData.service_type} onValueChange={(value) => handleChange('service_type', value)} className="flex space-x-4 pt-2 text-white">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Presencial" id="r-presencial" /><Label htmlFor="r-presencial">Presencial</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Online" id="r-online" /><Label htmlFor="r-online">Online</Label></div>
              </RadioGroup>
            </div>


            {formData.service_type === 'Online' && (
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Link da Consulta Online</Label>
                <Input value={formData.video_call_link} onChange={e => handleChange('video_call_link', e.target.value)} className="bg-white/10 border-white/20 text-white" />
              </div>
            )}
            
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Observações da Secretaria</Label>
              <Textarea value={formData.secretary_notes} onChange={e => handleChange('secretary_notes', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Informações importantes para o médico..."/>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.terms_accepted} 
                  onCheckedChange={(checked) => handleChange('terms_accepted', checked)}
                  disabled={patientHasAcceptedTerms}
                />
                <Label htmlFor="terms" className="text-sm font-medium text-gray-300">
                  Paciente aceitou os termos de privacidade e protocolos da clínica.
                </Label>
              </div>
              {!patientHasAcceptedTerms && (
                <Button type="button" variant="outline" size="sm" onClick={handleSendTerms} className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10">
                  <Send className="w-3 h-3 mr-2" />
                  Enviar para Paciente
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Criar Agendamento</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default NewAppointmentDialog;
