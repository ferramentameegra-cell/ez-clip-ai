# ✅ Finalizar Configuração Cloudflare R2

## ✅ O Que Já Temos

- ✅ Conta Cloudflare criada
- ✅ Account ID: `45a4af538d59d53aa52ef8179165e0da`
- ✅ Endpoint: `https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com`

---

## 📋 O Que Falta Fazer (5 minutos)

### 1. Criar Bucket (2 minutos)

1. Acesse: https://dash.cloudflare.com
2. No menu lateral, clique em **"R2"**
3. Clique em **"Create bucket"**
4. Preencha:
   - **Bucket name:** `ez-clip-ai` (ou outro nome de sua escolha)
   - **Location:** `auto` (recomendado)
5. Clique em **"Create bucket"**

**✅ Anote o nome do bucket que você criou!**

---

### 2. Criar API Token (2 minutos)

1. No dashboard R2, clique em **"Manage R2 API Tokens"** (pode estar no menu lateral ou no topo)
2. Clique em **"Create API token"**
3. Preencha:
   - **Token name:** `ez-clip-ai-token`
   - **Permissions:** Selecione **"Admin Read & Write"**
   - **TTL:** Deixe vazio (sem expiração)
4. Clique em **"Create API Token"**
5. **⚠️ IMPORTANTE:** Copie as credenciais que aparecerem:
   - **Access Key ID** (ex: `a1b2c3d4e5f6...`)
   - **Secret Access Key** (ex: `xyz123...`)

**⚠️ ATENÇÃO:** A Secret Access Key só aparece UMA vez! Guarde em local seguro!

---

### 3. Configurar no Railway (1 minuto)

Depois de ter:
- ✅ Nome do bucket (do passo 1)
- ✅ Access Key ID (do passo 2)
- ✅ Secret Access Key (do passo 2)

**Vou te ajudar a configurar no Railway agora!**

---

## 🚀 Variáveis para Adicionar no Railway

Depois de criar o bucket e o token, adicione estas variáveis no Railway:

```env
AWS_ACCESS_KEY_ID=[SEU-ACCESS-KEY-ID]
AWS_SECRET_ACCESS_KEY=[SEU-SECRET-ACCESS-KEY]
AWS_REGION=auto
AWS_S3_BUCKET=[NOME-DO-BUCKET]
AWS_S3_ENDPOINT=https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

**Substitua:**
- `[SEU-ACCESS-KEY-ID]` → O Access Key ID que você copiou
- `[SEU-SECRET-ACCESS-KEY]` → O Secret Access Key que você copiou
- `[NOME-DO-BUCKET]` → O nome do bucket que você criou (ex: `ez-clip-ai`)

---

## ✅ Checklist

- [ ] Bucket criado (nome anotado)
- [ ] API Token criado
- [ ] Access Key ID copiado
- [ ] Secret Access Key copiado
- [ ] Variáveis adicionadas no Railway
- [ ] Deploy finalizado

---

**Me envie quando tiver criado o bucket e o token que eu te ajudo a configurar no Railway!** 🚀

