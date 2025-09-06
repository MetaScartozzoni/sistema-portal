import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PersonIcon, 
  GearIcon, 
  MagnifyingGlassIcon,
  EnvelopeClosedIcon,
  ChatBubbleIcon,
  FileTextIcon,
  IdCardIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  ListBulletIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { getPatientJourneys } from '@/services/api';
import { mapRawPatient } from '@portal/shared';
import CommunicationModal from '@/components/journey/CommunicationModal';
import StageChecklistModal from '@/components/journey/StageChecklistModal';

const Journey = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [commMode, setCommMode] = useState('email');

  const fetchJourneys = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
  const response = await getPatientJourneys(user.id);
      const journeysData = Array.isArray(response?.data) ? response.data : [];
      setJourneys(journeysData.map(j => ({
        ...j,
        patient: j.patient ? mapRawPatient(j.patient) : undefined
      })));
    } catch (err) {
      setError(err.message);
      setJourneys([]);
      toast({
        variant: "destructive",
        title: "Erro ao carregar jornadas",
        description: err.message || "Não foi possível buscar os dados. Verifique a API.",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!authLoading) {
      fetchJourneys();
    }
  }, [user, authLoading, fetchJourneys]);

  const filteredJourneys = useMemo(() => {
    if (!Array.isArray(journeys)) return [];
    return journeys.filter(journey => {
      const patient = journey.patient;
      if (!patient) return false;
      const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (patient.phone && patient.phone.includes(searchTerm));
      return matchesSearch;
    });
  }, [journeys, searchTerm]);


  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  const openCommunicationModal = (patient, mode) => {
    setSelectedPatient(patient);
    setCommMode(mode);
    setIsCommModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const isLoading = authLoading || loading;

  return (
    <>
      <CommunicationModal 
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        patient={selectedPatient}
        mode={commMode}
        onSent={fetchJourneys}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Jornada do Paciente</h1>
            <p className="text-slate-400 mt-2">Acompanhe o progresso e timeline dos pacientes</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleOrcamentoClick} variant="shine" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <IdCardIcon className="w-4 h-4 mr-2" />
              Orçamento
            </Button>
            <Link to="/protocol-config">
              <Button variant="shine">
                <GearIcon className="w-4 h-4 mr-2" />
                Configurar Protocolo
              </Button>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading && <p className="text-slate-400 col-span-full text-center">Carregando jornadas...</p>}
          {error && <p className="text-yellow-400 col-span-full text-center flex items-center justify-center gap-2"><ExclamationTriangleIcon className="w-4 h-4"/> {error}</p>}
          {!isLoading && !error && filteredJourneys.map((journey, index) => {
            const patient = journey.patient;
            const protocol = journey.protocol;
            const stage = journey.current_stage;
            const totalStages = protocol?.total_stages || 5;
            const stageOrder = stage?.position || 1;
            const status = journey.status || 'on-track';

            return (
              <motion.div
                key={journey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:bg-slate-700/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{patient.full_name}</h3>
                    <p className="text-sm text-slate-400">{protocol?.name}</p>
                    <p className="text-sm text-slate-300">{patient.phone}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status === 'on-track' && 'No Prazo'}
                    {status === 'delayed' && 'Atrasado'}
                    {status === 'completed' && 'Concluído'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Progresso</span>
                    <span className="text-sm text-white">{stageOrder}/{totalStages}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stageOrder / totalStages) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Etapa Atual</span>
                  </div>
                  <p className="text-blue-400 font-medium">{stage?.name}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <StageChecklistModal journey={journey} stage={stage}>
                      <Button
                        size="sm"
                        variant="shine"
                        disabled={status === 'completed'}
                      >
                        <ListBulletIcon className="w-3 h-3 mr-1" />
                        Ver Checklist
                      </Button>
                    </StageChecklistModal>

                  <Link to={`/patients/${patient.id}/caderno`}>
                    <Button size="sm" variant="outline" className="border-slate-600 hover:border-purple-500">
                      <FileTextIcon className="w-3 h-3 mr-1" />
                      Caderno
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openCommunicationModal(patient, 'sms')}
                    className="border-slate-600 hover:border-green-500"
                  >
                    <ChatBubbleIcon className="w-3 h-3 mr-1" />
                    Mensagem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openCommunicationModal(patient, 'email')}
                    className="border-slate-600 hover:border-blue-500"
                  >
                    <EnvelopeClosedIcon className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {!isLoading && filteredJourneys.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
              <PersonIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum paciente encontrado</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Nenhum paciente na jornada atual'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Journey;