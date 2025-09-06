import React from 'react';
import { Clock, User, Edit, CheckCircle, XCircle, MoreVertical, Video, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const AppointmentDetails = ({ appointment, onEdit, onQuickUpdate }) => {
    const { toast } = useToast();

    const getStatusInfo = (status) => {
        switch (status) {
            case 'agendado': return { text: 'Agendado', color: 'border-blue-500/50 bg-blue-500/10', textColor: 'text-blue-300' };
            case 'concluido': return { text: 'Concluído', color: 'border-green-500/50 bg-green-500/10', textColor: 'text-green-300' };
            case 'cancelado': return { text: 'Cancelado', color: 'border-red-500/50 bg-red-500/10', textColor: 'text-red-300' };
            default: return { text: 'Pendente', color: 'border-yellow-500/50 bg-yellow-500/10', textColor: 'text-yellow-300' };
        }
    };

    const handleCopyLink = () => {
        if (appointment.whereby_link) {
            navigator.clipboard.writeText(appointment.whereby_link);
            toast({ title: '✅ Link copiado!', description: 'O link da reunião foi copiado para a área de transferência.' });
        }
    };

    const statusInfo = getStatusInfo(appointment.status);
    
    const startTimeObj = appointment.appointment_time ? new Date(appointment.appointment_time) : null;
    const endTimeObj = appointment.end_at ? new Date(appointment.end_at) : null;

    const startTime = startTimeObj && !isNaN(startTimeObj) ? startTimeObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Inválido';
    const endTime = endTimeObj && !isNaN(endTimeObj) ? endTimeObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Inválido';

    const isOnline = appointment.visit_type === 'online';

    return (
        <div className={`p-4 rounded-lg glass-effect border-l-4 ${statusInfo.color} hover:bg-white/10 transition-all duration-200`}>
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-medium capitalize flex items-center gap-2">
                        {isOnline && <Video className="w-4 h-4 text-cyan-400" />}
                        {appointment.visit_type}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-300 mt-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.patient?.full_name || 'Paciente não encontrado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{startTime} - {endTime}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`status-badge ${statusInfo.color.replace('border-', 'bg-').replace('/50', '/20')} ${statusInfo.textColor} border-none`}>
                        {statusInfo.text}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(appointment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                            {isOnline && appointment.whereby_link && (
                                <DropdownMenuItem onClick={handleCopyLink}>
                                    <Copy className="mr-2 h-4 w-4 text-cyan-400"/>
                                    <span>Copiar Link da Reunião</span>
                                </DropdownMenuItem>
                            )}
                            {appointment.status !== 'concluido' && (
                                <DropdownMenuItem onClick={() => onQuickUpdate(appointment.id, 'concluido')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                                    <span>Concluir</span>
                                </DropdownMenuItem>
                            )}
                            {appointment.status !== 'cancelado' && (
                                <DropdownMenuItem onClick={() => onQuickUpdate(appointment.id, 'cancelado')}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-400" />
                                    <span>Cancelar</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {appointment.reason && <p className="text-sm text-gray-400 mt-2 pt-2 border-t border-white/10">Motivo: {appointment.reason}</p>}
        </div>
    );
};

export default AppointmentDetails;