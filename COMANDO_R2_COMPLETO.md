# 🚀 Configurar Cloudflare R2 - Comando por Comando

## ✅ O Que Você Já Tem

- ✅ Account ID: `45a4af538d59d53aa52ef8179165e0da`
- ✅ Endpoint: `https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com`

---

## 📋 O Que Fazer Agora (3 Passos)

### ✅ Passo 1: Criar Bucket

1. Abra: https://dash.cloudflare.com
2. Clique em **"R2"** (menu lateral)
3. Clique em **"Create bucket"**
4. Nome: `ez-clip-ai`
5. Location: `auto`
6. Clique em **"Create bucket"**

**⏱️ Tempo: 2 minutos**

---

### ✅ Passo 2: Criar API Token

1. No dashboard R2, clique em **"Manage R2 API Tokens"**
2. Clique em **"Create API token"**
3. Preencha:
   - Nome: `ez-clip-ai-token`
   - Permissions: **Admin Read & Write**
4. Clique em **"Create API Token"**
5. **⚠️ COPIE AGORA (só aparece uma vez!):**
   - Access Key ID
   - Secret Access Key

**⏱️ Tempo: 2 minutos**

---

### ✅ Passo 3: Configurar no Railway

**Opção A: Me enviar as credenciais**
- Envie: Access Key ID, Secret Access Key, nome do bucket
- Eu configuro no Railway para você! ✅

**Opção B: Você mesmo configurar**

1. Acesse: https://railway.app → Seu projeto → Variables
2. Adicione estas 5 variáveis:

```
Nome: AWS_ACCESS_KEY_ID
Valor: [COLE-ACCESS-KEY-ID-AQUI]

Nome: AWS_SECRET_ACCESS_KEY
Valor: [COLE-SECRET-ACCESS-KEY-AQUI]

Nome: AWS_REGION
Valor: auto

Nome: AWS_S3_BUCKET
Valor: ez-clip-ai

Nome: AWS_S3_ENDPOINT
Valor: https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

**⏱️ Tempo: 2 minutos**

---

## 🎯 Resumo

1. ✅ Criar bucket (2 min)
2. ✅ Criar token e copiar credenciais (2 min)
3. ✅ Configurar no Railway (2 min)

**Total: ~6 minutos** ⏱️

---

## 📞 Próximo Passo

**Depois de fazer os 3 passos, me avise!**

Se quiser, me envie:
- Access Key ID
- Secret Access Key  
- Nome do bucket

**E eu configuro tudo no Railway para você!** 🚀

---

**Ou siga o guia completo:** `FINALIZAR_R2_AGORA.md`

