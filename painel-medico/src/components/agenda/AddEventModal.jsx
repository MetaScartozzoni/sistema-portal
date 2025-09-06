import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { addAppointment, addSurgery, addPersonalEvent, getPatients, createWherebyMeeting } from '@/services/api';
import { mapRawPatient } from '@portal/shared';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Scissors, User as UserIcon, Calendar, Clock, Sun, Moon, Search, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddEventModal = ({ isOpen, onClose, selectedDate, onEventAdded }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [eventType, setEventType] = useState('pessoal');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [isTeleconsult, setIsTeleconsult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    const fetchPatientsList = async () => {
      if (eventType === 'consulta' || eventType === 'cirurgia') {
        try {
          const response = await getPatients(user.id);
          if (response.success) {
            const normalized = (response.data || []).map(mapRawPatient);
            setPatients(normalized);
            setFilteredPatients(normalized);
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro ao buscar pacientes",
            description: "Não foi possível carregar a lista de pacientes."
          });
        }
      }
    };
    if (isOpen) {
      fetchPatientsList();
    }
  }, [eventType, isOpen, user, toast]);

  useEffect(() => {
    if (patientSearch === '') {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(p =>
          p.full_name.toLowerCase().includes(patientSearch.toLowerCase())
        )
      );
    }
  }, [patientSearch, patients]);

  const resetForm = () => {
    setTitle('');
    setTime('09:00');
    setNotes('');
    setEventType('pessoal');
    setSelectedPatientId('');
    setPatientSearch('');
    setIsTeleconsult(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time || (eventType === 'pessoal' && !title) || (eventType !== 'pessoal' && !selectedPatientId)) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos necessários.',
      });
      return;
    }

    if (!user) {
      toast({ variant: 'destructive', title: 'Erro de autenticação' });
      return;
    }

    setIsSubmitting(true);
    
    const [hours, minutes] = time.split(':').map(Number);
    const eventDateTime = setSeconds(setMinutes(setHours(selectedDate, hours), minutes), 0);

    let wherebyLink = null;
    if (isTeleconsult) {
      try {
        const meetingResponse = await createWherebyMeeting({
          endDate: new Date(eventDateTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour meeting
        }, user.token);
        if (meetingResponse.success) {
          wherebyLink = meetingResponse.data.roomUrl;
        } else {
          throw new Error(meetingResponse.message || 'Falha ao criar sala de teleconsulta.');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro na Teleconsulta', description: error.message });
        setIsSubmitting(false);
        return;
      }
    }

    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    const eventData = {
      doctor_id: user.id,
      appointment_time: eventDateTime.toISOString(),
      notes: notes,
      whereby_link: wherebyLink,
    };

    try {
      switch (eventType) {
        case 'consulta':
          await addAppointment({
            ...eventData,
            patient_id: selectedPatientId,
            visit_type: 'consulta',
            title: `Consulta com ${selectedPatient?.full_name}`
          });
          break;
        case 'cirurgia':
          await addSurgery({
            ...eventData,
            patient_id: selectedPatientId,
            visit_type: 'cirurgia',
            title: `Cirurgia de ${selectedPatient?.full_name}`
          });
          break;
        case 'pessoal':
        default:
          await addPersonalEvent({
            ...eventData,
            title: title,
            visit_type: 'pessoal',
          });
          break;
      }

      toast({
        title: 'Sucesso!',
        description: 'Seu compromisso foi adicionado com sucesso.',
        className: 'bg-green-600 text-white',
      });
      onEventAdded();
      handleClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar evento',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderPatientSelector = () => (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        <Input 
          placeholder="Buscar paciente..."
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          className="pl-9 mb-2"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="patient" className="text-right">Paciente</Label>
        <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione um paciente" />
          </SelectTrigger>
          <SelectContent>
            {filteredPatients.length > 0 ? filteredPatients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>{patient.full_name}</SelectItem>
            )) : <div className="p-4 text-sm text-slate-400 text-center">Nenhum paciente encontrado.</div>}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Adicionar Compromisso</DialogTitle>
          <DialogDescription>Selecione o tipo de compromisso e preencha os detalhes.</DialogDescription>
        </DialogHeader>

        <Tabs value={eventType} onValueChange={setEventType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pessoal"><UserIcon className="w-4 h-4 mr-2"/> Pessoal</TabsTrigger>
            <TabsTrigger value="consulta"><Stethoscope className="w-4 h-4 mr-2"/> Consulta</TabsTrigger>
            <TabsTrigger value="cirurgia"><Scissors className="w-4 h-4 mr-2"/> Cirurgia</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <div className="py-4 space-y-4">
              <TabsContent value="pessoal" className="space-y-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Título</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Ex: Reunião de equipe"/>
                 </div>
              </TabsContent>
              <TabsContent value="consulta" className="space-y-4">
                {renderPatientSelector()}
              </TabsContent>
              <TabsContent value="cirurgia" className="space-y-4">
                {renderPatientSelector()}
              </TabsContent>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Data</Label>
                <div className="col-span-3 flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{format(selectedDate, 'dd/MM/yyyy')}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Horário</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-2"/>
                <div className="col-span-1 flex gap-1">
                    <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => setTime('09:00')}><Sun className="w-4 h-4"/></Button>
                    <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => setTime('14:00')}><Moon className="w-4 h-4"/></Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                 <Label htmlFor="notes" className="text-right pt-2">Observações</Label>
                 <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Adicione notas ou detalhes..."/>
              </div>

              {eventType === 'consulta' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-start-2 col-span-3 flex items-center space-x-2">
                    <Checkbox id="teleconsult" checked={isTeleconsult} onCheckedChange={setIsTeleconsult} />
                    <Label htmlFor="teleconsult" className="flex items-center gap-2 cursor-pointer">
                      <Video className="w-4 h-4 text-blue-400" />
                      Agendar teleconsulta
                    </Label>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Salvando...' : 'Salvar Compromisso'}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;