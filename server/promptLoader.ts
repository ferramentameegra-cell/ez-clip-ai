import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Carrega prompts mestres por nicho
 */

// Compatibilidade com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = path.join(__dirname, '../prompts');

/**
 * Mapeamento de nicho para nome do arquivo
 */
const NICHE_TO_FILE: Record<string, string> = {
  'politica': 'PROMPT_MAESTRO_POLITICA.md',
  'futebol': 'PROMPT_MAESTRO_FUTEBOL.md',
  'series-filmes': 'PROMPT_MAESTRO_SERIES_FILMES.md',
  'comedia': 'PROMPT_MAESTRO_COMEDIA.md',
  'religiao': 'PROMPT_MAESTRO_RELIGIAO.md',
  'profissoes': 'PROMPT_MAESTRO_PROFISSOES.md',
  'novelas': 'PROMPT_MAESTRO_NOVELAS.md',
  'programas-tv': 'PROMPT_MAESTRO_PROGRAMAS_TV.md',
};

/**
 * Carrega o prompt core (regras gerais)
 */
export function getCorePrompt(): string {
  const corePath = path.join(PROMPTS_DIR, 'PROMPT_MAESTRO_CORE.md');
  
  if (!fs.existsSync(corePath)) {
    console.warn('[PromptLoader] Core prompt não encontrado, usando padrão');
    return getDefaultCorePrompt();
  }
  
  return fs.readFileSync(corePath, 'utf-8');
}

/**
 * Carrega o prompt específico de um nicho
 */
export function getPromptForNiche(nicheId: string): string {
  const fileName = NICHE_TO_FILE[nicheId];
  
  if (!fileName) {
    console.warn(`[PromptLoader] Nicho '${nicheId}' não encontrado, usando padrão`);
    return getDefaultNichePrompt();
  }
  
  const promptPath = path.join(PROMPTS_DIR, fileName);
  
  if (!fs.existsSync(promptPath)) {
    console.warn(`[PromptLoader] Prompt para '${nicheId}' não encontrado, usando padrão`);
    return getDefaultNichePrompt();
  }
  
  return fs.readFileSync(promptPath, 'utf-8');
}

/**
 * Carrega prompt completo (Core + Nicho)
 */
export function getFullPrompt(nicheId: string): string {
  const core = getCorePrompt();
  const niche = getPromptForNiche(nicheId);
  
  return `${core}\n\n---\n\n${niche}`;
}

/**
 * Substitui placeholders no prompt
 */
export function replacePlaceholders(
  prompt: string,
  params: {
    pack_size?: number;
    nicho_id?: string;
    tema_principal?: string;
    duracao_total_seg?: number;
    branding?: {
      cores?: string[];
      fonte?: string;
      logo_url?: string;
      watermark_posicao?: string;
    };
    cta_padrao?: string;
    transcricao?: string;
  }
): string {
  let result = prompt;
  
  // Substituir placeholders simples
  if (params.pack_size) {
    result = result.replace(/\{\{pack_size\}\}/g, params.pack_size.toString());
  }
  
  if (params.nicho_id) {
    result = result.replace(/\{\{nicho_id\}\}/g, params.nicho_id);
  }
  
  if (params.tema_principal) {
    result = result.replace(/\{\{tema_principal\}\}/g, params.tema_principal);
  }
  
  if (params.duracao_total_seg) {
    result = result.replace(/\{\{duracao_total_seg\}\}/g, params.duracao_total_seg.toString());
  }
  
  if (params.cta_padrao) {
    result = result.replace(/\{\{cta_padrao\}\}/g, params.cta_padrao);
  }
  
  if (params.transcricao) {
    result = result.replace(/\{\{transcricao\}\}/g, params.transcricao);
  }
  
  // Substituir placeholders de branding
  if (params.branding) {
    if (params.branding.cores) {
      result = result.replace(/\{\{branding\.cores\}\}/g, JSON.stringify(params.branding.cores));
    }
    
    if (params.branding.fonte) {
      result = result.replace(/\{\{branding\.fonte\}\}/g, params.branding.fonte);
    }
    
    if (params.branding.logo_url) {
      result = result.replace(/\{\{branding\.logo_url\}\}/g, params.branding.logo_url);
    }
    
    if (params.branding.watermark_posicao) {
      result = result.replace(/\{\{branding\.watermark_posicao\}\}/g, params.branding.watermark_posicao);
    }
  }
  
  return result;
}

/**
 * Prompt core padrão (fallback)
 */
function getDefaultCorePrompt(): string {
  return `
# Prompt Mestre CORE — Regras Gerais

## Modo Sequencial
- Cortes cronológicos, sem reordenar
- Não pular trechos
- Edição mínima

## Duração
- Alvo: 45-75s por corte
- Tolerância: ±10%
- Mínimo: 20s, Máximo: 120s

## Áudio
- Loudness: -14 LUFS
- True Peak: ≤ -1 dBTP

## Legendas
- PT-BR, sincronizadas
- Máximo 2 linhas, 38-42 caracteres por linha
  `;
}

/**
 * Prompt de nicho padrão (fallback)
 */
function getDefaultNichePrompt(): string {
  return `
# Prompt Mestre — NICHO GENÉRICO

## Contexto
Processe o vídeo em cortes sequenciais cronológicos.

## Regras
- Manter ordem original
- Cortes completos (não cortar no meio de frase)
- Edição mínima

## Saída JSON
Retorne JSON conforme schema padrão.
  `;
}

