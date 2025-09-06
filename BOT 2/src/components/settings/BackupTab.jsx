import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Download, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import IntegrationCard from './IntegrationCard';

const BackupTab = () => {
  const { toast } = useToast();
  const { exportData, importData } = useData();

  const handleExport = () => {
    exportData();
    toast({
      title: "✅ Exportado com Sucesso!",
      description: "O arquivo de backup 'botconversa_backup.json' foi baixado.",
    });
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importData(file, () => {
        toast({
          title: "✅ Importado com Sucesso!",
          description: "Suas configurações foram restauradas. A página será recarregada.",
        });
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Backup e Restauração</h2>
        <p className="text-gray-300">Exporte seus dados para um arquivo ou restaure a partir de um backup.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard
          icon={<Download className="h-6 w-6 text-white" />}
          title="Exportar Dados"
          description="Salve todas as suas configurações e mensagens em um arquivo JSON."
        >
          <div className="flex-grow flex items-center justify-center">
            <Button onClick={handleExport} className="w-full" variant="glassPrimary">
              <Download className="mr-2 h-4 w-4" />
              Exportar Backup
            </Button>
          </div>
        </IntegrationCard>
        <IntegrationCard
          icon={<Upload className="h-6 w-6 text-white" />}
          title="Importar Dados"
          description="Restaure suas configurações a partir de um arquivo de backup."
        >
          <div className="flex-grow flex items-center justify-center">
            <Button asChild className="w-full" variant="glass">
              <Label htmlFor="import-file" className="cursor-pointer w-full h-full flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Importar Backup
              </Label>
            </Button>
            <Input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </IntegrationCard>
      </div>
    </div>
  );
};

export default BackupTab;