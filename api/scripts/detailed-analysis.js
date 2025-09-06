require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function detailedTableAnalysis() {
  console.log('🔍 Análise Detalhada das Tabelas\n');

  try {
    // 1. Verificar todas as tabelas existentes
    const { data: allTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (!tablesError && allTables) {
      console.log('📋 TABELAS DISPONÍVEIS:');
      allTables.forEach(table => {
        console.log(`   ✅ ${table.table_name}`);
      });
      console.log();
    }

    // 2. Verificar colunas específicas das tabelas principais
    const mainTables = ['ai_messages', 'ai_conversations', 'users', 'profiles'];
    
    for (const tableName of mainTables) {
      console.log(`🔍 ESTRUTURA: ${tableName.toUpperCase()}`);
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position');

      if (!columnsError && columns) {
        columns.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? '(opcional)' : '(obrigatório)';
          const defaultValue = col.column_default ? ` [default: ${col.column_default}]` : '';
          console.log(`   📄 ${col.column_name}: ${col.data_type} ${nullable}${defaultValue}`);
        });
      } else {
        console.log(`   ❌ Erro ao obter colunas: ${columnsError?.message || 'Desconhecido'}`);
      }
      
      // Contar registros
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
        
      if (!countError) {
        console.log(`   📊 Total de registros: ${count || 0}`);
      }
      
      console.log();
    }

    // 3. Verificar constraints e índices
    console.log('🔗 CONSTRAINTS E ÍNDICES:\n');
    
    const { data: constraints, error: constraintsError } = await supabase
      .from('information_schema.table_constraints')
      .select('table_name, constraint_name, constraint_type')
      .eq('table_schema', 'public')
      .in('table_name', mainTables)
      .order('table_name, constraint_type');

    if (!constraintsError && constraints) {
      let currentTable = '';
      constraints.forEach(constraint => {
        if (constraint.table_name !== currentTable) {
          console.log(`📋 ${constraint.table_name.toUpperCase()}:`);
          currentTable = constraint.table_name;
        }
        console.log(`   🔒 ${constraint.constraint_type}: ${constraint.constraint_name}`);
      });
    } else {
      console.log(`❌ Erro ao obter constraints: ${constraintsError?.message || 'Desconhecido'}`);
    }

    // 4. Verificar políticas RLS (Row Level Security)
    console.log('\n🛡️  POLÍTICAS RLS:\n');
    
    for (const tableName of mainTables) {
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('policyname, permissive, roles, cmd, qual')
        .eq('schemaname', 'public')
        .eq('tablename', tableName);

      if (!policiesError && policies && policies.length > 0) {
        console.log(`🔐 ${tableName.toUpperCase()}:`);
        policies.forEach(policy => {
          console.log(`   📜 ${policy.policyname} (${policy.cmd}) - ${policy.permissive}`);
        });
      } else {
        console.log(`📝 ${tableName.toUpperCase()}: Sem políticas RLS ou erro`);
      }
    }

    // 5. Testar acesso direto
    console.log('\n🧪 TESTE DE ACESSO:\n');
    
    for (const tableName of mainTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Acesso OK (${data?.length || 0} registros no teste)`);
        }
      } catch (e) {
        console.log(`⚠️  ${tableName}: Exceção - ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral na análise:', error.message);
  }
}

detailedTableAnalysis();
