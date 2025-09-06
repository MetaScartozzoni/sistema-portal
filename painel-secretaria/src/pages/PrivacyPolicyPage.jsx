
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, FileText, Database } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Política de Privacidade e LGPD - Clínica Médica</title>
        <meta name="description" content="Conheça nossa política de privacidade e como tratamos seus dados de acordo com a LGPD." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardHeader className="text-center">
              <ShieldCheck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-4xl font-extrabold">Política de Privacidade e LGPD</CardTitle>
              <p className="text-gray-300 mt-2">Seu bem-estar e sua privacidade são nossa prioridade.</p>
            </CardHeader>
            <CardContent className="space-y-8 text-gray-200 text-lg leading-relaxed px-8 pb-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><FileText className="mr-3 text-pink-400" />Introdução</h2>
                <p>A presente Política de Privacidade e Proteção de Dados Pessoais tem por finalidade demonstrar o nosso compromisso com a sua privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Detalhamos como coletamos, usamos, armazenamos e protegemos seus dados pessoais.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><Database className="mr-3 text-pink-400" />Coleta e Uso de Dados Pessoais</h2>
                <p>Coletamos dados pessoais essenciais para a prestação de nossos serviços de saúde, como nome, contato, data de nascimento e informações de saúde (dados sensíveis). Esses dados são utilizados para:</p>
                <ul className="list-disc list-inside mt-4 space-y-2 pl-4">
                  <li>Agendamento e confirmação de consultas e procedimentos.</li>
                  <li>Criação e manutenção do seu prontuário eletrônico.</li>
                  <li>Comunicação sobre seu tratamento e informações relevantes da clínica.</li>
                  <li>Cumprimento de obrigações legais e regulatórias.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><ShieldCheck className="mr-3 text-pink-400" />Segurança dos Dados</h2>
                <p>Adotamos medidas de segurança técnicas e administrativas rigorosas para proteger seus dados contra acessos não autorizados, perda, alteração ou destruição. O acesso aos seus dados é restrito apenas a profissionais autorizados e que necessitam das informações para a execução de suas funções.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><FileText className="mr-3 text-pink-400" />Direitos do Titular</h2>
                <p>De acordo com a LGPD, você possui o direito de:</p>
                 <ul className="list-disc list-inside mt-4 space-y-2 pl-4">
                  <li>Confirmar a existência de tratamento de seus dados.</li>
                  <li>Acessar seus dados.</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                  <li>Solicitar a portabilidade dos dados a outro fornecedor de serviço.</li>
                  <li>Revogar o consentimento a qualquer momento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><Database className="mr-3 text-pink-400" />Contato</h2>
                <p>Para exercer seus direitos ou para qualquer esclarecimento sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através dos nossos canais oficiais de atendimento.</p>
              </section>
            </CardContent>
          </Card>

           <div className="mt-8 text-center">
            <Button 
                onClick={() => navigate('/register')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Cadastro
            </Button>
          </div>

        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
