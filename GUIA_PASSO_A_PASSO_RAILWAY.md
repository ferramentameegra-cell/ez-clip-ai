# 🚀 Guia Passo a Passo - Deploy no Railway (Para Não Programadores)

Este guia vai te levar do zero até ter seu site funcionando no Railway, passo a passo, sem precisar entender programação.

---

## 📋 ANTES DE COMEÇAR

Você vai precisar de:
- ✅ Conta no GitHub (gratuita) - [github.com](https://github.com)
- ✅ Conta no Railway (gratuita para começar) - [railway.app](https://railway.app)
- ✅ 30-60 minutos de tempo

---

## PARTE 1: PREPARAR O CÓDIGO NO GITHUB

### Passo 1.1: Criar Conta no GitHub (se não tiver)

1. Acesse: https://github.com/signup
2. Preencha: email, senha, nome de usuário
3. Clique em "Create account"
4. Confirme seu email

### Passo 1.2: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome do repositório:** `ez-clip-ai` (ou qualquer nome)
3. **Descrição:** (opcional) "EZ CLIP AI - Plataforma de processamento de vídeos"
4. Deixe **Público** ou **Privado** (sua escolha)
5. **NÃO marque** "Add a README file" (já temos arquivos)
6. Clique em **"Create repository"**

### Passo 1.3: Fazer Upload do Código

**Opção A: Via GitHub Desktop (Mais Fácil - Recomendado)**

1. Baixe: https://desktop.github.com/
2. Instale e abra o GitHub Desktop
3. Faça login com sua conta GitHub
4. Clique em **"File" → "Add Local Repository"**
5. Clique em **"Choose..."** e selecione a pasta `viral-clips-ai` (ou o nome da pasta do projeto)
6. Clique em **"Publish repository"**
7. Marque **"Keep this code private"** (se quiser)
8. Clique em **"Publish repository"**

**Opção B: Via Terminal (Se preferir)**

1. Abra o Terminal (Mac) ou Prompt de Comando (Windows)
2. Digite os comandos abaixo (um por vez, pressionando Enter após cada um):

```bash
cd Downloads/viral-clips-ai
git init
git add .
git commit -m "Initial commit - EZ CLIP AI"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git
git push -u origin main
```

**⚠️ IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

**Exemplo:** Se seu usuário é `joaosilva`, o comando seria:
```bash
git remote add origin https://github.com/joaosilva/ez-clip-ai.git
```

---

## PARTE 2: CONFIGURAR RAILWAY

### Passo 2.1: Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"** ou **"Login"**
3. Escolha **"Login with GitHub"**
4. Autorize Railway a acessar sua conta GitHub
5. Pronto! Você está no dashboard do Railway

### Passo 2.2: Criar Novo Projeto

1. No dashboard, clique no botão grande **"+ New Project"**
2. Escolha **"Deploy from GitHub repo"**
3. Se pedir, autorize Railway a acessar seus repositórios
4. Na lista, encontre e clique em **"ez-clip-ai"** (ou o nome que você deu ao repositório)
5. Railway vai começar a fazer o deploy automaticamente! ⏳

**Aguarde 2-3 minutos** enquanto Railway instala tudo.

---

## PARTE 3: CONFIGURAR BANCO DE DADOS

### Passo 3.1: Adicionar Banco MySQL

1. No projeto Railway, clique no botão **"+ New"** (canto superior direito)
2. Role para baixo e clique em **"Database"**
3. Escolha **"MySQL"**
4. Railway vai criar o banco automaticamente! ✅

**Aguarde 1-2 minutos.**

### Passo 3.2: Adicionar Redis (Para Filas)

1. Clique novamente em **"+ New"**
2. Clique em **"Database"**
3. Escolha **"Redis"**
4. Railway cria automaticamente! ✅

---

## PARTE 4: CONFIGURAR VARIÁVEIS DE AMBIENTE

### Passo 4.1: Acessar Variáveis

1. No projeto Railway, clique na aba **"Variables"** (no topo)
2. Você verá uma lista de variáveis

### Passo 4.2: Adicionar Variáveis Obrigatórias

Clique em **"+ New Variable"** e adicione uma por uma:

#### 1. JWT_SECRET
- **Nome:** `JWT_SECRET`
- **Valor:** Cole um texto aleatório longo (ex: `minhasenhasupersecreta123456789abcdefghijklmnop`)
- Clique em **"Add"**

#### 2. NODE_ENV
- **Nome:** `NODE_ENV`
- **Valor:** `production`
- Clique em **"Add"**

#### 3. PORT
- **Nome:** `PORT`
- **Valor:** `3001`
- Clique em **"Add"**

#### 4. BUILT_IN_FORGE_API_KEY
- **Nome:** `BUILT_IN_FORGE_API_KEY`
- **Valor:** (Você precisa obter da Manus Forge - deixe vazio por enquanto se não tiver)
- Clique em **"Add"**

#### 5. BUILT_IN_FORGE_API_URL
- **Nome:** `BUILT_IN_FORGE_API_URL`
- **Valor:** `https://api.manus.im`
- Clique em **"Add"**

#### 6. AWS_ACCESS_KEY_ID
- **Nome:** `AWS_ACCESS_KEY_ID`
- **Valor:** (Sua chave AWS - deixe vazio por enquanto se não tiver)
- Clique em **"Add"**

#### 7. AWS_SECRET_ACCESS_KEY
- **Nome:** `AWS_SECRET_ACCESS_KEY`
- **Valor:** (Sua chave secreta AWS - deixe vazio por enquanto se não tiver)
- Clique em **"Add"**

#### 8. AWS_REGION
- **Nome:** `AWS_REGION`
- **Valor:** `us-east-1`
- Clique em **"Add"**

#### 9. AWS_S3_BUCKET
- **Nome:** `AWS_S3_BUCKET`
- **Valor:** `ez-clip-ai` (ou o nome que você quiser)
- Clique em **"Add"**

#### 10. STRIPE_SECRET_KEY
- **Nome:** `STRIPE_SECRET_KEY`
- **Valor:** (Sua chave do Stripe - comece com `sk_test_` para testes)
- Clique em **"Add"**

#### 11. STRIPE_WEBHOOK_SECRET
- **Nome:** `STRIPE_WEBHOOK_SECRET`
- **Valor:** (Você vai configurar depois)
- Clique em **"Add"**

#### 12. VITE_STRIPE_PUBLISHABLE_KEY
- **Nome:** `VITE_STRIPE_PUBLISHABLE_KEY`
- **Valor:** (Sua chave pública do Stripe - começa com `pk_test_`)
- Clique em **"Add"**

### Passo 4.3: Verificar Variáveis Automáticas

Railway já criou automaticamente:
- ✅ `DATABASE_URL` (do MySQL)
- ✅ `REDIS_URL` (do Redis)

**NÃO mexa nessas!** Elas já estão corretas.

---

## PARTE 5: APLICAR MIGRATIONS (CRIAR TABELAS)

### Passo 5.1: Instalar Railway CLI

**No Mac:**
1. Abra o Terminal
2. Cole este comando:
```bash
curl -fsSL https://railway.app/install.sh | sh
```

**No Windows:**
1. Baixe: https://github.com/railwayapp/cli/releases
2. Instale o arquivo `.exe`

### Passo 5.2: Fazer Login no Railway CLI

1. Abra o Terminal/Prompt
2. Digite:
```bash
railway login
```
3. Isso vai abrir o navegador - faça login
4. Volte ao terminal

### Passo 5.3: Conectar ao Projeto

1. No Terminal, vá até a pasta do projeto:
```bash
cd Downloads/viral-clips-ai
```

2. Conecte ao projeto Railway:
```bash
railway link
```
3. Escolha o projeto `ez-clip-ai` (ou o nome que você deu) na lista

### Passo 5.4: Criar Tabelas no Banco

1. No Terminal, digite:
```bash
railway run npm run db:push
```

2. Aguarde alguns segundos
3. Se aparecer "✓ Push successful", está pronto! ✅

---

## PARTE 6: CONFIGURAR DOMÍNIO

### Passo 6.1: Gerar Domínio Gratuito

1. No Railway, clique na aba **"Settings"**
2. Role até **"Domains"**
3. Clique em **"Generate Domain"**
4. Railway vai criar um domínio tipo: `ez-clip-ai-production.up.railway.app`
5. **Copie esse domínio!** Você vai precisar dele.

### Passo 6.2: Atualizar Variáveis com o Domínio

1. Volte para **"Variables"**
2. Adicione:

**FRONTEND_URL**
- **Nome:** `FRONTEND_URL`
- **Valor:** `https://seu-dominio.railway.app` (cole o domínio que você copiou)
- Clique em **"Add"**

**VITE_TRPC_URL**
- **Nome:** `VITE_TRPC_URL`
- **Valor:** `https://seu-dominio.railway.app/trpc` (mesmo domínio + /trpc)
- Clique em **"Add"**

---

## PARTE 7: VERIFICAR SE ESTÁ FUNCIONANDO

### Passo 7.1: Verificar Deploy

1. No Railway, clique na aba **"Deployments"**
2. Você deve ver um deploy com status **"Active"** ✅
3. Se estiver vermelho ou com erro, clique nele para ver os logs

### Passo 7.2: Acessar o Site

1. Clique na aba **"Settings"**
2. Em **"Domains"**, clique no domínio gerado
3. Ou acesse diretamente: `https://seu-dominio.railway.app`

**Se o site abrir, está funcionando!** 🎉

---

## PARTE 8: CONFIGURAR APIS EXTERNAS (Opcional - Depois)

### 8.1: Stripe (Para Pagamentos)

1. Acesse: https://dashboard.stripe.com
2. Faça login ou crie conta
3. Vá em **"Developers" → "API keys"**
4. Copie:
   - **Secret key** (começa com `sk_test_` ou `sk_live_`)
   - **Publishable key** (começa com `pk_test_` ou `pk_live_`)
5. Cole no Railway nas variáveis:
   - `STRIPE_SECRET_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### 8.2: AWS S3 (Para Armazenar Vídeos)

1. Acesse: https://aws.amazon.com
2. Crie conta (tem plano gratuito)
3. Vá em **"S3" → "Create bucket"**
4. Crie um bucket
5. Vá em **"IAM" → "Users" → "Create user"**
6. Dê permissão de S3
7. Copie as chaves:
   - **Access Key ID**
   - **Secret Access Key**
8. Cole no Railway:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### 8.3: Manus Forge (Para Transcrição)

1. Acesse: https://manus.im
2. Crie conta
3. Obtenha sua API key
4. Cole no Railway:
   - `BUILT_IN_FORGE_API_KEY`

---

## ✅ CHECKLIST FINAL

Marque conforme for completando:

### GitHub
- [ ] Conta criada
- [ ] Repositório criado
- [ ] Código enviado

### Railway
- [ ] Conta criada
- [ ] Projeto criado
- [ ] Conectado ao GitHub
- [ ] MySQL adicionado
- [ ] Redis adicionado
- [ ] Variáveis configuradas
- [ ] Migrations aplicadas
- [ ] Domínio gerado
- [ ] Site acessível

### APIs (Opcional)
- [ ] Stripe configurado
- [ ] AWS S3 configurado
- [ ] Manus Forge configurado

---

## 🆘 PROBLEMAS COMUNS

### "Site não abre"
- Verifique se o deploy está "Active" (verde)
- Veja os logs clicando no deploy
- Verifique se todas as variáveis obrigatórias estão preenchidas

### "Erro de banco de dados"
- Verifique se MySQL foi criado
- Verifique se `DATABASE_URL` existe nas variáveis
- Rode novamente: `railway run npm run db:push`

### "Erro ao fazer build"
- Veja os logs do deploy
- Verifique se todas as dependências estão no `package.json`
- Tente fazer deploy novamente

### "Não consigo rodar comandos Railway CLI"
- Verifique se instalou o CLI: `railway --version`
- Faça login novamente: `railway login`
- Conecte ao projeto: `railway link`

---

## 📞 PRECISA DE AJUDA?

Se travar em algum passo:
1. Veja os logs no Railway (aba "Deployments" → clique no deploy)
2. Verifique se seguiu todos os passos
3. Tente fazer o passo novamente

---

## 🎉 PRONTO!

Depois de completar todos os passos, seu site estará no ar e funcionando!

**URL do seu site:** `https://seu-dominio.railway.app`

**Lembre-se:** Você pode adicionar as APIs externas (Stripe, AWS, etc.) depois. O site vai funcionar mesmo sem elas, só algumas funcionalidades não vão estar disponíveis.

