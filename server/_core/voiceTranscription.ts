/**
 * Integração com Whisper Large v3 via OpenAI API ou Manus Forge API
 */

import fs from 'fs';
import OpenAI from 'openai';

export interface TranscriptionOptions {
  audioUrl: string; // Pode ser URL ou caminho local
  language?: string;
  prompt?: string;
}

export interface TranscriptionResult {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language: string;
}

/**
 * Transcreve áudio usando Whisper Large v3 (OpenAI ou Manus Forge)
 */
export async function transcribeAudio(options: TranscriptionOptions): Promise<TranscriptionResult> {
  const { audioUrl, language = 'pt', prompt } = options;

  console.log(`[Whisper] Transcrevendo: ${audioUrl} (${language})`);

  // Tentar OpenAI primeiro (se API key estiver configurada)
  if (process.env.OPENAI_API_KEY) {
    try {
      return await transcribeWithOpenAI(audioUrl, language, prompt);
    } catch (error: any) {
      console.warn(`[Whisper] OpenAI falhou, tentando Manus Forge:`, error.message);
    }
  }

  // Tentar Manus Forge API
  if (process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY) {
    try {
      return await transcribeWithManusForge(audioUrl, language, prompt);
    } catch (error: any) {
      console.error(`[Whisper] Manus Forge falhou:`, error.message);
      throw new Error(`Transcrição falhou: ${error.message}`);
    }
  }

  // Se nenhuma API estiver configurada, retornar mock para desenvolvimento
  console.warn('[Whisper] Nenhuma API configurada. Retornando mock para desenvolvimento.');
  return {
    text: 'Transcrição mockada - configure OPENAI_API_KEY ou BUILT_IN_FORGE_API_KEY',
    segments: [
      { start: 0, end: 5, text: 'Transcrição mockada' },
      { start: 5, end: 10, text: 'Configure OPENAI_API_KEY no .env' }
    ],
    language: language
  };
}

/**
 * Transcreve usando OpenAI Whisper API
 */
async function transcribeWithOpenAI(
  audioPath: string,
  language: string,
  prompt?: string
): Promise<TranscriptionResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Verificar se é arquivo local ou URL
  const isLocalFile = fs.existsSync(audioPath);
  
  if (!isLocalFile) {
    throw new Error('OpenAI Whisper requer arquivo local. Faça download primeiro.');
  }

  // Ler arquivo como stream
  const audioFile = fs.createReadStream(audioPath);
  
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile as any,
    model: 'whisper-1',
    language: language === 'pt' ? 'pt' : language,
    prompt: prompt,
    response_format: 'verbose_json', // Para obter timestamps
    timestamp_granularities: ['segment']
  });

  // Converter formato OpenAI para nosso formato
  const segments = (transcription as any).segments?.map((seg: any) => ({
    start: seg.start,
    end: seg.end,
    text: seg.text.trim()
  })) || [];

  return {
    text: transcription.text,
    segments,
    language: language
  };
}

/**
 * Transcreve usando Manus Forge API
 */
async function transcribeWithManusForge(
  audioUrl: string,
  language: string,
  prompt?: string
): Promise<TranscriptionResult> {
  const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/transcribe`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioUrl,
      language,
      prompt,
      model: 'whisper-large-v3'
    })
  });

  if (!response.ok) {
    // Clonar response antes de ler para não consumir o stream
    const clonedResponse = response.clone();
    const errorText = await clonedResponse.text();
    throw new Error(`Transcrição falhou: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

