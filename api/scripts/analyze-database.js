/**
 * Análise Completa da Estrutura do Banco de Dados
 * Verifica tabelas, colunas, relacionamentos e dependências
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function analyzeDatabase() {
  console.log('🔍 ANÁLISE COMPLETA DA ESTRUTURA DO BANCO DE DADOS');
  console.log('='.repeat(60));
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 1. LISTAR TODAS AS TABELAS
    console.log('📊 1. TABELAS DISPONÍVEIS:');
    console.log('-'.repeat(30));
    
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) {
      // Método alternativo - tentar algumas tabelas conhecidas
      const knownTables = [
        'ai_messages', 'ai_conversations', 'conversations', 'messages', 
        'users', 'profiles', 'auth.users', 'chat_messages', 'appointments',
        'patients', 'doctors', 'system_alerts'
      ];
      
      console.log('📋 Verificando tabelas conhecidas...');
      
      for (const tableName of knownTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!error) {
            console.log(`✅ ${tableName} - EXISTE`);
            
            // Analisar estrutura da tabela
            if (data && data.length > 0) {
              const columns = Object.keys(data[0]);
              console.log(`   📝 Colunas (${columns.length}): ${columns.join(', ')}`);
              console.log(`   📊 Registros: ${data.length > 0 ? 'COM DADOS' : 'VAZIA'}`);
            } else {
              // Tentar obter estrutura mesmo sem dados
              const { data: structure } = await supabase
                .from(tableName)
                .select('*')
                .limit(0);
              console.log(`   📝 Tabela vazia, mas estrutura acessível`);
            }
          }
        } catch (err) {
          console.log(`❌ ${tableName} - NÃO EXISTE ou SEM ACESSO`);
        }
      }
    }
    
    console.log('\n🔗 2. ANÁLISE DE RELACIONAMENTOS:');
    console.log('-'.repeat(40));
    
    // 2. TESTAR RELACIONAMENTOS ENTRE TABELAS PRINCIPAIS
    const relationships = [
      {
        from: 'ai_messages',
        to: 'ai_conversations',
        foreignKey: 'conversation_id',
        description: 'Mensagens -> Conversas'
      },
      {
        from: 'ai_messages',
        to: 'users',
        foreignKey: 'user_id',
        description: 'Mensagens -> Usuários'
      },
      {
        from: 'ai_conversations',
        to: 'users',
        foreignKey: 'user_id',
        description: 'Conversas -> Usuários'
      },
      {
        from: 'messages',
        to: 'conversations',
        foreignKey: 'conversation_id',
        description: 'Messages -> Conversations'
      }
    ];
    
    for (const rel of relationships) {
      try {
        const { data, error } = await supabase
          .from(rel.from)
          .select(`*, ${rel.to}(*)`)
          .limit(1);
        
        if (!error) {
          console.log(`✅ ${rel.description}: RELACIONAMENTO OK`);
        } else {
          console.log(`❌ ${rel.description}: ${error.message}`);
        }
      } catch (err) {
        console.log(`❌ ${rel.description}: ERRO - ${err.message}`);
      }
    }
    
    console.log('\n📋 3. ESTRUTURA DETALHADA DAS TABELAS PRINCIPAIS:');
    console.log('-'.repeat(50));
    
    // 3. ANÁLISE DETALHADA DAS PRINCIPAIS TABELAS
    const mainTables = ['ai_messages', 'ai_conversations', 'users'];
    
    for (const tableName of mainTables) {
      console.log(`\n🗂️  TABELA: ${tableName.toUpperCase()}`);
      
      try {
        // Buscar um registro para análise
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Erro: ${error.message}`);
          continue;
        }
        
        if (data && data.length > 0) {
          const record = data[0];
          console.log(`   📊 Status: CONTÉM DADOS`);
          console.log(`   📝 Colunas encontradas:`);
          
          Object.entries(record).forEach(([column, value]) => {
            const type = typeof value;
            const preview = value ? String(value).substring(0, 50) : 'null';
            console.log(`      • ${column}: ${type} - "${preview}"`);
          });
        } else {
          console.log(`   📊 Status: TABELA VAZIA`);
          
          // Tentar inserir um registro de teste para ver a estrutura
          console.log(`   🔍 Tentando descobrir estrutura...`);
          
          if (tableName === 'ai_messages') {
            // Testar estrutura esperada para ai_messages
            const testInsert = {
              content: 'Teste de estrutura',
              direction: 'inbound',
              created_at: new Date().toISOString()
            };
            
            const { data: insertTest, error: insertError } = await supabase
              .from(tableName)
              .insert(testInsert)
              .select();
            
            if (insertError) {
              console.log(`   ⚠️  Estrutura inferida do erro: ${insertError.message}`);
            } else {
              console.log(`   ✅ Registro de teste inserido com sucesso`);
              console.log(`   📝 Estrutura confirmada:`, Object.keys(insertTest[0]));
            }
          }
        }
        
      } catch (err) {
        console.log(`   💥 Erro crítico: ${err.message}`);
      }
    }
    
    console.log('\n🔧 4. RECOMENDAÇÕES PARA O LEAD ALERT WORKER:');
    console.log('-'.repeat(50));
    
    // 4. VERIFICAR SE AS COLUNAS NECESSÁRIAS EXISTEM
    const requiredColumns = {
      'ai_messages': ['id', 'content', 'direction', 'created_at', 'conversation_id', 'user_id'],
      'ai_conversations': ['id', 'user_id', 'status', 'created_at'],
      'users': ['id', 'email', 'created_at']
    };
    
    for (const [table, columns] of Object.entries(requiredColumns)) {
      console.log(`\n📋 ${table}:`);
      
      try {
        const { data, error } = await supabase
          .from(table)
          .select(columns.join(','))
          .limit(1);
        
        if (!error) {
          console.log(`   ✅ Todas as colunas necessárias existem`);
          console.log(`   📝 Colunas: ${columns.join(', ')}`);
        } else {
          console.log(`   ❌ Problema: ${error.message}`);
          
          // Testar coluna por coluna
          for (const column of columns) {
            try {
              const { error: colError } = await supabase
                .from(table)
                .select(column)
                .limit(1);
              
              if (colError) {
                console.log(`      ❌ ${column}: NÃO EXISTE`);
              } else {
                console.log(`      ✅ ${column}: OK`);
              }
            } catch (e) {
              console.log(`      ❌ ${column}: ERRO`);
            }
          }
        }
      } catch (err) {
        console.log(`   💥 Tabela inacessível: ${err.message}`);
      }
    }
    
    console.log('\n📊 5. RESUMO E PRÓXIMOS PASSOS:');
    console.log('-'.repeat(40));
    console.log('✅ Análise concluída');
    
  } catch (error) {
    console.error('💥 Erro na análise:', error.message);
  }
}

// Executar análise
analyzeDatabase().then(() => {
  console.log('\n🏁 Análise finalizada');
  process.exit(0);
});
