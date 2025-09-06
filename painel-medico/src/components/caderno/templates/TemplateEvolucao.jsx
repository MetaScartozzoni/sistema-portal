import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Camera, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TemplateEvolucao = ({ content, setContent }) => {
    const { toast } = useToast();

    const handleChange = (field, value, subField = null, subSubField = null) => {
        setContent(prev => {
            const newContent = { ...prev };
            if (subSubField) {
                newContent[field] = {
                    ...newContent[field],
                    [subField]: {
                        ...newContent[field]?.[subField],
                        [subSubField]: value
                    }
                };
            } else if (subField) {
                newContent[field] = {
                    ...newContent[field],
                    [subField]: value
                };
            } else {
                newContent[field] = value;
            }
            return newContent;
        });
    };

    const handlePhotoUpload = () => {
        toast({
            title: "🚧 Upload de Fotos",
            description: "Funcionalidade de upload de fotos ainda não implementada. Você pode solicitá-la no próximo prompt! 🚀",
        });
    };

    const dor = content.sinais_inflamatorios?.dor || 0;

    return (
        <div className="space-y-6 text-white">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Evolução Subjetiva</label>
                <Textarea
                    value={content.subjetivo || ''}
                    onChange={(e) => handleChange('subjetivo', e.target.value)}
                    placeholder="Relato do paciente, queixas, melhora ou piora dos sintomas..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Avaliação Pós-operatória</h4>
                <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Volume do Dreno (ml)" placeholder="50" type="number" value={content.avaliacao_pos_op?.volume_dreno || ''} onChange={(e) => handleChange('avaliacao_pos_op', e.target.value, 'volume_dreno')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sinais Inflamatórios</label>
                        <div className="flex items-center gap-6">
                            <CheckboxGroup label="Rubor" checked={content.sinais_inflamatorios?.rubor || false} onChange={(e) => handleChange('sinais_inflamatorios', e.target.checked, 'rubor')} />
                            <CheckboxGroup label="Calor" checked={content.sinais_inflamatorios?.calor || false} onChange={(e) => handleChange('sinais_inflamatorios', e.target.checked, 'calor')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Escala de Dor: <span className="font-bold text-blue-400">{dor}</span></label>
                        <Slider
                            defaultValue={[dor]}
                            max={10}
                            step={1}
                            onValueChange={(value) => handleChange('sinais_inflamatorios', value[0], 'dor')}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Estado da Ferida Operatória</label>
                        <Textarea
                            value={content.avaliacao_pos_op?.estado_ferida || ''}
                            onChange={(e) => handleChange('avaliacao_pos_op', e.target.value, 'estado_ferida')}
                            placeholder="Aspecto da incisão, presença de secreções, cicatrização..."
                            className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Fotografias de Acompanhamento</h4>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                    <Button variant="outline" onClick={handlePhotoUpload} className="w-full border-dashed border-slate-500 hover:border-blue-500">
                        <Camera className="w-4 h-4 mr-2" />
                        Adicionar Fotos
                    </Button>
                    {/* Placeholder for uploaded images */}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plano e Conduta</label>
                <Textarea
                    value={content.plano || ''}
                    onChange={(e) => handleChange('plano', e.target.value)}
                    placeholder="Mudanças na medicação, solicitação de novos exames, orientações, agendamento de retorno..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
            </div>
        </div>
    );
};

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <Input {...props} className="bg-slate-700 border-slate-600 text-white" />
    </div>
);

const CheckboxGroup = ({ label, ...props }) => (
    <div className="flex items-center gap-2">
        <input type="checkbox" {...props} id={label} className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-blue-600 focus:ring-blue-500" />
        <label htmlFor={label} className="text-sm text-slate-300">{label}</label>
    </div>
);

export default TemplateEvolucao;