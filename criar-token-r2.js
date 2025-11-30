/**
 * Script para criar token R2 no Cloudflare via API
 */

const ACCOUNT_ID = '45a4af538d59d53aa52ef8179165e0da';
const API_TOKEN = 'nt4Lq9mD91OUrUD9Pw9Vkd7TExuMCe128MUcPjcM';

async function criarTokenR2() {
  try {
    console.log('🔄 Criando token R2...\n');

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/api-token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'ez-clip-ai-r2-token',
          permissions: ['object_read_write'],
          bucket: 'ez-clip-ai',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro ao criar token:', data);
      
      // Tentar método alternativo
      console.log('\n🔄 Tentando método alternativo...\n');
      return await criarTokenR2Alternativo();
    }

    console.log('✅ Token R2 criado com sucesso!\n');
    console.log('📋 CREDENCIAIS - COPIE AGORA:\n');
    console.log('═'.repeat(50));
    console.log(`Access Key ID:`);
    console.log(data.result?.access_key_id || data.access_key_id);
    console.log(`\nSecret Access Key:`);
    console.log(data.result?.secret_access_key || data.secret_access_key);
    console.log('═'.repeat(50));
    console.log('\n⚠️  IMPORTANTE: A Secret Access Key só aparece uma vez!');
    console.log('    Copie e guarde em local seguro!\n');

    return {
      accessKeyId: data.result?.access_key_id || data.access_key_id,
      secretAccessKey: data.result?.secret_access_key || data.secret_access_key,
    };
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔄 Tentando método alternativo...\n');
    return await criarTokenR2Alternativo();
  }
}

async function criarTokenR2Alternativo() {
  try {
    // Método alternativo: criar via Workers R2 API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/tokens`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'ez-clip-ai-r2-token',
          permissions: ['read', 'write'],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro:', data);
      console.log('\n💡 SOLUÇÃO MANUAL:');
      console.log('Acesse: https://dash.cloudflare.com/r2/api-tokens');
      console.log('Ou me envie os erros acima para eu ajudar!\n');
      return null;
    }

    console.log('✅ Token criado!\n');
    console.log('📋 CREDENCIAIS:\n');
    console.log('═'.repeat(50));
    if (data.result) {
      console.log(`Access Key ID: ${data.result.access_key_id || data.result.id}`);
      console.log(`Secret Access Key: ${data.result.secret_access_key || data.result.secret}`);
    } else {
      console.log('Resposta completa:', JSON.stringify(data, null, 2));
    }
    console.log('═'.repeat(50));

    return data.result;
  } catch (error) {
    console.error('❌ Erro no método alternativo:', error.message);
    return null;
  }
}

// Executar
criarTokenR2().then((result) => {
  if (result) {
    console.log('\n✅ Pronto! Agora você tem as credenciais para configurar no Railway!');
  }
}).catch(console.error);

