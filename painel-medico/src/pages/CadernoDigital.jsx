import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IdCardIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PatientHeader from '@/components/caderno/PatientHeader';
import DocumentsPanel from '@/components/caderno/DocumentsPanel';
import CanvasEditor from '@/components/caderno/CanvasEditor';
import { useAuthStore } from '@/store/authStore';
import { saveDocument } from '@/services/api';

const CadernoDigital = () => {
  const { id: patientId } = useParams();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = () => {
    // Em produção, isso viria da sua API
    const mockDocuments = [
      { id: 1, type: 'receita', title: 'Receita Médica', date: '2024-01-15', status: 'rascunho' },
      { id: 2, type: 'exames', title: 'Solicitação de Exames', date: '2024-01-10', status: 'enviado' },
      { id: 3, type: 'atendimento', title: 'Ficha de Atendimento', date: '2024-01-08', status: 'finalizado' },
      { id: 4, type: 'evolucao', title: 'Evolução Médica', date: '2024-01-05', status: 'rascunho' },
      { id: 5, type: 'agendamento_cirurgico', title: 'Solicitação de Cirurgia: Rinoplastia', date: '2024-01-18', status: 'solicitado'}
    ];
    setDocuments(mockDocuments);
  };

  useEffect(() => {
    // Em produção, isso viria da sua API
    const mockPatient = {
      id: patientId,
      name: 'Maria Silva Santos',
      phone: '(11) 99999-9999',
      email: 'maria.silva@email.com',
      birthDate: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores, 123 - São Paulo, SP'
    };
    setPatient(mockPatient);

    fetchDocuments();
  }, [patientId]);

  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  const handleSaveDraft = async (documentData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para salvar um documento.",
      });
      return;
    }

    try {
      const doc = {
        ...documentData,
        patient_id: patientId
      };
      await saveDocument(doc, user.token);
      toast({ title: "Rascunho salvo com sucesso!" });
      fetchDocuments();
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o rascunho. Verifique a API.",
      });
    }
  };

  const handleGeneratePDF = () => {
    toast({ title: "🚧 Geração de PDF ainda não implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  const handleSendEmail = () => {
    toast({ title: "🚧 Envio por email ainda não implementado—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Caderno Digital</h1>
            <p className="text-slate-400 text-sm">Paciente: {patient.name}</p>
          </div>
          <Button onClick={handleOrcamentoClick} variant="shine" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <IdCardIcon className="w-4 h-4 mr-2" />
            Orçamento
          </Button>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <PatientHeader patient={patient} />
        </motion.div>

        <DocumentsPanel
            documents={documents}
            patient={patient}
            onSaveDraft={handleSaveDraft}
            onGeneratePDF={handleGeneratePDF}
            onSendEmail={handleSendEmail}
        />
        
        <div className="w-full">
          <CanvasEditor patientId={patient.id} />
        </div>
      </main>
    </div>
  );
};

export default CadernoDigital;