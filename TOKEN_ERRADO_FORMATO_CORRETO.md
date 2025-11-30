# ⚠️ Token no Formato Errado - Como Corrigir

## ❌ O Que Você Tem

Você tem um token:
```
TpWC70aMkJdaG6sgNLrBXfbkU5w5mEBA9dRttf6i
```

**Isso é um Bearer token da API geral do Cloudflare**, não funciona para R2!

---

## ✅ O Que Você Precisa

Para R2, você precisa de **2 valores separados**:

```
Access Key ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Secret Access Key: xyz123abc456def789ghi012jkl345mno678pqr901
```

**Dois valores!** Não um único token!

---

## 🚀 Como Criar o Token R2 Correto

### Passo 1: Ir para R2 API Tokens

**URL Direta:**
```
https://dash.cloudflare.com/r2/api-tokens
```

**Ou pelo Dashboard:**
1. Acesse: https://dash.cloudflare.com
2. Clique em **"R2"** no menu lateral
3. Procure por **"Manage R2 API Tokens"** ou **"API Tokens"**

---

### Passo 2: Criar Token R2

Quando acessar a página de R2 API Tokens:

1. **Clique em "Create API token"** (ou botão similar)
2. Preencha:
   - **Token name:** `ez-clip-ai-r2`
   - **Permissions:** Deixe padrão (Admin Read & Write)
3. **Clique em "Create"**

---

### Passo 3: Copiar as Credenciais

Depois de criar, você verá algo assim:

```
Access Key ID
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

Secret Access Key  
xyz123abc456def789ghi012jkl345mno678pqr901
```

**⚠️ COPIE AMBOS OS VALORES!** A Secret Access Key só aparece UMA vez!

---

## 📋 Como Você Vai Saber Que Está Certo?

### ❌ Formato Errado (o que você tem):
```
TpWC70aMkJdaG6sgNLrBXfbkU5w5mEBA9dRttf6i
```
- Um único valor
- Bearer token

### ✅ Formato Correto (o que você precisa):
```
Access Key ID: a1b2c3d4e5f6g7h8...
Secret Access Key: xyz123abc456def...
```
- Dois valores separados
- No formato S3

---

## 🎯 Resumo

**O que você tem:**
- ❌ Token único (Bearer) - formato errado para R2

**O que você precisa:**
- ✅ Access Key ID (primeiro valor)
- ✅ Secret Access Key (segundo valor)

**Onde criar:**
- ✅ https://dash.cloudflare.com/r2/api-tokens

---

## ✅ Próximos Passos

1. **Acesse:** https://dash.cloudflare.com/r2/api-tokens
2. **Crie um token R2**
3. **Copie os 2 valores** (Access Key ID + Secret Access Key)
4. **Me envie** para eu configurar no Railway

---

**Acesse a URL acima e crie o token R2 correto!** 🚀

**Você vai ver 2 valores separados, não um único token!** 💪

