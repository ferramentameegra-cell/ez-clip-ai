# Prompt Mestre CORE — Regras Gerais (Aplicável a Todos os Nichos)

## Observação Geral

**Modo:** cortes sequenciais (cronológicos). Não reordenar, não pular trechos, não "caçar virais".

**Edição mínima:** corte seco, micro-ajustes de respiro (≤5%), correção de filler words leve quando necessário.

**Packs:** 5, 10, 50, 100 cortes, consumindo créditos equivalentes.

---

## Duração Alvo por Corte

### Com duração total conhecida:
- Dividir a duração total por N cortes
- Ajustar cada corte para terminar em fim de frase ou parágrafo
- Tolerância de ±10% (mín. 20s, máx. 120s por corte para short vertical)
- Se conteúdo é long-form 16:9, permitir 60–180s

### Sem duração total conhecida:
- Alvo padrão: 45–75s por corte
- Se a fala é rápida, subir teto para 90–120s

---

## Aspectos Técnicos

### Entrega Padrão:
- **9:16 (vertical)**, com segurança de croppings de rosto/legendas
- **Opcional adicional:** 1:1 e 16:9 se solicitado

### Áudio:
- **Loudness:** -14 LUFS integrado
- **Pico verdadeiro:** ≤ -1 dBTP

### Legendas:
- **Queimadas (burn-in)** em PT-BR
- **Sincronizadas**
- **Destaque por palavra** (karaokê leve)
- **Sem emojis excessivos**

### Naming:
- **Padrão:** `Sxx-Eyy-Clip-zz-[slug-curto].mp4`
  - `xx` = temporada (opcional)
  - `yy` = episódio ou data
  - `zz` = ordem do corte no pack

### Saída:
- **JSON único** com manifesto completo dos cortes

---

## Políticas de Edição Mínima (Iguais para Todos)

1. **Sem reorder**
2. **Sem jump-cuts agressivos** em sequência curta; priorize cortes naturais
3. **Sem zoom-ins desnecessários;** use apenas para leitura labial/ênfase de fala
4. **Cuidado com lipsync:** alinhar legendas à palavra falada (±120ms)

---

## Qualidade de Áudio

- **-14 LUFS integrado**, true peak ≤ -1 dBTP
- **Ruídos:** atenuar somente se distrativos, sem artefatos perceptíveis
- **Música de fundo:** somente licenciada; sempre abaixo de -26 LUFS

---

## Legendas

- **PT-BR**, ortografia conforme ABL
- **Máximo 2 linhas** por bloco
- **38–42 caracteres** por linha
- **Duração mínima 1s** por bloco
- **Quebra em sintagmas naturais**
- **Evitar "viu?" e muletas** salvo se relevantes ao estilo

---

## CTA Sequencial (Padrão)

- **Texto base:** "Parte X/Y — continue para manter o contexto"
- **Posição:** últimos 3–5s do corte
- **Alternativas por nicho** já especificadas nos prompts individuais

---

## Naming e Organização

- **Diretório por pack:** `/packs/Sxx-Eyy/`
- **Arquivo por corte:** `Sxx-Eyy-Clip-zz-[slug].mp4`
- **Manifest:** `manifest.json` com a estrutura completa

---

## Heurística de Cálculo de Duração por Corte

### Com `duracao_total_seg` conhecido:
1. `base = duracao_total_seg / pack_size`
2. Ajuste para terminar em fim de frase; tolerância ±10%
3. **Clamp:** mínimo 20s, máximo 120s para short 9:16
4. Para talk show 16:9 permitido até 180s se deliverables incluir 16:9

### Sem duração conhecida:
1. Use 45–75s
2. Se densidade de fala alta: 60–90s
3. Se baixa: 30–60s
4. **Não cortar:** punchline, resposta completa, versículo completo ou lance descrito
5. Se ultrapassar o teto, permita uma exceção e sinalize em `qa.compliance_flags`

---

## Checklist Final (Todos os Nichos)

- [ ] Ordem cronológica preservada
- [ ] Cortes finalizam frases/ideias
- [ ] Sem sobreposição; gap ≤0.5s
- [ ] Loudness e picos dentro da meta
- [ ] Legendas sincronizadas, limpas e consistentes com o preset de nicho
- [ ] CTAs em todos os cortes, exceto o último (pode conter CTA de seguir/assinar)
- [ ] `credits_used` correto

---

## Estrutura JSON Padrão

```json
{
  "pack_meta": {
    "pack_size": 10,
    "credits_used": 10,
    "tema_principal": "string",
    "data_processamento": "YYYY-MM-DD",
    "deliverables": ["9:16"],
    "duracao_total_estimada_s": 720
  },
  "cortes": [
    {
      "id": "c1",
      "ordem": 1,
      "start_ms": 0,
      "end_ms": 72000,
      "duracao_ms": 72000,
      "titulo": "Texto curto e claro",
      "subtitulo": "Complemento opcional",
      "descricao": "Resumo objetivo do que há neste corte, sem clickbait",
      "cta": {
        "texto": "Parte 1/10 — continue para manter o contexto",
        "posicao_s": 60,
        "estilo": "card_simples"
      },
      "legendas": {
        "estilo": {
          "font": "Inter",
          "size": 42,
          "color": "#FFFFFF",
          "outline": "#000000"
        },
        "palavras_destaque": ["termos", "nomes", "números"]
      },
      "overlays": [],
      "audio": {
        "lufs_integrado": -14,
        "true_peak_db": -1.0
      },
      "export": {
        "aspect_ratios": ["9:16"],
        "bitrate": "8 Mbps",
        "codec": "h264"
      },
      "filename": "S01-E05-Clip-01-analise-intro.mp4",
      "flags": {},
      "qa": {
        "continuidade_ok": true,
        "sobreposicao_ok": true,
        "gaps_max_s": 0.0,
        "loudness_ok": true,
        "ortografia_ok": true
      }
    }
  ],
  "qa": {
    "continuidade_ok": true,
    "sobreposicao_ok": true,
    "gaps_max_s": 0.5,
    "loudness_ok": true,
    "ortografia_ok": true,
    "compliance_flags": []
  }
}
```

---

## Regras de Validação

1. **Cortes em ordem crescente** de tempo
2. **Sem sobreposições;** gaps entre cortes ≤0.5s (preferência 0)
3. **start_ms/end_ms** sempre inteiros
4. **credits_used = pack_size**
5. **Preencher "flags"** conforme nicho; use `null` quando não aplicável

