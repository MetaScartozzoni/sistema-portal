import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const surgeryTypes = [
    "Rinoplastia",
    "Mamoplastia de Aumento",
    "Mamoplastia Redutora",
    "Mastopexia",
    "Abdominoplastia",
    "Lipoaspiração",
    "Blefaroplastia",
    "Otoplastia",
];

const TemplateAtendimento = ({ content, setContent, patientId }) => {
    const [peso, setPeso] = useState(content.avaliacao_corporal?.peso || '');
    const [altura, setAltura] = useState(content.avaliacao_corporal?.altura || '');
    const [imc, setImc] = useState(content.avaliacao_corporal?.imc || '');

    useEffect(() => {
        if (peso > 0 && altura > 0) {
            const alturaMetros = altura / 100;
            const imcCalculado = (peso / (alturaMetros * alturaMetros)).toFixed(2);
            setImc(imcCalculado);
            setContent(prev => ({
                ...prev,
                avaliacao_corporal: { ...prev.avaliacao_corporal, peso, altura, imc: imcCalculado }
            }));
        } else {
            setImc('');
        }
    }, [peso, altura]);

    const handlePesoChange = (e) => {
        const value = e.target.value;
        setPeso(value);
        setContent(prev => ({ ...prev, avaliacao_corporal: { ...prev.avaliacao_corporal, peso: value } }));
    };

    const handleAlturaChange = (e) => {
        const value = e.target.value;
        setAltura(value);
        setContent(prev => ({ ...prev, avaliacao_corporal: { ...prev.avaliacao_corporal, altura: value } }));
    };

    const handleChange = (field, value, subField = null) => {
        if (subField) {
            setContent(prev => ({ ...prev, [field]: { ...prev[field], [subField]: value } }));
        } else {
            setContent(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div className="space-y-6 text-white">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Queixa Principal</label>
                <Textarea value={content.queixa_principal || ''} onChange={(e) => handleChange('queixa_principal', e.target.value)} placeholder="Descreva a queixa principal do paciente..." className="bg-slate-700 border-slate-600 text-white min-h-[80px]" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">História da Doença Atual (HDA)</label>
                <Textarea value={content.hda || ''} onChange={(e) => handleChange('hda', e.target.value)} placeholder="Detalhes sobre a condição atual..." className="bg-slate-700 border-slate-600 text-white min-h-[120px]" />
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Avaliação Corporal</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Peso (kg)" placeholder="70" value={peso} onChange={handlePesoChange} type="number" />
                    <InputGroup label="Altura (cm)" placeholder="175" value={altura} onChange={handleAlturaChange} type="number" />
                    <InputGroup label="IMC" placeholder="-" value={imc} readOnly />
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-3">Sinais Vitais</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Pressão Arterial" placeholder="120/80 mmHg" value={content.pressao_arterial || ''} onChange={(e) => handleChange('pressao_arterial', e.target.value)} />
                    <InputGroup label="Freq. Cardíaca" placeholder="72 bpm" value={content.freq_cardiaca || ''} onChange={(e) => handleChange('freq_cardiaca', e.target.value)} />
                    <InputGroup label="Freq. Respiratória" placeholder="16 rpm" value={content.freq_respiratoria || ''} onChange={(e) => handleChange('freq_respiratoria', e.target.value)} />
                    <InputGroup label="Temperatura" placeholder="36.5°C" value={content.temperatura || ''} onChange={(e) => handleChange('temperatura', e.target.value)} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Exame Físico</label>
                <Textarea value={content.exame_fisico || ''} onChange={(e) => handleChange('exame_fisico', e.target.value)} placeholder="Descrição do exame físico..." className="bg-slate-700 border-slate-600 text-white min-h-[100px]" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hipótese Diagnóstica</label>
                <Input value={content.hipotese_diagnostica || ''} onChange={(e) => handleChange('hipotese_diagnostica', e.target.value)} placeholder="CID-10 ou descrição" className="bg-slate-700 border-slate-600 text-white" />
            </div>

            <div className="p-4 bg-slate-700/30 rounded-lg space-y-4">
                <h4 className="text-lg font-medium text-white">Indicação Cirúrgica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Nome da Cirurgia (Procedimento Principal)" placeholder="Ex: Rinoplastia + Septoplastia" value={content.indicacao_cirurgica?.nome_cirurgia || ''} onChange={(e) => handleChange('indicacao_cirurgica', e.target.value, 'nome_cirurgia')} />
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Cirurgia</label>
                        <Select onValueChange={(value) => handleChange('indicacao_cirurgica', value, 'tipo_cirurgia')} value={content.indicacao_cirurgica?.tipo_cirurgia}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {surgeryTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plano Terapêutico</label>
                <Textarea value={content.plano_terapeutico || ''} onChange={(e) => handleChange('plano_terapeutico', e.target.value)} placeholder="Condutas, medicações, exames solicitados..." className="bg-slate-700 border-slate-600 text-white min-h-[100px]" />
            </div>
        </div>
    );
};

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <Input {...props} className={`bg-slate-700 border-slate-600 text-white ${props.readOnly ? 'opacity-70' : ''}`} />
    </div>
);

export default TemplateAtendimento;