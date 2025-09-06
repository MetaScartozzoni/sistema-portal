
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const documentTemplates = [
  { id: 'orientacoes_gerais', label: 'Orientações Gerais' },
  { id: 'pre_operatorio', label: 'Pré Operatório' },
  { id: 'internacao', label: 'Internação' },
  { id: 'pos_operatorio', label: 'Pós Operatório' },
  { id: 'termo_consentimento', label: 'Termo de Consentimento Cirúrgico' },
  { id: 'termo_responsabilidade', label: 'Termo de Responsabilidade do Paciente' },
  { id: 'termo_privacidade_fotos', label: 'Termo de Privacidade sobre envio de fotos' },
  { id: 'orientacao_cirurgica', label: 'Orientação Cirúrgica', needsSurgeryType: true },
];

const surgeryTypes = [
    'Rinoplastia',
    'Mamoplastia de Aumento',
    'Mamoplastia Redutora',
    'Abdominoplastia',
    'Lipoaspiração',
    'Blefaroplastia',
];

const getStatusInfo = (status) => {
    switch (status) {
        case 'sent':
            return { text: 'Enviado', icon: Clock, color: 'text-blue-400' };
        case 'signed':
            return { text: 'Assinado', icon: CheckCircle, color: 'text-green-400' };
        default:
            return { text: 'Pendente', icon: AlertCircle, color: 'text-yellow-400' };
    }
};

const SelectDocumentTemplatesDialog = ({ open, onOpenChange, patient, onSubmit }) => {
  const [selectedDocs, setSelectedDocs] = useState({});
  const [surgeryType, setSurgeryType] = useState('');

  if (!open || !patient) return null;

  const patientDocs = patient.documents_status || {};

  const handleCheckboxChange = (docId, checked) => {
    setSelectedDocs(prev => ({ ...prev, [docId]: !!checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
        documents: Object.keys(selectedDocs).filter(key => selectedDocs[key]),
        surgeryType: selectedDocs['orientacao_cirurgica'] ? surgeryType : null,
    };
    if (submissionData.documents.length === 0) return;
    if (submissionData.documents.includes('orientacao_cirurgica') && !submissionData.surgeryType) {
        return;
    }
    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-3 text-blue-400"/>
            Gerenciar Documentos e Termos
          </h3>
          <p className="text-gray-400 mb-6">Para o paciente: {patient.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Checklist de Documentos</Label>
              <div className="space-y-3 p-4 bg-white/5 rounded-md max-h-96 overflow-y-auto">
                {documentTemplates.map(doc => {
                  const docStatus = patientDocs[doc.id];
                  const statusInfo = getStatusInfo(docStatus?.status);
                  const isSentOrSigned = docStatus?.status === 'sent' || docStatus?.status === 'signed';

                  return (
                    <div key={doc.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`doc-${doc.id}`}
                            checked={!!selectedDocs[doc.id]}
                            onCheckedChange={(checked) => handleCheckboxChange(doc.id, checked)}
                            disabled={isSentOrSigned}
                          />
                          <Label htmlFor={`doc-${doc.id}`} className={`font-normal ${isSentOrSigned ? 'text-gray-500 line-through' : 'text-white'}`}>{doc.label}</Label>
                        </div>
                        <div className={`flex items-center text-sm ${statusInfo.color}`}>
                            <statusInfo.icon className="w-4 h-4 mr-2" />
                            <span>{statusInfo.text}</span>
                            {docStatus?.date && <span className="ml-2 text-gray-400 text-xs">({format(new Date(docStatus.date), 'dd/MM/yy', { locale: ptBR })})</span>}
                        </div>
                      </div>
                      {doc.needsSurgeryType && selectedDocs[doc.id] && !isSentOrSigned && (
                          <motion.div 
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                              className="pl-9"
                          >
                              <Select onValueChange={setSurgeryType} value={surgeryType} required>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                      <SelectValue placeholder="Selecione o tipo de cirurgia" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 text-white border-white/20">
                                      {surgeryTypes.map(type => (
                                          <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" disabled={Object.values(selectedDocs).every(v => !v) || (selectedDocs['orientacao_cirurgica'] && !surgeryType)}>
                <Send className="w-4 h-4 mr-2" /> Gerar e Enviar Selecionados
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default SelectDocumentTemplatesDialog;
