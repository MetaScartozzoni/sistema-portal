
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Stethoscope, CheckCircle } from 'lucide-react';

const PublicPatientRegistrationPage = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    contact_reason: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.dob || !formData.contact_reason) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }
    
    if (!agreedToTerms) {
        toast({
            variant: "destructive",
            title: "Termos de Privacidade",
            description: "Você deve concordar com os termos de privacidade para continuar.",
        });
        return;
    }

    const initialLog = [{
      timestamp: new Date().toISOString(),
      user_id: null,
      action: "created",
      details: "Paciente cadastrado via formulário público."
    }];

    try {
      console.log("Simulando envio de dados (modo local):", { ...formData, logs: initialLog });

      setIsSubmitted(true);
      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Obrigado por se cadastrar. Entraremos em contato em breve.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar cadastro",
        description: "Ocorreu um erro simulado.",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Paciente - Clínica Médica</title>
        <meta name="description" content="Realize seu pré-cadastro em nossa clínica de forma rápida e segura." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Cadastro de Paciente</h1>
              <p className="text-gray-300 mt-2">Preencha o formulário abaixo para agilizar seu atendimento.</p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Obrigado!</h2>
                <p className="text-gray-300 mt-2">Seu cadastro foi recebido com sucesso. Nossa equipe entrará em contato em breve.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</Label>
                  <Input id="name" required value={formData.name} onChange={e => handleChange('name', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Seu nome completo" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={e => handleChange('email', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Telefone / WhatsApp</Label>
                    <Input id="phone" required value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-2">Data de Nascimento</Label>
                    <Input id="dob" type="date" required value={formData.dob} onChange={e => handleChange('dob', e.target.value)} className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">Como nos conheceu?</Label>
                    <Select required onValueChange={(value) => handleChange('contact_reason', value)} value={formData.contact_reason}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Selecione uma opção" /></SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-white/20">
                        <SelectItem value="Indicação">Indicação de amigo/familiar</SelectItem>
                        <SelectItem value="Mídias Sociais">Mídias Sociais (Instagram, Facebook)</SelectItem>
                        <SelectItem value="Busca Online">Busca Online (Google)</SelectItem>
                        <SelectItem value="Campanha">Campanha Publicitária</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Eu li e concordo com os{" "}
                      <Link to="/privacy-policy" target="_blank" className="font-semibold text-purple-400 hover:text-purple-300 underline">
                        Termos de Privacidade e LGPD
                      </Link>
                      .
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={!agreedToTerms} className="w-full text-lg py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    Enviar Cadastro
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PublicPatientRegistrationPage;
