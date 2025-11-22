# 📋 Prompts Mestres — Sistema de Cortes Sequenciais

## 📁 Estrutura de Arquivos

Este diretório contém os **8 prompts mestres** específicos por nicho, mais o **Prompt Core** com regras gerais.

### **Arquivos:**

1. **`PROMPT_MAESTRO_CORE.md`** - Regras gerais aplicáveis a todos os nichos
2. **`PROMPT_MAESTRO_POLITICA.md`** - Prompt para nicho Política
3. **`PROMPT_MAESTRO_FUTEBOL.md`** - Prompt para nicho Futebol
4. **`PROMPT_MAESTRO_SERIES_FILMES.md`** - Prompt para nicho Séries/Filmes
5. **`PROMPT_MAESTRO_COMEDIA.md`** - Prompt para nicho Comédia
6. **`PROMPT_MAESTRO_RELIGIAO.md`** - Prompt para nicho Religião
7. **`PROMPT_MAESTRO_PROFISSOES.md`** - Prompt para nicho Profissões
8. **`PROMPT_MAESTRO_NOVELAS.md`** - Prompt para nicho Novelas
9. **`PROMPT_MAESTRO_PROGRAMAS_TV.md`** - Prompt para nicho Programas TV

---

## 🎯 Como Usar

### **Opção 1: No Cursor (Rules/Workspace)**

1. Cole o **`PROMPT_MAESTRO_CORE.md`** nas **Rules do Cursor**
2. Use os prompts específicos por nicho quando necessário no **Composer**

### **Opção 2: No Backend (Sistema de IA)**

1. Use o **Core** como `system` prompt
2. Use o prompt do nicho específico como contexto adicional
3. Passe os parâmetros do job no `user` prompt:
   ```json
   {
     "pack_size": 10,
     "nicho_id": "politica",
     "transcricao": "...",
     "branding": {...}
   }
   ```

### **Opção 3: Snippets no Cursor**

1. Crie snippets para cada nicho:
   - `/politica` → Prompt Política
   - `/futebol` → Prompt Futebol
   - etc.

---

## 📝 Placeholders Padrão

Todos os prompts usam placeholders que devem ser preenchidos:

- `{{pack_size}}` - Tamanho do pacote (5, 10, 50, 100)
- `{{nicho_id}}` - ID do nicho
- `{{tema_principal}}` - Tema principal do conteúdo
- `{{branding.cores}}` - Cores do branding
- `{{branding.fonte}}` - Fonte do branding
- `{{cta_padrao}}` - Texto do CTA
- `{{duracao_total_seg}}` - Duração total em segundos
- `{{transcricao}}` - Texto da transcrição com timestamps

---

## ✅ Checklist de Uso

- [ ] Selecionar prompt do nicho correto
- [ ] Preencher todos os placeholders
- [ ] Validar JSON de saída
- [ ] Verificar compliance do nicho
- [ ] Confirmar `credits_used = pack_size`

---

## 🔗 Integração com o Sistema

Os prompts estão integrados com:
- **`server/presets.ts`** - Presets por pacote e nicho
- **`shared/types.ts`** - Tipos TypeScript
- **`server/transcription.ts`** - Segmentação sequencial
- **`server/qa.ts`** - Sistema de QA

---

**Todos os prompts seguem o mesmo padrão de saída JSON e as mesmas regras centrais de "sequencial, cronológico, edição mínima".**

