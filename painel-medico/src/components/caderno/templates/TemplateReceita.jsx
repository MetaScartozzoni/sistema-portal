import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const padraoReceitas = [
    { med: 'Amoxicilina 500mg', pos: 'Tomar 1 comprimido de 8/8 horas por 7 dias.' },
    { med: 'Dipirona 500mg', pos: 'Tomar 1 comprimido até de 6/6 horas se dor ou febre.' },
    { med: 'Ibuprofeno 600mg', pos: 'Tomar 1 comprimido de 12/12 horas por 5 dias.' },
];

const TemplateReceita = ({ content, setContent }) => {
    const [medicamentos, setMedicamentos] = useState(content.medicamentos || []);

    const updateContent = (newMedicamentos) => {
        setMedicamentos(newMedicamentos);
        setContent(prev => ({ ...prev, medicamentos: newMedicamentos }));
    };

    const addMedicamento = (med = '', pos = '') => {
        updateContent([...medicamentos, { med, pos }]);
    };

    const removeMedicamento = (index) => {
        updateContent(medicamentos.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const newMedicamentos = [...medicamentos];
        newMedicamentos[index][field] = value;
        updateContent(newMedicamentos);
    };

    return (
        <div className="space-y-6 text-white">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Receituário</label>
                <Input
                    value={content.tipo_receituario || 'Receituário Simples'}
                    onChange={(e) => setContent(prev => ({ ...prev, tipo_receituario: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                />
            </div>
            
            <div>
                <h4 className="text-lg font-medium text-white mb-3">Prescrição</h4>
                <div className="space-y-4">
                    {medicamentos.map((item, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg space-y-3 relative">
                            <Input
                                value={item.med}
                                onChange={(e) => handleChange(index, 'med', e.target.value)}
                                placeholder="Nome do Medicamento, forma e dosagem"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                            <Textarea
                                value={item.pos}
                                onChange={(e) => handleChange(index, 'pos', e.target.value)}
                                placeholder="Posologia (Ex: Tomar 1 comprimido de 8/8 horas por 7 dias)"
                                className="bg-slate-800 border-slate-600 text-white min-h-[60px]"
                            />
                            <Button size="icon" variant="ghost" onClick={() => removeMedicamento(index)} className="absolute top-2 right-2 text-red-400 hover:bg-red-900/50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => addMedicamento()} className="mt-3 border-slate-600 hover:border-blue-500">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Medicamento
                </Button>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Adicionar Prescrições Padrão</h4>
                <div className="flex flex-wrap gap-2">
                    {padraoReceitas.map(receita => (
                        <Button
                            key={receita.med}
                            size="sm"
                            variant="secondary"
                            onClick={() => addMedicamento(receita.med, receita.pos)}
                            className="bg-slate-600 hover:bg-slate-500 text-white"
                        >
                            {receita.med}
                        </Button>
                    ))}
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Orientações Adicionais</label>
                <Textarea
                    value={content.orientacoes || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, orientacoes: e.target.value }))}
                    placeholder="Recomendações gerais, repouso, alimentação, etc."
                    className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                />
            </div>
        </div>
    );
};

export default TemplateReceita;