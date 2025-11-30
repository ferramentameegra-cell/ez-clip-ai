# ✅ Verificar se OpenAI está Funcionando

## 🎯 Status Atual

Você já:
- ✅ Criou a API Key no site da OpenAI
- ✅ Adicionou `OPENAI_API_KEY` no Railway

Agora vamos confirmar se está tudo funcionando!

---

## 🔍 Método 1: Verificar via Railway Dashboard (Mais Rápido)

1. Acesse [https://railway.app](https://railway.app)
2. Entre no projeto **gentle-fulfillment**
3. Clique no serviço **ez-clip-ai**
4. Vá na aba **Variables**
5. Procure por `OPENAI_API_KEY`

**✅ Se aparecer na lista, está configurado!**

---

## 🔍 Método 2: Testar com um Vídeo Real (Melhor Teste)

1. **Acesse seu site:**
   - No Railway, vá em **Settings** → **Networking**
   - Copie a URL pública do seu site (ou use o domínio se tiver configurado)

2. **Faça login no site**

3. **Processe um vídeo:**
   - Cole um link do YouTube
   - Configure o trim (opcional)
   - Clique em processar

4. **Veja os logs em tempo real:**
   - No Railway, vá em **Deployments**
   - Clique no último deployment
   - Clique em **View Logs**
   - Procure por:
     ```
     [Whisper] Transcrevendo: ...
     [Transcription] Concluído: X segmentos
     ```

**✅ Se aparecer isso, está funcionando perfeitamente!**

---

## 🔍 Método 3: Verificar via Terminal (Mais Completo)

### Passo 1: Verificar se a variável está configurada

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
export PATH="$HOME/.local/bin:$PATH"
railway variables | grep -i openai
```

**✅ Se aparecer `OPENAI_API_KEY`, está configurado!**

### Passo 2: Ver logs em tempo real

```bash
railway logs --follow
```

Depois processe um vídeo e veja os logs aparecerem!

---

## ✅ O que você vai ver quando estiver funcionando

Nos logs do Railway, você verá algo como:

```
[Whisper] Transcrevendo: /tmp/viral-clips/audio_abc123.mp3 (pt)
[Transcription] Concluído: 25 segmentos
```

**Isso significa que a OpenAI está transcrevendo corretamente!** 🎉

---

## ❌ Problemas Comuns

### "Nenhuma API configurada"

**Solução:**
- Verifique se `OPENAI_API_KEY` está na lista de variáveis do Railway
- Certifique-se de que o nome está exatamente `OPENAI_API_KEY` (case-sensitive)
- Faça um redeploy após adicionar a variável

### "OpenAI falhou: 401 Unauthorized"

**Solução:**
- Verifique se a API key está correta (deve começar com `sk-`)
- Verifique se copiou a chave completa
- Certifique-se de ter créditos na conta OpenAI

### "OpenAI falhou: 429 Too Many Requests"

**Solução:**
- Você excedeu o limite de requisições
- Aguarde alguns minutos
- Verifique seus limites em [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)

---

## 📝 Como o Sistema Funciona

1. Quando você processa um vídeo, o sistema:
   - Baixa o vídeo do YouTube
   - Extrai o áudio
   - **Usa a OpenAI Whisper para transcrever** (se `OPENAI_API_KEY` estiver configurada)
   - Segmenta o vídeo em clipes
   - Gera os vídeos finais

2. **A OpenAI é usada automaticamente** - não precisa fazer nada especial!

3. **Fallback:** Se a OpenAI falhar, o sistema tenta Manus Forge (se configurado)

---

## 🎯 Próximos Passos

Depois que confirmar que a OpenAI está funcionando:

1. ✅ Configure AWS S3 (para armazenar vídeos)
2. ✅ Teste o processamento completo
3. ✅ Verifique se os vídeos estão sendo salvos

---

## 💡 Dica Rápida

A forma mais rápida de verificar é:
1. Processar um vídeo no site
2. Ver os logs no Railway
3. Se aparecer `[Whisper] Transcrevendo...`, está funcionando! ✅

