# ⚡ INTEGRAÇÃO RÁPIDA DE APIs - PASSO A PASSO

## 🎯 RESUMO

Você precisa configurar **2 APIs críticas** para o sistema funcionar:

1. **API de Transcrição** (Manus Forge ou OpenAI)
2. **AWS S3** (Armazenamento)

---

## ✅ O QUE JÁ ESTÁ CONFIGURADO

```
✅ AWS_REGION = us-east-1
✅ AWS_S3_BUCKET = ez-clip-ai
✅ BUILT_IN_FORGE_API_URL = https://api.manus.im
```

---

## ❌ O QUE FALTA CONFIGURAR

```
❌ BUILT_IN_FORGE_API_KEY = (precisa obter)
❌ AWS_ACCESS_KEY_ID = (precisa obter)
❌ AWS_SECRET_ACCESS_KEY = (precisa obter)
```

---

## 🚀 PASSO 1: API DE TRANSCRIÇÃO (15 minutos)

### **Opção A: Manus Forge** ⭐ Recomendado

1. **Acesse:** https://manusforge.com ou https://manus.im
2. **Crie conta** e faça login
3. **Vá em "API Keys"** ou "Dashboard"
4. **Crie uma API Key** e copie
5. **Configure no Railway:**

```bash
railway variables set BUILT_IN_FORGE_API_KEY=sua_api_key_aqui
```

**OU pelo Dashboard:**
- Railway → Projeto → Serviço → Variables → New Variable
- Name: `BUILT_IN_FORGE_API_KEY`
- Value: sua API key
- Add

---

### **Opção B: OpenAI** (Alternativa - mais caro)

1. **Acesse:** https://platform.openai.com
2. **Crie conta** e adicione método de pagamento
3. **Vá em "API Keys"**
4. **Crie uma chave** e copie (formato: `sk-proj-...`)
5. **Configure no Railway:**

```bash
railway variables set OPENAI_API_KEY=sk-proj-sua_chave_aqui
```

---

## 🚀 PASSO 2: AWS S3 (30 minutos)

### **1. Criar Conta AWS**

1. Acesse: https://aws.amazon.com
2. Clique em **"Create an AWS Account"**
3. Preencha seus dados
4. Adicione cartão de crédito
5. Confirme por SMS

⏱️ **Tempo:** 10-15 minutos

---

### **2. Criar Bucket S3**

1. Acesse: https://s3.console.aws.amazon.com
2. Clique em **"Create bucket"**
3. Preencha:
   - **Bucket name:** `ez-clip-ai` (ou outro nome único)
   - **Region:** `us-east-1`
   - **Object Ownership:** ACLs enabled
   - **Block Public Access:** ✅ **DESMARQUE TODAS** as opções
   - **Encryption:** Habilitado (recomendado)
4. Clique em **"Create bucket"**

✅ **Bucket criado!**

---

### **3. Criar Usuário IAM**

1. Acesse: https://console.aws.amazon.com/iam
2. **"Users"** → **"Create user"**
3. **User name:** `ez-clip-ai-user`
4. Clique em **"Next"**
5. **"Attach policies directly"**
6. Procure: **`AmazonS3FullAccess`**
7. **Marque** a política
8. Clique em **"Next"** → **"Create user"**

---

### **4. Criar Access Keys**

1. Clique no usuário criado
2. Aba **"Security credentials"**
3. **"Access keys"** → **"Create access key"**
4. Selecione: **"Application running outside AWS"**
5. Clique em **"Next"** → **"Create access key"**
6. **COPIE E SALVE:**
   - **Access Key ID:** `AKIA...`
   - **Secret Access Key:** `wJalrXUt...` ⚠️ Só aparece uma vez!

---

### **5. Configurar no Railway**

**Via Terminal:**
```bash
railway variables set AWS_ACCESS_KEY_ID=AKIA...
railway variables set AWS_SECRET_ACCESS_KEY=wJalrXUt...
```

**OU via Dashboard:**
- Railway → Variables → New Variable
- Adicione cada uma:
  - `AWS_ACCESS_KEY_ID` = sua Access Key ID
  - `AWS_SECRET_ACCESS_KEY` = sua Secret Access Key

---

## ✅ VERIFICAR SE FUNCIONOU

```bash
# Ver todas as variáveis de API
railway variables | grep -E "FORGE|AWS|OPENAI"

# Deve mostrar:
✅ BUILT_IN_FORGE_API_KEY=manus_... (ou OPENAI_API_KEY=sk-...)
✅ AWS_ACCESS_KEY_ID=AKIA...
✅ AWS_SECRET_ACCESS_KEY=*** (oculto)
✅ AWS_REGION=us-east-1 (já estava)
✅ AWS_S3_BUCKET=ez-clip-ai (já estava)
```

---

## 🧪 TESTAR

Após configurar tudo:

1. **Acesse o site:** https://ez-clip-ai-production.up.railway.app
2. **Crie uma conta**
3. **Crie um job** com URL do YouTube
4. **Verifique os logs:**

```bash
railway logs --follow
```

**Deve mostrar:**
- ✅ `[Whisper] Transcrevendo...`
- ✅ `[S3] Upload concluído...`
- ✅ `[Job] Processamento concluído!`

---

## 🆘 SE DER ERRO

### **Erro: "API Key inválida"**
- Verifique se copiou a chave completa
- Verifique se não tem espaços extras
- Tente criar uma nova chave

### **Erro: "S3 Access Denied"**
- Verifique se as credenciais estão corretas
- Verifique se o bucket existe
- Verifique se o usuário IAM tem `AmazonS3FullAccess`

### **Erro: "Transcrição falhou"**
- Verifique se há créditos na conta Manus Forge/OpenAI
- Verifique os logs para ver erro específico

---

## 📋 CHECKLIST RÁPIDO

- [ ] API de Transcrição configurada (`BUILT_IN_FORGE_API_KEY` ou `OPENAI_API_KEY`)
- [ ] AWS Access Key ID configurado
- [ ] AWS Secret Access Key configurado
- [ ] Bucket S3 criado
- [ ] Usuário IAM criado com permissões
- [ ] Testado processamento de vídeo

---

## ⏱️ TEMPO TOTAL

- API de Transcrição: **15 minutos**
- AWS S3: **30 minutos**
- **Total: ~45 minutos**

---

## 🎉 PRONTO!

Após configurar essas 2 APIs, o sistema está **100% funcional** para processar vídeos!

**Próximo passo:** Testar processando um vídeo! 🚀


