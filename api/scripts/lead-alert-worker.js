/**
 * Lead Alert Worker - Monitor SLA de Resposta de Leads
 * 
 * Este worker monitora mensagens não respondidas e envia alertas
 * baseado nos SLAs configurados (1h, 4h, 24h)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

class LeadAlertWorker {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    this.config = {
      enabled: process.env.ENABLE_LEAD_ALERT_WORKER === 'true',
      checkInterval: parseInt(process.env.LEAD_ALERT_CHECK_INTERVAL) || 300000, // 5min
      slaLevels: {
        level1: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_1) || 3600000,   // 1h
        level2: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_2) || 14400000,  // 4h
        level3: parseInt(process.env.LEAD_ALERT_SLA_LEVEL_3) || 86400000   // 24h
      },
      maxRetries: parseInt(process.env.LEAD_ALERT_MAX_RETRIES) || 3,
      webhookUrl: process.env.LEAD_ALERT_WEBHOOK_URL,
      emailNotifications: process.env.LEAD_ALERT_EMAIL_NOTIFICATIONS === 'true'
    };

    this.isRunning = false;
    this.intervalId = null;
  }

  async start() {
    if (!this.config.enabled) {
      console.log('🟡 Lead Alert Worker: DESABILITADO (ENABLE_LEAD_ALERT_WORKER=false)');
      return;
    }

    if (this.isRunning) {
      console.log('⚠️ Lead Alert Worker: Já está executando');
      return;
    }

    console.log('🚀 Lead Alert Worker: Iniciando...');
    console.log(`📊 Configuração: Verificação a cada ${this.config.checkInterval/1000}s`);
    console.log(`⏰ SLAs: ${this.config.slaLevels.level1/3600000}h | ${this.config.slaLevels.level2/3600000}h | ${this.config.slaLevels.level3/3600000}h`);

    this.isRunning = true;
    
    // Primeira verificação imediata
    await this.checkLeads();
    
    // Agendar verificações periódicas
    this.intervalId = setInterval(() => {
      this.checkLeads().catch(error => {
        console.error('❌ Erro na verificação de leads:', error);
      });
    }, this.config.checkInterval);

    console.log('✅ Lead Alert Worker: Ativo');
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Lead Alert Worker: Parado');
  }

  async checkLeads() {
    try {
      const now = new Date();
      console.log(`🔍 Verificando leads não respondidos... (${now.toISOString()})`);

      // Primeiro, vamos verificar se conseguimos conectar
      console.log('🔌 Testando conexão com Supabase...');
      
      const { data: testData, error: testError } = await this.supabase
        .from('ai_messages')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('❌ Erro na conexão Supabase:', testError);
        throw new Error(`Erro de conexão: ${testError.message}`);
      }

      console.log('✅ Conexão com Supabase OK');

      // Buscar mensagens (query super simples para teste)
      console.log('� Buscando mensagens de entrada...');
      const { data: messages, error } = await this.supabase
        .from('ai_messages')
        .select('id, content, created_at, direction')
        .eq('direction', 'inbound')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('❌ Erro na query de mensagens:', error);
        throw new Error(`Erro ao buscar mensagens: ${error.message}`);
      }

      console.log(`📋 Encontradas ${messages?.length || 0} mensagens de entrada`);

      if (messages && messages.length > 0) {
        console.log('📝 Exemplo de mensagem:', {
          id: messages[0].id,
          content: messages[0].content?.substring(0, 50) + '...',
          created_at: messages[0].created_at
        });

        // Para cada mensagem, calcular tempo de espera
        messages.forEach((message, index) => {
          const messageTime = new Date(message.created_at);
          const timeSinceMessage = now.getTime() - messageTime.getTime();
          const hoursWaiting = Math.floor(timeSinceMessage / 3600000);
          const minutesWaiting = Math.floor((timeSinceMessage % 3600000) / 60000);

          if (hoursWaiting > 0 || minutesWaiting > 15) { // Alerta para mensagens > 15min
            console.log(`⚠️  Mensagem ${index + 1}: Aguardando há ${hoursWaiting}h${minutesWaiting}m`);
            console.log(`   Conteúdo: "${message.content?.substring(0, 80)}..."`);
          }
        });
      } else {
        console.log('✅ Nenhuma mensagem de entrada encontrada');
      }

    } catch (error) {
      console.error('❌ Erro na verificação de leads:', error);
      throw error;
    }
  }

  async processUnrepliedMessage(message, now) {
    const messageTime = new Date(message.created_at);
    const timeSinceMessage = now.getTime() - messageTime.getTime();

    // Determinar qual nível de SLA foi atingido
    let alertLevel = null;
    let alertColor = '';
    let urgency = '';

    if (timeSinceMessage >= this.config.slaLevels.level3) {
      alertLevel = 3;
      alertColor = '🔴';
      urgency = 'CRÍTICO';
    } else if (timeSinceMessage >= this.config.slaLevels.level2) {
      alertLevel = 2;
      alertColor = '🟠';
      urgency = 'ALTO';
    } else if (timeSinceMessage >= this.config.slaLevels.level1) {
      alertLevel = 1;
      alertColor = '🟡';
      urgency = 'MÉDIO';
    }

    if (!alertLevel) {
      return; // Ainda não atingiu nenhum SLA
    }

      // Verificar se já foi enviado alerta para este nível
      const alertKey = `lead_alert_${message.id}_level_${alertLevel}`;
      const { data: existingAlert } = await this.supabase
        .from('system_alerts')
        .select('id, retry_count')
        .eq('alert_key', alertKey)
        .single();    // Se já foi enviado e atingiu máximo de tentativas, pular (simplificado)
    // TODO: Implementar controle de repetição com cache/tabela

    const hoursWaiting = Math.floor(timeSinceMessage / 3600000);
    const minutesWaiting = Math.floor((timeSinceMessage % 3600000) / 60000);

    console.log(`${alertColor} ALERTA ${urgency}: Lead sem resposta há ${hoursWaiting}h${minutesWaiting}m`);
    console.log(`📱 Conversa: ${message.conversation_id}`);
    console.log(`💬 Mensagem: "${message.content.substring(0, 100)}..."`);

    // Registrar o alerta (simplificado - apenas log por enquanto)
    console.log(`📝 Alert Key: ${alertKey}`);

    // Enviar notificações
    await this.sendNotifications(message, alertLevel, urgency, hoursWaiting, minutesWaiting);
  }

  async recordAlert(message, alertLevel, alertKey, timeSinceMessage) {
    try {
      const alertData = {
        alert_key: alertKey,
        conversation_id: message.conversation_id,
        message_id: message.id,
        alert_level: alertLevel,
        time_since_message: timeSinceMessage,
        created_at: new Date().toISOString(),
        retry_count: 1,
        metadata: {
          user_id: message.user_id,
          channel: message.ai_conversations.channel,
          message_preview: message.content.substring(0, 200)
        }
      };

      // Tentar inserir novo alerta ou incrementar retry_count
      const { data: existingAlert } = await this.supabase
        .from('system_alerts')
        .select('id, retry_count')
        .eq('alert_key', alertKey)
        .single();

      if (existingAlert) {
        // Incrementar contador
        await this.supabase
          .from('system_alerts')
          .update({ 
            retry_count: existingAlert.retry_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAlert.id);
      } else {
        // Criar novo alerta
        await this.supabase
          .from('system_alerts')
          .insert(alertData);
      }

    } catch (error) {
      console.error('❌ Erro ao registrar alerta:', error);
    }
  }

  async sendNotifications(message, alertLevel, urgency, hours, minutes) {
    // Console notification (sempre ativo)
    console.log(`📢 Notificação ${urgency}: Conversa ${message.conversation_id} aguarda resposta há ${hours}h${minutes}m`);

    // Webhook notification
    if (this.config.webhookUrl) {
      try {
        const webhookPayload = {
          type: 'lead_alert',
          level: alertLevel,
          urgency: urgency,
          conversation_id: message.conversation_id,
          message_id: message.id,
          waiting_time: { hours, minutes },
          message_preview: message.content.substring(0, 200),
          channel: 'unknown', // será atualizado quando descobrirmos a estrutura
          timestamp: new Date().toISOString()
        };

        // Aqui você pode implementar a chamada HTTP para o webhook
        console.log('🌐 Webhook payload:', JSON.stringify(webhookPayload, null, 2));
      } catch (error) {
        console.error('❌ Erro ao enviar webhook:', error);
      }
    }

    // Email notifications (futuro)
    if (this.config.emailNotifications) {
      console.log('📧 Email notification (TODO): Implementar integração de email');
    }
  }

  // Método para criar tabela de alerts se não existir
  async createAlertsTableIfNotExists() {
    try {
      const { error } = await this.supabase.rpc('create_system_alerts_table');
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Erro ao criar tabela system_alerts:', error);
      }
    } catch (error) {
      console.log('ℹ️ Tabela system_alerts: usando estrutura existente');
    }
  }
}

// Gerenciador principal
const worker = new LeadAlertWorker();

// Handlers para encerramento gracioso
process.on('SIGINT', async () => {
  console.log('\n⚡ Recebido SIGINT - Encerrando worker...');
  await worker.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚡ Recebido SIGTERM - Encerrando worker...');
  await worker.stop();
  process.exit(0);
});

// Iniciar worker
if (require.main === module) {
  worker.start().catch(error => {
    console.error('💥 Falha fatal no Lead Alert Worker:', error);
    process.exit(1);
  });
}

module.exports = LeadAlertWorker;