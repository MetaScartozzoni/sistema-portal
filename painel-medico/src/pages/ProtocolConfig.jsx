import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ProtocolHeader from '@/components/protocol-config/ProtocolHeader';
import ProtocolOverview from '@/components/protocol-config/ProtocolOverview';
import StageCard from '@/components/protocol-config/StageCard';
import NoStages from '@/components/protocol-config/NoStages';

const ProtocolConfig = () => {
  const { toast } = useToast();
  const [stages, setStages] = useState([]);

  useEffect(() => {
    // TODO: Fetch this data from Supabase
    const mockStages = [
      { id: 1, name: 'Primeiro Contato', order: 1, event: 'Consulta', deadline: { type: 'after_previous', days: 1 }, notifyRules: { beforeDue: 0, onDue: true, afterDue: 0 }, description: 'Agendar consulta em até 24h do primeiro contato.' },
      { id: 2, name: 'Confirmação de Consulta', order: 2, event: 'Consulta', deadline: { type: 'before_event', days: 1 }, notifyRules: { beforeDue: 0, onDue: true, afterDue: 0 }, description: 'Confirmar consulta 24h antes da data marcada.' },
      { id: 3, name: 'Consulta Realizada', order: 3, event: 'Consulta', deadline: { type: 'after_previous', days: 0 }, notifyRules: { beforeDue: 0, onDue: false, afterDue: 0 }, description: 'Registro da consulta inicial com o paciente.' },
      { id: 4, name: 'Envio de Orçamento', order: 4, event: 'Consulta', deadline: { type: 'after_previous', days: 2 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Gerar e enviar o orçamento em até 30h após a consulta.' },
      { id: 5, name: 'Follow-up Orçamento (1-3 dias)', order: 5, event: 'Consulta', deadline: { type: 'after_previous', days: 3 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Contato para tirar dúvidas sobre o orçamento.' },
      { id: 6, name: 'Follow-up Orçamento (15 dias)', order: 6, event: 'Consulta', deadline: { type: 'after_previous', days: 15 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Segundo contato de acompanhamento.' },
      { id: 7, name: 'Aceite de Orçamento e Pagamento', order: 7, event: 'Consulta', deadline: { type: 'after_previous', days: 180 }, notifyRules: { beforeDue: 30, onDue: true, afterDue: 15 }, description: 'Prazo máximo de 6 meses para aceite e pagamento da entrada.' },
      { id: 8, name: 'Agendamento de Cirurgia', order: 8, event: 'Cirurgia', deadline: { type: 'after_previous', days: 2 }, notifyRules: { beforeDue: 0, onDue: false, afterDue: 0 }, description: 'Definir a data da cirurgia após a confirmação do pagamento.' },
      { id: 9, name: 'Entrega de Exames', order: 9, event: 'Cirurgia', deadline: { type: 'before_event', days: 7 }, notifyRules: { beforeDue: 3, onDue: true, afterDue: 1 }, description: 'Paciente deve entregar os exames prontos até 1 semana antes da cirurgia.' },
      { id: 10, name: 'Quitar Cirurgia', order: 10, event: 'Cirurgia', deadline: { type: 'before_event', days: 2 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Pagamento final do procedimento.' },
      { id: 11, name: 'Cirurgia', order: 11, event: 'Cirurgia', deadline: { type: 'before_event', days: 0 }, notifyRules: { beforeDue: 0, onDue: false, afterDue: 0 }, description: 'Realização do procedimento cirúrgico.' },
      { id: 12, name: '1º Retorno Pós-Operatório', order: 12, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 1 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Primeiro retorno (4-5 dias pós-cirurgia).' },
      { id: 13, name: '2º Retorno Pós-Operatório', order: 13, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 2 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Retorno semanal.' },
      { id: 14, name: '3º Retorno Pós-Operatório', order: 14, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 3 }, notifyRules: { beforeDue: 1, onDue: true, afterDue: 0 }, description: 'Retorno semanal.' },
      { id: 15, name: '4º Retorno Pós-Operatório', order: 15, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 4 }, notifyRules: { beforeDue: 2, onDue: true, afterDue: 1 }, description: 'Retorno quinzenal.' },
      { id: 16, name: '5º Retorno (Alta)', order: 16, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 5 }, notifyRules: { beforeDue: 3, onDue: true, afterDue: 1 }, description: 'Retorno de alta (aprox. 60 dias).' },
      { id: 17, name: 'Retorno de 6 Meses', order: 17, event: 'Cirurgia', deadline: { type: 'post_op', return_number: 6 }, notifyRules: { beforeDue: 7, onDue: true, afterDue: 0 }, description: 'Acompanhamento de longo prazo.' },
    ].sort((a, b) => a.order - b.order);
    setStages(mockStages);
  }, []);

  const reorderStages = (updatedStages) => {
    return updatedStages.sort((a, b) => a.order - b.order).map((stage, index) => ({ ...stage, order: index + 1 }));
  };

  const handleAddStage = (stageData) => {
    const newStage = {
      ...stageData,
      id: stages.length > 0 ? Math.max(...stages.map(s => s.id)) + 1 : 1,
      order: stages.length + 1
    };
    const updatedStages = reorderStages([...stages, newStage]);
    setStages(updatedStages);
    toast({ title: "Nova etapa adicionada com sucesso!" });
  };
  
  const handleUpdateStage = (stageData) => {
    const updatedStages = stages.map(stage =>
      stage.id === stageData.id ? { ...stage, ...stageData } : stage
    );
    setStages(reorderStages(updatedStages));
    toast({ title: "Etapa atualizada com sucesso!" });
  };

  const handleDeleteStage = (stageId) => {
    const updatedStages = stages.filter(stage => stage.id !== stageId);
    setStages(reorderStages(updatedStages));
    toast({ title: "Etapa removida com sucesso!" });
  };

  const moveStage = (stageId, direction) => {
    const index = stages.findIndex(s => s.id === stageId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stages.length - 1)) {
      return;
    }
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    setStages(reorderStages(newStages));
    toast({ title: "Ordem das etapas atualizada!" });
  };

  return (
    <div className="space-y-6">
      <ProtocolHeader onAddStage={handleAddStage} />
      <ProtocolOverview stages={stages} />
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            index={index}
            onMove={(direction) => moveStage(stage.id, direction)}
            onUpdate={handleUpdateStage}
            onDelete={() => handleDeleteStage(stage.id)}
            isFirst={index === 0}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>

      {stages.length === 0 && <NoStages onAddStage={handleAddStage} />}
    </div>
  );
};

export default ProtocolConfig;