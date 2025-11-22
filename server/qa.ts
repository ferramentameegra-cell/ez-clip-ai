import { QAResult, ContinuityMap, ClipSegment } from '../shared/types';
import { TranscriptionSegment } from './transcription';

/**
 * Sistema de QA (Quality Assurance) para clipes
 */

export interface QACheckResult {
  passed: boolean;
  issues: string[];
}

/**
 * Verifica qualidade de um clipe individual
 */
export async function checkClipQuality(
  clip: ClipSegment,
  transcriptionSegments: TranscriptionSegment[],
  targetDuration: number,
  tolerance: number
): Promise<QAResult> {
  const issues: string[] = [];
  let passed = true;

  // 1. Verificar duração dentro da tolerância
  const duration = clip.end - clip.start;
  const minDuration = targetDuration * (1 - tolerance);
  const maxDuration = targetDuration * (1 + tolerance);

  const durationOk = duration >= minDuration && duration <= maxDuration;
  if (!durationOk) {
    issues.push(`Duração fora da tolerância: ${duration.toFixed(1)}s (esperado: ${minDuration.toFixed(1)}-${maxDuration.toFixed(1)}s)`);
    passed = false;
  }

  // 2. Verificar se não cortou no meio de palavra
  const noMidWordCut = !checkMidWordCut(clip, transcriptionSegments);
  if (!noMidWordCut) {
    issues.push('Corte detectado no meio de palavra');
    passed = false;
  }

  // 3. Verificar silêncio inicial/final (deve ser ≤ 300ms)
  const initialSilence = getInitialSilence(clip, transcriptionSegments);
  const finalSilence = getFinalSilence(clip, transcriptionSegments);

  const syncOk = initialSilence <= 0.3 && finalSilence <= 0.3;
  if (!syncOk) {
    if (initialSilence > 0.3) {
      issues.push(`Silêncio inicial muito longo: ${initialSilence.toFixed(2)}s`);
    }
    if (finalSilence > 0.3) {
      issues.push(`Silêncio final muito longo: ${finalSilence.toFixed(2)}s`);
    }
  }

  // 4. Continuidade (verificado separadamente)
  const continuityOk = true; // Será verificado no nível do pacote

  // 5. Loudness (será verificado durante o processamento de vídeo)
  const loudnessOk = true; // Placeholder - implementar durante render

  return {
    loudness_ok: loudnessOk,
    sync_ok: syncOk,
    no_midword_cut: noMidWordCut,
    continuity_ok: continuityOk,
    passed,
    issues
  };
}

/**
 * Verifica continuidade entre clipes consecutivos
 */
export function checkContinuity(clips: ClipSegment[]): ContinuityMap[] {
  const continuityMap: ContinuityMap[] = [];

  for (let i = 0; i < clips.length - 1; i++) {
    const current = clips[i];
    const next = clips[i + 1];

    // Calcular gap real (considerando overlap)
    const gap = next.start - (current.end - current.overlapWithNext);

    continuityMap.push({
      from: current.index,
      to: next.index,
      gap_sec: Math.max(0, gap),
      overlap_sec: current.overlapWithNext
    });
  }

  return continuityMap;
}

/**
 * Verifica se há cortes no meio de palavras
 */
function checkMidWordCut(clip: ClipSegment, segments: TranscriptionSegment[]): boolean {
  // Encontrar segmentos que começam ou terminam exatamente nos limites do clipe
  const boundarySegments = segments.filter(seg => {
    const startsAtBoundary = Math.abs(seg.start - clip.start) < 0.1;
    const endsAtBoundary = Math.abs(seg.end - clip.end) < 0.1;
    return startsAtBoundary || endsAtBoundary;
  });

  // Se um segmento começa exatamente no início do clipe, pode ter sido cortado
  for (const seg of boundarySegments) {
    if (Math.abs(seg.start - clip.start) < 0.1) {
      // Verificar se o texto começa com espaço (indica que não foi cortado no meio)
      if (seg.text.trim().length > 0 && !seg.text.startsWith(' ')) {
        // Pode ser um corte no meio de palavra
        return true;
      }
    }
  }

  return false;
}

/**
 * Calcula silêncio inicial do clipe
 */
function getInitialSilence(clip: ClipSegment, segments: TranscriptionSegment[]): number {
  const firstSegment = segments.find(seg => seg.start >= clip.start && seg.start < clip.end);
  if (!firstSegment) return 0;

  return Math.max(0, firstSegment.start - clip.start);
}

/**
 * Calcula silêncio final do clipe
 */
function getFinalSilence(clip: ClipSegment, segments: TranscriptionSegment[]): number {
  const lastSegment = segments
    .filter(seg => seg.start >= clip.start && seg.start < clip.end)
    .sort((a, b) => b.end - a.end)[0];

  if (!lastSegment) return 0;

  return Math.max(0, clip.end - lastSegment.end);
}

/**
 * Verifica qualidade geral do pacote
 */
export function checkPackageQuality(
  clips: ClipSegment[],
  continuityMap: ContinuityMap[]
): QACheckResult {
  const issues: string[] = [];
  let passed = true;

  // Verificar continuidade
  for (const continuity of continuityMap) {
    if (continuity.gap_sec > 0.5) {
      issues.push(`Gap de ${continuity.gap_sec.toFixed(2)}s entre clipe ${continuity.from} e ${continuity.to}`);
      passed = false;
    }
  }

  // Verificar se todos os clipes foram gerados
  const expectedClips = clips.length > 0 ? clips[0].total : 0;
  if (clips.length < expectedClips) {
    issues.push(`Apenas ${clips.length} de ${expectedClips} clipes foram gerados`);
    passed = false;
  }

  return {
    passed,
    issues
  };
}

