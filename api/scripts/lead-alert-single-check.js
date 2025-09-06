/**
 * Lead Alert Worker - Execução Única (Single Check)
 * Para executar manualmente ou via cron
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkLeadsOnce() {
  console.log('🚀 Lead Alert Worker - Verificação Única');
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
    
    // Buscar mensagens de entrada não respondidas
    const { data: messages, error } = await supabase
      .from('ai_messages')
      .select('id, content, created_at, direction, conversation_id')
      .eq('direction', 'inbound')
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar mensagens: ${error.message}`);
    }
    
    if (!messages || messages.length === 0) {
      console.log('✅ Nenhuma mensagem de entrada encontrada');
      return;
    }
    
    console.log(`📋 Analisando ${messages.length} mensagens de entrada...`);
    
    const now = new Date();
    let alertsFound = 0;
    
    // Analisar cada mensagem
    for (const message of messages) {
      const messageTime = new Date(message.created_at);
      const timeSinceMessage = now.getTime() - messageTime.getTime();
      
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
        console.log(`💬 Mensagem: "${message.content?.substring(0, 100)}..."`);
        console.log(`📅 Criada em: ${messageTime.toLocaleString('pt-BR')}`);
        console.log('─'.repeat(50));
      }
    }
    
    if (alertsFound === 0) {
      console.log('✅ Nenhum alerta de SLA encontrado - todos os leads estão dentro do prazo');
    } else {
      console.log(`⚠️  Total de alertas encontrados: ${alertsFound}`);
    }
    
    console.log('✅ Verificação concluída');
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message);
    process.exit(1);
  }
}

// Executar verificação única
checkLeadsOnce().then(() => {
  console.log('🏁 Finalizando verificação...');
  process.exit(0);
});
