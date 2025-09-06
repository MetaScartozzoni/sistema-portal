import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Puzzle, Settings, Book, Stethoscope, ClipboardX as ClipboardUser, User, FileBarChart2, Bot, Power, PowerOff, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import IntegrationConfigModal from '@/components/IntegrationConfigModal';
import IntegrationDocsModal from '@/components/IntegrationDocsModal';

const IntegrationIcon = ({ iconName, className }) => {
  const icons = {
    Stethoscope,
    ClipboardUser,
    User,
    FileBarChart2,
    Bot,
    Puzzle,
  };
  const IconComponent = icons[iconName] || Puzzle;
  return <IconComponent className={className} />;
};

const Integrations = () => {
  const { integrations, updateIntegration, addLog } = useData();
  const { toast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);
  const [isDocsModalOpen, setDocsModalOpen] = useState(false);

  const handleStatusChange = (integration, checked) => {
    const newStatus = checked ? 'active' : 'inactive';
    updateIntegration(integration.id, { status: newStatus });
    addLog({
      action: 'integration.status.update',
      user: 'Admin',
      description: `Integração '${integration.name}' foi ${checked ? 'ativada' : 'desativada'}.`,
      level: 'info',
    });
    toast({
      title: `Integração ${checked ? 'Ativada' : 'Desativada'}`,
      description: `O ${integration.name} foi ${checked ? 'ligado' : 'desligado'}.`,
    });
  };

  const handleAction = (action, integration) => {
    setSelectedIntegration(integration);
    if (action === 'configurar') {
      setConfigModalOpen(true);
    } else if (action === 'ver documentação') {
      setDocsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    toast({
      title: "Próximos Passos!",
      description: "A funcionalidade para adicionar novas integrações será implementada em breve.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Integrações - Portal Admin Clínica</title>
        <meta name="description" content="Gerencie integrações de API com outros portais da clínica, incluindo portal médico, secretaria e bot de atendimento." />
      </Helmet>

      {selectedIntegration && (
        <>
          <IntegrationConfigModal
            open={isConfigModalOpen}
            onOpenChange={setConfigModalOpen}
            integration={selectedIntegration}
          />
          <IntegrationDocsModal
            open={isDocsModalOpen}
            onOpenChange={setDocsModalOpen}
            integration={selectedIntegration}
          />
        </>
      )}

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Central de Integrações</h1>
          <p className="text-gray-400">Controle o acesso e o status dos portais e serviços conectados.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-effect border-white/10 card-hover h-full flex flex-col transition-all duration-300 ${integration.status === 'active' ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${integration.status === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <IntegrationIcon iconName={integration.icon} className={`w-6 h-6 transition-colors duration-300 ${integration.status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-semibold ${integration.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {integration.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Versão</span>
                      <span className="text-white font-mono">{integration.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">API Key</span>
                      <span className="text-white font-mono bg-white/5 px-2 py-1 rounded text-xs truncate">{integration.apiKey}</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5">
                      {integration.status === 'active' ? <Power className="w-5 h-5 text-green-400" /> : <PowerOff className="w-5 h-5 text-red-400" />}
                      <Label htmlFor={`switch-${integration.id}`} className="flex-1 text-white font-medium">
                        {integration.status === 'active' ? 'Portal Ativo' : 'Portal Inativo'}
                      </Label>
                      <Switch
                        id={`switch-${integration.id}`}
                        checked={integration.status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(integration, checked)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => handleAction('configurar', integration)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => handleAction('ver documentação', integration)}
                      >
                        <Book className="w-4 h-4 mr-2" />
                        Docs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: integrations.length * 0.1 }}
            >
              <Card 
                className="glass-effect border-white/10 card-hover h-full flex flex-col transition-all duration-300 border-dashed hover:border-solid hover:border-purple-500/50 cursor-pointer"
                onClick={handleAddNew}
                >
                <CardContent className="flex-grow flex flex-col justify-center items-center text-center p-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border-2 border-dashed border-white/20 group-hover:border-solid">
                        <PlusCircle className="w-10 h-10 text-gray-400 transition-transform group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Adicionar Nova Integração</h3>
                    <p className="text-sm text-gray-500 mt-1">Conecte novas ferramentas e portais.</p>
                </CardContent>
            </Card>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default Integrations;