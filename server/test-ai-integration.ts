/**
 * Script de teste para integração de IA
 * Testa carregamento de prompts, substituição de placeholders e estrutura de IA
 */

import { getCorePrompt, getPromptForNiche, getFullPrompt, replacePlaceholders } from './promptLoader.js';
import { TranscriptionResult } from './transcription.js';

/**
 * Teste 1: Carregar prompt core
 */
function testCorePrompt() {
  console.log('\n📋 Teste 1: Carregar Prompt Core');
  console.log('─'.repeat(50));
  
  try {
    const core = getCorePrompt();
    console.log('✅ Prompt core carregado com sucesso');
    console.log(`📏 Tamanho: ${core.length} caracteres`);
    console.log(`📄 Primeiras 200 caracteres: ${core.substring(0, 200)}...`);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao carregar prompt core:', error.message);
    return false;
  }
}

/**
 * Teste 2: Carregar prompts por nicho
 */
function testNichePrompts() {
  console.log('\n📋 Teste 2: Carregar Prompts por Nicho');
  console.log('─'.repeat(50));
  
  const niches = ['politica', 'futebol', 'comedia', 'religiao', 'profissoes', 'novelas', 'series-filmes', 'programas-tv'];
  let successCount = 0;
  
  for (const niche of niches) {
    try {
      const prompt = getPromptForNiche(niche);
      console.log(`✅ ${niche}: ${prompt.length} caracteres`);
      successCount++;
    } catch (error: any) {
      console.error(`❌ ${niche}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Resultado: ${successCount}/${niches.length} prompts carregados`);
  return successCount === niches.length;
}

/**
 * Teste 3: Carregar prompt completo (Core + Nicho)
 */
function testFullPrompt() {
  console.log('\n📋 Teste 3: Carregar Prompt Completo (Core + Nicho)');
  console.log('─'.repeat(50));
  
  try {
    const full = getFullPrompt('politica');
    console.log('✅ Prompt completo carregado');
    console.log(`📏 Tamanho: ${full.length} caracteres`);
    console.log(`📄 Contém "Core": ${full.includes('Core') ? '✅' : '❌'}`);
    console.log(`📄 Contém "POLÍTICA": ${full.includes('POLÍTICA') || full.includes('Política') ? '✅' : '❌'}`);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao carregar prompt completo:', error.message);
    return false;
  }
}

/**
 * Teste 4: Substituir placeholders
 */
function testPlaceholders() {
  console.log('\n📋 Teste 4: Substituir Placeholders');
  console.log('─'.repeat(50));
  
  const template = `
Pack: {{pack_size}}
Nicho: {{nicho_id}}
Tema: {{tema_principal}}
Duração: {{duracao_total_seg}}s
Cores: {{branding.cores}}
Fonte: {{branding.fonte}}
CTA: {{cta_padrao}}
  `;
  
  try {
    const result = replacePlaceholders(template, {
      pack_size: 10,
      nicho_id: 'politica',
      tema_principal: 'Reforma Tributária',
      duracao_total_seg: 720,
      branding: {
        cores: ['#0B5FFF', '#FFFFFF'],
        fonte: 'Inter'
      },
      cta_padrao: 'Parte X/10 — continue'
    });
    
    console.log('✅ Placeholders substituídos');
    console.log('📄 Resultado:');
    console.log(result);
    
    // Verificar se todos foram substituídos
    const hasPlaceholders = result.includes('{{');
    if (hasPlaceholders) {
      console.warn('⚠️  Ainda há placeholders não substituídos');
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao substituir placeholders:', error.message);
    return false;
  }
}

/**
 * Teste 5: Estrutura de segmentação com IA (mock)
 */
function testAISegmentationStructure() {
  console.log('\n📋 Teste 5: Estrutura de Segmentação com IA');
  console.log('─'.repeat(50));
  
  // Mock de transcrição
  const mockTranscription: TranscriptionResult = {
    text: 'Este é um teste de transcrição.',
    segments: [
      { id: 0, start: 0, end: 2, text: 'Este é' },
      { id: 1, start: 2, end: 5, text: 'um teste' },
      { id: 2, start: 5, end: 8, text: 'de transcrição.' }
    ],
    language: 'pt',
    duration: 8
  };
  
  try {
    // Testar preparação de dados
    const transcriptionText = mockTranscription.segments
      .map(seg => `[${seg.start.toFixed(2)}s-${seg.end.toFixed(2)}s] ${seg.text}`)
      .join('\n');
    
    console.log('✅ Transcrição formatada:');
    console.log(transcriptionText);
    
    // Testar prompt completo
    const fullPrompt = getFullPrompt('politica');
    const systemPrompt = replacePlaceholders(fullPrompt, {
      pack_size: 5,
      nicho_id: 'politica',
      tema_principal: 'Teste',
      duracao_total_seg: 8,
      branding: {
        cores: ['#0B5FFF', '#FFFFFF'],
        fonte: 'Inter'
      },
      cta_padrao: 'Parte X/5 — continue'
    });
    
    console.log('\n✅ System prompt preparado');
    console.log(`📏 Tamanho: ${systemPrompt.length} caracteres`);
    
    const userPrompt = `
Processe a seguinte transcrição em 5 cortes sequenciais:

TRANSCRIÇÃO:
${transcriptionText}

PARÂMETROS:
- Duração alvo por corte: 60s
- Overlap: 1s
- Modo: hybrid
- Duração total: 8s

Retorne APENAS o JSON conforme o schema especificado no prompt, sem comentários adicionais.
    `;
    
    console.log('\n✅ User prompt preparado');
    console.log(`📏 Tamanho: ${userPrompt.length} caracteres`);
    
    return true;
  } catch (error: any) {
    console.error('❌ Erro na estrutura de segmentação:', error.message);
    return false;
  }
}

/**
 * Teste 6: Verificar variáveis de ambiente
 */
function testEnvironmentVariables() {
  console.log('\n📋 Teste 6: Variáveis de Ambiente');
  console.log('─'.repeat(50));
  
  const useAI = process.env.USE_AI_SEGMENTATION === 'true';
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const provider = process.env.AI_PROVIDER;
  
  console.log(`USE_AI_SEGMENTATION: ${useAI ? '✅ true' : '❌ false/undefined'}`);
  console.log(`OPENAI_API_KEY: ${openaiKey ? '✅ configurada' : '❌ não configurada'}`);
  console.log(`ANTHROPIC_API_KEY: ${anthropicKey ? '✅ configurada' : '❌ não configurada'}`);
  console.log(`AI_PROVIDER: ${provider || 'não definido'}`);
  
  if (useAI && !openaiKey && !anthropicKey) {
    console.warn('⚠️  IA ativada mas nenhuma API key configurada');
    return false;
  }
  
  if (useAI && (openaiKey || anthropicKey)) {
    console.log('✅ Configuração de IA válida');
    return true;
  }
  
  console.log('ℹ️  IA não ativada (usando algoritmo)');
  return true;
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log('🧪 TESTES DE INTEGRAÇÃO DE IA');
  console.log('═'.repeat(50));
  
  const results = {
    corePrompt: testCorePrompt(),
    nichePrompts: testNichePrompts(),
    fullPrompt: testFullPrompt(),
    placeholders: testPlaceholders(),
    aiStructure: testAISegmentationStructure(),
    environment: testEnvironmentVariables()
  };
  
  console.log('\n📊 RESUMO DOS TESTES');
  console.log('═'.repeat(50));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  
  for (const [test, result] of Object.entries(results)) {
    console.log(`${result ? '✅' : '❌'} ${test}`);
  }
  
  console.log(`\n📈 Resultado: ${passed}/${total} testes passaram`);
  
  if (passed === total) {
    console.log('\n🎉 Todos os testes passaram!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Alguns testes falharam. Verifique os erros acima.');
    process.exit(1);
  }
}

// Executar testes
runAllTests().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

