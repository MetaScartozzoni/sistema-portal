import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Book, Code, UserCircle, GitBranch, Info, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const IntegrationDocsModal = ({ open, onOpenChange, integration }) => {
  if (!integration || !integration.documentation) return null;

  const { author, version, description, endpoints } = integration.documentation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[700px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
              <Book />
              Documentação: {integration.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalhes técnicos e endpoints disponíveis para esta integração.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[450px] my-6 pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <UserCircle className="w-5 h-5 text-cyan-400"/>
                  <div>
                    <p className="text-gray-400">Autor</p>
                    <p className="font-medium text-white">{author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <GitBranch className="w-5 h-5 text-amber-400"/>
                  <div>
                    <p className="text-gray-400">Versão</p>
                    <p className="font-medium text-white font-mono">{version}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg md:col-span-3">
                  <Info className="w-5 h-5 text-indigo-400"/>
                  <div>
                    <p className="text-gray-400">Descrição</p>
                    <p className="font-medium text-white">{description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Code /> Endpoints da API
                </h3>
                <div className="space-y-3">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-900/60 border border-white/10 font-mono text-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          endpoint.method === 'GET' ? 'bg-blue-600 text-white' : 
                          endpoint.method === 'POST' ? 'bg-green-600 text-white' :
                          endpoint.method === 'PUT' ? 'bg-yellow-600 text-black' :
                          'bg-red-600 text-white'
                        }`}>{endpoint.method}</span>
                        <p className="text-cyan-300">{endpoint.path}</p>
                      </div>
                      <p className="text-gray-400 text-xs pl-1">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationDocsModal;