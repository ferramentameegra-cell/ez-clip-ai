import { TranscriptionResult, splitIntoSequentialClipsWithOverlap } from './transcription';
import { PackageSize, SegmentationMode } from '../shared/types';
import { getFullPrompt, replacePlaceholders } from './promptLoader';

/**
 * Interface para clipe segmentado
 */
interface ClipSegment {
  index: number;
  total: number;
  start: number;
  end: number;
  overlapWithNext: number;
  text: string;
  partNumber: number;
}

/**
 * Interface para chamada de IA
 */
interface AICallOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Chama API de IA para segmentação
 * Suporta OpenAI e Anthropic
 */
async function callAI(options: AICallOptions): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key não configurada. Defina OPENAI_API_KEY ou ANTHROPIC_API_KEY');
  }
  
  try {
    if (provider === 'anthropic' || process.env.ANTHROPIC_API_KEY) {
      return await callAnthropic(options);
    } else {
      return await callOpenAI(options);
    }
  } catch (error: any) {
    console.error('[AISegmenter] Erro na chamada de IA:', error.message);
    throw error;
  }
}

/**
 * Chama OpenAI API
 */
async function callOpenAI(options: AICallOptions): Promise<string> {
  const { default: OpenAI } = await import('openai');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }
  
  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
  
  console.log(`[AISegmenter] Chamando OpenAI (${model})...`);
  
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt }
    ],
    temperature: options.temperature || 0.3,
    max_tokens: options.maxTokens || 4000,
    response_format: { type: 'json_object' }
  });
  
  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Resposta vazia da OpenAI');
  }
  
  console.log('[AISegmenter] Resposta recebida da OpenAI');
  return content;
}

/**
 * Chama Anthropic API
 */
async function callAnthropic(options: AICallOptions): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }
  
  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  
  console.log(`[AISegmenter] Chamando Anthropic (${model})...`);
  
  const response = await anthropic.messages.create({
    model,
    max_tokens: options.maxTokens || 4000,
    temperature: options.temperature || 0.3,
    system: options.systemPrompt,
    messages: [
      { role: 'user', content: options.userPrompt }
    ]
  });
  
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Resposta não é texto da Anthropic');
  }
  
  // Tentar extrair JSON da resposta
  let jsonText = content.text;
  
  // Se a resposta contém markdown code blocks, extrair JSON
  const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }
  
  console.log('[AISegmenter] Resposta recebida da Anthropic');
  return jsonText;
}

/**
 * Segmenta transcrição usando IA com prompt mestre
 */
export async function segmentWithAI(
  transcription: TranscriptionResult,
  packageSize: PackageSize,
  nicheId: string,
  targetDuration: number,
  overlapSec: number,
  mode: SegmentationMode,
  theme?: string
): Promise<ClipSegment[]> {
  console.log(`[AISegmenter] Segmentando com IA: nicho=${nicheId}, pack=${packageSize}`);
  
  // Carregar prompt do nicho
  const fullPrompt = getFullPrompt(nicheId);
  
  // Preparar dados para o prompt
  const transcriptionText = transcription.segments
    .map(seg => `[${seg.start.toFixed(2)}s-${seg.end.toFixed(2)}s] ${seg.text}`)
    .join('\n');
  
  // Substituir placeholders
  const systemPrompt = replacePlaceholders(fullPrompt, {
    pack_size: packageSize,
    nicho_id: nicheId,
    tema_principal: theme || 'Conteúdo geral',
    duracao_total_seg: transcription.duration,
    branding: {
      cores: ['#0B5FFF', '#FFFFFF'],
      fonte: 'Inter'
    },
    cta_padrao: `Parte X/${packageSize} — continue para manter o contexto`
  });
  
  const userPrompt = `
Processe a seguinte transcrição em ${packageSize} cortes sequenciais:

TRANSCRIÇÃO:
${transcriptionText}

PARÂMETROS:
- Duração alvo por corte: ${targetDuration}s
- Overlap: ${overlapSec}s
- Modo: ${mode}
- Duração total: ${transcription.duration.toFixed(2)}s

Retorne APENAS o JSON conforme o schema especificado no prompt, sem comentários adicionais.
  `;
  
  try {
    // Chamar IA
    const aiResponse = await callAI({
      systemPrompt,
      userPrompt,
      temperature: 0.3,
      maxTokens: 4000
    });
    
    // Parsear JSON
    const result = JSON.parse(aiResponse);
    
    // Validar e converter para ClipSegment[]
    if (result.cortes && Array.isArray(result.cortes)) {
      return result.cortes.map((clip: any) => ({
        index: clip.ordem || clip.index,
        total: packageSize,
        start: clip.start_ms / 1000,
        end: clip.end_ms / 1000,
        overlapWithNext: overlapSec,
        text: clip.descricao || '',
        partNumber: clip.ordem || clip.index
      }));
    }
    
    throw new Error('Resposta da IA não contém cortes válidos');
    
  } catch (error: any) {
    console.error('[AISegmenter] Erro ao segmentar com IA:', error.message);
    console.log('[AISegmenter] Fallback para segmentação algorítmica');
    
    // Fallback para segmentação algorítmica
    const algorithmClips = splitIntoSequentialClipsWithOverlap(
      transcription,
      packageSize,
      targetDuration,
      overlapSec,
      mode,
      0.1 // tolerance padrão
    );
    
    return algorithmClips.map((clip, idx) => ({
      index: idx + 1,
      total: packageSize,
      start: clip.start,
      end: clip.end,
      overlapWithNext: overlapSec,
      text: clip.text,
      partNumber: clip.partNumber
    }));
  }
}


