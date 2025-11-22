# 📦 INSTALAÇÃO E CONFIGURAÇÃO COMPLETA

## 🔧 PRÉ-REQUISITOS DO SISTEMA

### 1. FFmpeg (OBRIGATÓRIO)

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
1. Baixe de: https://ffmpeg.org/download.html
2. Extraia e adicione ao PATH
3. Ou use: `choco install ffmpeg`

**Verificar instalação:**
```bash
ffmpeg -version
```

### 2. Node.js 22.x

**Verificar versão:**
```bash
node --version
```

**Instalar (se necessário):**
- macOS: `brew install node@22`
- Ubuntu: `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`
- Windows: Baixe de https://nodejs.org/

### 3. MySQL/TiDB

**MySQL:**
```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Criar banco:**
```sql
CREATE DATABASE viral_clips_ai;
```

---

## 📦 INSTALAÇÃO DO PROJETO

### 1. Instalar Dependências

```bash
npm install
```

### 2. Instalar Dependências Adicionais

```bash
npm install stripe axios
npm install -D @types/stripe
```

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@localhost:3306/viral_clips_ai

# JWT
JWT_SECRET=seu_secret_aleatorio_muito_seguro_aqui

# Whisper API (Manus Forge)
BUILT_IN_FORGE_API_KEY=sua_chave_api_aqui
BUILT_IN_FORGE_API_URL=https://api.manus.im

# AWS S3
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth TikTok (opcional)
TIKTOK_CLIENT_KEY=seu_key
TIKTOK_CLIENT_SECRET=seu_secret

# OAuth Instagram (opcional)
INSTAGRAM_CLIENT_ID=seu_id
INSTAGRAM_CLIENT_SECRET=seu_secret

# OAuth YouTube (opcional)
YOUTUBE_CLIENT_ID=seu_id
YOUTUBE_CLIENT_SECRET=seu_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Configurar Banco de Dados

```bash
# Aplicar migrations
npm run db:push

# Abrir Drizzle Studio (opcional)
npm run db:studio
```

### 5. Rodar Seeds (opcional)

```bash
# Seed de vídeos de retenção
npm run tsx server/seedRetentionVideos.ts

# Seed de emojis genéricos
npm run tsx server/seedGenericEmojis.ts
```

---

## 🚀 EXECUTAR PROJETO

### Desenvolvimento

```bash
# Rodar frontend e backend juntos
npm run dev:all

# Ou separado:
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev
```

### URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **tRPC:** http://localhost:3001/trpc
- **Health Check:** http://localhost:3001/health

---

## ✅ VERIFICAÇÃO PÓS-INSTALAÇÃO

### 1. Verificar FFmpeg

```bash
ffmpeg -version
# Deve mostrar versão 6.x ou superior
```

### 2. Verificar Banco de Dados

```bash
npm run db:studio
# Deve abrir interface web
```

### 3. Verificar Backend

```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok"}
```

### 4. Verificar Frontend

Acesse: http://localhost:3000
- Deve carregar a página inicial
- Sem erros no console

---

## 🔑 CONFIGURAR APIS EXTERNAS

### 1. Manus Forge API (Whisper)

1. Acesse: https://manus.im
2. Crie uma conta
3. Obtenha sua API key
4. Adicione ao `.env`: `BUILT_IN_FORGE_API_KEY=...`

### 2. AWS S3

1. Acesse: https://aws.amazon.com/s3/
2. Crie um bucket
3. Crie um usuário IAM com permissões S3
4. Obtenha Access Key e Secret Key
5. Adicione ao `.env`

**Permissões IAM necessárias:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::viral-clips/*"
    }
  ]
}
```

### 3. Stripe

1. Acesse: https://stripe.com
2. Crie uma conta
3. Obtenha chaves de teste
4. Adicione ao `.env`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (após configurar webhook)

**Configurar Webhook:**
1. No dashboard Stripe: Developers > Webhooks
2. Adicione endpoint: `https://seu-dominio.com/api/stripe/webhook`
3. Selecione eventos: `checkout.session.completed`
4. Copie o webhook secret

### 4. OAuth TikTok (opcional)

1. Acesse: https://developers.tiktok.com
2. Crie um app
3. Configure redirect URI
4. Obtenha Client Key e Client Secret
5. Adicione ao `.env`

### 5. OAuth Instagram (opcional)

1. Acesse: https://developers.facebook.com
2. Crie um app do tipo "Instagram"
3. Configure permissões
4. Obtenha Client ID e Secret
5. Adicione ao `.env`

### 6. OAuth YouTube (opcional)

1. Acesse: https://console.cloud.google.com
2. Crie um projeto
3. Ative YouTube Data API v3
4. Crie credenciais OAuth 2.0
5. Obtenha Client ID e Secret
6. Adicione ao `.env`

---

## 🐛 TROUBLESHOOTING

### FFmpeg não encontrado

**Erro:** `FFmpeg não está instalado`

**Solução:**
```bash
# Verificar se está no PATH
which ffmpeg

# Se não estiver, adicionar ao PATH ou reinstalar
```

### Erro de conexão com banco

**Erro:** `Database não disponível`

**Solução:**
1. Verificar se MySQL está rodando
2. Verificar `DATABASE_URL` no `.env`
3. Testar conexão:
```bash
mysql -u user -p -h localhost viral_clips_ai
```

### Erro de S3

**Erro:** `AWS credenciais não configuradas`

**Solução:**
1. Verificar variáveis no `.env`
2. Testar credenciais:
```bash
aws s3 ls s3://viral-clips
```

### Erro de Whisper API

**Erro:** `BUILT_IN_FORGE_API_KEY não configurada`

**Solução:**
1. Verificar chave no `.env`
2. Testar API:
```bash
curl -H "Authorization: Bearer SUA_KEY" https://api.manus.im/v1/audio/transcriptions
```

### Erro de Stripe

**Erro:** `Stripe não configurado`

**Solução:**
1. Verificar `STRIPE_SECRET_KEY` no `.env`
2. Usar chaves de teste para desenvolvimento
3. Verificar formato: `sk_test_...`

---

## 📚 RECURSOS ADICIONAIS

- **Documentação FFmpeg:** https://ffmpeg.org/documentation.html
- **Documentação Stripe:** https://stripe.com/docs
- **Documentação AWS S3:** https://docs.aws.amazon.com/s3/
- **Documentação tRPC:** https://trpc.io/docs

---

## ✅ CHECKLIST FINAL

Antes de começar a usar:

- [ ] FFmpeg instalado e funcionando
- [ ] Node.js 22.x instalado
- [ ] MySQL/TiDB configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Banco de dados criado e migrations aplicadas
- [ ] Backend rodando (`npm run dev:server`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Health check funcionando
- [ ] Login funcionando
- [ ] Upload de vídeo funcionando (se S3 configurado)

---

**Pronto! Agora você pode usar o projeto! 🚀**

