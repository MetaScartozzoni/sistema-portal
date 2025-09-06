import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Info } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const renderField = (field, formData, setFormData) => {
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [field.name]: e.target.value }));
  };

  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          id={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          placeholder={field.label}
          className="bg-white/10 border-white/20 text-white"
        />
      );
    case 'date':
      return (
        <Input
          id={field.name}
          type="date"
          value={formData[field.name] || ''}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white"
        />
      );
    case 'datetime-local':
       return (
        <Input
          id={field.name}
          type="datetime-local"
          value={formData[field.name] || ''}
          onChange={handleChange}
          className="bg-white/10 border-white/20 text-white"
        />
      );
    case 'text':
    default:
      return (
        <Input
          id={field.name}
          type="text"
          value={formData[field.name] || ''}
          onChange={handleChange}
          placeholder={field.label}
          className="bg-white/10 border-white/20 text-white"
        />
      );
  }
};

const SendDocumentDialog = ({ open, onOpenChange, patient, document }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceText, setReferenceText] = useState('');

  useEffect(() => {
    if (document && patient) {
      const initialFormData = (document.editable_fields || []).reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {});
      setFormData(initialFormData);

      let text = document.reference_content || '';
      text = text.replace(/{patient_name}/g, patient.name);
      setReferenceText(text);
    } else {
      setFormData({});
      setReferenceText('');
    }
  }, [document, patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-botconversa-webhook', {
        body: {
          patient_id: patient.id,
          template_id: document.id,
          form_data: formData,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Sucesso!',
        description: `Documento "${document.name}" enviado para ${patient.name} via BotConversa.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar documento',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !document) return null;

  const editableFields = document.editable_fields || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Enviar via BotConversa</h3>
          <p className="text-gray-400 mb-6">Enviando "{document.name}" para {patient.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {editableFields.length > 0 ? (
              editableFields.map(field => (
                <div key={field.name}>
                  <Label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-2">{field.label}</Label>
                  {renderField(field, formData, setFormData)}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Este modelo não possui campos editáveis.</p>
            )}

            {referenceText && (
              <div className="mt-4 p-3 bg-black/20 border border-white/10 rounded-lg">
                <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><Info className="w-4 h-4 mr-2"/> Texto de Referência (não será enviado)</p>
                <p className="text-xs text-gray-400 italic whitespace-pre-wrap">{referenceText}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default SendDocumentDialog;