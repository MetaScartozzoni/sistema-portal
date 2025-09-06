
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, MessageSquare as MessageSquareQuestion, ShieldCheck, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/components/ui/use-toast';

// Mock function to simulate an API call
const submitResponse = async (patientId, response) => {
  console.log(`Simulating budget response for patient ${patientId}: ${response}`);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  if (response === 'approved') {
    return { success: true, message: 'Orçamento aprovado com sucesso!' };
  } else {
    return { success: true, message: 'Sua solicitação de contato foi enviada. A equipe comercial entrará em contato em breve.' };
  }
};

const BudgetResponsePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [responseSent, setResponseSent] = useState(null);

  // Mock patient data - in a real app, this would be fetched
  const patient = { name: 'Ana Silva', id: '1' }; 
  const budgetDetails = {
    procedure: 'Rinoplastia Estruturada',
    value: 'R$ 25.000,00',
    includes: ['Honorários Médicos', 'Custos Hospitalares', 'Anestesia', 'Acompanhamento Pós-operatório (1 ano)'],
  };

  const handleResponse = async (responseType) => {
    setIsLoading(true);
    try {
      const result = await submitResponse(patientId, responseType);
      if (result.success) {
        setResponseSent(responseType);
        toast({
          title: 'Resposta Enviada!',
          description: result.message,
        });
      } else {
        throw new Error('Falha ao enviar resposta.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar sua resposta. Por favor, tente novamente ou entre em contato com a clínica.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (responseSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Obrigado! - Resposta de Orçamento</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <ShieldCheck className="w-24 h-24 mx-auto text-emerald-400 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Obrigado, {patient.name}!</h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            {responseSent === 'approved' 
              ? 'Recebemos a sua aprovação! Nossa equipe financeira entrará em contato em breve para os próximos passos.' 
              : 'Sua solicitação foi registrada. Um de nossos consultores entrará em contato para esclarecer todas as suas dúvidas.'}
          </p>
          <Button onClick={() => navigate('/')} className="mt-8 bg-white text-purple-700 hover:bg-gray-200">
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Resposta de Orçamento - Clínica Médica</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-800/80 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Resposta sobre o Orçamento</CardTitle>
            <p className="text-center text-gray-400">Olá, {patient.name}! Por favor, confirme sua decisão abaixo.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold text-purple-300 mb-2">{budgetDetails.procedure}</h3>
              <p className="text-4xl font-bold mb-4">{budgetDetails.value}</p>
              <ul className="space-y-2 text-sm">
                {budgetDetails.includes.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-center text-gray-500">
              Este é um resumo do seu orçamento. Para detalhes completos, consulte o documento enviado previamente.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="w-full bg-red-500 hover:bg-red-600 text-white flex-1"
              onClick={() => handleResponse('questions')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquareQuestion className="mr-2 h-5 w-5" />
              )}
              Tenho Dúvidas / Falar com a Equipe
            </Button>
            <Button
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
              onClick={() => handleResponse('approved')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-5 w-5" />
              )}
              Aprovar Orçamento
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BudgetResponsePage;
