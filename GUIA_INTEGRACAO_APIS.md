# 🔌 GUIA COMPLETO DE INTEGRAÇÃO DE APIs

## 📋 RESUMO

Este guia explica **passo a passo** como integrar todas as APIs necessárias para o EZ CLIP AI funcionar 100%.

---

## 🎯 APIS NECESSÁRIAS (Por Prioridade)

### 🔴 **CRÍTICO** (Sistema não funciona sem)
1. **API de Transcrição** - Transcrever áudio dos vídeos
2. **AWS S3** - Armazenar vídeos processados
3. **FFmpeg** - Processar vídeos (já configurado via Dockerfile)

### 🟡 **IMPORTANTE** (Sistema funciona limitado sem)
4. **Redis** - Fila de processamento (já configurado no Railway)

### 🟢 **OPCIONAL** (Sistema funciona, mas sem extras)
5. **Stripe** - Pagamentos
6. **OAuth APIs** - Publicação automática nas redes sociais

---

## 1️⃣ API DE TRANSCRIÇÃO (Manus Forge ou OpenAI)

### **Por que precisa?**
- Sistema precisa **transcrever o áudio** dos vídeos
- Transcrição gera **timestamps** para cortar os clipes
- Sem isso, sistema **não consegue processar vídeos**

---

### **OPÇÃO A: Manus Forge** ⭐ Recomendado

#### **Passo 1: Criar Conta**
1. Acesse: **https://manusforge.com** ou **https://manus.im**
2. Clique em **"Sign Up"** ou **"Criar Conta"**
3. Preencha seus dados
4. Confirme o email

#### **Passo 2: Obter API Key**
1. Após login, vá em **"API Keys"** ou **"Dashboard"**
2. Clique em **"Create API Key"** ou **"Gerar Chave"**
3. **Copie a API Key** (ela não será mostrada novamente!)
4. Exemplo: `manus_abc123xyz789...`

#### **Passo 3: Configurar no Railway**

**Via Dashboard:**
1. Acesse: https://railway.app
2. Vá no projeto **"gentle-fulfillment"**
3. Clique no serviço **"ez-clip-ai"**
4. Vá em **"Variables"**
5. Clique em **"New Variable"**
6. Adicione:
   - **Name:** `BUILT_IN_FORGE_API_KEY`
   - **Value:** `sua_api_key_aqui`
7. Clique em **"Add"**

**Via Terminal:**
```bash
railway variables set BUILT_IN_FORGE_API_KEY=sua_api_key_aqui
```

#### **Passo 4: Verificar URL da API**
A URL já está configurada:
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

Se precisar alterar:
```bash
railway variables set BUILT_IN_FORGE_API_URL=https://api.manus.im
```

---

### **OPÇÃO B: OpenAI Whisper** (Alternativa)

#### **Passo 1: Criar Conta OpenAI**
1. Acesse: **https://platform.openai.com**
2. Clique em **"Sign Up"**
3. Crie uma conta ou faça login

#### **Passo 2: Obter API Key**
1. Vá em **"API Keys"** (https://platform.openai.com/api-keys)
2. Clique em **"Create new secret key"**
3. **Copie a API Key** (ela não será mostrada novamente!)
4. Exemplo: `sk-proj-abc123xyz789...`

#### **Passo 3: Configurar no Railway**
```bash
railway variables set OPENAI_API_KEY=sk-proj-abc123xyz789...
```

#### **Passo 4: Adicionar Créditos**
1. Vá em **"Billing"** (https://platform.openai.com/account/billing)
2. Adicione método de pagamento
3. Adicione créditos (mínimo $5)

**⚠️ Nota:** OpenAI é mais caro (~$0.006/minuto de áudio)

---

### ✅ **Verificar se Funcionou**

```bash
# Ver variáveis configuradas
railway variables | grep -E "FORGE|OPENAI"

# Ver logs do servidor
railway logs | grep -i "whisper\|transcribe"
```

**Deve mostrar:**
```
✅ BUILT_IN_FORGE_API_KEY=manus_... (configurado)
✅ BUILT_IN_FORGE_API_URL=https://api.manus.im (configurado)
```

---

## 2️⃣ AWS S3 (Armazenamento de Vídeos)

### **Por que precisa?**
- Sistema precisa **salvar vídeos processados** na nuvem
- Sem isso, vídeos **não podem ser baixados** pelo usuário
- Vídeos são muito grandes para banco de dados

---

### **Passo 1: Criar Conta AWS**

1. Acesse: **https://aws.amazon.com**
2. Clique em **"Create an AWS Account"** ou **"Sign In"**
3. Preencha seus dados
4. Adicione método de pagamento (cartão de crédito)
5. Confirme sua identidade via SMS ou chamada

**⏱️ Tempo:** 10-15 minutos

---

### **Passo 2: Criar Bucket S3**

1. Acesse: **https://s3.console.aws.amazon.com**
2. Clique em **"Create bucket"**
3. Preencha:
   - **Bucket name:** `ez-clip-ai` (deve ser único globalmente)
   - **AWS Region:** `us-east-1` (ou sua preferência)
   - **Object Ownership:** `ACLs enabled`
   - **Block Public Access:** ✅ **DESMARQUE** "Block all public access" (para permitir downloads)
   - **Bucket Versioning:** Desabilitado (por enquanto)
   - **Default encryption:** Habilitado (recomendado)
4. Clique em **"Create bucket"**

**✅ Bucket criado!**

---

### **Passo 3: Criar Usuário IAM com Permissões**

#### **3.1 Criar Usuário**

1. Acesse: **https://console.aws.amazon.com/iam**
2. No menu lateral, clique em **"Users"**
3. Clique em **"Create user"**
4. **User name:** `ez-clip-ai-s3-user`
5. Clique em **"Next"**

#### **3.2 Anexar Política S3**

1. Em **"Set permissions"**, selecione **"Attach policies directly"**
2. Procure por: **`AmazonS3FullAccess`**
3. **Marque a caixa** ao lado de `AmazonS3FullAccess`
4. Clique em **"Next"**
5. Clique em **"Create user"**

#### **3.3 Criar Access Keys**

1. Clique no usuário criado (`ez-clip-ai-s3-user`)
2. Vá na aba **"Security credentials"**
3. Role até **"Access keys"**
4. Clique em **"Create access key"**
5. Selecione **"Application running outside AWS"**
6. Clique em **"Next"**
7. (Opcional) Adicione descrição: "EZ CLIP AI S3 Access"
8. Clique em **"Create access key"**
9. **IMPORTANTE:** Copie e **SALVE** em local seguro:
   - **Access Key ID:** `AKIA...`
   - **Secret Access Key:** `wJalrXUt...`

**⚠️ ATENÇÃO:** A Secret Access Key **só é mostrada uma vez**!

---

### **Passo 4: Configurar no Railway**

**Variáveis necessárias:**
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUt...
AWS_REGION=us-east-1
AWS_S3_BUCKET=ez-clip-ai
```

**Via Dashboard:**
1. Railway → Projeto → Serviço → Variables
2. Adicione cada variável:
   - `AWS_ACCESS_KEY_ID` = sua Access Key ID
   - `AWS_SECRET_ACCESS_KEY` = sua Secret Access Key
   - `AWS_REGION` = `us-east-1` (já está configurado)
   - `AWS_S3_BUCKET` = `ez-clip-ai` (já está configurado)

**Via Terminal:**
```bash
railway variables set AWS_ACCESS_KEY_ID=AKIA...
railway variables set AWS_SECRET_ACCESS_KEY=wJalrXUt...
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET=ez-clip-ai
```

---

### ✅ **Verificar se Funcionou**

```bash
# Ver variáveis configuradas
railway variables | grep -E "AWS_"

# Testar upload (via logs)
railway logs | grep -i "s3\|upload\|storage"
```

**Deve mostrar:**
```
✅ AWS_ACCESS_KEY_ID=AKIA... (configurado)
✅ AWS_SECRET_ACCESS_KEY=*** (configurado - oculto)
✅ AWS_REGION=us-east-1 (configurado)
✅ AWS_S3_BUCKET=ez-clip-ai (configurado)
```

---

## 3️⃣ REDIS (Já Configurado - Verificar)

### **Verificar se Redis Existe**

**Via Dashboard:**
1. Railway → Projeto → Services
2. Verifique se existe serviço **"Redis"**

**Via Terminal:**
```bash
railway service list
```

### **Se Não Existir - Adicionar Redis**

**Via Dashboard:**
1. Railway → Projeto
2. Clique em **"New"**
3. Selecione **"Database" → "Redis"**
4. Railway cria automaticamente e configura `REDIS_URL`

**✅ Redis configurado!**

---

## 4️⃣ STRIPE (Opcional - Pagamentos)

### **Por que precisa?**
- Sistema de pagamentos para usuários comprarem créditos
- Sem isso, usuários não podem fazer upgrade

---

### **Passo 1: Criar Conta Stripe**

1. Acesse: **https://stripe.com**
2. Clique em **"Sign up"**
3. Preencha seus dados
4. Confirme o email

---

### **Passo 2: Obter API Keys**

1. Acesse: **https://dashboard.stripe.com/apikeys**
2. Copie as chaves:
   - **Publishable key:** `pk_test_...` ou `pk_live_...`
   - **Secret key:** `sk_test_...` ou `sk_live_...`

**⚠️ Use `test` para desenvolvimento, `live` para produção**

---

### **Passo 3: Obter Webhook Secret**

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. Clique em **"Add endpoint"**
3. **Endpoint URL:** `https://ez-clip-ai-production.up.railway.app/api/stripe/webhook`
4. Selecione eventos: `checkout.session.completed`
5. Clique em **"Add endpoint"**
6. Copie o **"Signing secret"**: `whsec_...`

---

### **Passo 4: Configurar no Railway**

```bash
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 5️⃣ OAUTH APIs (Opcional - Publicação Automática)

### **YouTube Data API**

1. Acesse: **https://console.cloud.google.com**
2. Crie projeto
3. Ative **YouTube Data API v3**
4. Crie credenciais OAuth 2.0
5. Configure redirect URI

### **TikTok API**

1. Acesse: **https://developers.tiktok.com**
2. Crie app
3. Obtenha Client Key e Secret

### **Instagram Graph API**

1. Acesse: **https://developers.facebook.com**
2. Crie app Meta
3. Configure Instagram Basic Display

**📝 Nota:** Essas APIs são opcionais - sistema funciona sem elas (apenas sem publicação automática)

---

## ✅ CHECKLIST FINAL

### **APIs Críticas:**
- [ ] **BUILT_IN_FORGE_API_KEY** configurado
- [ ] **AWS_ACCESS_KEY_ID** configurado
- [ ] **AWS_SECRET_ACCESS_KEY** configurado
- [ ] **AWS_REGION** configurado (já está)
- [ ] **AWS_S3_BUCKET** configurado (já está)
- [ ] **Redis** verificado/existe

### **APIs Opcionais:**
- [ ] **STRIPE_SECRET_KEY** (se quiser pagamentos)
- [ ] **STRIPE_WEBHOOK_SECRET** (se quiser pagamentos)
- [ ] **OAuth APIs** (se quiser publicação automática)

---

## 🧪 TESTAR INTEGRAÇÕES

### **Teste 1: API de Transcrição**

```bash
# Ver logs quando processar vídeo
railway logs --follow | grep -i "whisper\|transcribe"
```

**Deve mostrar:**
```
[Whisper] Transcrevendo: audio.mp3 (pt)
[Whisper] Transcrição concluída: X segmentos
```

### **Teste 2: AWS S3**

```bash
# Ver logs quando fizer upload
railway logs --follow | grep -i "s3\|upload\|storage"
```

**Deve mostrar:**
```
[S3] Upload concluído: clips/geral/1234567890_part1.mp4
[S3] URL gerada: https://ez-clip-ai.s3.us-east-1.amazonaws.com/...
```

### **Teste 3: Redis**

```bash
# Ver logs da fila
railway logs --follow | grep -i "queue\|redis\|job"
```

**Deve mostrar:**
```
[Queue] Job adicionado à fila
[Queue] Processando job 123...
```

---

## 🆘 TROUBLESHOOTING

### **Erro: "API Key inválida"**

**Solução:**
1. Verifique se copiou a chave completa
2. Verifique se não tem espaços antes/depois
3. Teste a chave manualmente via curl

### **Erro: "S3 Access Denied"**

**Solução:**
1. Verifique se as credenciais AWS estão corretas
2. Verifique se o bucket existe
3. Verifique se o usuário IAM tem permissão `AmazonS3FullAccess`

### **Erro: "Transcrição falhou"**

**Solução:**
1. Verifique se `BUILT_IN_FORGE_API_KEY` está configurado
2. Verifique se há créditos na conta Manus Forge
3. Verifique logs para ver erro específico

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique os logs: `railway logs --follow`
2. Verifique variáveis: `railway variables`
3. Consulte a documentação de cada API

---

## 🎉 PRONTO!

Após configurar as APIs críticas:
- ✅ Sistema pode transcrever vídeos
- ✅ Sistema pode salvar vídeos no S3
- ✅ Sistema pode processar vídeos completamente

**Tudo funcionando! 🚀**


