# 🚀 DEPLOY COMPLETO NO RAILWAY - EZ CLIPS AI

## ✅ PRÉ-REQUISITOS JÁ IMPLEMENTADOS

- ✅ Código commitado e enviado para GitHub
- ✅ Todas as correções críticas implementadas:
  - ✅ Bug max retries corrigido
  - ✅ Sistema de logging com Winston
  - ✅ Integração Stripe completa
  - ✅ Rate limiting robusto
  - ✅ Sistema de créditos funcionando

---

## 📋 PASSO A PASSO DO DEPLOY

### 1. Aplicar Migrations no Banco de Dados (Railway MySQL)

1. Acesse o **Railway Dashboard**
2. Vá em seu projeto → **MySQL Database**
3. Clique em **"Query"** ou **"Connect"**
4. Execute o script `SQL_CRIAR_TABELAS_STRIPE.sql`:

```sql
-- Adicionar coluna stripeCustomerId
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(256) UNIQUE;

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
```

**OU** execute via CLI:

```bash
railway connect mysql
# Cole o SQL acima
```

---

### 2. Configurar Variáveis de Ambiente no Railway

No **Railway Dashboard** → Seu projeto → **Variables**:

#### Variáveis Obrigatórias (já configuradas):
```
DATABASE_URL=mysql://... (gerado automaticamente pelo Railway)
REDIS_URL=redis://... (gerado automaticamente pelo Railway)
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=production
```

#### Variáveis Stripe (NOVAS - CONFIGURAR AGORA):

1. **Acesse** https://dashboard.stripe.com/test/products (test) ou https://dashboard.stripe.com/products (production)

2. **Crie os produtos e preços**:
   - Starter: R$ 29/mês, R$ 299/ano
   - Creator: R$ 79/mês, R$ 799/ano  
   - Pro: R$ 199/mês, R$ 1999/ano

3. **Copie os Price IDs** (começam com `price_...`)

4. **Adicione no Railway**:
```
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTH=price_...
STRIPE_PRICE_STARTER_YEAR=price_...
STRIPE_PRICE_CREATOR_MONTH=price_...
STRIPE_PRICE_CREATOR_YEAR=price_...
STRIPE_PRICE_PRO_MONTH=price_...
STRIPE_PRICE_PRO_YEAR=price_...
```

#### Variáveis Storage (Cloudflare R2):
```
AWS_ACCESS_KEY_ID=seu_access_key_id
AWS_SECRET_ACCESS_KEY=seu_secret_access_key
AWS_S3_ENDPOINT=https://...r2.cloudflarestorage.com
AWS_S3_BUCKET=nome_do_bucket
AWS_REGION=auto
```

#### Variáveis APIs (já configuradas):
```
OPENAI_API_KEY=...
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

---

### 3. Configurar Build e Start Commands

No **Railway Dashboard** → Seu projeto → **Settings** → **Deploy**:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Node Version:**
```
22
```

---

### 4. Configurar Webhook do Stripe

1. **Acesse** https://dashboard.stripe.com/webhooks
2. **Clique** em "Add endpoint"
3. **URL do endpoint**: `https://seu-dominio.railway.app/api/webhooks/stripe`
4. **Eventos para escutar**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. **Copie o "Signing secret"** (começa com `whsec_...`)
6. **Adicione** no Railway como `STRIPE_WEBHOOK_SECRET`

---

### 5. Verificar Deploy

1. **Acesse** seu domínio Railway: `https://seu-projeto.railway.app`
2. **Verifique logs** no Railway Dashboard → **Deployments** → **View Logs**
3. **Teste endpoints**:
   - Health: `https://seu-projeto.railway.app/health`
   - tRPC: `https://seu-projeto.railway.app/trpc`

---

## 🔍 VERIFICAÇÕES PÓS-DEPLOY

### ✅ Banco de Dados
- [ ] Tabela `subscriptions` criada
- [ ] Tabela `credit_ledgers` criada
- [ ] Coluna `stripe_customer_id` em `users`

### ✅ Redis
- [ ] Redis conectado (ver logs: `[Redis] Conectado com sucesso`)
- [ ] Sem erros "max retries"

### ✅ Stripe
- [ ] Variáveis de ambiente configuradas
- [ ] Webhook configurado e funcionando
- [ ] Price IDs corretos

### ✅ Aplicação
- [ ] Servidor iniciado (`🚀 Backend rodando`)
- [ ] Fila de processamento ativa (`[Queue] Fila inicializada`)
- [ ] Sem erros críticos nos logs

---

## 🐛 TROUBLESHOOTING

### Erro: "max retries per request limit"
**Solução:** ✅ JÁ CORRIGIDO - Redis configurado com `maxRetriesPerRequest: null`

### Erro: "Table 'subscriptions' doesn't exist"
**Solução:** Execute o SQL acima no Railway MySQL

### Erro: "Stripe webhook signature verification failed"
**Solução:** Verifique se `STRIPE_WEBHOOK_SECRET` está correto no Railway

### Erro: "Rate limit exceeded"
**Solução:** Normal - sistema de rate limiting funcionando. Aguarde e tente novamente.

---

## 📝 NOTAS IMPORTANTES

1. **Primeiro deploy** pode levar 3-5 minutos
2. **Migrations** devem ser aplicadas ANTES do primeiro deploy
3. **Redis** deve estar rodando antes do backend iniciar
4. **Webhook Stripe** só funciona com HTTPS (Railway fornece automaticamente)

---

## ✅ PRONTO PARA DEPLOY!

Execute os passos acima e o site estará 100% funcional! 🚀
