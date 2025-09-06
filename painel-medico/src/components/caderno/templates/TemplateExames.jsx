import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const padraoExames = [
    'Hemograma completo',
    'Coagulograma',
    'Glicemia de jejum',
    'Ureia e creatinina',
    'Eletrocardiograma (ECG)',
    'Radiografia de tórax PA e perfil',
    'Tipagem Sanguínea e Fator RH'
];

const TemplateExames = ({ content, setContent }) => {
    const [exames, setExames] = useState(content.lista_exames || []);

    const updateContent = (newExames) => {
        setExames(newExames);
        setContent(prev => ({ ...prev, lista_exames: newExames }));
    };

    const addExame = (exame = '') => {
        updateContent([...exames, exame]);
    };

    const removeExame = (index) => {
        updateContent(exames.filter((_, i) => i !== index));
    };

    const handleExameChange = (index, value) => {
        const newExames = [...exames];
        newExames[index] = value;
        updateContent(newExames);
    };

    return (
        <div className="space-y-6 text-white">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hipótese Diagnóstica / Indicação Clínica</label>
                <Input
                    value={content.indicacao_clinica || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, indicacao_clinica: e.target.value }))}
                    placeholder="Ex: Pré-operatório para Rinoplastia"
                    className="bg-slate-700 border-slate-600 text-white"
                />
            </div>
            
            <div>
                <h4 className="text-lg font-medium text-white mb-3">Exames Solicitados</h4>
                <div className="space-y-3">
                    {exames.map((exame, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={exame}
                                onChange={(e) => handleExameChange(index, e.target.value)}
                                placeholder="Nome do exame"
                                className="bg-slate-700 border-slate-600 text-white flex-1"
                            />
                            <Button size="icon" variant="ghost" onClick={() => removeExame(index)} className="text-red-400 hover:bg-red-900/50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => addExame()} className="mt-3 border-slate-600 hover:border-blue-500">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Exame
                </Button>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Adicionar Exames Padrão</h4>
                <div className="flex flex-wrap gap-2">
                    {padraoExames.map(exame => (
                        <Button
                            key={exame}
                            size="sm"
                            variant="secondary"
                            onClick={() => addExame(exame)}
                            className="bg-slate-600 hover:bg-slate-500 text-white"
                        >
                            {exame}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateExames;