import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookmarkIcon, 
  UploadIcon, 
  BellIcon, 
  EnvelopeClosedIcon,
  ColorWheelIcon,
  ImageIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const AdminConfig = () => {
  const { toast } = useToast();
  const [brandingConfig, setBrandingConfig] = useState({
    logo: '',
    clinicName: 'Dr. Márcio Plastic Surgery',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    phone: '(11) 99999-9999',
    email: 'contato@marcioplasticsurgery.com',
    crm: 'CRM/SP 123456',
    headerText: 'RECEITA MÉDICA',
    footerText: 'Este documento é válido em todo território nacional'
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpUser: '',
    smtpPass: '',
    emailFrom: 'contato@marcioplasticsurgery.com'
  });

  const [notificationConfig, setNotificationConfig] = useState({
    enableEmail: true,
    enableSms: false,
    reminderDays: 2,
    overdueNotification: true
  });

  const handleSaveSettings = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    toast({ 
      title: "Configurações Salvas", 
      description: "Suas configurações foram salvas com sucesso.",
      className: 'bg-green-600 text-white' 
    });
  };

  const handleLogoUpload = () => {
    toast({ title: "🚧 Upload de logo ainda não foi implementado—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  const handleSaveEmail = () => {
    handleSaveSettings('emailConfig', emailConfig);
  };

  const handleSaveNotifications = () => {
    handleSaveSettings('notificationConfig', notificationConfig);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-slate-400 mt-2">Personalize a aparência e o comportamento do seu portal.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/80 border border-slate-700/60 p-1 h-auto rounded-xl">
            <TabsTrigger value="branding" className="data-[state=active]:bg-blue-600/80 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <ColorWheelIcon className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-blue-600/80 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <EnvelopeClosedIcon className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600/80 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <BellIcon className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 glass-effect p-6 rounded-xl">
            <TabsContent value="branding" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Identidade Visual & Documentos</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Logo da Clínica</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
                      {brandingConfig.logo ? (
                        <img src={brandingConfig.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <Button onClick={handleLogoUpload} variant="outline" className="border-slate-600 hover:bg-slate-700/50">
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Clínica</label>
                    <Input
                      value={brandingConfig.clinicName}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, clinicName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">CRM</label>
                    <Input
                      value={brandingConfig.crm}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, crm: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                    <Input
                      value={brandingConfig.phone}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, phone: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <Input
                      value={brandingConfig.email}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, email: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Endereço</label>
                  <Input
                    value={brandingConfig.address}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, address: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Texto do Cabeçalho (PDF)</label>
                    <Input
                      value={brandingConfig.headerText}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, headerText: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Texto do Rodapé (PDF)</label>
                    <Textarea
                      value={brandingConfig.footerText}
                      onChange={(e) => setBrandingConfig({ ...brandingConfig, footerText: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={2}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings('brandingConfig', brandingConfig)} className="bg-blue-600 hover:bg-blue-700">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Salvar Branding
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-6 mt-0">
              <h3 className="text-lg font-semibold text-white">Configuração de Email (SMTP)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Host SMTP</label>
                  <Input
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Usuário SMTP</label>
                  <Input
                    value={emailConfig.smtpUser}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Senha SMTP</label>
                  <Input
                    type="password"
                    value={emailConfig.smtpPass}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email de Remetente</label>
                  <Input
                    value={emailConfig.emailFrom}
                    onChange={(e) => setEmailConfig({ ...emailConfig, emailFrom: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="no-reply@example.com"
                  />
                </div>
                <Button onClick={handleSaveEmail} className="bg-blue-600 hover:bg-blue-700">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Salvar Configurações de Email
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <h3 className="text-lg font-semibold text-white">Configuração de Notificações</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enableEmail" checked={notificationConfig.enableEmail} onChange={(e) => setNotificationConfig({...notificationConfig, enableEmail: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="enableEmail" className="text-sm text-slate-300">Habilitar notificações por email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enableSms" checked={notificationConfig.enableSms} onChange={(e) => setNotificationConfig({...notificationConfig, enableSms: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="enableSms" className="text-sm text-slate-300">Habilitar notificações por SMS</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Lembretes (dias antes)</label>
                  <Input
                    type="number"
                    value={notificationConfig.reminderDays}
                    onChange={(e) => setNotificationConfig({...notificationConfig, reminderDays: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="overdueNotification" checked={notificationConfig.overdueNotification} onChange={(e) => setNotificationConfig({...notificationConfig, overdueNotification: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="overdueNotification" className="text-sm text-slate-300">Notificar sobre tarefas atrasadas</label>
                </div>
                <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Salvar Configurações de Notificação
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminConfig;