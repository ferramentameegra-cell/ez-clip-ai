/**
 * Tipos para o sistema de cortes sequenciais
 */

export type PackageSize = 5 | 10 | 50 | 100;
export type SegmentationMode = 'fixed' | 'semantic' | 'hybrid';

export interface PackageConfig {
  size: PackageSize;
  targetDurationSec: number;
  overlapSec: number;
  segmentationMode: SegmentationMode;
  aspectRatios: string[];
  durationTolerance: number; // 0.1 = 10%
}

export interface ClipSegment {
  index: number;
  total: number;
  start: number;
  end: number;
  overlapWithNext: number;
  text: string;
  partNumber: number;
}

export interface QAResult {
  loudness_ok: boolean;
  sync_ok: boolean;
  no_midword_cut: boolean;
  continuity_ok: boolean;
  passed: boolean;
  issues: string[];
}

export interface ContinuityMap {
  from: number;
  to: number;
  gap_sec: number;
  overlap_sec: number;
}

