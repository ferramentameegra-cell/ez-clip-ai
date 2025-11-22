# 📦 Especificação: Sistema de Cortes Sequenciais

## 🎯 Objetivo

Gerar lotes de clipes **sequenciais, cronológicos e padronizados** a partir da transcrição do vídeo/áudio, respeitando o número de cortes contratado e as durações-alvo, **sem priorizar "momentos virais"**.

**Prioridade:** cobertura do conteúdo, fluidez entre segmentos, e consistência visual/técnica em todo o pacote.

---

## 📊 Modelo de Negócio

### **Pacotes Disponíveis:**
- **Pack 5:** 5 clipes (60-120s cada)
- **Pack 10:** 10 clipes (45-90s cada)
- **Pack 50:** 50 clipes (30-60s cada)
- **Pack 100:** 100 clipes (20-45s cada)

### **Consumo de Créditos:**
- **1 crédito por clipe gerado** (após aprovação no QA)
- Se reprocessar após falha de QA, consome crédito novamente

---

## 🔄 Modo de Produção: SEQUENCIAL

### **Regras Obrigatórias:**
1. ✅ **Ordem cronológica preservada** (sem pular conteúdo)
2. ✅ **Cobertura máxima do timeline** (sem lacunas)
3. ✅ **Overlap curto permitido** (0.4-2.0s) para não quebrar frases
4. ✅ **Sem "pular" trechos** por parecerem menos interessantes
5. ✅ **Continuidade entre partes** (fluidez narrativa)

---

## ⚙️ Parâmetros de Segmentação

### **Modos Disponíveis:**
- **`fixed`:** Cortes de duração-alvo fixa (ex.: 45s), com tolerância ±10%
- **`semantic`:** Cortes seguem limites naturais (pausas, mudança de tópico), mas mantêm sequência
- **`hybrid`** (recomendado): Usa duração-alvo como guia, ajusta para respeitar frases completas

### **Presets por Pacote:**

| Pacote | Duração Alvo | Overlap | Modo | Aspect Ratio |
|--------|--------------|---------|------|--------------|
| Pack 5 | 90s | 1.5s | hybrid | 9:16, 1:1 (opcional) |
| Pack 10 | 60s | 1.0s | hybrid | 9:16 |
| Pack 50 | 45s | 0.8s | fixed/hybrid | 9:16 |
| Pack 100 | 30s | 0.6s | fixed | 9:16 |

---

## 🎨 Edição Mínima e Consistente

### **Regras de Edição:**
- ✅ Corte limpo nas pausas naturais
- ✅ Remover apenas silêncios longos (>5s) e ruídos óbvios
- ✅ Máximo 5-10% do runtime com micro-ajustes (punch-in leve ≤8%)
- ✅ Sem zooms/efeitos agressivos
- ✅ Sem "ganchos" artificiais ou cold opens não sequenciais
- ✅ Legendas padronizadas em todo o lote
- ✅ Música de fundo opcional: -28 a -30 LUFS, ducking -10 a -12 dB
- ✅ Normalizar voz: -16 LUFS mono / -18 LUFS estéreo, limite -1 dBTP

### **Branding Consistente:**
- Watermark/logo no mesmo canto em todos os cortes
- Safe areas para shorts (1080x1920) e wide (1920x1080)
- Cores e fonte conforme preset do nicho
- CTA discreto apenas se solicitado (ex.: "Parte 3 na sequência")

---

## 📝 Presets por Nicho

| Nicho | Emojis | Cor Primária | Fonte | CTA | Observações |
|-------|--------|--------------|-------|-----|-------------|
| **Política** | ❌ Zero | #0B5FFF | Sem serifa | Discreto | Tom sério |
| **Futebol** | ✅ 1 por corte | #16A34A | Coloquial | Opcional | Vinheta de apito (-20 dB) |
| **Séries/Filmes** | ❌ Zero | Neutra | Padrão | Opcional | Destaque nomes próprios |
| **Comédia** | ✅ 1-2 por corte | Viva | Bold | Opcional | Até 2 punch-ins leves |
| **Religião** | ❌ Zero | #374151 | Neutra | Opcional | Transições seco-corte |
| **Profissões** | ❌ Zero | Corporativa | Sóbria | Opcional | Sem claims técnicos |
| **Novelas** | ✅ 1 leve | #E11D48 | Popular | Opcional | Ênfase em nomes |
| **Programas TV** | ❌ Zero | Neutra | Talk show | Opcional | Respeitar aplausos/risos |

---

## 🔍 QA Automático

### **Verificações por Clipe:**
- ✅ Áudio sem clipping
- ✅ Loudness dentro da meta
- ✅ Silêncio inicial/final ≤ 300ms
- ✅ Sem cortes no meio de palavra
- ✅ Legendas sincronizadas (erro ≤ 200ms)
- ✅ Resolução e fps conforme output_config
- ✅ Continuidade: não "pular" trechos entre partes consecutivas

### **Reprocessamento:**
- Até 2 tentativas por clipe que falhar QA
- Se falhar após 2 tentativas, marcar `qa.passed=false` e detalhar issues

---

## 📋 Schema JSON de Saída

```json
{
  "job_id": "string",
  "package": {
    "requested_clips": 10,
    "produced_clips": 10,
    "segmentation_mode": "hybrid",
    "niche_id": "profissoes",
    "language": "pt-BR"
  },
  "source": {
    "duration_sec": 4521.7,
    "fps": 29.97,
    "resolution": "1920x1080"
  },
  "params": {
    "target_duration_sec": 60,
    "duration_tolerance": 0.1,
    "overlap_sec": 1.0,
    "aspect_ratios": ["9:16"],
    "fps_out": 30,
    "resolution_out": "1080x1920",
    "audio": {
      "voice_lufs": -18,
      "music_bed": true,
      "ducking_db": -11,
      "true_peak_db": -1
    },
    "subtitles": {
      "enabled": true,
      "style": "clean",
      "max_emphasis_words": 3
    },
    "branding": {
      "logo_url": "https://cdn.exemplo.com/logo.png",
      "watermark_position": "top-right",
      "primary_color": "#0B5FFF",
      "font_family": "Inter"
    },
    "cta": {
      "enabled": true,
      "text": "Parte {idx}/{total} • Próxima na sequência →",
      "show_on": "end"
    }
  },
  "clips": [
    {
      "index": 1,
      "total": 10,
      "title": "Guia de Advocacia – Parte 1/10",
      "slug": "guia-advocacia_parte-01-10",
      "timeline": {
        "start_sec": 0.0,
        "end_sec": 61.2,
        "overlap_with_next_sec": 1.0
      },
      "text": {
        "summary": "Introdução ao tema e objetivo da série.",
        "keywords": ["advocacia", "introdução", "objetivo"]
      },
      "captions": [
        {
          "start": 0.12,
          "end": 2.80,
          "text": "Bem-vindo, hoje vamos falar sobre…"
        }
      ],
      "qa": {
        "loudness_ok": true,
        "sync_ok": true,
        "no_midword_cut": true,
        "continuity_ok": true
      },
      "export": {
        "filename": "guia-advocacia_parte-01-10_00m00s-01m01s.mp4",
        "aspect_ratio": "9:16",
        "codec": "h264",
        "bitrate": "10M"
      }
    }
  ],
  "continuity_map": [
    {
      "from": 1,
      "to": 2,
      "gap_sec": 0.0,
      "overlap_sec": 1.0
    }
  ],
  "credits": {
    "consumed": 10,
    "policy": "1 crédito por corte gerado",
    "notes": "Consumo inclui clipes reprocessados aprovados no QA."
  },
  "qa_overall": {
    "passed": true,
    "issues": []
  }
}
```

---

## 🚨 Fallbacks e Políticas de Erro

### **Conteúdo Curto Demais:**
- **Estratégia A:** Reduzir `target_duration_sec` mantendo N cortes
- **Estratégia B:** Reduzir N até cobrir 95% do timeline
- **Regra:** Escolha A por padrão; se A quebrar legibilidade (cortes < 15s), aplicar B

### **Conteúdo Longo Demais:**
- Manter N e `target_duration`
- Ignorar excedente após o último corte
- Registrar aviso: "timeline não coberto 100%"

### **Silêncios Longos:**
- Se > 5s, posicionar cortes próximo a esse silêncio para manter fluidez

---

## 📁 Nomenclatura de Arquivos

**Padrão:** `{slug_base}_parte-{idx}-{total}_{inicio}-{fim}.mp4`

**Exemplo:** `guia-advocacia_parte-03-10_05m10s-06m00s.mp4`

**Título do corte:** `"Título Base – Parte {idx}/{total}"`

**Descrição:** `"Trecho de {hh:mm:ss} a {hh:mm:ss} do conteúdo completo."`

---

## ✅ Checklist de "Sequência Perfeita"

- [ ] Ordem cronológica preservada
- [ ] Sem lacunas entre partes (considerando overlap)
- [ ] Durações dentro da tolerância
- [ ] Sem cortes no meio de palavra
- [ ] Mesma estética em todo o pack
- [ ] Loudness e true peak dentro da meta
- [ ] Legendas sincronizadas e limpas
- [ ] Naming consistente e claro
- [ ] Manifest gerado
- [ ] Créditos consumidos corretamente

