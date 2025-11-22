import { transcribeAudio as whisperTranscribe } from './_core/voiceTranscription';
import fs from 'fs';
import { PackageSize, SegmentationMode, ClipSegment } from '../shared/types';

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  duration: number;
}

/**
 * Transcreve áudio usando Whisper Large v3
 */
export async function transcribeAudio(
  audioPath: string,
  language: string = 'pt'
): Promise<TranscriptionResult> {
  console.log(`[Transcription] Iniciando: ${audioPath}`);

  if (!fs.existsSync(audioPath)) {
    throw new Error(`Arquivo não encontrado: ${audioPath}`);
  }

  // Transcrever via Whisper (OpenAI ou Manus Forge)
  const result = await whisperTranscribe({
    audioUrl: audioPath,
    language,
    prompt: 'Transcrição para vídeos virais. Inclua pontuação correta.'
  });

  console.log(`[Transcription] Concluído: ${result.segments?.length || 0} segmentos`);

  const segments: TranscriptionSegment[] = (result.segments || []).map((seg: any, index: number) => ({
    id: index,
    start: seg.start,
    end: seg.end,
    text: seg.text.trim()
  }));

  // Calcular duração total do áudio
  const duration = segments.length > 0 ? segments[segments.length - 1].end : 0;

  return {
    text: result.text,
    segments,
    language: result.language,
    duration
  };
}

/**
 * Divide transcrição em clipes sequenciais (LEGADO - mantido para compatibilidade)
 */
export function splitIntoSequentialClips(
  transcription: TranscriptionResult,
  clipDuration: number
): Array<{ start: number; end: number; text: string; partNumber: number }> {
  const clips: Array<{ start: number; end: number; text: string; partNumber: number }> = [];
  const totalDuration = transcription.duration;
  const totalClips = Math.ceil(totalDuration / clipDuration);

  console.log(`[Split] Total: ${totalDuration}s | Clipes: ${totalClips} | Duração: ${clipDuration}s`);

  for (let i = 0; i < totalClips; i++) {
    const startTime = i * clipDuration;
    const endTime = Math.min((i + 1) * clipDuration, totalDuration);

    // Segmentos neste intervalo
    const clipSegments = transcription.segments.filter(seg => {
      return (seg.start >= startTime && seg.start < endTime) ||
             (seg.end > startTime && seg.end <= endTime) ||
             (seg.start < startTime && seg.end > endTime);
    });

    const clipText = clipSegments.map(seg => seg.text).join(' ');

    clips.push({
      start: startTime,
      end: endTime,
      text: clipText,
      partNumber: i + 1
    });
  }

  return clips;
}

/**
 * Divide transcrição em clipes sequenciais com overlap (NOVO SISTEMA)
 * Respeita limites de frase, garante continuidade cronológica
 */
export function splitIntoSequentialClipsWithOverlap(
  transcription: TranscriptionResult,
  packageSize: PackageSize,
  targetDuration: number,
  overlapSec: number,
  mode: SegmentationMode,
  durationTolerance: number = 0.1
): ClipSegment[] {
  const clips: ClipSegment[] = [];
  const totalDuration = transcription.duration;
  const tolerance = durationTolerance; // 0.1 = 10%
  const minDuration = targetDuration * (1 - tolerance);
  const maxDuration = targetDuration * (1 + tolerance);

  console.log(`[SplitSequential] Package: ${packageSize} | Target: ${targetDuration}s | Overlap: ${overlapSec}s | Mode: ${mode}`);

  // Calcular duração total necessária
  const totalNeededDuration = packageSize * targetDuration;
  
  // Se conteúdo for curto demais, ajustar targetDuration
  let adjustedTargetDuration = targetDuration;
  if (totalDuration < totalNeededDuration) {
    adjustedTargetDuration = Math.max(15, totalDuration / packageSize); // Mínimo 15s
    console.log(`[SplitSequential] Conteúdo curto! Ajustando targetDuration para ${adjustedTargetDuration}s`);
  }

  let currentTime = 0;
  let clipIndex = 0;

  while (clipIndex < packageSize && currentTime < totalDuration) {
    const clipStart = currentTime;
    let clipEnd = Math.min(clipStart + adjustedTargetDuration, totalDuration);

    // Ajustar fim do clipe baseado no modo de segmentação
    if (mode === 'semantic' || mode === 'hybrid') {
      // Encontrar melhor ponto de corte (pausa natural, fim de frase)
      clipEnd = findBestCutPoint(
        transcription.segments,
        clipStart,
        clipEnd,
        minDuration,
        maxDuration,
        mode === 'hybrid'
      );
    }

    // Garantir que não ultrapasse o total
    clipEnd = Math.min(clipEnd, totalDuration);

    // Se chegou ao fim do conteúdo, parar
    if (clipEnd <= clipStart) {
      break;
    }

    // Obter segmentos deste clipe
    const clipSegments = transcription.segments.filter(seg => {
      return (seg.start >= clipStart && seg.start < clipEnd) ||
             (seg.end > clipStart && seg.end <= clipEnd) ||
             (seg.start < clipStart && seg.end > clipEnd);
    });

    const clipText = clipSegments.map(seg => seg.text).join(' ');

    // Calcular overlap com próximo clipe
    const overlapWithNext = clipIndex < packageSize - 1 ? overlapSec : 0;

    clips.push({
      index: clipIndex + 1,
      total: packageSize,
      start: clipStart,
      end: clipEnd,
      overlapWithNext,
      text: clipText,
      partNumber: clipIndex + 1
    });

    // Avançar para próximo clipe (com overlap)
    currentTime = clipEnd - overlapSec;
    clipIndex++;

    // Se próximo clipe ultrapassaria o total, parar
    if (currentTime >= totalDuration) {
      break;
    }
  }

  // Se gerou menos clipes que o solicitado, ajustar
  if (clips.length < packageSize) {
    console.log(`[SplitSequential] Aviso: Gerado ${clips.length} clipes de ${packageSize} solicitados`);
  }

  // Validar continuidade
  validateContinuity(clips);

  console.log(`[SplitSequential] Gerados ${clips.length} clipes sequenciais`);
  return clips;
}

/**
 * Encontra melhor ponto de corte respeitando limites naturais
 */
function findBestCutPoint(
  segments: TranscriptionSegment[],
  start: number,
  targetEnd: number,
  minDuration: number,
  maxDuration: number,
  isHybrid: boolean
): number {
  // Se modo fixed, retornar targetEnd
  if (!isHybrid) {
    return targetEnd;
  }

  // Procurar pausas naturais próximas ao targetEnd
  const searchWindow = 5; // segundos de janela de busca
  const searchStart = Math.max(start + minDuration, targetEnd - searchWindow);
  const searchEnd = Math.min(targetEnd + searchWindow, start + maxDuration);

  // Encontrar segmentos na janela de busca
  const candidates = segments.filter(seg => {
    return seg.end >= searchStart && seg.end <= searchEnd;
  });

  if (candidates.length === 0) {
    return targetEnd;
  }

  // Escolher o ponto mais próximo do targetEnd que respeita duração mínima
  let bestCut = targetEnd;
  let bestDistance = Math.abs(targetEnd - targetEnd);

  for (const seg of candidates) {
    const cutPoint = seg.end;
    const duration = cutPoint - start;

    if (duration >= minDuration && duration <= maxDuration) {
      const distance = Math.abs(cutPoint - targetEnd);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCut = cutPoint;
      }
    }
  }

  return bestCut;
}

/**
 * Valida continuidade entre clipes (sem lacunas, considerando overlap)
 */
function validateContinuity(clips: ClipSegment[]): void {
  for (let i = 0; i < clips.length - 1; i++) {
    const current = clips[i];
    const next = clips[i + 1];

    // Calcular gap real (considerando overlap)
    const gap = next.start - (current.end - current.overlapWithNext);

    if (gap > 0.5) { // Tolerância de 0.5s
      console.warn(`[SplitSequential] Aviso: Gap de ${gap.toFixed(2)}s entre clipe ${i + 1} e ${i + 2}`);
    }
  }
}

/**
 * Gera arquivo SRT para legendas
 */
export function generateSRT(
  segments: TranscriptionSegment[],
  clipStart: number,
  clipEnd: number
): string {
  let srt = '';
  let index = 1;

  const clipSegments = segments.filter(seg => {
    return (seg.start >= clipStart && seg.start < clipEnd) ||
           (seg.end > clipStart && seg.end <= clipEnd) ||
           (seg.start < clipStart && seg.end > clipEnd);
  });

  for (const segment of clipSegments) {
    const start = Math.max(0, segment.start - clipStart);
    const end = Math.min(clipEnd - clipStart, segment.end - clipStart);

    srt += `${index}\n`;
    srt += `${formatSRTTime(start)} --> ${formatSRTTime(end)}\n`;
    srt += `${segment.text}\n\n`;

    index++;
  }

  return srt;
}

function formatSRTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

