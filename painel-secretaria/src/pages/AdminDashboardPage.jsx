
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { appointmentTypes } from '@/lib/schedulingConfig';

const daysOfWeek = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
];

const eventTypes = Object.values(appointmentTypes).map(t => t.label);

const AdminDashboardPage = () => {
  const { scheduleConfig, loading, addRule, deleteRule, tableExists } = useContext(ScheduleConfigContext);
  const { toast } = useToast();
  const [newRule, setNewRule] = useState({
    doctor_id: 'doc1',
    day_of_week: 1,
    event_type: appointmentTypes.PRIMEIRA_CONSULTA.label,
    start_time: '09:00',
    end_time: '17:00',
    is_biweekly: false,
    is_hidden: false,
  });

  const handleInputChange = (field, value) => {
    setNewRule(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRule = () => {
    if (!newRule.event_type || !newRule.start_time || !newRule.end_time) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }
    addRule(newRule);
    setNewRule({
      doctor_id: 'doc1',
      day_of_week: 1,
      event_type: appointmentTypes.PRIMEIRA_CONSULTA.label,
      start_time: '09:00',
      end_time: '17:00',
      is_biweekly: false,
      is_hidden: false,
    });
  };

  const handleDeleteRule = (id) => {
    deleteRule(id);
  };

  return (
    <>
      <Helmet>
        <title>Admin - Configuração da Agenda</title>
        <meta name="description" content="Configure os dias e horários de atendimento da clínica." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Configuração da Agenda</h1>

          {!tableExists ? (
              <Card className="bg-yellow-900/30 border-yellow-500 text-yellow-200 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center"><AlertTriangle className="w-5 h-5 mr-3"/> Ação Necessária</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>A tabela <strong>schedule_rules</strong> não foi encontrada em seu banco de dados Supabase.</p>
                  <p className="mt-2">Por favor, crie esta tabela no seu painel do Supabase para habilitar a configuração da agenda.</p>
                </CardContent>
              </Card>
          ) : (
            <Card className="bg-white/10 border-white/20 text-white mb-8">
              <CardHeader>
                <CardTitle>Adicionar Nova Regra</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Dia da Semana</Label>
                  <Select value={String(newRule.day_of_week)} onValueChange={v => handleInputChange('day_of_week', parseInt(v))}>
                    <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-white/20">
                      {daysOfWeek.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Tipo de Evento</Label>
                  <Select value={newRule.event_type} onValueChange={v => handleInputChange('event_type', v)}>
                    <SelectTrigger className="bg-white/10 border-white/20"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-white/20">
                      {eventTypes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Hora de Início</Label>
                  <Input type="time" value={newRule.start_time} onChange={e => handleInputChange('start_time', e.target.value)} className="bg-white/10 border-white/20" />
                </div>
                <div>
                  <Label className="text-gray-300">Hora de Fim</Label>
                  <Input type="time" value={newRule.end_time} onChange={e => handleInputChange('end_time', e.target.value)} className="bg-white/10 border-white/20" />
                </div>
                <div className="flex items-end space-x-4 col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 pt-6">
                      <Checkbox id="is_biweekly" checked={newRule.is_biweekly} onCheckedChange={c => handleInputChange('is_biweekly', c)} />
                      <Label htmlFor="is_biweekly" className="text-gray-300">Quinzenal</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                      <Checkbox id="is_hidden" checked={newRule.is_hidden} onCheckedChange={c => handleInputChange('is_hidden', c)} />
                      <Label htmlFor="is_hidden" className="text-gray-300">Oculto</Label>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddRule} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}


          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle>Regras Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <p>Carregando...</p> : (
                <div className="space-y-2">
                  {scheduleConfig.sort((a,b) => a.day_of_week - b.day_of_week).map(rule => (
                    <div key={rule.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">{daysOfWeek.find(d => d.id === rule.day_of_week)?.name} - {rule.event_type}</p>
                        <p className="text-sm text-gray-300">{rule.start_time} - {rule.end_time} {rule.is_biweekly ? '(Quinzenal)' : ''} {rule.is_hidden ? '(Oculto)' : ''}</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteRule(rule.id)} disabled={!tableExists}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {scheduleConfig.length === 0 && !loading && (
                    <p className="text-gray-400 text-center py-4">
                      {tableExists ? "Nenhuma regra de agendamento definida." : "A tabela de regras precisa ser criada primeiro."}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
