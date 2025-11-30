# ✅ OpenAI Configurado - Verificar se Está Funcionando

## 🎉 Parabéns!

Você já:
- ✅ Criou a API Key no site da OpenAI
- ✅ Adicionou `OPENAI_API_KEY` no Railway

**A configuração está completa!** Agora vamos verificar se está funcionando.

---

## 🔍 Como Verificar (2 Formas)

### ⚡ Forma Rápida (30 segundos)

1. No Railway, vá em **Variables**
2. Procure por `OPENAI_API_KEY`
3. **Se aparecer na lista = Configurado! ✅**

---

### 🧪 Forma Completa (Teste Real)

1. **Acesse seu site no Railway**
   - Settings → Networking → Copie a URL

2. **Processe um vídeo do YouTube**
   - Cole um link
   - Clique em processar

3. **Veja os logs**
   - Railway → Deployments → Último → View Logs
   - Procure por: `[Whisper] Transcrevendo: ...`

**Se aparecer isso, está funcionando perfeitamente! ✅**

---

## 📝 O Que Esperar

### ✅ Funcionando Corretamente:

```
[Whisper] Transcrevendo: /tmp/viral-clips/audio_123.mp3 (pt)
[Transcription] Concluído: 25 segmentos
```

### ❌ Não Funcionando:

```
[Whisper] Nenhuma API configurada. Retornando mock...
```

ou

```
[Whisper] OpenAI falhou: 401 Unauthorized
```

---

## ⚙️ Como Funciona

1. **Automático:** Quando você processa um vídeo, a OpenAI é usada automaticamente
2. **Prioridade:** Tenta OpenAI primeiro, depois Manus Forge (se configurado)
3. **Sem configuração extra:** Não precisa fazer nada além de ter a API key configurada

---

## ❓ Problemas?

### "Nenhuma API configurada"
- Verifique se `OPENAI_API_KEY` está na lista de variáveis
- Faça um redeploy

### "401 Unauthorized"
- Verifique se a chave está correta (deve começar com `sk-`)
- Certifique-se de ter créditos na conta OpenAI

### "429 Too Many Requests"
- Aguarde alguns minutos
- Verifique limites em [platform.openai.com/account/billing](https://platform.openai.com/account/billing)

---

## 🎯 Próximo Passo

**Configure AWS S3** para armazenar os vídeos processados!

Veja o guia: `GUIA_INTEGRACAO_APIS.md` ou `INTEGRACAO_RAPIDA_APIS.md`

---

## 💡 Dica

A forma mais rápida de verificar é processar um vídeo e ver os logs em tempo real! 🚀

