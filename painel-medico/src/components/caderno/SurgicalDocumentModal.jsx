import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiscIcon, FileTextIcon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const SurgicalDocumentModal = ({ patient, onSave, trigger }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        if (isOpen && patient) {
            setDocumentName(`Documento Cirúrgico - ${patient.name} - ${format(new Date(), 'dd-MM-yyyy')}`);
        } else if (isOpen) {
            setDocumentName(`Documento Cirúrgico - ${format(new Date(), 'dd-MM-yyyy')}`);
        }
        setDocumentContent('');
        setSelectedTemplate('');
    }, [isOpen, patient]);
    
    const handleTemplateClick = (templateType, templateContent) => {
        setSelectedTemplate(templateType);
        setDocumentContent(templateContent);
        toast({
            title: `Template de '${templateType}' carregado!`,
            description: "O conteúdo foi preenchido na área de texto.",
        });
    };

    const handleSave = () => {
        if (!patient) {
            toast({
                variant: 'destructive',
                title: 'Paciente não selecionado',
                description: 'Por favor, selecione um paciente para salvar o documento.',
            });
            return;
        }

        const doc = {
            patient_id: patient.id,
            type: `doc_cirurgico_${selectedTemplate.toLowerCase()}`,
            content: {
                nome: documentName,
                texto: documentContent
            },
            status: 'rascunho',
        };
        onSave(doc);
        setIsOpen(false);
        toast({ title: "Documento cirúrgico salvo com sucesso!" });
    };

    const templates = [
        { type: 'Orientações', icon: CheckIcon, content: 'Template para Orientações Pré e Pós-operatórias...' },
        { type: 'Relatório', icon: FileTextIcon, content: 'Template para Relatório Cirúrgico detalhado...' },
        { type: 'Informativo', icon: InfoCircledIcon, content: 'Template para Termo de Consentimento Informado...' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl text-white">
                <DialogHeader>
                    <DialogTitle>Gerar Documento Cirúrgico</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {!patient && (
                         <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                            Atenção: Nenhum paciente selecionado. O documento será um modelo genérico.
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Documento</label>
                        <Input 
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            className="bg-slate-800 border-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Modelos Rápidos</label>
                        <div className="flex gap-3">
                            {templates.map(({ type, icon: Icon, content }) => (
                                <Button 
                                    key={type}
                                    variant="outline"
                                    className={`flex-1 ${selectedTemplate === type ? 'bg-blue-600 border-blue-500' : 'border-slate-600'}`}
                                    onClick={() => handleTemplateClick(type, content)}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo</label>
                        <Textarea 
                            value={documentContent}
                            onChange={(e) => setDocumentContent(e.target.value)}
                            placeholder="Selecione um modelo ou escreva o conteúdo aqui..."
                            className="bg-slate-800 border-slate-600 min-h-[200px]"
                        />
                    </div>
                </div>
                 <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-700">
                    <Button onClick={handleSave} variant="shine">
                        <DiscIcon className="w-4 h-4 mr-2" />
                        Salvar Documento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SurgicalDocumentModal;