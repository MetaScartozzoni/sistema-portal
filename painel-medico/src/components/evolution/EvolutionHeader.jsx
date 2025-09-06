import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EvolutionHeader = () => {
  const { toast } = useToast();

  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  const handleExportCSV = () => {
    toast({ title: "🚧 Exportação CSV ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  const handleExportPDF = () => {
    toast({ title: "🚧 Exportação PDF ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Quadro Evolutivo</h1>
        <p className="text-slate-400 mt-2">Monitore a evolução clínica dos pacientes</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleOrcamentoClick} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Calculator className="w-4 h-4 mr-2" />
          Orçamento
        </Button>
        <Button onClick={handleExportCSV} variant="outline" className="border-slate-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
        <Button onClick={handleExportPDF} variant="outline" className="border-slate-600">
          <FileText className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};

export default EvolutionHeader;