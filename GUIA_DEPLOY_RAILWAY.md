# 🚂 Guia Completo de Deploy no Railway - EZ CLIP AI

## 📋 Onde Fazer Cada Configuração

### ✅ FAZER LOCALMENTE (Antes do Deploy)

#### 1. Preparar Repositório Git
```bash
# 1. Verificar se está tudo commitado
git status

# 2. Se não tiver .gitignore, criar
echo "node_modules/
.env
.env.local
dist/
*.log
.DS_Store" > .gitignore

# 3. Fazer commit inicial (se ainda não fez)
git add .
git commit -m "Initial commit - EZ CLIP AI"

# 4. Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git
git branch -M main
git push -u origin main
```

#### 2. Verificar se Compila
```bash
# Testar build localmente
npm run build

# Se der erro, corrigir antes de fazer deploy
```

#### 3. Criar Arquivo railway.json (Opcional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run dev:all",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### 🚀 FAZER NO RAILWAY (Após Conectar GitHub)

#### 1. Criar Projeto no Railway

1. Acesse [https://railway.com/new](https://railway.com/new)
2. Clique em **"Deploy from GitHub repo"**
3. Autorize Railway a acessar seu GitHub
4. Selecione o repositório **"ez-clip-ai"** (ou o nome que você deu)
5. Railway detecta automaticamente que é Node.js

#### 2. Adicionar Banco de Dados MySQL

1. No dashboard do projeto Railway, clique em **"New"**
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente o banco
4. **Copie a variável `DATABASE_URL`** (aparece automaticamente nas variáveis)

#### 3. Adicionar Redis (Para Filas)

1. No dashboard, clique em **"New"**
2. Selecione **"Database" → "Redis"**
3. Railway cria automaticamente
4. **Copie a variável `REDIS_URL`** (aparece automaticamente)

#### 4. Configurar Variáveis de Ambiente

No Railway, vá em **"Variables"** e adicione:

##### Variáveis Obrigatórias

```env
# Node.js
NODE_VERSION=22
NODE_ENV=production
PORT=3001

# Banco de Dados (Railway gera automaticamente - só verificar)
DATABASE_URL=mysql://user:password@host:port/database

# Redis (Railway gera automaticamente - só verificar)
REDIS_URL=redis://default:password@host:port

# JWT
JWT_SECRET=seu_secret_aleatorio_muito_longo_e_seguro_aqui

# Manus Forge API (Whisper)
BUILT_IN_FORGE_API_KEY=sua_api_key_aqui
BUILT_IN_FORGE_API_URL=https://api.manus.im

# S3 Storage (AWS ou compatível)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ez-clip-ai

# Stripe
STRIPE_SECRET_KEY=sk_live_...ou_sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...ou_pk_test_...

# Frontend URL (ajustar com seu domínio Railway)
FRONTEND_URL=https://seu-projeto.railway.app
VITE_TRPC_URL=https://seu-projeto.railway.app/trpc
```

##### Variáveis Opcionais (OAuth - Redes Sociais)

```env
# YouTube Data API v3
YOUTUBE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=seu_client_secret
YOUTUBE_REDIRECT_URI=https://seu-projeto.railway.app/api/oauth/youtube/callback

# TikTok API
TIKTOK_CLIENT_KEY=seu_client_key
TIKTOK_CLIENT_SECRET=seu_client_secret
TIKTOK_REDIRECT_URI=https://seu-projeto.railway.app/api/oauth/tiktok/callback

# Instagram Graph API
INSTAGRAM_APP_ID=seu_app_id
INSTAGRAM_APP_SECRET=seu_app_secret
INSTAGRAM_REDIRECT_URI=https://seu-projeto.railway.app/api/oauth/instagram/callback
```

#### 5. Configurar Build e Start Commands

No Railway, vá em **"Settings" → "Deploy"**:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm run dev:all
```

**OU** (se quiser separar frontend e backend):

Criar dois serviços:
1. **Backend Service:**
   - Build: `npm install`
   - Start: `npm run dev:server`

2. **Frontend Service:**
   - Build: `npm install && npm run build`
   - Start: `npm run preview` (ou servir arquivos estáticos)

#### 6. Aplicar Migrations do Banco de Dados

**Opção A: Via Railway CLI (Recomendado)**

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Fazer login
railway login

# 3. Conectar ao projeto
railway link

# 4. Aplicar migrations
railway run npm run db:push

# 5. (Opcional) Rodar seeds
railway run npm run tsx server/seedRetentionVideos.ts
railway run npm run tsx server/seedGenericEmojis.ts
```

**Opção B: Via Script no Deploy**

Criar arquivo `scripts/post-deploy.sh`:

```bash
#!/bin/bash
npm run db:push
npm run tsx server/seedRetentionVideos.ts
npm run tsx server/seedGenericEmojis.ts
```

E adicionar no `package.json`:

```json
{
  "scripts": {
    "postdeploy": "bash scripts/post-deploy.sh"
  }
}
```

#### 7. Configurar FFmpeg

Railway tem FFmpeg pré-instalado em imagens Nixpacks, mas se não funcionar:

**Opção A: Usar Nixpacks (Automático)**
Railway detecta automaticamente e instala FFmpeg.

**Opção B: Dockerfile Customizado**

Criar `Dockerfile`:

```dockerfile
FROM node:22-slim

# Instalar FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev:all"]
```

#### 8. Configurar Domínio (Opcional)

1. No Railway, vá em **"Settings" → "Domains"**
2. Clique em **"Generate Domain"**
3. Railway gera um domínio tipo: `seu-projeto.railway.app`
4. Ou adicione seu domínio customizado

#### 9. Configurar Webhook do Stripe

1. No Stripe Dashboard, vá em **"Developers" → "Webhooks"**
2. Clique em **"Add endpoint"**
3. URL: `https://seu-projeto.railway.app/api/webhooks/stripe`
4. Eventos: `checkout.session.completed`, `customer.subscription.updated`
5. Copie o **Webhook Secret** e adicione em `STRIPE_WEBHOOK_SECRET` no Railway

---

## 📝 Checklist Completo

### Antes do Deploy (Local)
- [ ] Código commitado no GitHub
- [ ] `.gitignore` configurado (não commitar `.env`)
- [ ] Build funciona localmente (`npm run build`)
- [ ] Testes básicos passam

### No Railway
- [ ] Projeto criado e conectado ao GitHub
- [ ] Banco MySQL criado
- [ ] Redis criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build e Start commands configurados
- [ ] Migrations aplicadas (`railway run npm run db:push`)
- [ ] Seeds rodados (opcional)
- [ ] Domínio configurado
- [ ] Webhook Stripe configurado

### Após Deploy
- [ ] Site acessível no domínio Railway
- [ ] Backend respondendo (`/trpc` endpoint)
- [ ] Banco de dados conectado
- [ ] Testar criação de conta
- [ ] Testar criação de job
- [ ] Verificar logs no Railway

---

## 🔧 Troubleshooting

### Erro: "Database not available"
- Verificar se `DATABASE_URL` está configurada
- Verificar se MySQL está rodando no Railway
- Aplicar migrations: `railway run npm run db:push`

### Erro: "FFmpeg not found"
- Railway deve ter FFmpeg pré-instalado
- Se não tiver, usar Dockerfile customizado

### Erro: "Redis connection failed"
- Verificar se `REDIS_URL` está configurada
- Verificar se Redis está rodando no Railway

### Erro: "Port already in use"
- Railway define `PORT` automaticamente
- Verificar se `server/index.ts` usa `process.env.PORT`

### Build falha
- Verificar logs no Railway
- Testar build localmente primeiro
- Verificar se todas as dependências estão no `package.json`

---

## 🎯 Resumo: Onde Fazer Cada Coisa

| Tarefa | Onde Fazer |
|--------|-----------|
| Preparar código Git | **Local** |
| Testar build | **Local** |
| Criar projeto Railway | **Railway Dashboard** |
| Criar banco MySQL | **Railway Dashboard** |
| Criar Redis | **Railway Dashboard** |
| Configurar variáveis de ambiente | **Railway Dashboard → Variables** |
| Aplicar migrations | **Railway CLI** ou **Script** |
| Rodar seeds | **Railway CLI** ou **Script** |
| Configurar FFmpeg | **Automático** (Railway) ou **Dockerfile** |
| Configurar domínio | **Railway Dashboard → Settings** |
| Configurar webhook Stripe | **Stripe Dashboard** + **Railway Variables** |

---

## 🚀 Próximos Passos

1. **Fazer commit e push para GitHub**
2. **Criar projeto no Railway**
3. **Configurar variáveis de ambiente**
4. **Aplicar migrations**
5. **Testar sistema completo**

**Tudo pronto! O sistema estará 100% funcional após essas configurações no Railway!** 🎉

