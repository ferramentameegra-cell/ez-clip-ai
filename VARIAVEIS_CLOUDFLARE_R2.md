# 🔐 Variáveis Cloudflare R2 para Railway

## ✅ Informações Já Configuradas

- ✅ Account ID: `45a4af538d59d53aa52ef8179165e0da`
- ✅ Endpoint: `https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com`

---

## 📋 Variáveis para Adicionar no Railway

Depois de criar o bucket e o API token, adicione estas variáveis:

```env
AWS_ACCESS_KEY_ID=[COLE-SEU-ACCESS-KEY-ID-AQUI]
AWS_SECRET_ACCESS_KEY=[COLE-SEU-SECRET-ACCESS-KEY-AQUI]
AWS_REGION=auto
AWS_S3_BUCKET=[COLE-NOME-DO-BUCKET-AQUI]
AWS_S3_ENDPOINT=https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

---

## 📝 Exemplo Preenchido

```env
AWS_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
AWS_SECRET_ACCESS_KEY=xyz123abc456def789ghi012jkl345mno678pqr901
AWS_REGION=auto
AWS_S3_BUCKET=ez-clip-ai
AWS_S3_ENDPOINT=https://45a4af538d59d53aa52ef8179165e0da.r2.cloudflarestorage.com
```

---

## 🚀 Como Adicionar no Railway

1. Acesse: https://railway.app
2. Entre no seu projeto
3. Clique no serviço **ez-clip-ai**
4. Vá em **Variables**
5. Para cada variável:
   - Clique em **"New Variable"**
   - Cole o nome (ex: `AWS_ACCESS_KEY_ID`)
   - Cole o valor
   - Clique em **"Add"**
6. Repita para todas as 5 variáveis

---

## ✅ Depois de Adicionar

1. O Railway fará deploy automático (1-2 minutos)
2. Verifique os logs para confirmar que funcionou
3. Teste fazendo upload de um arquivo

---

**Pronto! Cloudflare R2 configurado!** 🎉

