# 🔗 Integração dos Prompts no Backend

## ✅ O Que Foi Implementado

### **1. Prompt Loader** (`server/promptLoader.ts`)
- ✅ Carrega prompts dos arquivos markdown
- ✅ Função `getCorePrompt()` - Carrega regras gerais
- ✅ Função `getPromptForNiche()` - Carrega prompt específico do nicho
- ✅ Função `getFullPrompt()` - Combina Core + Nicho
- ✅ Função `replacePlaceholders()` - Substitui placeholders com dados do job

### **2. AI Segmenter** (`server/aiSegmenter.ts`)
- ✅ Função `segmentWithAI()` - Segmenta usando IA com prompts mestres
- ✅ Fallback automático para segmentação algorítmica se IA falhar
- ✅ Integração com sistema de prompts

### **3. Job Processor Atualizado** (`server/jobProcessor.ts`)
- ✅ Suporte a segmentação com IA (opcional)
- ✅ Fallback automático para algoritmo se IA não disponível
- ✅ Usa prompts do nicho quando `USE_AI_SEGMENTATION=true`

---

## ⚙️ Como Ativar Segmentação com IA

### **Opção 1: Variável de Ambiente**

Adicione no `.env`:

```bash
# Ativar segmentação com IA
USE_AI_SEGMENTATION=true

# Escolher provedor (openai ou anthropic)
AI_PROVIDER=openai

# Configurar API de IA (OpenAI)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview  # opcional

# OU Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022  # opcional
```

**Nota:** Se `ANTHROPIC_API_KEY` estiver definida, o sistema usa Anthropic automaticamente, mesmo que `AI_PROVIDER=openai`.

### **Opção 2: Sem IA (Padrão Atual)**

Se `USE_AI_SEGMENTATION` não estiver definido ou for `false`, o sistema usa segmentação algorítmica (já implementada e funcional).

---

## ✅ Chamada Real de IA Implementada

A função `callAI()` já está implementada em `server/aiSegmenter.ts` com suporte para:

### **OpenAI:**
- Modelo padrão: `gpt-4-turbo-preview`
- Suporta `response_format: { type: 'json_object' }`
- Configurável via `OPENAI_MODEL`

### **Anthropic:**
- Modelo padrão: `claude-3-5-sonnet-20241022`
- Extrai JSON de markdown code blocks automaticamente
- Configurável via `ANTHROPIC_MODEL`

### **Instalação:**

As dependências já foram instaladas:
```bash
npm install openai @anthropic-ai/sdk
```

### **Uso:**

Basta configurar as variáveis de ambiente no `.env` e ativar `USE_AI_SEGMENTATION=true`.

---

## 📋 Fluxo de Processamento

### **Com IA Ativada:**

1. Job criado com `packageSize` e `vertical`
2. Transcrição gerada
3. **Sistema carrega prompt do nicho** (`getFullPrompt()`)
4. **Substitui placeholders** com dados do job
5. **Chama IA** com prompt completo
6. **IA retorna JSON** com cortes segmentados
7. **Sistema valida e processa** cada clipe
8. **Se IA falhar**, fallback automático para algoritmo

### **Sem IA (Padrão):**

1. Job criado com `packageSize` e `vertical`
2. Transcrição gerada
3. **Sistema usa algoritmo** (`splitIntoSequentialClipsWithOverlap()`)
4. **Processa cada clipe** normalmente

---

## 🎯 Vantagens da Integração

### **Com IA:**
- ✅ Segmentação mais inteligente (respeita contexto, pausas naturais)
- ✅ Títulos e descrições gerados automaticamente
- ✅ Compliance automático por nicho
- ✅ CTAs personalizados

### **Sem IA (Algoritmo):**
- ✅ Funciona imediatamente (sem dependências)
- ✅ Rápido e previsível
- ✅ Sem custos de API
- ✅ Já implementado e testado

---

## 📝 Exemplo de Uso

### **No Job Processor:**

```typescript
// O sistema já detecta automaticamente:
if (useAI && job.vertical) {
  // Usa IA com prompt do nicho
  clips = await segmentWithAI(...);
} else {
  // Usa algoritmo
  clips = splitIntoSequentialClipsWithOverlap(...);
}
```

---

## ✅ Status da Implementação

- ✅ **Prompt Loader:** 100% implementado
- ✅ **AI Segmenter:** Estrutura pronta (placeholder para API)
- ✅ **Job Processor:** Integrado com fallback
- ⏳ **Chamada Real de IA:** Pendente (implementar com OpenAI/Anthropic)

---

## 🚀 Próximos Passos

1. **Instalar SDK de IA** (se quiser usar):
   ```bash
   npm install openai
   # ou
   npm install @anthropic-ai/sdk
   ```

2. **Implementar `callAI()`** em `server/aiSegmenter.ts`

3. **Adicionar variável de ambiente:**
   ```bash
   USE_AI_SEGMENTATION=true
   OPENAI_API_KEY=sk-...
   ```

4. **Testar** com um job real

---

**O sistema está pronto para usar prompts! Por padrão, usa algoritmo. Para usar IA, implemente a chamada real e ative a flag.**

