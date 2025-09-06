import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MessageSquare, AlertCircle, Tag, MoreVertical, Edit2, Trash2, CheckCircle, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

const ConversationCard = ({ message }) => {
  const navigate = useNavigate();
  const { tags: allTags } = useData();
  const { toast } = useToast();

  const timeAgo = (dateString) => {
    if (!dateString) return 'agora';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 5) return "agora";
    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;
    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;
    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)}min`;
    return `há ${Math.floor(seconds)}s`;
  };

  const priorityConfig = {
    baixa: { label: 'Baixa', color: 'bg-gray-500', icon: <Flag className="h-3 w-3" /> },
    media: { label: 'Média', color: 'bg-yellow-500 text-black', icon: <Flag className="h-3 w-3" /> },
    alta: { label: 'Alta', color: 'bg-orange-500', icon: <Flag className="h-3 w-3" /> },
    urgente: { label: 'Urgente', color: 'bg-red-600', icon: <AlertCircle className="h-3 w-3" /> }
  };

  const getPriorityDetails = (priority) => {
    return priorityConfig[priority] || priorityConfig.media;
  };
  
  const handleAction = () => {
     toast({ title: "🚧 Funcionalidade Desativada", description: "Esta ação requer uma conexão com o banco de dados." });
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Card className="dark:glass-effect-strong hover:shadow-purple-500/20 dark:hover:border-purple-400/50 transition-all duration-300">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-purple-500 text-white">
                  {message.patientName?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground flex items-center">
                  {message.patientName} 
                  {message.isNewPatient && <Badge variant="secondary" className="ml-2 text-xs">Novo</Badge>}
                </p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {message.patientId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                {message.priority && (
                  <Badge className={`${getPriorityDetails(message.priority).color} text-white flex items-center gap-1`}>
                    {getPriorityDetails(message.priority).icon}
                    {getPriorityDetails(message.priority).label}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Flag className="mr-2 h-4 w-4" />
                        <span>Prioridade</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={handleAction}>Baixa</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleAction}>Média</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleAction}>Alta</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleAction}>Urgente</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Etiquetas</span>
                      </DropdownMenuSubTrigger>
                       <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           {allTags.map(tag => (
                             <DropdownMenuCheckboxItem
                               key={tag.id}
                               checked={message.tags && message.tags.includes(tag.id)}
                               onCheckedChange={handleAction}
                             >
                               {tag.name}
                             </DropdownMenuCheckboxItem>
                           ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(`/conversation/${message.contact_id}`)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Ver & Responder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={handleAction}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Arquivar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            <MessageSquare className="h-4 w-4 mr-2 inline-block text-gray-400" />
            {message.content}
          </p>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
             {(message.tags && message.tags.length > 0) &&
                allTags
                  .filter(t => message.tags.includes(t.id))
                  .map(tag => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white">{tag.name}</Badge>
                ))
              }
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(message.created_at)}</span>
            </div>
            <Button
              size="sm"
              variant="glass"
              className="text-xs"
              onClick={() => navigate(`/conversation/${message.contact_id}`)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Atender
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConversationCard;