import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Save, Upload, File as FileIcon, X, PlusCircle, UserPlus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { getDay, parse } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AddAppointmentModal = ({ isOpen, onClose }) => {
  const { users, calendarSettings, addLog, schedules, setSchedules } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    participants: [],
    professionalId: '',
    appointmentType: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    justification: '',
    files: [],
  });
  const [isOutsideHours, setIsOutsideHours] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const professionals = useMemo(() => users.filter(u => u.role === 'medico'), [users]);
  const availableContacts = useMemo(() => users.filter(u => !formData.participants.find(p => p.id === u.id)), [users, formData.participants]);

  const onDrop = useCallback((acceptedFiles) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...acceptedFiles],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const removeFile = (fileToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file !== fileToRemove)
    }));
  };

  const addParticipant = (contact) => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, contact]
    }));
    setPopoverOpen(false);
  };

  const removeParticipant = (contactId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== contactId)
    }));
  };

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    if (field === 'date' || field === 'time') {
      checkWorkingHours(newFormData.date, newFormData.time);
    }
  };

  const checkWorkingHours = (dateStr, timeStr) => {
    if (!dateStr || !timeStr || !calendarSettings?.general?.clinicWorkingHours) {
      setIsOutsideHours(false);
      return;
    }

    const date = new Date(`${dateStr}T00:00:00`);
    const dayOfWeek = getDay(date);
    const clinicHours = calendarSettings.general.clinicWorkingHours[dayOfWeek];

    if (!clinicHours.active) {
      setIsOutsideHours(true);
      return;
    }

    const appointmentTime = parse(timeStr, 'HH:mm', new Date());
    const startTime = parse(clinicHours.start, 'HH:mm', new Date());
    const endTime = parse(clinicHours.end, 'HH:mm', new Date());

    if (appointmentTime < startTime || appointmentTime > endTime) {
      setIsOutsideHours(true);
    } else {
      setIsOutsideHours(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOutsideHours && !formData.justification) {
      toast({
        variant: 'destructive',
        title: 'Justificativa Necessária',
        description: 'Por favor, forneça uma justificativa para agendar fora do horário de expediente.',
      });
      return;
    }
    if (formData.participants.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Participante Necessário',
        description: 'Adicione pelo menos um participante ao agendamento.',
      });
      return;
    }

    const professional = professionals.find(p => p.id === formData.professionalId);
    const newSchedule = {
      id: Date.now().toString(),
      participantIds: formData.participants.map(p => p.id),
      patientName: formData.participants.map(p => p.name).join(', '),
      professionalId: formData.professionalId,
      doctorName: professional?.name || 'N/A',
      date: formData.date,
      time: formData.time,
      status: 'confirmed',
      type: formData.appointmentType,
      reason: formData.reason,
      justification: formData.justification,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
      files: formData.files.map(f => f.name),
    };

    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    localStorage.setItem('clinic_schedules', JSON.stringify(updatedSchedules));

    addLog({
      action: 'schedule.create.admin',
      user: 'Admin',
      description: `Novo agendamento criado para ${newSchedule.patientName} com ${professional?.name}.`,
      level: 'info',
    });

    toast({
      title: 'Agendamento Criado!',
      description: `O agendamento foi criado com sucesso.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Novo Agendamento</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes abaixo para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white">Participantes</Label>
            <div className="flex flex-wrap gap-2 items-center p-2 bg-white/5 border border-white/10 rounded-md min-h-[40px]">
              {formData.participants.map(p => (
                <div key={p.id} className="flex items-center gap-2 bg-blue-500/20 text-white text-sm px-2 py-1 rounded-full">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{p.name}</span>
                  <button type="button" onClick={() => removeParticipant(p.id)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-blue-400 hover:text-blue-300">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0 glass-effect border-white/10 text-white">
                  <Command>
                    <CommandInput placeholder="Buscar contato..." className="h-9 bg-transparent border-0 focus:ring-0 text-white" />
                    <CommandEmpty>Nenhum contato encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                      {availableContacts.map((contact) => (
                        <CommandItem
                          key={contact.id}
                          value={contact.name}
                          onSelect={() => addParticipant(contact)}
                          className="hover:bg-white/10"
                        >
                          {contact.name}
                          <span className="text-xs text-gray-400 ml-2">({contact.role})</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="professionalId" className="text-white">Com (Profissional)</Label>
            <Select onValueChange={(value) => handleInputChange('professionalId', value)} value={formData.professionalId}>
              <SelectTrigger id="professionalId" className="bg-white/5 border-white/10">
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/10 text-white">
                {professionals.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>{prof.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentType" className="text-white">Tipo de Agendamento</Label>
              <Select onValueChange={(value) => handleInputChange('appointmentType', value)} value={formData.appointmentType}>
                <SelectTrigger id="appointmentType" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10 text-white">
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="Reunião">Reunião</SelectItem>
                  <SelectItem value="Pessoal">Pessoal</SelectItem>
                  <SelectItem value="Bate-papo">Bate-papo</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-white">Motivo do Agendamento</Label>
              <Input id="reason" placeholder="Ex: Retorno, Reunião com Fornecedor, etc." value={formData.reason} onChange={(e) => handleInputChange('reason', e.target.value)} className="bg-white/5 border-white/10" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Data</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">Hora</Label>
              <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange('time', e.target.value)} className="bg-white/5 border-white/10" required />
            </div>
          </div>

          {isOutsideHours && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-300">
                <AlertTriangle className="h-4 w-4 !text-yellow-400" />
                <AlertTitle className="font-bold">Atenção: Fora do Expediente</AlertTitle>
                <AlertDescription>
                  O horário selecionado está fora do horário de funcionamento da clínica. Por favor, forneça uma justificativa.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 mt-4">
                <Label htmlFor="justification" className="text-white">Justificativa</Label>
                <Textarea id="justification" value={formData.justification} onChange={(e) => handleInputChange('justification', e.target.value)} className="bg-white/5 border-white/10" placeholder="Ex: Atendimento de emergência, solicitação especial..." required />
              </div>
            </motion.div>
          )}

          <div className="flex justify-between items-end">
            <div className="w-1/2 pr-2">
              <Label className="text-white">Anexar Arquivos</Label>
              <div {...getRootProps()} className={`mt-2 p-4 border-2 border-dashed rounded-lg cursor-pointer text-center ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'}`}>
                <input {...getInputProps()} />
                <Upload className="w-6 h-6 mx-auto text-gray-400" />
                <p className="text-sm text-gray-400 mt-1">Arraste ou clique para enviar</p>
              </div>
              {formData.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-white/10 p-1 rounded">
                      <div className="flex items-center gap-2 truncate">
                        <FileIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFile(file)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Agendamento
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentModal;