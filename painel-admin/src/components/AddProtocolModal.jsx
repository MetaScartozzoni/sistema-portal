import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Send, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const AddProtocolModal = ({ open, onOpenChange, onAddProtocol }) => {
  const { users } = useData();
  const { toast } = useToast();
  const [protocolName, setProtocolName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }]);
  const [action, setAction] = useState({ type: 'notification', target: '' });

  const handleAddCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleSubmit = () => {
    if (!protocolName || !trigger || !action.target) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome, gatilho e alvo da ação.",
      });
      return;
    }

    const newProtocol = {
      id: `proto_${Date.now()}`,
      name: protocolName,
      trigger,
      conditions: conditions.filter(c => c.field && c.operator && c.value),
      action,
      enabled: true,
    };

    onAddProtocol(newProtocol);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setProtocolName('');
    setTrigger('');
    setConditions([{ field: '', operator: '', value: '' }]);
    setAction({ type: 'notification', target: '' });
  }

  const doctorRoles = users.filter(u => u.role === 'medico' || u.role === 'admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[650px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl">Novo Protocolo de Notificação</DialogTitle>
            <DialogDescription className="text-gray-400">Crie regras automatizadas para notificações internas.</DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="protocol-name">Nome do Protocolo</Label>
              <Input id="protocol-name" value={protocolName} onChange={e => setProtocolName(e.target.value)} placeholder="Ex: Alerta de Paciente Idoso" className="bg-white/5 border-white/10"/>
            </div>

            <div className="space-y-2">
              <Label>Gatilho (QUANDO)</Label>
              <Select onValueChange={setTrigger} value={trigger}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Selecione um evento..." /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="patient.created">Novo Paciente Cadastrado</SelectItem>
                  <SelectItem value="appointment.scheduled">Nova Consulta Agendada</SelectItem>
                  <SelectItem value="document.uploaded">Novo Documento Adicionado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Condições (SE)</Label>
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <Select value={condition.field} onValueChange={v => handleConditionChange(index, 'field', v)}>
                    <SelectTrigger className="w-1/3 bg-white/10 border-white/20"><SelectValue placeholder="Campo" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="age">Idade do Paciente</SelectItem>
                      <SelectItem value="specialty">Especialidade da Consulta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={condition.operator} onValueChange={v => handleConditionChange(index, 'operator', v)}>
                    <SelectTrigger className="w-1/4 bg-white/10 border-white/20"><SelectValue placeholder="Op." /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value=">">{'>'} (Maior que)</SelectItem>
                      <SelectItem value="<">{'<'} (Menor que)</SelectItem>
                      <SelectItem value="=">{'='} (Igual a)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={condition.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} placeholder="Valor" className="flex-1 bg-white/10 border-white/20" />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCondition(index)}><X className="w-4 h-4 text-red-400" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddCondition} className="border-dashed"><PlusCircle className="w-4 h-4 mr-2" />Adicionar Condição</Button>
            </div>

            <div className="space-y-2">
              <Label>Ação (ENTÃO)</Label>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                <span className="font-medium">Notificar</span>
                <Select value={action.target} onValueChange={v => setAction({ ...action, target: v })}>
                  <SelectTrigger className="flex-1 bg-white/10 border-white/20"><SelectValue placeholder="Selecione o alvo..." /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="tech_manager_medical">Responsável Técnico Médico</SelectItem>
                    {doctorRoles.map(doc => <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Protocolo
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProtocolModal;