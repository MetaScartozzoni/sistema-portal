import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Upload, File } from 'lucide-react';

const AddDocumentModal = ({ open, onOpenChange, documentType, editingItem, onSave }) => {
  const { addDocument, updateDocument, addLog } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [fileName, setFileName] = useState('');

  const isEditing = !!editingItem;

  useEffect(() => {
    if (isEditing) {
      setFormData(editingItem);
      setFileName(editingItem.fileName || '');
    } else {
      setFormData({});
      setFileName('');
    }
  }, [editingItem, open]);

  const getTitleAndFields = () => {
    const baseFields = {
      institutional: [
        { name: 'name', label: 'Nome do Documento', type: 'text' },
        { name: 'content', label: 'Conteúdo', type: 'textarea' },
      ],
      emailTemplates: [
        { name: 'name', label: 'Nome do Modelo', type: 'text' },
        { name: 'subject', label: 'Assunto', type: 'text' },
        { name: 'body', label: 'Corpo do E-mail', type: 'textarea' },
      ],
      systemMessages: [
        { name: 'description', label: 'Descrição', type: 'text' },
        { name: 'key', label: 'Chave (ex: welcome_msg)', type: 'text' },
        { name: 'content', label: 'Conteúdo da Mensagem', type: 'textarea' },
      ],
    };

    return {
      title: `${isEditing ? 'Editar' : 'Novo'} ${
        {
          institutional: 'Documento Institucional',
          emailTemplates: 'Modelo de E-mail',
          systemMessages: 'Mensagem do Sistema',
        }[documentType] || 'Item'
      }`,
      fields: baseFields[documentType] || [],
    };
  };

  const { title, fields } = getTitleAndFields();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData((prev) => ({ ...prev, fileName: file.name }));
      toast({
        title: "Arquivo selecionado!",
        description: `"${file.name}" pronto para upload. O salvamento real do arquivo não é suportado neste ambiente de demonstração.`,
      });
    }
  };

  const resetForm = () => {
    setFormData({});
    setFileName('');
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isEditing) {
        updateDocument(documentType, editingItem.id, formData);
        addLog({
          action: 'document.update',
          user: 'Administrador',
          description: `Documento '${formData.name || formData.description}' atualizado em '${documentType}'.`,
          level: 'info',
        });
        toast({
          title: 'Modelo atualizado com sucesso!',
          description: 'As alterações foram salvas no sistema.',
        });
      } else {
        addDocument(documentType, formData);
        addLog({
          action: 'document.create',
          user: 'Administrador',
          description: `Novo documento '${formData.name || formData.description}' criado em '${documentType}'.`,
          level: 'info',
        });
        toast({
          title: 'Modelo criado com sucesso!',
          description: 'O novo modelo foi adicionado ao sistema.',
        });
      }
      onSave();
      resetForm();
    } catch (error) {
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'criar'} modelo`,
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[650px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditing ? 'Altere as informações abaixo.' : 'Preencha as informações abaixo para criar o novo modelo.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-white">
                  {field.label}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white min-h-[150px]"
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                )}
              </div>
            ))}

            {(documentType === 'institutional' || documentType === 'emailTemplates') && (
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-white">
                  Anexar Arquivo (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    {fileName ? (
                      <div className="text-center text-green-400">
                        <File className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm font-medium">{fileName}</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm">Clique para fazer upload</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isEditing ? 'Salvar Alterações' : 'Salvar Modelo'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;