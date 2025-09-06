import React, { useState, useEffect, useCallback } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch.jsx';
import { useApi } from '@/contexts/ApiContext';
import { Loader2, Search, Wand2, AlertTriangle, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

const AppointmentForm = ({ appointment, selectedDate, onSave, onClose }) => {
    const { searchPatients, getSuggestedTime, getContacts, convertContactToPatient, getAppointmentTypes } = useApi();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '54110e37-aa52-4159-a646-17ceadb617f4', // Dr. Marcio Scartozzoni's ID
        start_at: '',
        end_at: '',
        visit_type: '',
        status: 'agendado',
        reason: '',
        whereby_link: '',
        appointment_type_id: '',
        is_online: false,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPersonName, setSelectedPersonName] = useState('');
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [contactToConvert, setContactToConvert] = useState(null);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);

    const updateTimes = useCallback((startTimeStr, typeId) => {
        const typeInfo = appointmentTypes.find(t => t.id == typeId);
        const duration = typeInfo ? typeInfo.duration_minutes : 30;
        
        if (!startTimeStr || isNaN(new Date(startTimeStr))) {
            return;
        }

        const startDate = new Date(startTimeStr);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        
        setFormData(prev => ({
            ...prev,
            start_at: startDate.toISOString().slice(0, 16),
            end_at: endDate.toISOString(),
        }));
    }, [appointmentTypes]);

    useEffect(() => {
        const fetchTypes = async () => {
            setLoadingTypes(true);
            try {
                const types = await getAppointmentTypes();
                setAppointmentTypes(types || []);
                if (!appointment && types && types.length > 0) {
                   setFormData(prev => {
                       const firstType = types[0];
                       const initialDate = selectedDate;
                       const startTime = new Date(initialDate.setHours(9, 0, 0, 0));
                       const duration = firstType.duration_minutes || 30;
                       const endTime = new Date(startTime.getTime() + duration * 60000);

                       return {
                           ...prev,
                           appointment_type_id: firstType.id,
                           visit_type: firstType.visit_type,
                           is_online: firstType.is_online,
                           start_at: !isNaN(startTime) ? startTime.toISOString().slice(0, 16) : '',
                           end_at: !isNaN(endTime) ? endTime.toISOString() : '',
                       };
                   });
                }
            } finally {
                setLoadingTypes(false);
            }
        };
        fetchTypes();
    }, [getAppointmentTypes, appointment, selectedDate]);
    
    useEffect(() => {
        if (appointment && appointmentTypes.length > 0) {
            const typeInfo = appointmentTypes.find(t => t.id === appointment.appointment_type_id);
            const startTime = new Date(appointment.appointment_time || selectedDate);
            const endTime = new Date(appointment.end_at || new Date(startTime.getTime() + (typeInfo?.duration_minutes || 30) * 60000));

            setFormData({
                id: appointment.id,
                patient_id: appointment.patient?.id || '',
                doctor_id: appointment.doctor_id || '54110e37-aa52-4159-a646-17ceadb617f4',
                start_at: !isNaN(startTime) ? startTime.toISOString().slice(0, 16) : '',
                end_at: !isNaN(endTime) ? endTime.toISOString() : '',
                visit_type: typeInfo?.visit_type || '',
                status: appointment.status || 'agendado',
                reason: appointment.reason || '',
                whereby_link: appointment.whereby_link || '',
                appointment_type_id: appointment.appointment_type_id || '',
                is_online: typeInfo?.is_online || !!appointment.whereby_link,
            });
            
            if (appointment.patient) {
                setSelectedPersonName(appointment.patient.full_name);
                setSearchQuery(appointment.patient.full_name);
            }
        }
    }, [appointment, selectedDate, appointmentTypes]);

    const handleSearch = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const [patients, contacts] = await Promise.all([
                searchPatients(query),
                getContacts(query)
            ]);
            
            const patientResults = (patients || []).map(p => ({ ...p, type: 'patient' }));
            const contactResults = (contacts || []).filter(c => c.status !== 'converted').map(c => ({ ...c, type: 'contact' }));

            setSearchResults([...patientResults, ...contactResults]);
        } catch (error) {
        } finally {
            setLoadingSearch(false);
        }
    }, [searchPatients, getContacts]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery && searchQuery !== selectedPersonName) {
                handleSearch(searchQuery);
            }
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedPersonName, handleSearch]);

    const handleSelectPerson = (person) => {
        if (person.type === 'patient') {
            setFormData(prev => ({ ...prev, patient_id: person.id }));
            setSelectedPersonName(person.full_name);
            setSearchQuery(person.full_name);
            setSearchResults([]);
        } else {
            setContactToConvert(person);
        }
    };

    const handleConfirmConvert = async () => {
        if (!contactToConvert) return;
        try {
            const newPatient = await convertContactToPatient(contactToConvert.id);
            setFormData(prev => ({ ...prev, patient_id: newPatient.id }));
            setSelectedPersonName(newPatient.full_name);
            setSearchQuery(newPatient.full_name);
            setSearchResults([]);
        } finally {
            setContactToConvert(null);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: checked }));
             return;
        }

        if (name === 'appointment_type_id') {
            const selectedType = appointmentTypes.find(t => t.id == value);
            setFormData(prev => {
                const newFormData = { 
                    ...prev, 
                    appointment_type_id: value, 
                    visit_type: selectedType?.visit_type || '',
                    is_online: selectedType?.is_online || false
                };
                updateTimes(newFormData.start_at, value);
                return newFormData;
            });
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSuggestTime = async () => {
        if (!formData.appointment_type_id) {
            toast({ variant: 'destructive', title: 'Selecione um tipo de consulta primeiro.'});
            return;
        }
        setLoadingSuggestion(true);
        try {
            const selectedType = appointmentTypes.find(t => t.id == formData.appointment_type_id);
            const preferredDate = formData.start_at.split('T')[0];
            const suggestedTime = await getSuggestedTime(selectedType.visit_type, preferredDate, false, formData.doctor_id);
            if (suggestedTime) {
                updateTimes(suggestedTime, formData.appointment_type_id);
                toast({ title: "✨ Horário sugerido!", description: `Encontramos um horário para ${new Date(suggestedTime).toLocaleString('pt-BR')}` });
            } else {
                toast({ variant: "destructive", title: "Nenhum horário encontrado", description: "Tente outra data ou tipo de consulta." });
            }
        } finally {
            setLoadingSuggestion(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.patient_id) {
            toast({ variant: "destructive", title: "Paciente não selecionado", description: "Por favor, busque e selecione um paciente." });
            return;
        }
        const payload = {
            ...formData,
            start_at: new Date(formData.start_at).toISOString(),
        };
        onSave(payload);
    };

    if (loadingTypes) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{appointment ? 'Editar Consulta' : 'Nova Consulta'}</DialogTitle>
                    <DialogDescription>Preencha os detalhes abaixo para criar ou editar uma consulta.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-4">
                        <div className="md:col-span-2 relative">
                            <Label htmlFor="patient-search">Paciente ou Contato</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input 
                                    id="patient-search"
                                    placeholder="Buscar paciente ou contato..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                                {loadingSearch && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin" />}
                            </div>
                            {searchResults.length > 0 && (
                                <ul className="absolute z-10 w-full bg-slate-800 border border-white/20 rounded-lg mt-1 max-h-40 overflow-y-auto">
                                    {searchResults.map(p => (
                                        <li key={p.id} onClick={() => handleSelectPerson(p)} className="px-4 py-2 hover:bg-white/10 cursor-pointer flex justify-between items-center">
                                            <span>{p.full_name}</span>
                                            {p.type === 'contact' && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Contato</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="appointment_type_id">Tipo de Consulta</Label>
                            <select id="appointment_type_id" name="appointment_type_id" value={formData.appointment_type_id} onChange={handleChange} className="input-field w-full">
                                {appointmentTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.visit_type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" name="date" value={formData.start_at ? formData.start_at.split('T')[0] : ''} onChange={e => {
                                const date = e.target.value;
                                const time = formData.start_at ? formData.start_at.split('T')[1] : '09:00';
                                const newStartAt = `${date}T${time}`;
                                updateTimes(newStartAt, formData.appointment_type_id);
                            }} />
                        </div>
                        <div className="relative">
                            <Label htmlFor="start_time">Início</Label>
                            <Input id="start_time" type="time" name="start_time" value={formData.start_at ? formData.start_at.split('T')[1] : ''} onChange={e => {
                                const time = e.target.value;
                                const date = formData.start_at.split('T')[0];
                                const newStartAt = `${date}T${time}`;
                                updateTimes(newStartAt, formData.appointment_type_id);
                            }} />
                             <Button type="button" size="icon" variant="ghost" className="absolute right-0 bottom-0 h-10 w-10 text-blue-400 hover:text-blue-300" onClick={handleSuggestTime} disabled={loadingSuggestion} title="Sugerir próximo horário">
                                {loadingSuggestion ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="end_time">Fim</Label>
                            <Input id="end_time" type="time" name="end_time" value={formData.end_at ? new Date(formData.end_at).toISOString().slice(11, 16) : ''} readOnly disabled className="bg-slate-800/50" />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="reason">Motivo (Opcional)</Label>
                            <Input id="reason" name="reason" placeholder="Ex: Primeira avaliação, retorno..." value={formData.reason} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                            <Switch
                                id="is_online"
                                name="is_online"
                                checked={formData.is_online}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_online: checked }))}
                            />
                            <Label htmlFor="is_online" className="mb-0 flex items-center gap-2">
                                <Video className="w-4 h-4 text-blue-400" />
                                Consulta Online? (Gerar link de vídeo)
                            </Label>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 pr-4 border-t border-slate-700 mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" className="btn-primary" disabled={loadingSuggestion || !formData.patient_id}>
                        {loadingSuggestion ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                        Salvar Consulta
                    </Button>
                </DialogFooter>
            </form>

            <AlertDialog open={!!contactToConvert} onOpenChange={() => setContactToConvert(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="text-yellow-400 mr-2" />
                            Converter Contato em Paciente?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            "{contactToConvert?.full_name}" é um contato, mas ainda não é um paciente. Para agendar uma consulta, é necessário convertê-lo. Deseja fazer isso agora?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmConvert} className="btn-primary">Sim, Converter</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AppointmentForm;