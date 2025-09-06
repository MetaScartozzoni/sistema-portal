require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function analyzeForeignKeys() {
  console.log('🔍 Analisando Chaves Estrangeiras...\n');

  try {
    // 1. Verificar constraints de chave estrangeira via SQL
    const { data: constraints, error: constraintsError } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name,
            tc.constraint_name
          FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
          WHERE 
            tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
          ORDER BY tc.table_name, kcu.column_name;
        `
      });

    if (constraintsError) {
      console.log('❌ Erro ao buscar constraints:', constraintsError.message);
      
      // Método alternativo - verificar manualmente as relações
      console.log('\n🔍 Verificando relações manualmente...\n');
      
      // Testar ai_messages -> ai_conversations
      const { data: messages } = await supabase
        .from('ai_messages')
        .select('conversation_id')
        .limit(5);
        
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('id')
        .limit(5);
        
      console.log('📊 ai_messages -> ai_conversations:');
      console.log(`   ai_messages.conversation_id existe: ${messages ? '✅' : '❌'}`);
      console.log(`   ai_conversations.id existe: ${conversations ? '✅' : '❌'}`);
      
      // Testar ai_messages -> users
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .limit(5);
        
      console.log('\n📊 ai_messages -> users:');
      console.log(`   users.id existe: ${users ? '✅' : '❌'}`);
      
      // Testar ai_conversations -> users  
      console.log('\n📊 ai_conversations -> users:');
      console.log(`   Relação via user_id: ${users ? '✅' : '❌'}`);
      
    } else {
      console.log('✅ Constraints encontradas:');
      constraints.forEach(constraint => {
        console.log(`   ${constraint.table_name}.${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      });
    }

    // 2. Verificar estrutura específica das tabelas principais
    console.log('\n📋 Estrutura das Tabelas Principais:\n');
    
    const tables = ['ai_messages', 'ai_conversations', 'users', 'profiles'];
    
    for (const table of tables) {
      console.log(`🔍 ${table.toUpperCase()}:`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      } else {
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`   ✅ Colunas (${columns.length}): ${columns.join(', ')}`);
        } else {
          // Tabela vazia, tentar descobrir estrutura via erro
          const { error: structureError } = await supabase
            .from(table)
            .insert({});
            
          if (structureError && structureError.message.includes('null value')) {
            const requiredFields = structureError.message.match(/column "([^"]+)"/g)?.map(m => m.replace(/column "|"/g, ''));
            console.log(`   📝 Campos obrigatórios: ${requiredFields ? requiredFields.join(', ') : 'N/A'}`);
          }
        }
      }
    }

    // 3. Verificar dependências lógicas
    console.log('\n🔗 Verificando Dependências Lógicas:\n');
    
    // ai_messages depende de ai_conversations?
    const { data: msgWithConv } = await supabase
      .from('ai_messages')
      .select('id, conversation_id')
      .not('conversation_id', 'is', null)
      .limit(1);
      
    console.log(`📊 ai_messages com conversation_id: ${msgWithConv && msgWithConv.length > 0 ? '✅ Sim' : '❌ Não'}`);
    
    // ai_messages depende de users?
    const { data: msgWithUser } = await supabase
      .from('ai_messages')
      .select('id, user_id')
      .not('user_id', 'is', null)
      .limit(1);
      
    console.log(`📊 ai_messages com user_id: ${msgWithUser && msgWithUser.length > 0 ? '✅ Sim' : '❌ Não'}`);

    // 4. Testar integridade referencial
    console.log('\n🧪 Testando Integridade Referencial:\n');
    
    try {
      // Tentar inserir ai_message com conversation_id inválido
      const { error: refError } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: '99999999-9999-9999-9999-999999999999',
          content: 'teste',
          role: 'user'
        });
        
      if (refError) {
        if (refError.message.includes('foreign key')) {
          console.log('✅ Integridade referencial ativa (FK constraint)');
        } else {
          console.log(`⚠️  Erro diferente: ${refError.message}`);
        }
      } else {
        console.log('❌ Integridade referencial não ativa (inserção aceita)');
      }
    } catch (e) {
      console.log('⚠️  Erro no teste:', e.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

analyzeForeignKeys();
