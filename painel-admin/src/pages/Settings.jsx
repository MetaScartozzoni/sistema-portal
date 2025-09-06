import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Save, Building, Bell, Globe, ShieldCheck, User, HeartPulse, Server, CheckCircle, XCircle, MessageSquare as MessageSquareQuote, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';

const Settings = () => {
  const { settings, updateSettings, addLog, updateProtocols } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const protocols = settings.notifications.protocols || [];

  const handleSave = (section) => {
    updateSettings(formData);
    addLog({
      action: `settings.update.${section}`,
      user: 'Admin',
      description: `Configurações de '${section}' foram atualizadas.`,
      level: 'info',
    });
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSwitchChange = (section, field, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
      }
    }));
  };
  
  const handleProtocolToggle = (protocolId) => {
    const updatedProtocols = protocols.map(p => 
      p.id === protocolId ? { ...p, enabled: !p.enabled } : p
    );
    updateProtocols(updatedProtocols);
  };


  const hasApiError = formData.system.apiStatus.some(api => api.status === 'error');

  return (
    <>
      <Helmet>
        <title>Configurações Gerais - Portal Admin Clínica</title>
        <meta name="description" content="Configure parâmetros globais do sistema da clínica, incluindo dados da empresa, horários de funcionamento e notificações." />
      </Helmet>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações Gerais</h1>
          <p className="text-gray-400">Gerencie configurações globais do sistema</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="clinic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/70 backdrop-blur-sm border border-white/10">
              <TabsTrigger value="clinic" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"><Building className="w-4 h-4 mr-2" />Clínica</TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"><Globe className="w-4 h-4 mr-2" />Sistema</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"><Bell className="w-4 h-4 mr-2" />Notificações</TabsTrigger>
            </TabsList>

            <TabsContent value="clinic">
              <Card className="glass-effect border-white/10">
                <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Building className="w-5 h-5" /><span>Dados da Clínica</span></CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="clinic-name" className="text-white">Nome da Clínica</Label><Input id="clinic-name" value={formData.general.clinicName} onChange={(e) => handleInputChange('general', 'clinicName', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                    <div className="space-y-2"><Label htmlFor="clinic-cnpj" className="text-white">CNPJ</Label><Input id="clinic-cnpj" value={formData.general.cnpj} onChange={(e) => handleInputChange('general', 'cnpj', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="clinic-address" className="text-white">Endereço</Label><Input id="clinic-address" value={formData.general.address} onChange={(e) => handleInputChange('general', 'address', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="clinic-phone" className="text-white">Telefone</Label><Input id="clinic-phone" value={formData.general.phone} onChange={(e) => handleInputChange('general', 'phone', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                    <div className="space-y-2"><Label htmlFor="clinic-email" className="text-white">Email</Label><Input id="clinic-email" type="email" value={formData.general.email} onChange={(e) => handleInputChange('general', 'email', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  </div>
                  <div className="border-t border-white/10 pt-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2"><ShieldCheck className="text-cyan-400"/>Responsáveis Técnicos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2"><Label htmlFor="tech-medical" className="text-white flex items-center gap-2"><HeartPulse className="w-4 h-4"/>Médico</Label><Input id="tech-medical" value={formData.general.technicalManagerMedical} onChange={(e) => handleInputChange('general', 'technicalManagerMedical', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                      <div className="space-y-2"><Label htmlFor="tech-nursing" className="text-white flex items-center gap-2"><User className="w-4 h-4"/>Enfermagem</Label><Input id="tech-nursing" value={formData.general.technicalManagerNursing} onChange={(e) => handleInputChange('general', 'technicalManagerNursing', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                      <div className="space-y-2"><Label htmlFor="tech-admin" className="text-white flex items-center gap-2"><Server className="w-4 h-4"/>Administrativo</Label><Input id="tech-admin" value={formData.general.technicalManagerAdmin} onChange={(e) => handleInputChange('general', 'technicalManagerAdmin', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                    </div>
                  </div>
                  <Button onClick={() => handleSave('clínica')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"><Save className="w-4 h-4 mr-2" />Salvar Dados da Clínica</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <Card className="glass-effect border-white/10">
                <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Globe className="w-5 h-5" /><span>Configurações do Sistema</span></CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {hasApiError && (
                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-red-300">
                      <XCircle className="h-4 w-4 !text-red-400" />
                      <AlertTitle>Alerta de Sistema</AlertTitle>
                      <AlertDescription>
                        Uma ou mais integrações de API estão com problemas. Verifique o painel de "Monitoramento de API" abaixo para mais detalhes.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="border-t border-white/10 pt-6">
                    <CardTitle className="text-lg text-white mb-4">Monitoramento de API (Fusíveis)</CardTitle>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {formData.system.apiStatus.map(api => (
                        <div key={api.id} className={`p-4 rounded-lg text-center transition-all duration-300 ${api.status === 'ok' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30 animate-pulse'}`}>
                          {api.status === 'ok' ? <CheckCircle className="mx-auto w-8 h-8 text-green-400 mb-2"/> : <XCircle className="mx-auto w-8 h-8 text-red-400 mb-2"/>}
                          <p className="text-sm font-medium text-white">{api.name}</p>
                          <p className={`text-xs font-bold ${api.status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{api.status === 'ok' ? 'Operacional' : 'Falha'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => handleSave('sistema')} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"><Save className="w-4 h-4 mr-2" />Salvar Configurações do Sistema</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-effect border-white/10">
                <CardHeader><CardTitle className="text-white flex items-center space-x-2"><Bell className="w-5 h-5" /><span>Configurações de Notificações</span></CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Canais de Comunicação</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5"><div className="flex items-center gap-4"><Label htmlFor="email-notifications" className="text-white font-medium flex-1">Notificações por Email</Label><Switch id="email-notifications" checked={formData.notifications.email} onCheckedChange={(checked) => handleSwitchChange('notifications', 'email', checked)} /></div></div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5"><div className="flex items-center gap-4"><Label htmlFor="sms-notifications" className="text-white font-medium flex-1">Notificações por SMS</Label><Switch id="sms-notifications" checked={formData.notifications.sms} onCheckedChange={(checked) => handleSwitchChange('notifications', 'sms', checked)} /></div></div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5"><div className="flex items-center gap-4"><Label htmlFor="whatsapp-notifications" className="text-white font-medium flex-1">Notificações por WhatsApp</Label><Switch id="whatsapp-notifications" checked={formData.notifications.whatsapp} onCheckedChange={(checked) => handleSwitchChange('notifications', 'whatsapp', checked)} /></div></div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2"><MessageSquareQuote className="text-blue-400"/>Protocolos de Notificação Interna</h3>
                        <Link to="/protocols">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Settings2 className="w-4 h-4 mr-2" />
                                Gerenciar Protocolos
                            </Button>
                        </Link>
                     </div>
                      <div className="space-y-2">
                          {protocols.map(protocol => (
                              <div key={protocol.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <Label htmlFor={`proto-${protocol.id}`} className="text-white font-medium flex-1">{protocol.name}</Label>
                                <Switch id={`proto-${protocol.id}`} checked={protocol.enabled} onCheckedChange={() => handleProtocolToggle(protocol.id)} />
                              </div>
                          ))}
                           {protocols.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhum protocolo criado.</p>}
                      </div>
                  </div>

                  <Button onClick={() => handleSave('notificações')} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"><Save className="w-4 h-4 mr-2" />Salvar Configurações de Notificação</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;