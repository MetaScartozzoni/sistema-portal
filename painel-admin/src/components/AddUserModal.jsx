import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowRight, ArrowLeft, HeartPulse, Briefcase, Stethoscope, Loader2, Contact } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const Step1RoleSelection = ({ onSelectRole, selectedRole }) => {
  const roles = [
    { name: 'contact', label: 'Contato', icon: Contact },
    { name: 'secretaria', label: 'Funcionário', icon: Briefcase },
    { name: 'medico', label: 'Médico', icon: Stethoscope },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <DialogHeader>
        <DialogTitle className="gradient-text text-2xl">Novo Usuário</DialogTitle>
        <DialogDescription className="text-gray-400">
          Para começar, selecione o tipo de usuário que deseja cadastrar.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.name;
          return (
            <button
              key={role.name}
              onClick={() => onSelectRole(role.name)}
              className={`p-6 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10'
              }`}
            >
              <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
              <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{role.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

const Step2Form = ({ selectedRole, onSubmit, onBack, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf: '',
    specialty: '',
    crm: '',
    position: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ role: selectedRole, ...formData });
  };
  
  const getRoleLabel = () => {
    if (selectedRole === 'contact') return 'Contato';
    if (selectedRole === 'secretaria') return 'Funcionário';
    if (selectedRole === 'medico') return 'Médico';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader>
        <DialogTitle className="gradient-text text-2xl">Cadastro de {getRoleLabel()}</DialogTitle>
        <DialogDescription className="text-gray-400">
          Preencha as informações abaixo para criar o novo usuário.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome Completo</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Telefone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
        </div>
        
        {selectedRole !== 'contact' && (
          <div className="space-y-2">
              <Label htmlFor="cpf" className="text-white">CPF</Label>
              <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
        )}

        {selectedRole === 'medico' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-white">Especialidade</Label>
              <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm" className="text-white">CRM</Label>
              <Input id="crm" name="crm" value={formData.crm} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
        )}

        {selectedRole === 'secretaria' && (
          <div className="space-y-2">
            <Label htmlFor="position" className="text-white">Cargo</Label>
            <Input id="position" name="position" value={formData.position} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack} className="border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Cadastrar Usuário
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const AddUserModal = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addUser, addLog } = useData();
  const { toast } = useToast();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      setStep(2);
    } else {
      toast({
        title: "Seleção necessária",
        description: "Por favor, selecione um tipo de usuário para continuar.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const resetState = () => {
    setStep(1);
    setSelectedRole(null);
    onOpenChange(false);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addUser(formData);
      addLog({
        action: 'user.create',
        user: 'Administrador',
        description: `Novo usuário '${formData.name}' criado com a função '${formData.role}'.`,
        level: 'info'
      });
      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.name} foi adicionado ao sistema.`,
      });
      resetState();
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[650px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1">
              <Step1RoleSelection selectedRole={selectedRole} onSelectRole={handleSelectRole} />
              <div className="flex justify-end pt-8">
                <Button onClick={handleNext} disabled={!selectedRole} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2">
              <Step2Form selectedRole={selectedRole} onSubmit={handleSubmit} onBack={handleBack} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;