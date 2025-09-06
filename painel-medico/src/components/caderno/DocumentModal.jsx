import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DiscIcon, DownloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import TemplateAtendimento from './templates/TemplateAtendimento';
import TemplateEvolucao from './templates/TemplateEvolucao';
import TemplateReceita from './templates/TemplateReceita';
import TemplateExames from './templates/TemplateExames';
import SurgeryScheduleModal from './SurgeryScheduleModal';

const DocumentModal = ({ type, title, icon: Icon, patientId, onSave, onGeneratePDF, trigger }) => {
    const { toast } = useToast();
    const [documentContent, setDocumentContent] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const handleSaveDraft = async () => {
        const doc = {
            patient_id: patientId,
            type: type,
            content: documentContent,
            status: 'rascunho'
        };

        try {
            await onSave(doc);
            setIsOpen(false);
            toast({ title: `Rascunho de '${title}' salvo com sucesso!` });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message,
            });
        }
    };
    
    const getTemplateComponent = () => {
        const props = { content: documentContent, setContent: setDocumentContent, patientId };
        switch (type) {
            case 'atendimento':
                return <TemplateAtendimento {...props} />;
            case 'evolucao':
                return <TemplateEvolucao {...props} />;
            case 'receita':
                return <TemplateReceita {...props} />;
            case 'exames':
                return <TemplateExames {...props} />;
            default:
                return <p className="text-slate-400">Template não encontrado.</p>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-400" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    {getTemplateComponent()}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <div>
                         {type === 'atendimento' && (
                            <SurgeryScheduleModal
                                patientId={patientId}
                                surgicalIndication={documentContent.indicacao_cirurgica}
                                onSave={onSave}
                            />
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSaveDraft} variant="shine">
                            <DiscIcon className="w-4 h-4 mr-2" />
                            Salvar Rascunho
                        </Button>
                        <Button onClick={onGeneratePDF} variant="outline" className="border-slate-600">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Gerar PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentModal;