# 🔐 Criar API Token no Cloudflare R2 - Passo a Passo

## ✅ Seu Bucket Está Pronto!

Você já tem:
- ✅ Bucket criado: `ez-clip-ai`
- ✅ Está funcionando perfeitamente!

---

## 🔐 Agora Precisa Criar o API Token

### Passo 1: Encontrar "Manage R2 API Tokens"

No dashboard do Cloudflare, você precisa encontrar onde criar o token:

**Opções para encontrar:**

1. **No menu lateral esquerdo:**
   - Procure por **"R2"** no menu
   - Clique em **"Manage R2 API Tokens"** (pode estar dentro de R2)

2. **No topo da página (se estiver na página do bucket):**
   - Procure por um botão ou link que diz algo como:
     - **"API Tokens"**
     - **"Manage Tokens"**
     - **"API Access"**

3. **Direto na URL:**
   - Tente acessar: https://dash.cloudflare.com/r2/api-tokens

---

### Passo 2: Criar o Token

Quando encontrar a página "Manage R2 API Tokens":

1. Clique no botão **"Create API token"** (ou similar)
2. Preencha:
   - **Token name:** `ez-clip-ai-token`
   - **Permissions:** 
     - Selecione **"Admin Read & Write"** OU
     - Selecione o bucket `ez-clip-ai` e dê permissões de Read & Write
3. Clique em **"Create API token"** (ou "Create")

---

### Passo 3: Copiar as Credenciais

**⚠️ IMPORTANTE:** Depois de criar, você verá uma tela com:

```
Access Key ID: a1b2c3d4e5f6g7h8...
Secret Access Key: xyz123abc456def789...
```

**⚠️ COPIE AGORA!** A Secret Access Key só aparece UMA vez!

1. **Copie o Access Key ID**
2. **Copie o Secret Access Key**
3. **Guarde em local seguro!**

---

## 🔍 Se Não Encontrar a Opção

### Alternativa: Criar Token Manualmente

Se não conseguir encontrar pelo dashboard, você pode:

1. **Ir direto para:**
   - https://dash.cloudflare.com/r2/api-tokens

2. **Ou procurar no menu:**
   - Dashboard → R2 → (algum submenu) → API Tokens

---

## 📋 Depois de Ter o Token

Quando tiver o Access Key ID e Secret Access Key, me envie:

1. **Access Key ID** (ex: `a1b2c3d4e5f6...`)
2. **Secret Access Key** (ex: `xyz123abc...`)
3. **Nome do bucket:** `ez-clip-ai` (você já tem)

**E eu configuro tudo no Railway para você!** 🚀

---

## ✅ Checklist

- [x] Bucket criado ✅
- [ ] API Token criado
- [ ] Access Key ID copiado
- [ ] Secret Access Key copiado
- [ ] Me enviar as credenciais (para eu configurar no Railway)

---

## 🆘 Precisa de Ajuda?

Se não conseguir encontrar onde criar o token, me avise e eu te ajudo a localizar! 💪

