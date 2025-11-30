# 🔐 Criar Token Customizado para R2 - Passo a Passo

## ✅ Você Está no Lugar Certo!

Você encontrou a página de criar API token! Agora precisa criar um **custom token** com permissões de R2.

---

## 🚀 Passo a Passo

### Passo 1: Criar Custom Token

1. **Role a página para baixo** (ou procure na parte inferior)
2. Procure por **"Custom token"**
3. Clique em **"Create Custom Token"**

---

### Passo 2: Configurar o Token

Você verá um formulário. Preencha assim:

#### 1. Token name
```
ez-clip-ai-r2-token
```

#### 2. Permissions (Permissões)

Você precisa adicionar permissões de R2:

**Opção A: Permissão Completa (Mais Fácil)**

1. Procure por uma seção de permissões
2. Procure por **"Cloudflare R2"** ou **"Object Storage"**
3. Selecione: **"Edit"** ou **"Admin"** ou **"Read & Write"**

**Opção B: Se não encontrar R2 específico**

1. Procure por **"Account"** → **"Cloudflare R2"**
2. Selecione permissões de **"Edit"** ou **"Admin"**

**Opção C: Permissão de Account Admin (Funciona, mas é mais ampla)**

1. Procure por **"Account"**
2. Selecione permissão de **"Admin"** (isso dá acesso total, incluindo R2)

---

### Passo 3: Account Resources

1. Se aparecer uma opção de **"Account Resources"**
2. Selecione sua conta (geralmente só tem uma)
3. Ou deixe como está

---

### Passo 4: TTL (Tempo de Vida)

1. Deixe em branco (sem expiração) OU
2. Selecione "No expiration" OU
3. Deixe padrão

---

### Passo 5: Criar

1. Revise as configurações
2. Clique em **"Continue to summary"** OU **"Create Token"**

---

## 🎯 Configuração Recomendada

Se você ver estas opções, configure assim:

```
Token name: ez-clip-ai-r2-token

Permissions:
└── Account
    └── Cloudflare R2: Edit

Account Resources:
└── Include: All accounts (ou selecione sua conta)

TTL: No expiration
```

---

## 📋 Se Não Encontrar R2 nas Permissões

Se não aparecer uma opção específica de R2:

1. **Procure por:**
   - **"Account"** → **"Admin"** (dá acesso total, incluindo R2)
   - OU **"Account"** → procure por algo relacionado a storage

2. **Ou tente:**
   - Buscar na barra de busca por **"R2"**
   - Buscar por **"Object Storage"**
   - Buscar por **"S3"**

---

## ⚠️ IMPORTANTE: Depois de Criar

Quando você criar o token, aparecerá:

```
Access Key ID: a1b2c3d4e5f6g7h8...
Secret Access Key: xyz123abc456def...
```

**⚠️ COPIE AGORA!** A Secret Access Key só aparece UMA vez!

1. Copie o **Access Key ID**
2. Copie o **Secret Access Key**
3. Guarde em local seguro

---

## ✅ Checklist

- [ ] Cliquei em "Create Custom Token"
- [ ] Preenchi o nome: `ez-clip-ai-r2-token`
- [ ] Adicionei permissões de R2 (ou Account Admin)
- [ ] Cliquei em "Create Token"
- [ ] Copiei o Access Key ID
- [ ] Copiei o Secret Access Key
- [ ] Guardei as credenciais em local seguro

---

## 🆘 Se Precisar de Ajuda

Se não conseguir encontrar as opções de R2, me diga:
- Quais opções de permissões você vê?
- Há alguma busca/filtro na página?
- O que aparece quando você clica em "Create Custom Token"?

---

**Clique em "Create Custom Token" e me diga o que aparece!** 🚀

