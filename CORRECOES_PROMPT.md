# ⚠️ CORREÇÕES NECESSÁRIAS NO PROMPT

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **ENV não existe** ❌
**Problema:** O prompt referencia `ENV` de `_core/env.ts`, mas esse arquivo não existe.

**Solução:** Usar `process.env` diretamente (como o código atual faz).

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
if (!ENV.builtInForgeApiKey) { ... }

// ✅ CORRETO:
if (!process.env.BUILT_IN_FORGE_API_KEY) { ... }
```

---

### 2. **useAuth não existe** ❌
**Problema:** `Billing.tsx` referencia `useAuth` que não existe no projeto.

**Solução:** Usar `localStorage` ou buscar dados do usuário via tRPC.

**Correção no Billing.tsx:**
```typescript
// ❌ ERRADO (no prompt):
import { useAuth } from '@/_core/hooks/useAuth';
const { user } = useAuth();

// ✅ CORRETO:
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

const [user, setUser] = useState<any>(null);
const { data: profile } = trpc.auth.getProfile.useQuery();

useEffect(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    setUser(JSON.parse(userData));
  } else if (profile) {
    setUser(profile);
  }
}, [profile]);
```

---

### 3. **ctx.user.credits não existe** ❌
**Problema:** O contexto do tRPC só tem `id` e `email`, não tem `credits` ou `role`.

**Solução:** Buscar dados completos do banco quando necessário.

**Correção no paymentRouter:**
```typescript
// ❌ ERRADO (no prompt):
customer_email: ctx.user.email,

// ✅ CORRETO (já está correto, mas precisa buscar user completo):
// No getProfile, já retorna credits, então está OK
```

---

### 4. **db.getDb() vs getDb()** ⚠️
**Problema:** O prompt usa `db.getDb()`, mas o código atual usa `getDb()` diretamente.

**Solução:** Usar `getDb()` diretamente.

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { db } from '../db';
const database = await db.getDb();

// ✅ CORRETO:
import { getDb } from '../db';
const db = await getDb();
```

---

### 5. **result.insertId** ✅
**Status:** Está correto! O código atual já usa `result[0].insertId` (linha 111 do auth.ts).

---

### 6. **Stripe sem validação** ⚠️
**Problema:** O prompt não valida se Stripe está configurado antes de usar.

**Solução:** Adicionar validação.

**Correção no paymentRouter:**
```typescript
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn('[Stripe] ⚠️ STRIPE_SECRET_KEY não configurada. Pagamentos não funcionarão.');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
}) : null;

// Depois, validar antes de usar:
if (!stripe) {
  throw new Error('Stripe não configurado. Configure STRIPE_SECRET_KEY no .env');
}
```

---

### 7. **Billing.tsx - Preço incorreto** ⚠️
**Problema:** O prompt mostra `R$ ${(plan.price / 100).toFixed(2)}`, mas `plan.price` já está em centavos (6700 = R$ 67).

**Solução:** O código está correto, mas precisa garantir que o backend retorne preço em centavos.

**Verificação:** No `listPlans`, o preço deve estar em centavos:
```typescript
{
  id: 'pro',
  name: 'Pro',
  price: 6700, // ← Já está em centavos (R$ 67.00)
  credits: 100,
}
```

---

### 8. **transcription.ts - ENV não existe** ❌
**Problema:** O prompt referencia `ENV.builtInForgeApiKey` que não existe.

**Solução:** Usar `process.env` diretamente.

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
if (!ENV.builtInForgeApiKey) { ... }

// ✅ CORRETO:
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const API_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://api.manus.im';

if (!API_KEY) {
  throw new Error('BUILT_IN_FORGE_API_KEY não configurada no .env');
}
```

---

### 9. **storage.ts - ENV não existe** ❌
**Problema:** O prompt referencia `ENV.awsAccessKeyId` que não existe.

**Solução:** Usar `process.env` diretamente (como o código atual já faz).

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
const s3Client = new S3Client({
  region: ENV.awsRegion || 'us-east-1',
  credentials: {
    accessKeyId: ENV.awsAccessKeyId,
    secretAccessKey: ENV.awsSecretAccessKey
  }
});

// ✅ CORRETO (já está assim no código atual):
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'viral-clips';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  } : undefined
});
```

---

### 10. **socialPublisher.ts - ENV não existe** ❌
**Problema:** O prompt referencia `ENV.tikTokClientKey` que não existe.

**Solução:** Usar `process.env` diretamente.

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
if (!ENV.tikTokClientKey || !ENV.tikTokClientSecret) { ... }

// ✅ CORRETO:
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
  throw new Error('TikTok credenciais não configuradas');
}
```

---

### 11. **authRouter - ENV não existe** ❌
**Problema:** O prompt referencia `ENV.jwtSecret` que não existe.

**Solução:** Usar `process.env` diretamente (como o código atual já faz).

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
const token = jwt.sign(
  { userId: result.insertId, email: input.email },
  ENV.jwtSecret,
  { expiresIn: TOKEN_EXPIRY }
);

// ✅ CORRETO (já está assim no código atual):
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const token = jwt.sign(
  { userId: result.insertId, email: input.email },
  JWT_SECRET,
  { expiresIn: TOKEN_EXPIRY }
);
```

---

### 12. **paymentRouter - ENV não existe** ❌
**Problema:** O prompt referencia `ENV.stripeSecretKey` que não existe.

**Solução:** Usar `process.env` diretamente.

**Correção:**
```typescript
// ❌ ERRADO (no prompt):
import { ENV } from './_core/env';
const stripe = new Stripe(ENV.stripeSecretKey, { ... });

// ✅ CORRETO:
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn('[Stripe] ⚠️ STRIPE_SECRET_KEY não configurada.');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
}) : null;
```

---

### 13. **Billing.tsx - createCheckout mutation** ⚠️
**Problema:** O prompt não mostra como lidar com a URL de redirecionamento do Stripe.

**Solução:** Adicionar lógica para redirecionar.

**Correção:**
```typescript
const handleUpgrade = async (planId: string) => {
  try {
    const result = await createCheckout.mutateAsync({
      planId: planId as 'free' | 'pro' | 'agency',
      successUrl: `${window.location.origin}/billing?success=true`,
      cancelUrl: `${window.location.origin}/billing?cancelled=true`
    });

    if (result.url && result.url !== `${window.location.origin}/billing?success=true`) {
      // Redirecionar para checkout Stripe
      window.location.href = result.url;
    } else {
      // Plano grátis ou erro
      toast.success('Plano ativado com sucesso!');
    }
  } catch (error: any) {
    toast.error(error.message || 'Erro ao processar pagamento');
  }
};
```

---

### 14. **Billing.tsx - Rota não adicionada** ⚠️
**Problema:** O prompt não menciona adicionar a rota `/billing` no `App.tsx`.

**Solução:** Adicionar rota.

**Correção no App.tsx:**
```typescript
import { Billing } from '@/pages/Billing';

// No Switch:
<Route path="/billing" component={Billing} />
```

---

### 15. **paymentRouter - Webhook não é tRPC** ⚠️
**Problema:** O prompt tenta criar webhook como tRPC procedure, mas webhooks do Stripe precisam ser endpoints HTTP separados.

**Solução:** Criar endpoint Express separado para webhook.

**Correção:** Adicionar em `server/index.ts`:
```typescript
import Stripe from 'stripe';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
}) : null;

// Webhook endpoint (deve ser antes do tRPC)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe não configurado' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, credits } = session.metadata || {};

      if (userId && credits) {
        const db = await getDb();
        if (db) {
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.id, parseInt(userId)))
            .limit(1);

          if (userResult.length > 0) {
            await db
              .update(users)
              .set({
                credits: (userResult[0].credits || 0) + parseInt(credits)
              })
              .where(eq(users.id, parseInt(userId)));

            console.log(`[Stripe] ✅ Créditos adicionados: ${credits} para usuário ${userId}`);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe] Webhook error:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});
```

---

## ✅ RESUMO DAS CORREÇÕES

1. **Substituir todas as referências `ENV.*` por `process.env.*`**
2. **Remover `useAuth` e usar `localStorage` + tRPC `getProfile`**
3. **Corrigir `db.getDb()` para `getDb()`**
4. **Adicionar validação de Stripe antes de usar**
5. **Criar endpoint HTTP separado para webhook do Stripe**
6. **Adicionar rota `/billing` no App.tsx**
7. **Adicionar tratamento de erro no `handleUpgrade`**

---

## 📝 ARQUIVO CORRIGIDO

O arquivo `PROMPT_CURSOR_CORRIGIR_FALHAS.md` já foi criado com essas correções aplicadas. Use esse arquivo em vez do prompt original.

---

**Todas as correções foram aplicadas no arquivo `PROMPT_CURSOR_CORRIGIR_FALHAS.md`! ✅**

