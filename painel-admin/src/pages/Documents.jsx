import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileSignature, Mail, MessageSquare, Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import AddDocumentModal from '@/components/AddDocumentModal';
import SystemMessageModal from '@/components/SystemMessageModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx";

const Documents = () => {
  const { documents, deleteDocument, addLog } = useData();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSystemMessageModalOpen, setIsSystemMessageModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const [currentDocType, setCurrentDocType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [selectedSystemMessage, setSelectedSystemMessage] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const forceUpdate = React.useReducer(() => ({}), {})[1];

  const handleOpenModal = (docType, item = null) => {
    setCurrentDocType(docType);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalSave = useCallback(() => {
    forceUpdate();
  }, []);

  const handleCardClick = (docType, item) => {
    switch (docType) {
      case 'institutional':
        handleOpenModal(docType, item);
        break;
      case 'emailTemplates':
        window.location.href = `mailto:?subject=${encodeURIComponent(item.subject)}&body=${encodeURIComponent(item.body)}`;
        break;
      case 'systemMessages':
        setSelectedSystemMessage(item);
        setIsSystemMessageModalOpen(true);
        break;
      default:
        break;
    }
  };

  const confirmDeleteItem = (section, id) => {
    setItemToDelete({ section, id });
    setIsAlertOpen(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteDocument(itemToDelete.section, itemToDelete.id);
      addLog({
        action: 'document.delete',
        user: 'Administrador',
        description: `Documento removido da seção '${itemToDelete.section}'.`,
        level: 'warning'
      });
      toast({
        title: "Modelo removido!",
        description: "O modelo foi removido com sucesso do sistema.",
      });
      setItemToDelete(null);
      setIsAlertOpen(false);
    }
  };

  const SectionContent = ({ title, icon: Icon, docType, data, children }) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          {title}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => handleOpenModal(docType)}
          className="mt-4 sm:mt-0 border-white/20 text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modelo
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {children(item, docType)}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Documentos e Modelos - Portal Admin Clínica</title>
        <meta name="description" content="Gerencie documentos institucionais, modelos de e-mail e mensagens do sistema." />
      </Helmet>

      <AddDocumentModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        documentType={currentDocType}
        editingItem={editingItem}
        onSave={handleModalSave}
      />
      
      <SystemMessageModal
        open={isSystemMessageModalOpen}
        onOpenChange={setIsSystemMessageModalOpen}
        messageItem={selectedSystemMessage}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="glass-effect border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o modelo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-gray-600 hover:bg-gray-700 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700 text-white">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Documentos e Modelos</h1>
          <p className="text-gray-400">Gerencie documentos, e-mails e mensagens do sistema em um só lugar.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="institutional" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-white/5 border border-white/10">
              <TabsTrigger value="institutional" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <FileSignature className="w-4 h-4 mr-2" />
                Institucionais
              </TabsTrigger>
              <TabsTrigger value="emails" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Mail className="w-4 h-4 mr-2" />
                Modelos de E-mail
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <MessageSquare className="w-4 h-4 mr-2" />
                Mensagens do Sistema
              </TabsTrigger>
            </TabsList>

            <TabsContent value="institutional">
              <SectionContent title="Documentos Institucionais" icon={FileSignature} docType="institutional" data={documents.institutional}>
                {(item, docType) => (
                  <Card className="glass-effect border-white/10 card-hover flex flex-col h-full cursor-pointer" onClick={() => handleCardClick(docType, item)}>
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                      <CardDescription>Modificado em: {new Date(item.lastModified).toLocaleDateString('pt-BR')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-300 text-sm line-clamp-3">{item.content}</p>
                    </CardContent>
                    <CardFooter className="mt-auto pt-4 flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 z-10" onClick={(e) => {e.stopPropagation(); confirmDeleteItem(docType, item.id)}}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 z-10" onClick={(e) => {e.stopPropagation(); handleOpenModal(docType, item)}}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </SectionContent>
            </TabsContent>

            <TabsContent value="emails">
              <SectionContent title="Modelos de E-mail" icon={Mail} docType="emailTemplates" data={documents.emailTemplates}>
                {(item, docType) => (
                  <Card className="glass-effect border-white/10 card-hover flex flex-col h-full cursor-pointer" onClick={() => handleCardClick(docType, item)}>
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center justify-between">{item.name} <ExternalLink className="w-4 h-4 text-gray-400" /></CardTitle>
                      <CardDescription>Assunto: {item.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <p className="text-gray-300 text-sm line-clamp-3">{item.body}</p>
                    </CardContent>
                    <CardFooter className="mt-auto pt-4 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 z-10" onClick={(e) => {e.stopPropagation(); confirmDeleteItem(docType, item.id)}}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 z-10" onClick={(e) => {e.stopPropagation(); handleOpenModal(docType, item)}}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </SectionContent>
            </TabsContent>

            <TabsContent value="messages">
              <SectionContent title="Mensagens do Sistema" icon={MessageSquare} docType="systemMessages" data={documents.systemMessages}>
                {(item, docType) => (
                  <Card className="glass-effect border-white/10 card-hover flex flex-col h-full cursor-pointer" onClick={() => handleCardClick(docType, item)}>
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{item.description}</CardTitle>
                      <CardDescription>Chave: <span className="font-mono">{item.key}</span></CardDescription>
                    </CardHeader>
                     <CardContent className="flex-grow">
                       <p className="text-gray-300 text-sm line-clamp-3">{item.content}</p>
                    </CardContent>
                    <CardFooter className="mt-auto pt-4 flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 z-10" onClick={(e) => {e.stopPropagation(); confirmDeleteItem(docType, item.id)}}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 z-10" onClick={(e) => {e.stopPropagation(); handleOpenModal(docType, item)}}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </SectionContent>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default Documents;