import { PackageSize, PackageConfig } from '../shared/types';

/**
 * Presets por pacote (Pack 5, 10, 50, 100)
 */
export const PACKAGE_PRESETS: Record<PackageSize, PackageConfig> = {
  5: {
    size: 5,
    targetDurationSec: 90,
    overlapSec: 1.5,
    segmentationMode: 'hybrid',
    aspectRatios: ['9:16', '1:1'], // 1:1 opcional
    durationTolerance: 0.1, // ±10%
  },
  10: {
    size: 10,
    targetDurationSec: 60,
    overlapSec: 1.0,
    segmentationMode: 'hybrid',
    aspectRatios: ['9:16'],
    durationTolerance: 0.1,
  },
  50: {
    size: 50,
    targetDurationSec: 45,
    overlapSec: 0.8,
    segmentationMode: 'fixed', // ou hybrid se áudio for muito linear
    aspectRatios: ['9:16'],
    durationTolerance: 0.1,
  },
  100: {
    size: 100,
    targetDurationSec: 30,
    overlapSec: 0.6,
    segmentationMode: 'fixed', // priorize estabilidade e batch speed
    aspectRatios: ['9:16'],
    durationTolerance: 0.1,
  },
};

/**
 * Presets leves por nicho (para padronização sutil)
 */
export interface NichePreset {
  emojisAllowed: number;
  primaryColor: string;
  fontFamily: string;
  ctaEnabled: boolean;
  punchInsAllowed: number;
  notes: string;
}

export const NICHE_PRESETS: Record<string, NichePreset> = {
  politica: {
    emojisAllowed: 0,
    primaryColor: '#0B5FFF',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: 'Tom sério, zero emojis, CTA discreto',
  },
  futebol: {
    emojisAllowed: 1,
    primaryColor: '#16A34A',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: '1 emoji permitido por corte, cor verde, pode breve vinheta de apito',
  },
  'series-filmes': {
    emojisAllowed: 0,
    primaryColor: '#6366F1',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: 'Destaque nomes próprios, sem spoilers explícitos',
  },
  comedia: {
    emojisAllowed: 2,
    primaryColor: '#F59E0B',
    fontFamily: 'Inter Bold',
    ctaEnabled: true,
    punchInsAllowed: 2,
    notes: 'Até 2 punch-ins leves, 1-2 emojis possíveis',
  },
  religiao: {
    emojisAllowed: 0,
    primaryColor: '#374151',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: 'Zero emojis, cor neutra, transições seco-corte',
  },
  profissoes: {
    emojisAllowed: 0,
    primaryColor: '#1F2937',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: 'Padrão corporativo, sem claims técnicos, zero emojis',
  },
  novelas: {
    emojisAllowed: 1,
    primaryColor: '#E11D48',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: '1 emoji leve, ênfase em nomes, cor viva',
  },
  'programas-tv': {
    emojisAllowed: 0,
    primaryColor: '#6366F1',
    fontFamily: 'Inter',
    ctaEnabled: true,
    punchInsAllowed: 0,
    notes: 'Ritmo talk show, respeitar aplausos/risos, sem cortar reações pela metade',
  },
};

/**
 * Obter preset de pacote
 */
export function getPackagePreset(size: PackageSize): PackageConfig {
  return PACKAGE_PRESETS[size];
}

/**
 * Obter preset de nicho
 */
export function getNichePreset(nicheId: string): NichePreset {
  return NICHE_PRESETS[nicheId] || NICHE_PRESETS.profissoes; // fallback
}

