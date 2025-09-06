
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const NewContactDialog = ({ open, onOpenChange, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contact_origin: '',
    contact_reason: '',
    secretary_notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.contact_origin || !formData.contact_reason) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, telefone, origem e motivo do contato.",
      });
      return;
    }
    onSubmit(formData);
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
          <h3 className="text-xl font-semibold text-white mb-6">Registrar Novo Contato</h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Nome do Contato</Label>
              <Input required value={formData.name} onChange={e => handleChange('name', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Digite o nome do contato" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Email (Opcional)</Label>
                <Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="email@exemplo.com" />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Telefone</Label>
                <Input required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Origem do Contato</Label>
                <Select required onValueChange={(value) => handleChange('contact_origin', value)} value={formData.contact_origin}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione a origem" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Mídias Sociais">Mídias Sociais</SelectItem>
                    <SelectItem value="Campanha">Campanha</SelectItem>
                    <SelectItem value="Site">Site</SelectItem>
                    <SelectItem value="Chatbot">Chatbot</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Motivo do Contato</Label>
                <Select required onValueChange={(value) => handleChange('contact_reason', value)} value={formData.contact_reason}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-white/20">
                    <SelectItem value="Agendamento">Agendamento</SelectItem>
                    <SelectItem value="Dúvidas Gerais">Dúvidas Gerais</SelectItem>
                    <SelectItem value="Orçamentos e Valores">Orçamentos e Valores</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Observações Iniciais</Label>
              <Textarea value={formData.secretary_notes} onChange={e => handleChange('secretary_notes', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Detalhes sobre o primeiro contato..." />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">Registrar Contato</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default NewContactDialog;
