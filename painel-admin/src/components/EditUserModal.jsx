import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Save, CalendarPlus as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';

const EditUserModal = ({ user, isOpen, onClose }) => {
  const { updateUser, addLog, roles } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        birthDate: user.birthDate ? new Date(user.birthDate) : null,
        admissionDate: user.admissionDate ? new Date(user.admissionDate) : null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleAvatarChange = (e) => {
    toast({ description: "🚧 Funcionalidade de upload de avatar em desenvolvimento!" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(user.id, {
      ...formData,
      birthDate: formData.birthDate?.toISOString(),
      admissionDate: formData.admissionDate?.toISOString(),
    });
    addLog({
      action: 'user.update',
      user: 'Administrador',
      description: `Perfil de ${formData.name} foi atualizado.`,
      level: 'info',
    });
    toast({
      title: 'Usuário Atualizado!',
      description: `O perfil de ${formData.name} foi atualizado com sucesso.`,
    });
    onClose();
  };

  if (!user) return null;

  const roleInfo = roles.find(r => r.name === user.role);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Editar Perfil de {user.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback>{formData.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar-upload" className="text-white">Foto de Perfil</Label>
              <div className="relative mt-2">
                <Input id="avatar-upload" type="file" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Button type="button" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2"/>
                    Trocar Foto
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome Completo</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Telefone</Label>
              <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-white">CPF</Label>
              <Input id="cpf" name="cpf" value={formData.cpf || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birthDate ? format(formData.birthDate, "PPP") : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-effect border-white/10 text-white">
                    <Calendar mode="single" selected={formData.birthDate} onSelect={(date) => handleDateChange('birthDate', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education" className="text-white">Escolaridade</Label>
                <Input id="education" name="education" value={formData.education || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
              </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">Endereço</Label>
            <Textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
          </div>

          {/* Role specific fields */}
          {user.role === 'medico' && (
            <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-blue-300">Informações do Médico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-white">Especialidade</Label>
                  <Input id="specialty" name="specialty" value={formData.specialty || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm" className="text-white">CRM</Label>
                  <Input id="crm" name="crm" value={formData.crm || ''} onChange={handleChange} className="bg-white/5 border-white/10" />
                </div>
              </div>
            </div>
          )}

          {(user.role === 'medico' || user.role === 'secretaria') && (
             <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-green-300">Informações de Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="admissionDate" className="text-white">Data de Admissão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.admissionDate ? format(formData.admissionDate, "PPP") : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 glass-effect border-white/10 text-white">
                        <Calendar mode="single" selected={formData.admissionDate} onSelect={(date) => handleDateChange('admissionDate', date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                 <div className="space-y-2">
                  <Label htmlFor="contractType" className="text-white">Tipo de Contrato</Label>
                  <Select onValueChange={(value) => handleSelectChange('contractType', value)} value={formData.contractType}>
                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="glass-effect border-white/10 text-white">
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="paymentDetails" className="text-white">Forma de Pagamento</Label>
                  <Input id="paymentDetails" name="paymentDetails" value={formData.paymentDetails || ''} onChange={handleChange} className="bg-white/5 border-white/10" placeholder="Ex: PIX, Transferência Bancária..."/>
                </div>
            </div>
          )}
          
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">Cancelar</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;