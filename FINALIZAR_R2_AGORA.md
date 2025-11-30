# ✅ Finalizar Cloudflare R2 - Passo a Passo Rápido

## ✅ O Que Você Já Tem

- ✅ Conta Cloudflare criada
- ✅ Account ID: `45a4af538d59d53aa52ef8179165e0da`
- ✅ Endpoint: `https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com`

---

## 📋 O Que Falta (3 passos - 5 minutos)

### Passo 1: Criar Bucket (2 minutos)

1. Acesse: https://dash.cloudflare.com
2. Clique em **"R2"** no menu lateral
3. Clique em **"Create bucket"**
4. Preencha:
   - **Bucket name:** `ez-clip-ai`
   - **Location:** `auto`
5. Clique em **"Create bucket"**

**✅ Anote o nome do bucket!**

---

### Passo 2: Criar API Token (2 minutos)

1. No dashboard R2, clique em **"Manage R2 API Tokens"**
2. Clique em **"Create API token"**
3. Preencha:
   - **Token name:** `ez-clip-ai-token`
   - **Permissions:** **"Admin Read & Write"**
4. Clique em **"Create API Token"**
5. **⚠️ COPIE AGORA:**
   - **Access Key ID** (ex: `a1b2c3d4...`)
   - **Secret Access Key** (ex: `xyz123...`)

**⚠️ A Secret Access Key só aparece UMA vez! Guarde bem!**

---

### Passo 3: Me Enviar as Informações

Depois de criar o bucket e o token, me envie:

1. **Nome do bucket** (ex: `ez-clip-ai`)
2. **Access Key ID**
3. **Secret Access Key**

**Depois eu configuro tudo no Railway para você!** 🚀

---

## 🔐 Ou Faça Você Mesmo no Railway (1 minuto)

Se preferir fazer você mesmo, adicione estas variáveis no Railway:

```env
AWS_ACCESS_KEY_ID=[SEU-ACCESS-KEY-ID]
AWS_SECRET_ACCESS_KEY=[SEU-SECRET-ACCESS-KEY]
AWS_REGION=auto
AWS_S3_BUCKET=[NOME-DO-BUCKET]
AWS_S3_ENDPOINT=https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

**Substitua:**
- `[SEU-ACCESS-KEY-ID]` → O Access Key ID do Passo 2
- `[SEU-SECRET-ACCESS-KEY]` → O Secret Access Key do Passo 2
- `[NOME-DO-BUCKET]` → O nome do bucket do Passo 1

---

## ✅ Checklist

- [ ] Bucket criado
- [ ] API Token criado
- [ ] Access Key ID copiado
- [ ] Secret Access Key copiado
- [ ] Variáveis adicionadas no Railway (ou me enviar para eu fazer)

---

**Quando terminar os 3 passos, me avise e eu finalizo a configuração!** 🚀

