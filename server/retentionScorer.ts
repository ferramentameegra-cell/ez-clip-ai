/**
 * Sistema de cálculo de score de retenção para clipes
 */

import { TranscriptionSegment } from './transcription';

export interface RetentionScoreResult {
  score: number; // 0-100
  factors: {
    keywordDensity: number;
    pacing: number;
    silenceRatio: number;
    clipLength: number;
  };
  recommendations: string[];
}

/**
 * Calcula score de retenção baseado em múltiplos fatores
 */
export function calculateRetentionScore(
  segments: TranscriptionSegment[],
  clipDuration: number,
  _vertical?: string
): RetentionScoreResult {
  const factors = {
    keywordDensity: calculateKeywordDensity(segments, _vertical),
    pacing: calculatePacing(segments, clipDuration),
    silenceRatio: calculateSilenceRatio(segments, clipDuration),
    clipLength: calculateLengthScore(clipDuration),
  };

  // Pesos para cada fator
  const weights = {
    keywordDensity: 0.3,
    pacing: 0.25,
    silenceRatio: 0.2,
    clipLength: 0.25,
  };

  // Calcular score ponderado
  const score = Math.round(
    factors.keywordDensity * weights.keywordDensity +
    factors.pacing * weights.pacing +
    factors.silenceRatio * weights.silenceRatio +
    factors.clipLength * weights.clipLength
  );

  // Gerar recomendações
  const recommendations = generateRecommendations(factors, score);

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
    recommendations,
  };
}

/**
 * Calcula densidade de palavras-chave (0-100)
 */
function calculateKeywordDensity(
  segments: TranscriptionSegment[],
  _vertical?: string
): number {
  if (segments.length === 0) return 0;

  // Palavras-chave comuns que aumentam retenção
  const commonKeywords = [
    'você', 'vocês', 'você sabe', 'olha', 'escuta', 'imagina',
    'porque', 'então', 'mas', 'porém', 'entretanto',
    'primeiro', 'segundo', 'terceiro', 'último',
    'importante', 'crucial', 'essencial', 'fundamental',
    'dica', 'truque', 'segredo', 'hack',
  ];

  const allText = segments.map(s => s.text.toLowerCase()).join(' ');
  const words = allText.split(/\s+/);
  const keywordCount = words.filter(word => 
    commonKeywords.some(keyword => word.includes(keyword))
  ).length;

  const density = (keywordCount / words.length) * 100;
  return Math.min(100, density * 10); // Normalizar para 0-100
}

/**
 * Calcula ritmo/pacing (0-100)
 * Baseado na velocidade de fala e pausas
 */
function calculatePacing(
  segments: TranscriptionSegment[],
  clipDuration: number
): number {
  if (segments.length === 0 || clipDuration === 0) return 50;

  // Calcular palavras por minuto
  const totalWords = segments.reduce((acc, seg) => {
    return acc + seg.text.split(/\s+/).length;
  }, 0);

  const wordsPerMinute = (totalWords / clipDuration) * 60;

  // Ideal: 150-180 palavras/minuto
  if (wordsPerMinute >= 150 && wordsPerMinute <= 180) {
    return 100;
  } else if (wordsPerMinute >= 120 && wordsPerMinute < 150) {
    return 80;
  } else if (wordsPerMinute > 180 && wordsPerMinute <= 200) {
    return 85;
  } else if (wordsPerMinute >= 100 && wordsPerMinute < 120) {
    return 60;
  } else {
    return 40; // Muito rápido ou muito lento
  }
}

/**
 * Calcula razão de silêncio (0-100)
 * Menos silêncio = melhor
 */
function calculateSilenceRatio(
  segments: TranscriptionSegment[],
  clipDuration: number
): number {
  if (segments.length === 0 || clipDuration === 0) return 0;

  // Calcular tempo total de fala
  const speechTime = segments.reduce((acc, seg) => {
    return acc + (seg.end - seg.start);
  }, 0);

  const silenceTime = clipDuration - speechTime;
  const silenceRatio = silenceTime / clipDuration;

  // Converter para score (menos silêncio = maior score)
  return Math.max(0, 100 - (silenceRatio * 200));
}

/**
 * Calcula score baseado na duração do clipe (0-100)
 * Ideal: 30-90 segundos
 */
function calculateLengthScore(clipDuration: number): number {
  if (clipDuration >= 30 && clipDuration <= 90) {
    return 100; // Duração ideal
  } else if (clipDuration >= 20 && clipDuration < 30) {
    return 80; // Um pouco curto
  } else if (clipDuration > 90 && clipDuration <= 120) {
    return 75; // Um pouco longo
  } else if (clipDuration >= 15 && clipDuration < 20) {
    return 60; // Muito curto
  } else if (clipDuration > 120 && clipDuration <= 180) {
    return 50; // Muito longo
  } else {
    return 30; // Fora do ideal
  }
}

/**
 * Gera recomendações baseadas nos fatores
 */
function generateRecommendations(
  factors: RetentionScoreResult['factors'],
  score: number
): string[] {
  const recommendations: string[] = [];

  if (factors.keywordDensity < 50) {
    recommendations.push('Adicione mais palavras-chave para aumentar engajamento');
  }

  if (factors.pacing < 60) {
    recommendations.push('Ajuste o ritmo da fala (ideal: 150-180 palavras/minuto)');
  }

  if (factors.silenceRatio < 60) {
    recommendations.push('Reduza pausas longas para manter atenção');
  }

  if (factors.clipLength < 70) {
    recommendations.push('Ajuste a duração do clipe (ideal: 30-90 segundos)');
  }

  if (score < 60) {
    recommendations.push('Considere re-editar o clipe para melhorar retenção');
  }

  if (recommendations.length === 0) {
    recommendations.push('Clipe otimizado para retenção!');
  }

  return recommendations;
}

