import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Plus } from 'lucide-react';

import MessageToolbar from '@/components/messages/MessageToolbar';
import MessageList from '@/components/messages/MessageList';
import MessageContent from '@/components/messages/MessageContent';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

const Messages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);

    const messages = [
        { id: 1, from: 'Maria Silva Santos', subject: 'Reagendamento de consulta', preview: 'Gostaria de reagendar minha consulta marcada para quinta-feira...', content: 'Olá, gostaria de reagendar minha consulta marcada para quinta-feira às 14h. Tive um imprevisto no trabalho e não conseguirei comparecer. Poderia ser na sexta-feira no mesmo horário? Aguardo retorno. Obrigada!', timestamp: '2025-08-13T10:30:00', status: 'unread', priority: 'normal', type: 'patient', hasAttachment: false },
        { id: 2, from: 'Dr. João Carvalho', subject: 'Relatório de exames - Paciente Roberto', preview: 'Segue em anexo o relatório dos exames do paciente Roberto Ferreira...', content: 'Prezada secretária, segue em anexo o relatório dos exames do paciente Roberto Ferreira realizados na semana passada. Por favor, agende um retorno para discussão dos resultados na próxima semana. Os exames mostram algumas alterações que precisam ser acompanhadas.', timestamp: '2025-08-13T09:15:00', status: 'read', priority: 'high', type: 'doctor', hasAttachment: true },
        { id: 3, from: 'Ana Paula Costa', subject: 'Dúvida sobre medicação', preview: 'Tenho uma dúvida sobre a medicação prescrita na última consulta...', content: 'Boa tarde! Tenho uma dúvida sobre a medicação prescrita na última consulta. O médico disse para tomar 2 vezes ao dia, mas não especificou se é antes ou depois das refeições. Poderia me esclarecer? Muito obrigada!', timestamp: '2025-08-12T16:45:00', status: 'read', priority: 'normal', type: 'patient', hasAttachment: false },
        { id: 4, from: 'Laboratório Central', subject: 'Resultados de exames disponíveis', preview: 'Os resultados dos exames dos pacientes estão disponíveis para retirada...', content: 'Informamos que os resultados dos exames dos seguintes pacientes estão disponíveis: João Santos, Maria Oliveira e Carlos Silva. Os exames podem ser retirados no laboratório ou enviados por email mediante autorização. Favor entrar em contato para coordenar a entrega.', timestamp: '2025-08-12T14:20:00', status: 'unread', priority: 'normal', type: 'lab', hasAttachment: false },
        { id: 5, from: 'Convênio Saúde Plus', subject: 'URGENTE: Autorização necessária', preview: 'Solicitação de autorização para procedimento do paciente Carlos...', content: 'URGENTE: Necessária autorização para procedimento cirúrgico do paciente Carlos Oliveira. O prazo para envio da documentação é até amanhã às 17h. Favor providenciar com urgência os seguintes documentos: relatório médico, exames pré-operatórios e formulário de solicitação preenchido.', timestamp: '2025-08-12T11:30:00', status: 'unread', priority: 'urgent', type: 'insurance', hasAttachment: false },
        { id: 6, from: 'Botconversa', subject: 'Agendamento automático: Joana Pereira', preview: 'A paciente Joana Pereira agendou uma consulta para 20/08 às 15h.', content: 'Agendamento automático realizado pelo Botconversa.\n\nPaciente: Joana Pereira\nData: 20/08/2025\nHorário: 15:00\nTipo: Primeira Consulta\n\nO agendamento foi confirmado com a paciente e adicionado ao calendário.', timestamp: '2025-08-13T11:00:00', status: 'unread', priority: 'normal', type: 'bot', hasAttachment: false }
    ];

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.preview.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'unread' && message.status === 'unread') ||
            (selectedFilter === 'read' && message.status === 'read') ||
            (selectedFilter === 'urgent' && message.priority === 'urgent');
        return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const unreadCount = messages.filter(m => m.status === 'unread').length;

    return (
        <>
            <Helmet>
                <title>Mensagens - Portal Secretaria</title>
                <meta name="description" content="Central de mensagens - Gerencie todas as comunicações com pacientes, médicos e fornecedores" />
            </Helmet>

            <div className="flex flex-col h-full space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">
                            Mensagens
                            {unreadCount > 0 && <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">{unreadCount}</span>}
                        </h1>
                        <p className="text-gray-400">Central de comunicações</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="btn-primary mt-4 md:mt-0"><Plus className="w-4 h-4 mr-2" />Nova Mensagem</Button>
                        </DialogTrigger>
                        <NewMessageDialog />
                    </Dialog>
                </motion.div>

                <div className="flex-shrink-0">
                    <MessageToolbar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow min-h-0">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-1 h-full">
                        <MessageList
                            messages={filteredMessages}
                            selectedMessage={selectedMessage}
                            onSelectMessage={setSelectedMessage}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 h-full hidden lg:block">
                        <Card className="h-full">
                            {selectedMessage ? (
                                <MessageContent message={selectedMessage} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Selecione uma mensagem</h3>
                                        <p className="text-gray-400">Escolha uma mensagem da lista para visualizar</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Messages;