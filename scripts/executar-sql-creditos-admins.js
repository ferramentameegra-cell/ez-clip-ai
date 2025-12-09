/**
 * Script para adicionar 10000 créditos aos admins
 * Executa via DATABASE_URL do Railway
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada!');
  console.log('Execute: DATABASE_URL="sua_url" node scripts/executar-sql-creditos-admins.js');
  process.exit(1);
}

async function main() {
  let connection;
  
  try {
    console.log('🔌 Conectando ao banco de dados...');
    connection = await mysql.createConnection(DATABASE_URL);
    
    console.log('✅ Conectado!');
    
    // Atualizar créditos
    console.log('💳 Atualizando créditos para 10000...');
    const [updateResult] = await connection.execute(
      `UPDATE users 
       SET credits = 10000 
       WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com')`
    );
    
    console.log(`✅ Atualizados ${updateResult.affectedRows} usuário(s)`);
    
    // Verificar
    console.log('🔍 Verificando créditos...');
    const [rows] = await connection.execute(
      `SELECT id, name, email, credits, role 
       FROM users 
       WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com')`
    );
    
    console.log('\n📊 Resultado:');
    console.table(rows);
    
    console.log('\n✅ Créditos atualizados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão fechada.');
    }
  }
}

main();

