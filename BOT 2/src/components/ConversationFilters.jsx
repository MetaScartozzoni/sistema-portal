import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Tag, Flag } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const ConversationFilters = ({ filters, setFilters }) => {
  const { tags } = useData();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const priorityOptions = [
    { value: 'all', label: 'Todas Prioridades' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-10 bg-white/10 text-white border-white/20 placeholder:text-gray-400"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
       <div className="relative">
        <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger className="w-full pl-10 bg-white/10 text-white border-white/20">
            <SelectValue placeholder="Filtrar por prioridade..." />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="relative">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Select value={filters.tag} onValueChange={(value) => handleFilterChange('tag', value)}>
          <SelectTrigger className="w-full pl-10 bg-white/10 text-white border-white/20">
            <SelectValue placeholder="Filtrar por etiqueta..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Etiquetas</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag.id} value={tag.id.toString()}>{tag.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConversationFilters;