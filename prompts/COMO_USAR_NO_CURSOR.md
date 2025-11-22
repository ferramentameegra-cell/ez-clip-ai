# 🎯 Como Usar os Prompts no Cursor

## ✅ Sim, você pode colar no Cursor!

Existem 3 formas principais de usar os prompts. Escolha a que melhor se adapta ao seu fluxo:

---

## 📋 Opção 1: Rules do Cursor (Recomendado para Consistência)

### **Passo a Passo:**

1. **Abra as Settings do Cursor:**
   - `Cmd + ,` (Mac) ou `Ctrl + ,` (Windows/Linux)
   - Vá em **"Rules for AI"** ou **"Cursor Settings" → "Rules"**

2. **Cole o Prompt Core:**
   - Abra `PROMPT_MAESTRO_CORE.md`
   - Copie todo o conteúdo
   - Cole nas Rules do Cursor
   - Isso garante que todas as respostas sigam as regras gerais

3. **Use os Prompts por Nicho no Composer:**
   - Quando precisar processar um vídeo de um nicho específico
   - Abra o prompt do nicho (ex.: `PROMPT_MAESTRO_POLITICA.md`)
   - Cole no Composer/Chat
   - Preencha os placeholders com os dados do job

### **Vantagens:**
- ✅ Consistência em todas as respostas
- ✅ Não precisa repetir regras gerais
- ✅ Foco no nicho específico quando necessário

---

## 📋 Opção 2: Snippets no Cursor (Rápido e Prático)

### **Passo a Passo:**

1. **Crie Snippets:**
   - Abra `Cmd + Shift + P` (Mac) ou `Ctrl + Shift + P` (Windows/Linux)
   - Digite "Preferences: Configure User Snippets"
   - Selecione "typescript" ou "markdown"

2. **Adicione Snippets para Cada Nicho:**
   ```json
   {
     "Prompt Política": {
       "prefix": "/politica",
       "body": [
         "// Cole aqui o conteúdo de PROMPT_MAESTRO_POLITICA.md"
       ]
     },
     "Prompt Futebol": {
       "prefix": "/futebol",
       "body": [
         "// Cole aqui o conteúdo de PROMPT_MAESTRO_FUTEBOL.md"
       ]
     }
     // ... etc para todos os 8 nichos
   }
   ```

3. **Use no Composer:**
   - Digite `/politica` e pressione Tab
   - O prompt será inserido automaticamente
   - Preencha os placeholders

### **Vantagens:**
- ✅ Acesso rápido com atalhos
- ✅ Não precisa procurar arquivos
- ✅ Padronizado

---

## 📋 Opção 3: No Backend (Produção Real)

### **Como Integrar:**

1. **Crie um arquivo de prompts:**
   ```typescript
   // server/prompts.ts
   import fs from 'fs';
   import path from 'path';

   export function getPromptForNiche(nicheId: string): string {
     const promptPath = path.join(__dirname, '../prompts', `PROMPT_MAESTRO_${nicheId.toUpperCase()}.md`);
     return fs.readFileSync(promptPath, 'utf-8');
   }

   export function getCorePrompt(): string {
     const corePath = path.join(__dirname, '../prompts', 'PROMPT_MAESTRO_CORE.md');
     return fs.readFileSync(corePath, 'utf-8');
   }
   ```

2. **Use na chamada da IA:**
   ```typescript
   const corePrompt = getCorePrompt();
   const nichePrompt = getPromptForNiche('politica');
   
   const systemPrompt = `${corePrompt}\n\n${nichePrompt}`;
   
   const userPrompt = `
     Processe este vídeo:
     - pack_size: ${packageSize}
     - transcricao: ${transcription}
     - tema_principal: ${theme}
     - branding: ${JSON.stringify(branding)}
   `;
   ```

### **Vantagens:**
- ✅ Controle programático
- ✅ Logs e auditoria
- ✅ Integração com o sistema de créditos

---

## 🎯 Exemplo Prático: Usar no Composer

### **Cenário:** Processar vídeo de Política, Pack 10

1. **Cole no Composer:**
   ```
   [Cole aqui o conteúdo de PROMPT_MAESTRO_POLITICA.md]
   
   Agora processe este vídeo:
   - pack_size: 10
   - transcricao: [cole a transcrição aqui]
   - tema_principal: Reforma Tributária
   - branding: { cores: ["#0B5FFF", "#FFFFFF"], fonte: "Inter" }
   - duracao_total_seg: 720
   ```

2. **O Cursor vai:**
   - Seguir as regras do prompt
   - Gerar o JSON de saída
   - Validar continuidade e QA

3. **Você recebe:**
   - JSON completo com todos os cortes
   - Pronto para processar no backend

---

## 📝 Dicas Importantes

### **1. Preencha os Placeholders:**
- `{{pack_size}}` → 5, 10, 50 ou 100
- `{{nicho_id}}` → politica, futebol, etc.
- `{{transcricao}}` → texto com timestamps
- `{{branding.cores}}` → array de cores hex

### **2. Valide o JSON:**
- Sempre peça: "Responda em JSON estrito, sem comentários"
- Valide o schema antes de processar

### **3. Controle de Tokens:**
- Se o transcript for muito longo, resuma primeiro
- Divida em chunks se necessário

---

## 🔗 Integração com o Sistema

Os prompts estão prontos para integrar com:
- ✅ `server/presets.ts` - Presets por nicho
- ✅ `server/transcription.ts` - Segmentação
- ✅ `server/qa.ts` - Validação
- ✅ `server/jobProcessor.ts` - Processamento

---

## ✅ Checklist de Uso

- [ ] Selecionar prompt do nicho correto
- [ ] Preencher placeholders
- [ ] Validar JSON de saída
- [ ] Verificar compliance
- [ ] Confirmar `credits_used = pack_size`

---

**Pronto! Agora você pode usar os prompts diretamente no Cursor! 🚀**

