# 🔐 Onde Criar o API Token no Cloudflare R2

## ✅ Seu Bucket Está Pronto!

Você já tem:
- ✅ Bucket: `ez-clip-ai`
- ✅ Tudo funcionando!

---

## 🔍 Como Encontrar "Manage R2 API Tokens"

### Opção 1: Menu Lateral (Mais Fácil)

1. **Olhe para o menu lateral esquerdo**
2. Procure por **"R2"** (pode estar colapsado)
3. Clique em **"R2"**
4. Procure por:
   - **"Manage R2 API Tokens"** OU
   - **"API Tokens"** OU
   - **"Access Keys"**

---

### Opção 2: No Topo da Página

1. **Na página do bucket** (onde você está agora)
2. **Olhe no topo da tela**
3. Procure por:
   - Um botão/link dizendo **"API Tokens"**
   - Ou **"Settings"** → depois procure por API Tokens

---

### Opção 3: URL Direta

**Tente acessar diretamente:**

```
https://dash.cloudflare.com/r2/api-tokens
```

Ou:

```
https://dash.cloudflare.com/[SEU-ACCOUNT-ID]/r2/api-tokens
```

---

### Opção 4: Buscar no Dashboard

1. **No topo do dashboard**, procure por uma **barra de busca**
2. Digite: **"API Tokens"** ou **"R2 Tokens"**
3. Selecione o resultado

---

## 📋 Depois de Encontrar

Quando encontrar a página "Manage R2 API Tokens":

1. Clique em **"Create API token"** (botão grande, geralmente azul)
2. Preencha:
   - **Token name:** `ez-clip-ai-token`
   - **Permissions:** 
     - Selecione **"Admin Read & Write"** (opção mais fácil)
     - Ou selecione o bucket `ez-clip-ai` e dê permissões Read & Write
3. Clique em **"Create API token"**

---

## ⚠️ IMPORTANTE: Copiar as Credenciais

Depois de criar, você verá:

```
Access Key ID: a1b2c3d4e5f6g7h8i9j0...
Secret Access Key: xyz123abc456def789ghi012...
```

**⚠️ COPIE AGORA!** A Secret Access Key só aparece UMA vez!

1. Copie o **Access Key ID**
2. Copie o **Secret Access Key**
3. Guarde em local seguro

---

## 🆘 Se Não Encontrar

**Me diga:**
- O que você vê no menu lateral?
- Há algum botão no topo da página do bucket?
- Você consegue ver algo como "Settings" na página do bucket?

**E eu te ajudo a encontrar!** 💪

---

## ✅ Checklist

- [x] Bucket criado ✅
- [ ] Encontrei "Manage R2 API Tokens"
- [ ] Criei o token
- [ ] Copiei Access Key ID
- [ ] Copiei Secret Access Key
- [ ] Vou me enviar as credenciais

---

**Tente a URL direta primeiro:** https://dash.cloudflare.com/r2/api-tokens

**Se funcionar, me avise quando criar o token!** 🚀

