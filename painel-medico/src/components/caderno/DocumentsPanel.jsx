import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileTextIcon, 
  ReaderIcon, 
  ActivityLogIcon, 
  MixIcon, 
  DownloadIcon,
  EnvelopeClosedIcon,
  CalendarIcon,
  SewingPinIcon,
  ArchiveIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DocumentModal from '@/components/caderno/DocumentModal';
import SurgicalDocumentModal from './SurgicalDocumentModal';

const documentTypes = [
  { type: "atendimento", title: "Atendimento", icon: ReaderIcon },
  { type: "evolucao", title: "Evolução", icon: FileTextIcon },
  { type: "receita", title: "Receita", icon: MixIcon },
  { type: "exames", title: "Exames", icon: ActivityLogIcon },
];

const HistoryModal = ({ documents, isOpen, onOpenChange }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><ArchiveIcon /> Histórico da Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg">
                                {doc.type === 'receita' && <MixIcon className="w-4 h-4 text-blue-400" />}
                                {doc.type === 'exames' && <ActivityLogIcon className="w-4 h-4 text-green-400" />}
                                {doc.type === 'atendimento' && <ReaderIcon className="w-4 h-4 text-purple-400" />}
                                {doc.type === 'evolucao' && <FileTextIcon className="w-4 h-4 text-orange-400" />}
                                {doc.type === 'agendamento_cirurgico' && <CalendarIcon className="w-4 h-4 text-teal-400" />}
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium">{doc.title}</p>
                                <p className="text-xs text-slate-400">{new Date(doc.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                doc.status === 'finalizado' ? 'bg-green-500/20 text-green-400' :
                                doc.status === 'enviado' ? 'bg-blue-500/20 text-blue-400' :
                                doc.status === 'solicitado' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {doc.status}
                            </span>
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                                <FileTextIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                 {documents.length === 0 && <p className="text-slate-400 text-center py-8">Nenhum documento no histórico.</p>}
            </div>
        </DialogContent>
    </Dialog>
);

const DocumentsPanel = ({ documents, patient, onSaveDraft, onGeneratePDF, onSendEmail }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
    <HistoryModal documents={documents} isOpen={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-xl p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
            {documentTypes.map(doc => (
                <DocumentModal
                    key={doc.type}
                    type={doc.type}
                    title={doc.title}
                    icon={doc.icon}
                    patientId={patient?.id}
                    onSave={onSaveDraft}
                    onGeneratePDF={onGeneratePDF}
                    trigger={
                        <Button variant="outline" size="sm" className="border-slate-600 hover:border-blue-500">
                           <doc.icon className="w-4 h-4 mr-2" />
                           {doc.title}
                        </Button>
                    }
                />
            ))}
            <SurgicalDocumentModal 
                patient={patient} 
                onSave={onSaveDraft} 
                trigger={
                    <Button variant="outline" size="sm" className="border-slate-600 hover:border-purple-500">
                        <SewingPinIcon className="w-4 h-4 mr-2 text-purple-400" />
                        Doc. Cirúrgico
                    </Button>
                }
            />
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" className="border-slate-600 hover:border-yellow-500" onClick={() => setIsHistoryOpen(true)}>
                <ArchiveIcon className="w-4 h-4 mr-2" />
                Ver Histórico
            </Button>
            <Button onClick={onGeneratePDF} size="sm" className="bg-green-600 hover:bg-green-700">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Gerar PDF
            </Button>
            <Button onClick={onSendEmail} size="sm" variant="outline" className="border-slate-600">
                <EnvelopeClosedIcon className="w-4 h-4 mr-2" />
                Enviar Email
            </Button>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default DocumentsPanel;