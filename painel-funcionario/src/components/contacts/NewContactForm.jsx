import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const NewContactForm = ({ onSave, onClose }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        contact_reason: '',
        status: 'new',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast({
            title: '🚧 Funcionalidade Desconectada',
            description: 'A conexão com o banco de dados foi removida.',
        });
        setTimeout(() => {
            setLoading(false);
            onSave();
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Novo Contato</DialogTitle>
                <DialogDescription>Adicione um novo lead ou contato manualmente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="contact_reason">Motivo do Contato (Opcional)</Label>
                    <Input id="contact_reason" name="contact_reason" value={formData.contact_reason} onChange={handleChange} />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" className="btn-primary" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar Contato
                </Button>
            </DialogFooter>
        </form>
    );
};

export default NewContactForm;