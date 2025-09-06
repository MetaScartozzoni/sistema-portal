/**
 * Teste simples do Lead Alert Worker
 * Executa uma vez e termina
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testWorker() {
  console.log('🚀 Teste do Lead Alert Worker - Versão Simples');
  
  try {
    // Conectar ao Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('🔌 Testando conexão...');
    
    // Teste básico de conexão
    const { data, error } = await supabase
      .from('ai_messages')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro de conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão OK');
    
    // Buscar mensagens
    const { data: messages, error: msgError } = await supabase
      .from('ai_messages')
      .select('id, content, created_at, direction')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (msgError) {
      console.error('❌ Erro ao buscar mensagens:', msgError.message);
      return;
    }
    
    console.log(`📊 Total de mensagens encontradas: ${messages?.length || 0}`);
    
    if (messages && messages.length > 0) {
      console.log('📝 Primeiras mensagens:');
      messages.forEach((msg, i) => {
        const timeAgo = new Date() - new Date(msg.created_at);
        const hoursAgo = Math.floor(timeAgo / (1000 * 60 * 60));
        console.log(`  ${i+1}. ${msg.direction} - ${hoursAgo}h atrás - "${msg.content?.substring(0,50)}..."`);
      });
    }
    
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

// Executar teste
testWorker().then(() => {
  console.log('🏁 Finalizando...');
  process.exit(0);
});
