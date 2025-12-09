# 🚀 DEPLOY NO RAILWAY - AÇÃO IMEDIATA

## ✅ STATUS ATUAL

- ✅ **Código commitado** e enviado para GitHub
- ✅ **Todas as correções críticas** implementadas
- ✅ **Sistema Stripe** completo
- ✅ **Rate limiting** configurado
- ✅ **Logging** com Winston
- ✅ **Bug max retries** corrigido

---

## 📋 PASSOS PARA FAZER O DEPLOY AGORA

### 1️⃣ NO RAILWAY DASHBOARD

#### A. Criar/Acessar Projeto
1. Acesse: https://railway.app
2. Se já tem projeto → Clique nele
3. Se não tem → "New Project" → "Deploy from GitHub repo" → Selecione `ez-clip-ai`

#### B. Adicionar MySQL (se não tiver)
1. No projeto → Botão **"+ New"**
2. **"Database"** → **"MySQL"**
3. Railway cria automaticamente (aguarde 1-2min)
4. **Copie** a `DATABASE_URL` que aparece nas variáveis

#### C. Adicionar Redis (se não tiver)
1. No projeto → Botão **"+ New"**
2. **"Database"** → **"Redis"**
3. Railway cria automaticamente
4. **Copie** a `REDIS_URL` que aparece nas variáveis

---

### 2️⃣ APLICAR MIGRATIONS (CRÍTICO!)

Você **DEVE** criar as tabelas Stripe antes do deploy funcionar:

#### Opção A: Via Railway MySQL Dashboard
1. No Railway → Seu projeto → **MySQL Database**
2. Clique em **"Query"** ou **"Connect"**
3. Cole o SQL abaixo e execute:

```sql
-- Criar tabela subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  stripe_customer_id VARCHAR(256) NOT NULL,
  stripe_subscription_id VARCHAR(256) UNIQUE NOT NULL,
  price_id VARCHAR(256) NOT NULL,
  plan_key VARCHAR(256) NOT NULL,
  billing_interval VARCHAR(256) NOT NULL,
  status VARCHAR(256) NOT NULL,
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar tabela credit_ledgers
CREATE TABLE IF NOT EXISTS credit_ledgers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  delta INT NOT NULL,
  reason VARCHAR(256) NOT NULL,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adicionar coluna stripe_customer_id em users (se não existir)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(256) UNIQUE;
```

#### Opção B: Via Railway CLI
```bash
railway connect mysql
# Cole o SQL acima
```

---

### 3️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

No Railway → Seu projeto → **"Variables"** → Adicione:

#### Variáveis Obrigatórias (Básicas)
```env
NODE_VERSION=22
NODE_ENV=production
PORT=3001
```

#### Variáveis Stripe (CRÍTICO - Configurar depois)
```env
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTH=price_...
STRIPE_PRICE_STARTER_YEAR=price_...
STRIPE_PRICE_CREATOR_MONTH=price_...
STRIPE_PRICE_CREATOR_YEAR=price_...
STRIPE_PRICE_PRO_MONTH=price_...
STRIPE_PRICE_PRO_YEAR=price_...
```

**⚠️ IMPORTANTE:** Para obter os Price IDs do Stripe:
1. Acesse: https://dashboard.stripe.com/test/products
2. Crie produtos: Starter, Creator, Pro
3. Crie preços mensais e anuais para cada
4. Copie os IDs que começam com `price_...`

#### Variáveis Storage (Cloudflare R2)
```env
AWS_ACCESS_KEY_ID=seu_access_key_id
AWS_SECRET_ACCESS_KEY=seu_secret_access_key
AWS_S3_ENDPOINT=https://...r2.cloudflarestorage.com
AWS_S3_BUCKET=nome_do_bucket
AWS_REGION=auto
```

#### Variáveis APIs
```env
JWT_SECRET=uma_chave_secreta_muito_longa_e_aleatoria
OPENAI_API_KEY=sk-...
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

---

### 4️⃣ CONFIGURAR BUILD/START (Settings)

No Railway → Seu projeto → **"Settings"** → **"Deploy"**:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Nixpacks Provider:** Deixar como está (auto-detecta Node.js)

---

### 5️⃣ VERIFICAR DEPLOY

1. Railway faz deploy **automaticamente** após push no GitHub
2. Acompanhe logs: Railway → Seu projeto → **"Deployments"** → Clique no último
3. Procure por:
   - ✅ `🚀 Backend rodando`
   - ✅ `[Redis] Conectado com sucesso`
   - ✅ `[Queue] Fila inicializada`
   - ❌ **SEM** erros "max retries"

---

### 6️⃣ CONFIGURAR WEBHOOK STRIPE (Depois do deploy)

1. Acesse: https://dashboard.stripe.com/webhooks
2. **"Add endpoint"**
3. **URL:** `https://seu-dominio.railway.app/api/webhooks/stripe`
4. **Eventos:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. **Copie** o "Signing secret" (`whsec_...`)
6. **Adicione** no Railway como `STRIPE_WEBHOOK_SECRET`

---

## ✅ CHECKLIST FINAL

Antes de considerar deploy completo:

- [ ] Tabelas `subscriptions` e `credit_ledgers` criadas
- [ ] Coluna `stripe_customer_id` adicionada em `users`
- [ ] `DATABASE_URL` configurada (Railway gera automaticamente)
- [ ] `REDIS_URL` configurada (Railway gera automaticamente)
- [ ] `STRIPE_SECRET_KEY` configurada
- [ ] Price IDs do Stripe configurados
- [ ] Build e Start commands configurados
- [ ] Deploy rodando sem erros nos logs
- [ ] Webhook Stripe configurado

---

## 🐛 TROUBLESHOOTING RÁPIDO

**Erro: "Table 'subscriptions' doesn't exist"**
→ Execute o SQL do passo 2️⃣ acima

**Erro: "max retries per request limit"**
→ ✅ JÁ CORRIGIDO no código - apenas verifique logs

**Erro: "Cannot connect to Redis"**
→ Verifique se `REDIS_URL` está configurada

**Erro: "Stripe webhook signature failed"**
→ Verifique se `STRIPE_WEBHOOK_SECRET` está correto

---

## 🎯 PRONTO!

Após seguir estes passos, seu site estará **100% funcional** no Railway! 🚀

**URL do site:** `https://seu-projeto.up.railway.app`

