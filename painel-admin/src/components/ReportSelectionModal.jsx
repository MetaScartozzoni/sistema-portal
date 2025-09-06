import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ReportSelectionModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState(null);

  const handleAction = (action) => {
    if (!selectedReport) {
      toast({
        variant: "destructive",
        title: "Nenhum relatório selecionado",
        description: "Por favor, selecione um tipo de relatório para continuar.",
      });
      return;
    }
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `A ação de "${action}" para o relatório "${selectedReport}" será implementada em breve.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[500px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
              <FileText />
              Gerar Relatório
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecione o tipo de relatório que deseja gerar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Tipo de Relatório</label>
            <Select onValueChange={setSelectedReport}>
              <SelectTrigger className="w-full bg-white/5 border-white/10">
                <SelectValue placeholder="Selecione um relatório..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="financeiro_mensal">Financeiro Mensal</SelectItem>
                <SelectItem value="agendamentos_periodo">Agendamentos por Período</SelectItem>
                <SelectItem value="desempenho_medico">Desempenho por Médico</SelectItem>
                <SelectItem value="pacientes_novos">Novos Pacientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleAction('enviar por e-mail')} className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              <Mail className="w-4 h-4 mr-2" />
              Enviar por E-mail
            </Button>
            <Button onClick={() => handleAction('download')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportSelectionModal;