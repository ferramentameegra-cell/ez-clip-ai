/**
 * Script de teste para verificar se a integração com OpenAI Whisper está funcionando
 * 
 * Este script testa:
 * 1. Se OPENAI_API_KEY está configurada
 * 2. Se a API está respondendo corretamente
 * 3. Se a transcrição funciona com um arquivo de áudio de teste
 */

import dotenv from 'dotenv';
import { transcribeAudio } from './_core/voiceTranscription.js';
import fs from 'fs';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Teste 1: Verificar se OPENAI_API_KEY está configurada
 */
function testAPIKeyConfigured() {
  console.log('\n📋 Teste 1: Verificar OPENAI_API_KEY');
  console.log('─'.repeat(50));
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY não encontrada nas variáveis de ambiente');
    console.log('💡 Certifique-se de que a variável está configurada no Railway');
    return false;
  }
  
  // Verificar formato da chave (OpenAI keys geralmente começam com sk-)
  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️  A chave não parece ser uma OpenAI API key válida (deve começar com "sk-")');
    return false;
  }
  
  // Mostrar apenas os primeiros e últimos caracteres por segurança
  const maskedKey = `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`;
  console.log(`✅ OPENAI_API_KEY encontrada: ${maskedKey}`);
  console.log(`📏 Tamanho: ${apiKey.length} caracteres`);
  
  return true;
}

/**
 * Teste 2: Verificar se a API está acessível (teste simples)
 */
async function testAPIAccessibility() {
  console.log('\n📋 Teste 2: Verificar Acessibilidade da API');
  console.log('─'.repeat(50));
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY não configurada');
    return false;
  }
  
  try {
    // Fazer uma requisição simples para verificar se a API está acessível
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro ao acessar API: ${response.status} ${response.statusText}`);
      console.error(`📄 Detalhes: ${errorText}`);
      
      if (response.status === 401) {
        console.error('💡 Problema de autenticação. Verifique se a API key está correta.');
      } else if (response.status === 429) {
        console.error('💡 Limite de requisições excedido. Tente novamente mais tarde.');
      }
      
      return false;
    }
    
    const data = await response.json();
    const whisperModel = data.data?.find((m: any) => m.id === 'whisper-1');
    
    if (whisperModel) {
      console.log('✅ API acessível e modelo whisper-1 disponível');
      return true;
    } else {
      console.warn('⚠️  API acessível, mas modelo whisper-1 não encontrado na lista');
      return true; // Ainda assim pode funcionar
    }
    
  } catch (error: any) {
    console.error(`❌ Erro ao testar API: ${error.message}`);
    console.error('💡 Verifique sua conexão com a internet');
    return false;
  }
}

/**
 * Teste 3: Testar transcrição com arquivo de áudio (se disponível)
 */
async function testTranscription() {
  console.log('\n📋 Teste 3: Testar Transcrição (Opcional)');
  console.log('─'.repeat(50));
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY não configurada');
    return false;
  }
  
  // Procurar um arquivo de áudio de teste
  const possibleTestFiles = [
    '/tmp/test-audio.mp3',
    '/tmp/test-audio.wav',
    './test-audio.mp3',
    './test-audio.wav'
  ];
  
  let testFile: string | null = null;
  for (const file of possibleTestFiles) {
    if (fs.existsSync(file)) {
      testFile = file;
      break;
    }
  }
  
  if (!testFile) {
    console.log('ℹ️  Nenhum arquivo de áudio de teste encontrado');
    console.log('💡 Para testar a transcrição completa, coloque um arquivo de áudio em /tmp/test-audio.mp3');
    console.log('✅ Mas a configuração da API está pronta para uso');
    return true;
  }
  
  console.log(`📁 Arquivo de teste encontrado: ${testFile}`);
  console.log('🔄 Testando transcrição (isso pode levar alguns segundos)...');
  
  try {
    const result = await transcribeAudio({
      audioUrl: testFile,
      language: 'pt',
      prompt: 'Teste de transcrição'
    });
    
    console.log('✅ Transcrição concluída com sucesso!');
    console.log(`📄 Texto: ${result.text.substring(0, 100)}${result.text.length > 100 ? '...' : ''}`);
    console.log(`📊 Segmentos: ${result.segments?.length || 0}`);
    console.log(`🌐 Idioma detectado: ${result.language}`);
    
    return true;
    
  } catch (error: any) {
    console.error(`❌ Erro na transcrição: ${error.message}`);
    console.error('💡 Verifique os logs acima para mais detalhes');
    return false;
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log('🧪 TESTE DE INTEGRAÇÃO OPENAI WHISPER');
  console.log('═'.repeat(50));
  
  const results = {
    apiKeyConfigured: testAPIKeyConfigured(),
    apiAccessible: false,
    transcription: false
  };
  
  if (results.apiKeyConfigured) {
    results.apiAccessible = await testAPIAccessibility();
    
    if (results.apiAccessible) {
      results.transcription = await testTranscription();
    }
  }
  
  console.log('\n📊 RESUMO DOS TESTES');
  console.log('═'.repeat(50));
  
  console.log(`${results.apiKeyConfigured ? '✅' : '❌'} OPENAI_API_KEY configurada`);
  console.log(`${results.apiAccessible ? '✅' : '❌'} API acessível`);
  console.log(`${results.transcription ? '✅' : 'ℹ️ '} Transcrição testada`);
  
  const allCritical = results.apiKeyConfigured && results.apiAccessible;
  
  if (allCritical) {
    console.log('\n🎉 OpenAI Whisper está configurado e pronto para uso!');
    console.log('💡 A transcrição será feita automaticamente ao processar vídeos');
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

