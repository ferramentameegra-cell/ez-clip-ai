# 🚀 Fazer Tudo no Railway - Passo a Passo Automatizado

Este guia te ajuda a configurar **TUDO** no Railway rapidamente.

---

## 📋 PRÉ-REQUISITOS

Você já tem:
- ✅ Código no GitHub (`ez-clip-ai`)
- ✅ Repositório conectado no Railway
- ✅ Conta Railway criada

---

## 🎯 O QUE VAMOS FAZER

1. **Instalar Railway CLI** (precisa de senha de admin - única vez)
2. **Adicionar MySQL** (no dashboard - 2 cliques)
3. **Adicionar Redis** (no dashboard - 2 cliques)
4. **Configurar variáveis** (automatizado via script)
5. **Aplicar migrations** (automatizado)
6. **Gerar domínio** (no dashboard - 1 clique)

---

## ⚡ EXECUTAR TUDO (AUTOMATIZADO)

### Passo 1: Instalar Railway CLI (Precisa de senha)

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
curl -fsSL https://railway.app/install.sh | sh
```

**Quando pedir senha de administrador, digite sua senha do Mac.**

Depois, feche e abra o terminal novamente, ou execute:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

**Teste se funcionou:**

```bash
railway --version
```

---

### Passo 2: Login no Railway

```bash
railway login
```

Isso vai abrir o navegador. Faça login e volte ao terminal.

---

### Passo 3: Conectar ao Projeto

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway link
```

Escolha o projeto `ez-clip-ai` na lista.

---

### Passo 4: Adicionar MySQL e Redis (NO DASHBOARD)

Você precisa fazer isso no dashboard web:

1. **Acesse:** https://railway.app/project
2. **Clique no projeto:** `ez-clip-ai`
3. **Clique em "+ New"** (canto superior direito)
4. **Clique em "Database"**
5. **Escolha "MySQL"**
6. **Aguarde 1-2 minutos**

**Depois, repita para Redis:**
1. **Clique em "+ New"** novamente
2. **Clique em "Database"**
3. **Escolha "Redis"**
4. **Aguarde 1-2 minutos**

✅ Railway cria automaticamente as variáveis `DATABASE_URL` e `REDIS_URL`!

---

### Passo 5: Configurar Variáveis de Ambiente (AUTOMATIZADO)

Execute este comando (vai configurar todas as variáveis essenciais):

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Gerar JWT_SECRET aleatório
JWT_SECRET=$(openssl rand -hex 32)

# Configurar variáveis essenciais
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set BUILT_IN_FORGE_API_URL=https://api.manus.im
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET=ez-clip-ai
```

✅ **Variáveis configuradas!**

---

### Passo 6: Aplicar Migrations (CRIAR TABELAS)

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway run npm run db:push
```

✅ **Se aparecer "✓ Push successful", está pronto!**

---

### Passo 7: Gerar Domínio (NO DASHBOARD)

1. **No Railway dashboard**, vá em **"Settings"** → **"Domains"**
2. **Clique em "Generate Domain"**
3. **Railway cria um domínio tipo:** `ez-clip-ai-production.up.railway.app`
4. **COPIE ESSE DOMÍNIO!**

Depois, configure as URLs:

```bash
# Substitua SEU_DOMINIO pelo domínio que você copiou
railway variables set FRONTEND_URL=https://SEU_DOMINIO.railway.app
railway variables set VITE_TRPC_URL=https://SEU_DOMINIO.railway.app/trpc
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Ver Status do Deploy

```bash
railway status
```

### 2. Ver Logs em Tempo Real

```bash
railway logs
```

### 3. Acessar o Site

Acesse o domínio que você gerou:
`https://seu-dominio.railway.app`

---

## 📝 RESUMO DOS COMANDOS (COPIE E COLE)

```bash
# 1. Instalar Railway CLI
curl -fsSL https://railway.app/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# 2. Login
railway login

# 3. Conectar ao projeto
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway link

# 4. Configurar variáveis (após adicionar MySQL/Redis no dashboard)
JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set BUILT_IN_FORGE_API_URL=https://api.manus.im
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET=ez-clip-ai

# 5. Aplicar migrations
railway run npm run db:push

# 6. Gerar domínio no dashboard, depois:
# railway variables set FRONTEND_URL=https://seu-dominio.railway.app
# railway variables set VITE_TRPC_URL=https://seu-dominio.railway.app/trpc
```

---

## 🆘 PROBLEMAS COMUNS

### "railway: command not found"

**Solução:**
```bash
export PATH="$HOME/.local/bin:$PATH"
```

Ou adicione ao seu `~/.zprofile`:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

### "Error: Not linked to a project"

**Solução:**
```bash
railway link
```

### "Database connection failed"

**Solução:**
1. Verifique se MySQL foi criado no dashboard
2. Verifique se `DATABASE_URL` existe: `railway variables`
3. Aplique migrations novamente: `railway run npm run db:push`

---

## 🎉 PRONTO!

Depois de seguir todos os passos, seu site estará no ar e funcionando!

**URL do seu site:** `https://seu-dominio.railway.app`

---

## 📚 ARQUIVOS ÚTEIS

- **Variáveis completas:** `VARIABLES_RAILWAY.txt`
- **Guia completo:** `GUIA_PASSO_A_PASSO_RAILWAY.md`
- **Checklist:** `CHECKLIST_RAILWAY.md`

---

**Boa sorte! 🚀**

