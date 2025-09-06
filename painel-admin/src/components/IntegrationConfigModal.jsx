import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Mail, MessageSquare as MessageSquareText, Blocks, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const featureIcons = {
  email: <Mail className="w-5 h-5 text-blue-400" />,
  sms: <MessageSquareText className="w-5 h-5 text-green-400" />,
  'third-party': <Blocks className="w-5 h-5 text-purple-400" />,
};

const IntegrationConfigModal = ({ open, onOpenChange, integration: initialIntegration }) => {
  const { toast } = useToast();
  const { updateIntegration, addLog } = useData();
  const [integration, setIntegration] = useState(initialIntegration);

  useEffect(() => {
    setIntegration(initialIntegration);
  }, [initialIntegration]);

  const handleFeatureToggle = (featureId) => {
    if (!integration) return;
    const updatedFeatures = integration.features.map(f => 
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    );
    setIntegration({ ...integration, features: updatedFeatures });
  };

  const handleSaveChanges = () => {
    if (!integration) return;
    updateIntegration(integration.id, { features: integration.features });
    addLog({
      action: 'integration.config.update',
      user: 'Admin',
      description: `Configurações da integração '${integration.name}' foram atualizadas.`,
      level: 'info',
    });
    toast({
      title: "Configurações Salvas!",
      description: `As funcionalidades da integração ${integration.name} foram atualizadas.`,
    });
    onOpenChange(false);
  };

  if (!integration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
              <Settings />
              Configurar: {integration.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ative ou desative funcionalidades específicas para esta integração.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Funcionalidades da API</h3>
            {integration.features?.map(feature => (
              <div key={feature.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  {featureIcons[feature.id] || <Settings className="w-5 h-5 text-gray-400" />}
                  <div>
                    <Label htmlFor={`feature-${feature.id}`} className="text-white font-medium">{feature.name}</Label>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  id={`feature-${feature.id}`}
                  checked={feature.enabled}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
            </Button>
            <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConfigModal;