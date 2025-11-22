# 📋 Plano de Implementação: Sistema Sequencial

## ✅ Status da Implementação

### **Fase 1: Backend Core** (PRIORITÁRIO)
- [ ] Atualizar schema do banco (`packageSize`, `overlapSec`, `segmentationMode`)
- [ ] Criar tipos/interfaces para pacotes (`shared/types.ts`)
- [ ] Atualizar `transcription.ts` para segmentação sequencial com overlap
- [ ] Atualizar `jobProcessor.ts` para trabalhar com pacotes
- [ ] Atualizar `videoRouter.ts` para aceitar `packageSize`
- [ ] Criar sistema de QA (`server/qa.ts`)
- [ ] Implementar presets por pacote e nicho

### **Fase 2: Frontend**
- [ ] Atualizar `Home.tsx` para seleção de pacotes (5, 10, 50, 100)
- [ ] Adicionar campos de configuração (overlap, modo de segmentação)
- [ ] Atualizar preview para mostrar informações do pacote
- [ ] Atualizar `JobsList.tsx` para mostrar progresso por pacote

### **Fase 3: QA e Validação**
- [ ] Implementar verificações automáticas de QA
- [ ] Sistema de reprocessamento (até 2 tentativas)
- [ ] Geração de manifest JSON
- [ ] Validação de continuidade entre clipes

---

## 🔧 Mudanças Necessárias

### **1. Schema do Banco (`drizzle/schema.ts`)**
```typescript
// Adicionar ao jobs:
packageSize: int('package_size'), // 5, 10, 50, 100
overlapSec: decimal('overlap_sec', { precision: 3, scale: 2 }), // 0.4-2.0
segmentationMode: varchar('segmentation_mode', { length: 20 }), // fixed, semantic, hybrid
targetDurationSec: int('target_duration_sec'), // Duração alvo por clipe
durationTolerance: decimal('duration_tolerance', { precision: 3, scale: 2 }), // 0.1 (10%)
```

### **2. Tipos (`shared/types.ts`)**
```typescript
export type PackageSize = 5 | 10 | 50 | 100;
export type SegmentationMode = 'fixed' | 'semantic' | 'hybrid';

export interface PackageConfig {
  size: PackageSize;
  targetDurationSec: number;
  overlapSec: number;
  segmentationMode: SegmentationMode;
  aspectRatios: string[];
}
```

### **3. Presets (`server/presets.ts`)**
```typescript
export const PACKAGE_PRESETS: Record<PackageSize, PackageConfig> = {
  5: { targetDurationSec: 90, overlapSec: 1.5, segmentationMode: 'hybrid', ... },
  10: { targetDurationSec: 60, overlapSec: 1.0, segmentationMode: 'hybrid', ... },
  50: { targetDurationSec: 45, overlapSec: 0.8, segmentationMode: 'fixed', ... },
  100: { targetDurationSec: 30, overlapSec: 0.6, segmentationMode: 'fixed', ... }
};
```

### **4. Segmentação Sequencial (`server/transcription.ts`)**
- Implementar `splitIntoSequentialClipsWithOverlap()`
- Respeitar limites de frase (não cortar no meio de palavra)
- Garantir continuidade cronológica
- Aplicar overlap entre clipes consecutivos

### **5. Sistema de QA (`server/qa.ts`)**
- Verificar loudness (-18 LUFS)
- Verificar sincronização de legendas (≤200ms)
- Verificar continuidade (sem lacunas)
- Verificar duração dentro da tolerância
- Verificar que não cortou no meio de palavra

---

## 📝 Próximos Passos

1. **Criar arquivo de tipos** (`shared/types.ts`)
2. **Atualizar schema do banco** (`drizzle/schema.ts`)
3. **Criar presets** (`server/presets.ts`)
4. **Atualizar segmentação** (`server/transcription.ts`)
5. **Atualizar jobProcessor** (`server/jobProcessor.ts`)
6. **Atualizar router** (`server/routers/video.ts`)
7. **Criar QA** (`server/qa.ts`)
8. **Atualizar frontend** (`client/src/pages/Home.tsx`)

---

## ⚠️ Notas Importantes

- **Créditos:** 1 crédito por clipe gerado (após aprovação no QA)
- **Overlap:** Permitido entre clipes consecutivos (0.4-2.0s)
- **Continuidade:** Sempre cronológica, sem pular conteúdo
- **QA:** Reprocessar até 2x se falhar

