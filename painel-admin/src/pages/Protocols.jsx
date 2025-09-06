import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { MessageSquare as MessageSquareQuote, PlusCircle, Power, PowerOff, Zap, GitBranch, ArrowRight, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import AddProtocolModal from '@/components/AddProtocolModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate } from 'react-router-dom';


const Protocols = () => {
  const { settings, updateProtocols, users } = useData();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const protocols = settings.notifications.protocols || [];
  
  const handleToggleProtocol = (protocolId) => {
    const updatedProtocols = protocols.map(p => 
      p.id === protocolId ? { ...p, enabled: !p.enabled } : p
    );
    updateProtocols(updatedProtocols);
    toast({
      title: 'Protocolo atualizado!',
      description: `O protocolo foi ${updatedProtocols.find(p => p.id === protocolId).enabled ? 'ativado' : 'desativado'}.`,
    });
  };

  const handleAddProtocol = (newProtocol) => {
    const updatedProtocols = [...protocols, newProtocol];
    updateProtocols(updatedProtocols);
     toast({
      title: 'Protocolo criado!',
      description: `O protocolo "${newProtocol.name}" foi adicionado com sucesso.`,
    });
  };

  const handleDeleteProtocol = (protocolId) => {
    const updatedProtocols = protocols.filter(p => p.id !== protocolId);
    updateProtocols(updatedProtocols);
    toast({
      variant: "destructive",
      title: 'Protocolo removido!',
      description: `O protocolo foi removido com sucesso.`,
    });
  };

  const getTargetName = (targetId) => {
    if (targetId === 'tech_manager_medical') {
      return 'Resp. Técnico Médico';
    }
    const user = users.find(u => u.id === targetId);
    return user ? user.name : 'Desconhecido';
  }

  return (
    <>
      <Helmet>
        <title>Protocolos de Notificação - Portal Admin</title>
        <meta name="description" content="Crie e gerencie protocolos de notificação automatizados para otimizar a comunicação interna da clínica." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)} 
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <MessageSquareQuote className="w-8 h-8 text-blue-400" />
                Protocolos de Notificação
              </h1>
              <p className="text-gray-400">Automatize alertas e comunicações internas com regras personalizadas.</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Novo Protocolo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-effect border-white/10 ${!protocol.enabled && 'opacity-50'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{protocol.name}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs mt-1">
                        ID: {protocol.id}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={protocol.enabled}
                      onCheckedChange={() => handleToggleProtocol(protocol.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-gray-300">Gatilho:</span>
                      <span className="text-white">{protocol.trigger}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <GitBranch className="w-4 h-4 text-cyan-400 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-300">Condições:</span>
                         {protocol.conditions.length > 0 ? (
                          <ul className="list-disc list-inside pl-2">
                            {protocol.conditions.map((c, i) => (
                              <li key={i} className="text-white">
                                {c.field} {c.operator} {c.value}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic"> Nenhuma</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                      <span className="font-semibold text-gray-300">Ação:</span>
                      <span className="text-white">Notificar {getTargetName(protocol.action.target)}</span>
                    </div>
                  </div>
                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {protocol.enabled ? (
                        <Power className="w-4 h-4 text-green-500" />
                      ) : (
                        <PowerOff className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-bold ${protocol.enabled ? 'text-green-400' : 'text-red-400'}`}>
                        {protocol.enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-effect border-white/10 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o protocolo
                            "{protocol.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProtocol(protocol.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {protocols.length === 0 && (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-white/10">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquareQuote className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Nenhum protocolo encontrado</h3>
              <p className="text-gray-400 mb-4">Comece criando seu primeiro protocolo de notificação.</p>
               <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Criar Protocolo
               </Button>
            </div>
        )}
      </div>

      <AddProtocolModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddProtocol={handleAddProtocol}
      />
    </>
  );
};

export default Protocols;