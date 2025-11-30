# 🧪 Como Testar a Integração da OpenAI

## ✅ Status Atual

Você já:
- ✅ Criou a API Key no site da OpenAI
- ✅ Adicionou a variável `OPENAI_API_KEY` no Railway

Agora vamos verificar se está tudo funcionando!

---

## 🔍 Verificação Rápida

### Opção 1: Via Interface do Railway (Mais Fácil)

1. Acesse [https://railway.app](https://railway.app)
2. Entre no projeto **gentle-fulfillment**
3. Clique no serviço **ez-clip-ai**
4. Vá na aba **Variables**
5. Procure por `OPENAI_API_KEY` - ela deve aparecer na lista

✅ **Se estiver lá, está configurado!**

---

### Opção 2: Via Terminal (Teste Completo)

#### 1. Baixar o Railway CLI (se ainda não tiver)

```bash
curl -fsSL https://railway.app/install.sh | sh
```

#### 2. Fazer login

```bash
railway login
```

#### 3. Verificar variável

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway variables | grep OPENAI
```

Se aparecer `OPENAI_API_KEY` na lista, está configurado! ✅

#### 4. Testar localmente (opcional)

Para testar antes de fazer deploy:

1. Criar arquivo `.env.local` na raiz do projeto:

```bash
echo "OPENAI_API_KEY=sk-proj-sua_chave_aqui" > .env.local
```

2. Instalar dependências (se ainda não instalou):

```bash
npm install
```

3. Rodar o teste:

```bash
npm run test:openai
```

---

## 🚀 Teste Real (Processando um Vídeo)

A melhor forma de testar é processar um vídeo real:

1. **Acesse o site no Railway:**
   - Vá em [https://railway.app](https://railway.app)
   - Entre no projeto
   - Clique no serviço **ez-clip-ai**
   - Vá em **Settings** → **Networking**
   - Copie a URL pública (ou use o domínio customizado se tiver)

2. **Faça login no site**

3. **Processe um vídeo do YouTube:**
   - Cole um link do YouTube
   - Configure o trim (se quiser)
   - Clique em processar

4. **Monitore os logs:**
   - No Railway, vá em **Deployments**
   - Clique no último deployment
   - Vá em **View Logs**
   - Procure por mensagens como:
     - `[Whisper] Transcrevendo: ...`
     - Se aparecer erro, procure por `OpenAI falhou` ou similar

---

## ✅ O que esperar quando funcionar

Quando a OpenAI estiver funcionando corretamente, você verá nos logs:

```
[Whisper] Transcrevendo: /tmp/viral-clips/audio_12345.mp3 (pt)
[Transcription] Concluído: 25 segmentos
```

**Se aparecer isso, está funcionando perfeitamente!** 🎉

---

## ❌ Possíveis Problemas

### Problema 1: "OPENAI_API_KEY não configurada"

**Solução:**
- Verifique se adicionou a variável no Railway
- Verifique se o nome está exatamente `OPENAI_API_KEY` (case-sensitive)
- Tente fazer um redeploy

### Problema 2: "OpenAI falhou: 401 Unauthorized"

**Solução:**
- Verifique se a API key está correta (deve começar com `sk-`)
- Verifique se copiou a chave completa (sem espaços extras)
- Verifique se sua conta OpenAI tem créditos disponíveis

### Problema 3: "OpenAI falhou: 429 Too Many Requests"

**Solução:**
- Você excedeu o limite de requisições
- Aguarde alguns minutos e tente novamente
- Ou verifique seus limites em [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)

### Problema 4: Sistema usando Manus Forge em vez da OpenAI

**Solução:**
- O sistema tenta OpenAI primeiro, mas se falhar, usa Manus Forge como fallback
- Verifique os logs para ver por que a OpenAI falhou
- Se `BUILT_IN_FORGE_API_KEY` estiver configurada, o sistema pode estar usando ela

---

## 📝 Notas Importantes

1. **A OpenAI é usada automaticamente** quando você processa um vídeo - não precisa fazer nada especial!

2. **O sistema tem fallback:** Se a OpenAI falhar, tenta Manus Forge. Se nenhuma estiver configurada, usa um mock para desenvolvimento.

3. **Custos:** Cada transcrição custa alguns centavos. Verifique seus créditos em [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)

4. **Primeira transcrição pode demorar:** A primeira vez que usar a API pode demorar um pouco mais (cold start).

---

## 🎯 Próximos Passos

Depois que confirmar que a OpenAI está funcionando:

1. ✅ Configure AWS S3 (para armazenar vídeos processados)
2. ✅ Teste o processamento completo de um vídeo
3. ✅ Verifique se os vídeos estão sendo salvos corretamente

---

## 💡 Dica

Se quiser testar sem processar um vídeo completo, você pode verificar os logs do Railway em tempo real:

```bash
railway logs --follow
```

Depois processe um vídeo e veja os logs aparecerem em tempo real!

