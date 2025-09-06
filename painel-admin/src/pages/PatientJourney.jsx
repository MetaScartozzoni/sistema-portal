import React from 'react';
import { Helmet } from 'react-helmet';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GripVertical } from 'lucide-react';

const PatientJourney = () => {
    const { users, patientJourney, updatePatientJourney, updateUser, addLog } = useData();
    const { toast } = useToast();

    const patients = users.filter(u => u.role === 'paciente' || u.role === 'contact');

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = patientJourney.columns[source.droppableId];
        const finish = patientJourney.columns[destination.droppableId];

        if (start === finish) {
            const newPatientIds = Array.from(start.patientIds);
            newPatientIds.splice(source.index, 1);
            newPatientIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                patientIds: newPatientIds,
            };

            const newJourney = {
                ...patientJourney,
                columns: {
                    ...patientJourney.columns,
                    [newColumn.id]: newColumn,
                },
            };

            updatePatientJourney(newJourney);
            return;
        }

        const startPatientIds = Array.from(start.patientIds);
        startPatientIds.splice(source.index, 1);
        const newStart = {
            ...start,
            patientIds: startPatientIds,
        };

        const finishPatientIds = Array.from(finish.patientIds);
        finishPatientIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            patientIds: finishPatientIds,
        };

        const newJourney = {
            ...patientJourney,
            columns: {
                ...patientJourney.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        updatePatientJourney(newJourney);
        
        const patient = users.find(u => u.id === draggableId);
        const previousStatus = start.title;
        const newStatus = finish.title;

        const updateData = { journeyStatus: newStatus };
        if (newStatus === 'Alta') {
            updateData.dischargedAt = new Date().toISOString();
        } else {
            updateData.dischargedAt = null;
        }

        updateUser(draggableId, updateData);
        
        addLog({
            action: 'patient.journey.update',
            user: 'Administrador',
            description: `Status de ${patient.name} alterado de '${previousStatus}' para '${newStatus}'.`,
            level: 'info'
        });

        toast({
            title: 'Jornada do Paciente Atualizada!',
            description: `${patient.name} movido para a coluna "${newStatus}".`
        });
    };

    return (
        <>
            <Helmet>
                <title>Jornada do Paciente - Portal Admin</title>
                <meta name="description" content="Acompanhe o progresso dos pacientes em um painel Kanban." />
            </Helmet>
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold text-white mb-2">Jornada do Paciente</h1>
                    <p className="text-gray-400">Arraste e solte os cards para atualizar o status do tratamento de cada paciente.</p>
                </motion.div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {patientJourney.columnOrder.map(columnId => {
                            const column = patientJourney.columns[columnId];
                            const columnPatients = column.patientIds.map(patientId => patients.find(p => p.id === patientId)).filter(Boolean);
                            
                            return (
                                <Droppable key={column.id} droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <Card 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`glass-effect border-white/10 flex flex-col transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-500/10' : 'bg-white/5'}`}
                                        >
                                            <CardHeader>
                                                <CardTitle className="gradient-text">{column.title} ({columnPatients.length})</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow space-y-3 overflow-y-auto p-4">
                                                {columnPatients.map((patient, index) => (
                                                    <Draggable key={patient.id} draggableId={patient.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-4 rounded-lg bg-white/10 border border-white/20 transition-shadow duration-200 flex items-center gap-4 ${snapshot.isDragging ? 'shadow-lg shadow-blue-500/30' : ''}`}
                                                            >
                                                                <GripVertical className="w-5 h-5 text-gray-500" />
                                                                <Avatar className="w-10 h-10">
                                                                    <AvatarImage src={patient.avatar} alt={patient.name} />
                                                                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-semibold text-white">{patient.name}</p>
                                                                    <p className="text-sm text-gray-400">{patient.email}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </CardContent>
                                        </Card>
                                    )}
                                </Droppable>
                            );
                        })}
                    </div>
                </DragDropContext>
            </div>
        </>
    );
};

export default PatientJourney;