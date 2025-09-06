import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Save, FolderCog as CalendarCog, Clock, User, Plus, Trash2, Palette, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const CalendarSettings = () => {
  const { calendarSettings, updateCalendarSettings, users } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(calendarSettings)));

  const professionals = users.filter(u => u.role === 'medico');

  const handleSave = (section) => {
    updateCalendarSettings(formData);
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  const handleGeneralChange = (field, value) => {
    setFormData(prev => ({ ...prev, general: { ...prev.general, [field]: value } }));
  };
  
  const handleClinicWorkingHoursChange = (dayIndex, field, value) => {
    const newHours = [...formData.general.clinicWorkingHours];
    newHours[dayIndex][field] = value;
    handleGeneralChange('clinicWorkingHours', newHours);
  };

  const handleAppointmentTypeChange = (index, field, value) => {
    const newTypes = [...formData.appointmentTypes];
    newTypes[index][field] = value;
    setFormData(prev => ({ ...prev, appointmentTypes: newTypes }));
  };

  const handleWorkingHoursChange = (profIndex, dayIndex, field, value) => {
    const newHours = [...formData.workingHours];
    newHours[profIndex].days[dayIndex][field] = value;
    setFormData(prev => ({ ...prev, workingHours: newHours }));
  };

  const handleAddItem = (section) => {
    toast({
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const handleRemoveItem = (section, index) => {
    toast({
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Configurações da Agenda - Portal Admin</title>
        <meta name="description" content="Configure tipos de consulta, horários de trabalho e regras da agenda." />
      </Helmet>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações da Agenda</h1>
          <p className="text-gray-400">Gerencie os parâmetros e regras da agenda central.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger value="general" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <CalendarCog className="w-4 h-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="clinicHours" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Building className="w-4 h-4 mr-2" />
                Horário da Clínica
              </TabsTrigger>
              <TabsTrigger value="appointmentTypes" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Clock className="w-4 h-4 mr-2" />
                Tipos de Consulta
              </TabsTrigger>
              <TabsTrigger value="workingHours" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <User className="w-4 h-4 mr-2" />
                Horários Individuais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Regras Gerais da Agenda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="slotInterval" className="text-white">Intervalo de Slots (minutos)</Label>
                      <Input type="number" id="slotInterval" value={formData.general?.slotInterval || ''} onChange={e => handleGeneralChange('slotInterval', parseInt(e.target.value))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowBookingInAdvance" className="text-white">Antecedência Máx. (dias)</Label>
                      <Input type="number" id="allowBookingInAdvance" value={formData.general?.allowBookingInAdvance || ''} onChange={e => handleGeneralChange('allowBookingInAdvance', parseInt(e.target.value))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minNoticePeriod" className="text-white">Aviso Mínimo Cancel. (horas)</Label>
                      <Input type="number" id="minNoticePeriod" value={formData.general?.minNoticePeriod || ''} onChange={e => handleGeneralChange('minNoticePeriod', parseInt(e.target.value))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('regras gerais')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Regras Gerais
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clinicHours">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Horário de Funcionamento da Clínica</CardTitle>
                  <CardDescription className="text-gray-400">Define os horários globais de atendimento.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-3">
                    {formData.general?.clinicWorkingHours?.map((day, dayIndex) => (
                      <div key={day.day} className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 col-span-3 sm:col-span-1">
                          <Switch id={`clinic-active-${dayIndex}`} checked={day.active} onCheckedChange={checked => handleClinicWorkingHoursChange(dayIndex, 'active', checked)} />
                          <Label htmlFor={`clinic-active-${dayIndex}`} className="text-white font-medium">{day.day}</Label>
                        </div>
                        <Input type="time" value={day.start} onChange={e => handleClinicWorkingHoursChange(dayIndex, 'start', e.target.value)} disabled={!day.active} className="bg-white/10 border-white/20 text-white disabled:opacity-50" />
                        <Input type="time" value={day.end} onChange={e => handleClinicWorkingHoursChange(dayIndex, 'end', e.target.value)} disabled={!day.active} className="bg-white/10 border-white/20 text-white disabled:opacity-50" />
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleSave('horário da clínica')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Horário da Clínica
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointmentTypes">
              <Card className="glass-effect border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Tipos de Consulta</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleAddItem('appointmentTypes')} className="border-white/20 text-white hover:bg-white/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Tipo
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.appointmentTypes?.map((type, index) => (
                    <div key={type.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input value={type.name} onChange={e => handleAppointmentTypeChange(index, 'name', e.target.value)} placeholder="Nome do tipo" className="bg-white/10 border-white/20 text-white" />
                        <Input type="number" value={type.duration} onChange={e => handleAppointmentTypeChange(index, 'duration', parseInt(e.target.value))} placeholder="Duração (min)" className="bg-white/10 border-white/20 text-white" />
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`color-${index}`} className="text-white flex items-center gap-2"><Palette className="w-4 h-4" /> Cor:</Label>
                          <Input id={`color-${index}`} type="color" value={type.color} onChange={e => handleAppointmentTypeChange(index, 'color', e.target.value)} className="bg-transparent border-none w-12 h-8 p-1" />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('appointmentTypes', index)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => handleSave('tipos de consulta')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Tipos de Consulta
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workingHours">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Horários de Trabalho por Profissional</CardTitle>
                  <CardDescription className="text-gray-400">Defina exceções ou horários específicos para cada profissional.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.workingHours?.map((prof, profIndex) => (
                    <div key={prof.professionalId} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold text-blue-400 mb-4">{prof.professionalName}</h3>
                      <div className="space-y-3">
                        {prof.days.map((day, dayIndex) => (
                          <div key={day.day} className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 col-span-3 sm:col-span-1">
                              <Switch id={`active-${profIndex}-${dayIndex}`} checked={day.active} onCheckedChange={checked => handleWorkingHoursChange(profIndex, dayIndex, 'active', checked)} />
                              <Label htmlFor={`active-${profIndex}-${dayIndex}`} className="text-white font-medium">{day.day}</Label>
                            </div>
                            <Input type="time" value={day.start} onChange={e => handleWorkingHoursChange(profIndex, dayIndex, 'start', e.target.value)} disabled={!day.active} className="bg-white/10 border-white/20 text-white disabled:opacity-50" />
                            <Input type="time" value={day.end} onChange={e => handleWorkingHoursChange(profIndex, dayIndex, 'end', e.target.value)} disabled={!day.active} className="bg-white/10 border-white/20 text-white disabled:opacity-50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => handleSave('horários de trabalho')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Horários de Trabalho
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default CalendarSettings;