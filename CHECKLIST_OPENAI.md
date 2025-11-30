# ✅ Checklist: Verificar OpenAI

## 📋 Passo a Passo Rápido

### 1. ✅ Verificar se está configurado no Railway

**No Railway Dashboard:**
1. Acesse [https://railway.app](https://railway.app)
2. Entre no projeto
3. Clique no serviço **ez-clip-ai**
4. Vá em **Variables**
5. Procure por `OPENAI_API_KEY`

**✅ Deve aparecer na lista!**

---

### 2. ✅ Testar processando um vídeo

**A forma mais fácil de verificar:**

1. **Acesse seu site:**
   - No Railway: Settings → Networking
   - Copie a URL pública

2. **Faça login**

3. **Processe um vídeo do YouTube:**
   - Cole um link
   - Clique em processar

4. **Veja os logs:**
   - Railway → Deployments → Último deployment → View Logs
   - Procure por: `[Whisper] Transcrevendo: ...`

**✅ Se aparecer isso, está funcionando!**

---

### 3. ✅ O que você deve ver nos logs

**Quando estiver funcionando:**

```
[Whisper] Transcrevendo: /tmp/viral-clips/audio_abc123.mp3 (pt)
[Transcription] Concluído: 25 segmentos
```

**Quando NÃO estiver funcionando:**

```
[Whisper] Nenhuma API configurada. Retornando mock para desenvolvimento.
```

ou

```
[Whisper] OpenAI falhou: 401 Unauthorized
```

---

## 🔧 Como o Sistema Funciona

1. **Quando você processa um vídeo:**
   - Sistema baixa o vídeo do YouTube
   - Extrai o áudio
   - **Automaticamente usa OpenAI Whisper para transcrever** (se `OPENAI_API_KEY` estiver configurada)
   - Segmenta em clipes
   - Gera os vídeos finais

2. **Prioridade:**
   - ✅ Tenta OpenAI primeiro
   - ⚠️ Se falhar, tenta Manus Forge (se configurado)
   - ❌ Se nenhuma estiver configurada, usa mock

3. **Você não precisa fazer nada especial** - é automático!

---

## ❌ Problemas Comuns

### Problema: "Nenhuma API configurada"

**Solução:**
- Verifique se `OPENAI_API_KEY` está na lista de variáveis
- Faça um redeploy após adicionar

### Problema: "401 Unauthorized"

**Solução:**
- Verifique se a chave está correta (deve começar com `sk-`)
- Verifique se copiou completa (sem espaços)
- Certifique-se de ter créditos na conta OpenAI

### Problema: "429 Too Many Requests"

**Solução:**
- Aguarde alguns minutos
- Verifique limites em [platform.openai.com/account/billing](https://platform.openai.com/account/billing)

---

## 🎯 Resumo

**Se você:**
- ✅ Criou a API key
- ✅ Adicionou no Railway como `OPENAI_API_KEY`
- ✅ Vê a variável na lista do Railway

**Então está configurado!** 

**Para confirmar 100%, processe um vídeo e veja os logs!** 🚀

---

## 💡 Dica

A forma mais rápida:
1. Processe um vídeo no site
2. Veja os logs no Railway
3. Se aparecer `[Whisper] Transcrevendo...`, está funcionando! ✅

