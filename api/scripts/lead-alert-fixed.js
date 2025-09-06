/**
 * Lead Alert Worker - Versão Corrigida com Estrutura Real
 * Baseado na análise completa da estrutura do banco
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkLeadsWithRealStructure() {
  console.log('🚀 Lead Alert Worker - Versão com Estrutura Real');
  console.log(`⏰ Executado em: ${new Date().toISOString()}`);
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Configuração de SLA
    const slaLevels = {
      level1: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_1) || 3600000,   // 1h
      level2: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_2) || 14400000,  // 4h
      level3: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_3) || 86400000   // 24h
    };
    
    console.log(`📊 SLAs: ${slaLevels.level1/3600000}h | ${slaLevels.level2/3600000}h | ${slaLevels.level3/3600000}h`);
    
    // QUERY CORRIGIDA: Usar estrutura real das tabelas
    const { data: inboundMessages, error } = await supabase
      .from('ai_messages')
      .select(`
        id,
        conversation_id,
        user_id,
        content,
        direction,
        created_at,
        channel,
        status,
        assigned_user_id,
        role
      `)
      .eq('direction', 'inbound')
      .is('assigned_user_id', null)  // Mensagens não atribuídas
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar mensagens: ${error.message}`);
    }
    
    if (!inboundMessages || inboundMessages.length === 0) {
      console.log('✅ Nenhuma mensagem de entrada não atribuída encontrada');
      return;
    }
    
    console.log(`📋 Analisando ${inboundMessages.length} mensagens não atribuídas...`);
    
    const now = new Date();
    let alertsFound = 0;
    let responseNeeded = 0;
    
    // Analisar cada mensagem
    for (const message of inboundMessages) {
      const messageTime = new Date(message.created_at);
      const timeSinceMessage = now.getTime() - messageTime.getTime();
      
      // Verificar se precisa de resposta (baseado no status ou tempo)
      const needsResponse = !message.assigned_user_id && 
                           (message.status === 'pending' || !message.status);
      
      if (needsResponse) {
        responseNeeded++;
        
        let alertLevel = null;
        let alertColor = '';
        let urgency = '';
        
        if (timeSinceMessage >= slaLevels.level3) {
          alertLevel = 3;
          alertColor = '🔴';
          urgency = 'CRÍTICO';
        } else if (timeSinceMessage >= slaLevels.level2) {
          alertLevel = 2;
          alertColor = '🟠';
          urgency = 'ALTO';
        } else if (timeSinceMessage >= slaLevels.level1) {
          alertLevel = 1;
          alertColor = '🟡';
          urgency = 'MÉDIO';
        }
        
        if (alertLevel) {
          alertsFound++;
          const hoursWaiting = Math.floor(timeSinceMessage / 3600000);
          const minutesWaiting = Math.floor((timeSinceMessage % 3600000) / 60000);
          
          console.log(`${alertColor} ALERTA ${urgency}: Lead sem resposta há ${hoursWaiting}h${minutesWaiting}m`);
          console.log(`📱 Conversa: ${message.conversation_id}`);
          console.log(`👤 Usuário: ${message.user_id || 'N/A'}`);
          console.log(`📺 Canal: ${message.channel || 'N/A'}`);
          console.log(`🎭 Role: ${message.role || 'N/A'}`);
          console.log(`📊 Status: ${message.status || 'N/A'}`);
          console.log(`💬 Mensagem: "${message.content?.substring(0, 100)}..."`);
          console.log(`📅 Criada em: ${messageTime.toLocaleString('pt-BR')}`);
          console.log('─'.repeat(60));
        } else {
          // Mensagem dentro do SLA, mas ainda monitorando
          const minutesWaiting = Math.floor(timeSinceMessage / 60000);
          if (minutesWaiting > 5) { // Log apenas se > 5 minutos
            console.log(`⏱️  Aguardando resposta há ${minutesWaiting} minutos - Conversa: ${message.conversation_id}`);
          }
        }
      }
    }
    
    // Resumo final
    console.log('='.repeat(60));
    console.log(`📊 RESUMO:`);
    console.log(`   Total de mensagens analisadas: ${inboundMessages.length}`);
    console.log(`   Mensagens aguardando resposta: ${responseNeeded}`);
    console.log(`   Alertas de SLA disparados: ${alertsFound}`);
    
    if (alertsFound === 0 && responseNeeded === 0) {
      console.log('✅ Excelente! Nenhum lead pendente - Sistema em dia');
    } else if (alertsFound === 0) {
      console.log('🟢 Bom! Leads pendentes dentro do SLA');
    } else {
      console.log('⚠️  ATENÇÃO! Leads com SLA estourado requerem ação imediata');
    }
    
    console.log('✅ Verificação concluída');
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message);
    process.exit(1);
  }
}

// Executar verificação
checkLeadsWithRealStructure().then(() => {
  console.log('🏁 Finalizando verificação...');
  process.exit(0);
});
