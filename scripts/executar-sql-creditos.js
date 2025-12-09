#!/usr/bin/env node

/**
 * Script para executar SQL e adicionar créditos
 */

import mysql from 'mysql2/promise';

async function executarSQL() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log('🔧 Adicionando 1000 créditos para admins...\n');

    // Atualizar créditos
    const [updateResult] = await connection.execute(
      `UPDATE users 
       SET credits = credits + 1000 
       WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com')`
    );

    console.log(`✅ ${updateResult.affectedRows} usuário(s) atualizado(s)\n`);

    // Verificar resultado
    const [rows] = await connection.execute(
      `SELECT id, name, email, credits 
       FROM users 
       WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com')`
    );

    console.log('📊 Resultado:\n');
    for (const user of rows) {
      console.log(`  ✅ ${user.name || user.email}: ${user.credits} créditos`);
    }

    console.log('\n✅ Créditos adicionados com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

executarSQL();

