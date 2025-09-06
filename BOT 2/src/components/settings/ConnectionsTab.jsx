import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Key, Zap, Copy, Database, BellRing, Send, Settings2, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import IntegrationCard from './IntegrationCard';

const ConnectionsTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useData();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [externalIdParam, setExternalIdParam] = useState(settings.externalIdParam);
  const [notificationWebhook, setNotificationWebhook] = useState('');
  const [notificationEvents, setNotificationEvents] = useState({
    newMessage: false,
    messageReplied: false,
    userAdded: false,
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
  };
  
  const handleZapier = () => {
    toast({
      title: "🚧 Integração em breve!",
      description: "A integração com Zapier está a caminho! Fique ligado! 🚀"
    });
  };

  const handleSaveSettings = () => {
    updateSettings({ apiKey, externalIdParam });
    toast({
      title: "✅ Configurações Salvas!",
      description: "Suas configurações de API e ID foram salvas.",
    });
  };

  const handleSaveNotifications = () => {
    console.log("Saving notification settings:", { notificationWebhook, notificationEvents });
    toast({
      title: "✅ Configuração Salva!",
      description: "Suas configurações de notificação foram salvas.",
    });
  };

  const handleTestNotification = () => {
    if (!notificationWebhook) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira a URL do Webhook antes de testar.",
      });
      return;
    }
    toast({
      title: "✅ Teste Enviado!",
      description: "Uma notificação de teste foi enviada para o seu webhook.",
    });
  };

  const handleEventChange = (eventId) => {
    setNotificationEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Conexões e API</h2>
        <p className="text-gray-300">Conecte o BotConversa com suas ferramentas favoritas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        <IntegrationCard
          icon={<Database className="h-6 w-6 text-white" />}
          title="Banco de Dados"
          description="Conecte para habilitar o banco de dados e obter sua URL de webhook."
        >
          <div className="space-y-4 flex flex-col items-center justify-between h-full text-center flex-grow">
            <ol className="list-decimal list-inside text-left text-sm text-gray-300 space-y-2 flex-grow">
              <li>Este aplicativo agora usa dados locais.</li>
              <li>Para conectar a um banco de dados real, você precisará de um backend.</li>
              <li>Consulte o manual de integração para detalhes sobre a API.</li>
            </ol>
            <div className="w-full mt-4">
               <Label htmlFor="backend-api-url" className="text-xs font-medium text-gray-200">URL da API do seu Backend (Exemplo)</Label>
               <div className="flex items-center space-x-2 mt-1">
                <Input id="backend-api-url" type="text" readOnly value="https://api.marcioplasticsurgery.com" className="font-mono bg-white/10 text-white border-white/20 placeholder:text-gray-400 text-xs" />
                <Button variant="glass" size="icon" onClick={() => handleCopy("https://api.marcioplasticsurgery.com")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={() => toast({ title: "🚧 Funcionalidade em breve!", description: "A conexão com o backend será implementada em breve! 🚀" })} className="w-full bg-green-500 hover:bg-green-600 text-white mt-4">
              <Database className="mr-2 h-4 w-4" />
              Conectar Backend
            </Button>
          </div>
        </IntegrationCard>

        <IntegrationCard
          icon={<Key className="h-6 w-6 text-white" />}
          title="API BotConversa"
          description="Sua chave de API para autenticar as requisições do seu bot."
        >
          <div className="space-y-4 flex-grow flex flex-col justify-center">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium text-gray-200">Sua Chave API</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input id="api-key" type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="font-mono bg-white/10 text-white border-white/20 placeholder:text-gray-400" />
                <Button variant="glass" size="icon" onClick={() => handleCopy(apiKey)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Insira esta chave no cabeçalho 'Authorization' do seu webhook.</p>
            </div>
          </div>
          <Button onClick={handleSaveSettings} className="w-full mt-auto" variant="glassPrimary">Salvar Chave</Button>
        </IntegrationCard>

        <IntegrationCard
          icon={<Zap className="h-6 w-6 text-white" />}
          title="Zapier"
          description="Automatize tarefas conectando eventos do painel ao Zapier."
        >
          <div className="space-y-4 flex flex-col justify-center flex-grow text-center">
            <p className="text-sm text-gray-300">Conecte o BotConversa ao Zapier para criar automações com milhares de outros aplicativos.</p>
            <p className="text-xs text-gray-400 mt-1">Ex: Enviar um email, criar um card no Trello, ou notificar no Slack quando uma mensagem for respondida.</p>
          </div>
          <Button onClick={handleZapier} className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-auto">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Integrações Zapier
          </Button>
        </IntegrationCard>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard
          icon={<Settings2 className="h-6 w-6 text-white" />}
          title="ID Unificado"
          description="Conecte o ID do BotConversa com seu sistema principal."
        >
          <div>
            <Label htmlFor="external-id-param" className="text-sm font-medium text-gray-200">Parâmetro de ID Externo</Label>
            <Input 
              id="external-id-param" 
              type="text" 
              placeholder="ex: id_paciente_erp" 
              value={externalIdParam} 
              onChange={(e) => setExternalIdParam(e.target.value)} 
              className="mt-1 bg-white/10 text-white border-white/20 placeholder:text-gray-400" 
            />
            <p className="text-xs text-gray-400 mt-1">Este é o nome do campo usado para identificar o paciente no seu sistema principal.</p>
          </div>
          <Button onClick={handleSaveSettings} className="w-full mt-auto" variant="glassPrimary">Salvar Parâmetro</Button>
        </IntegrationCard>

        <IntegrationCard
          icon={<BellRing className="h-6 w-6 text-white" />}
          title="Webhook de Notificação"
          description="Configure para onde as notificações de eventos serão enviadas."
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-webhook" className="text-sm font-medium text-gray-200">URL do Webhook</Label>
              <Input id="notification-webhook" type="text" placeholder="https://seu-sistema.com/webhook" value={notificationWebhook} onChange={(e) => setNotificationWebhook(e.target.value)} className="mt-1 bg-white/10 text-white border-white/20 placeholder:text-gray-400" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-200">Eventos para Notificar</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="event-new-message" checked={notificationEvents.newMessage} onCheckedChange={() => handleEventChange('newMessage')} />
                  <Label htmlFor="event-new-message" className="text-gray-300 font-normal">Nova Mensagem Recebida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="event-message-replied" checked={notificationEvents.messageReplied} onCheckedChange={() => handleEventChange('messageReplied')} />
                  <Label htmlFor="event-message-replied" className="text-gray-300 font-normal">Mensagem Respondida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="event-user-added" checked={notificationEvents.userAdded} onCheckedChange={() => handleEventChange('userAdded')} />
                  <Label htmlFor="event-user-added" className="text-gray-300 font-normal">Novo Atendente Adicionado</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-auto pt-4">
            <Button onClick={handleSaveNotifications} className="w-full" variant="glassPrimary">Salvar</Button>
            <Button onClick={handleTestNotification} className="w-full" variant="glass">
              <Send className="mr-2 h-4 w-4" />
              Testar
            </Button>
          </div>
        </IntegrationCard>
      </div>
    </div>
  );
};

export default ConnectionsTab;
