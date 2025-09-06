
import React from 'react';
import { Mail, Phone, Edit, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const PatientInfoHeader = ({ patient, onCall, onUpdatePatient }) => {
  const { toast } = useToast();

  const handleCall = (type) => {
    if (onCall) {
      onCall(patient, type);
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage alt="Avatar do paciente" src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xl text-white font-bold">{patient.name}</h4>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              Ativo
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3 text-gray-300">
            <Mail className="w-4 h-4 flex-shrink-0 text-purple-400" />
            <span className="truncate">{patient.email || 'E-mail não cadastrado'}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <Phone className="w-4 h-4 flex-shrink-0 text-purple-400" />
            <span className="truncate">{patient.phone || 'Telefone não cadastrado'}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => toast({ title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}>
            <Edit className="w-3 h-3 mr-2" /> Editar Cadastro
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" disabled={!patient.phone}>
                Contato Rápido
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-white/20 text-white">
              <DropdownMenuItem onSelect={() => handleCall('phone')} className="cursor-pointer hover:!bg-white/10">
                <Phone className="w-4 h-4 mr-2" /> Ligar (Voz)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleCall('whatsapp')} className="cursor-pointer hover:!bg-white/10">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoHeader;
