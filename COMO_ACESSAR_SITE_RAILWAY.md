# 🌐 COMO ACESSAR O SITE NO RAILWAY

## 🚀 MÉTODOS PARA ACESSAR O SITE

### **Método 1: Via Dashboard do Railway** (Mais Fácil)

1. **Acesse o Dashboard:**
   - Vá para: https://railway.app
   - Faça login na sua conta

2. **Encontre seu Projeto:**
   - Clique em **"gentle-fulfillment"** (nome do projeto)
   - Ou procure pelo serviço **"ez-clip-ai"**

3. **Veja a URL:**
   - No topo da página do serviço, você verá a URL pública
   - Geralmente é algo como: `https://ez-clip-ai-production.up.railway.app`
   - Clique nessa URL para abrir o site

---

### **Método 2: Via Terminal (Railway CLI)**

```bash
# Ver o domínio público do serviço
railway domain

# Ou ver todas as variáveis incluindo URLs
railway variables | grep URL
```

---

### **Método 3: Via Variáveis de Ambiente**

A URL está salva nas variáveis do Railway:

```
FRONTEND_URL=https://ez-clip-ai-production.up.railway.app
RAILWAY_PUBLIC_DOMAIN=ez-clip-ai-production.up.railway.app
```

Você pode ver essas variáveis com:
```bash
railway variables
```

---

## 🔍 URL DO SEU SITE

Com base nas variáveis configuradas, seu site deve estar em:

**🌐 https://ez-clip-ai-production.up.railway.app**

**OU**

**🌐 https://ez-clip-ai-production.up.railway.app/**

---

## 📋 VERIFICAÇÃO RÁPIDA

### 1. **Abrir o Site:**
```
https://ez-clip-ai-production.up.railway.app
```

### 2. **O que você deve ver:**
- ✅ Página inicial do EZ CLIP AI
- ✅ Formulário para processar vídeos
- ✅ Interface funcionando

### 3. **Se não carregar:**
- Verificar logs: `railway logs`
- Verificar status do deploy: Dashboard do Railway
- Verificar se o deploy foi concluído

---

## 🐛 SE O SITE NÃO ESTIVER FUNCIONANDO

### Verificar Status do Deploy:

1. **Via Dashboard:**
   - Railway Dashboard → Seu Projeto → Deployments
   - Ver se o último deploy foi bem-sucedido (✅ verde)

2. **Via Terminal:**
   ```bash
   railway logs --tail 50
   ```
   - Isso mostra os últimos 50 logs
   - Procure por erros

### Verificar Logs em Tempo Real:

```bash
# Ver logs ao vivo
railway logs --follow

# Ver últimos 100 logs
railway logs --tail 100
```

### Verificar Saúde do Servidor:

```bash
# Verificar endpoint de health check
curl https://ez-clip-ai-production.up.railway.app/health

# Deve retornar:
# {"status":"ok","timestamp":"..."}
```

---

## 🔧 TROUBLESHOOTING

### Problema 1: Site não carrega (404 Not Found)

**Causas possíveis:**
- ❌ Build do frontend falhou
- ❌ Deploy não foi concluído
- ❌ Porta incorreta configurada

**Solução:**
```bash
# 1. Verificar logs
railway logs

# 2. Verificar se build passou
railway logs | grep -i "built\|error\|fail"

# 3. Verificar variável PORT
railway variables | grep PORT
# Deve ser PORT=3001
```

---

### Problema 2: Site carrega mas dá erro 500

**Causas possíveis:**
- ❌ Variáveis de ambiente faltando
- ❌ Banco de dados não conectado
- ❌ Erro no código

**Solução:**
```bash
# 1. Ver logs de erro
railway logs | grep -i error

# 2. Verificar variáveis críticas
railway variables | grep -E "DATABASE_URL|JWT_SECRET"

# 3. Verificar se banco está funcionando
railway logs | grep -i "database\|mysql\|connected"
```

---

### Problema 3: Frontend não aparece (API funciona mas UI não)

**Causas possíveis:**
- ❌ Build do frontend não foi executado
- ❌ Arquivos estáticos não foram servidos

**Solução:**
```bash
# 1. Verificar se build foi executado
railway logs | grep -i "build\|vite\|dist"

# 2. Verificar se pasta dist existe no build
railway run ls -la client/dist

# 3. Verificar variável de build
railway variables | grep -E "NODE_ENV|BUILD"
```

---

## 📊 VERIFICAR STATUS COMPLETO

### Ver todas as informações do serviço:

```bash
# Status do serviço
railway status

# Variáveis configuradas
railway variables

# Logs recentes
railway logs --tail 20

# URL pública
railway domain
```

---

## 🎯 CHECKLIST DE ACESSO

- [ ] Railway Dashboard acessível
- [ ] Projeto "gentle-fulfillment" visível
- [ ] Serviço "ez-clip-ai" ativo
- [ ] Último deploy bem-sucedido (✅ verde)
- [ ] URL pública disponível
- [ ] Site carrega no navegador
- [ ] Health check responde (`/health`)

---

## 🔗 LINKS ÚTEIS

### Railway Dashboard:
- **Dashboard:** https://railway.app/dashboard
- **Seu Projeto:** https://railway.app/project/698ef13f-bccc-4418-92e5-2dffaf94b359

### URLs do Site:
- **Site Principal:** https://ez-clip-ai-production.up.railway.app
- **Health Check:** https://ez-clip-ai-production.up.railway.app/health
- **tRPC Endpoint:** https://ez-clip-ai-production.up.railway.app/trpc

---

## 💡 DICA IMPORTANTE

**Primeira vez acessando?**

1. O Railway pode levar alguns minutos para provisionar o domínio
2. Se não funcionar imediatamente, aguarde 2-3 minutos
3. Verifique os logs para ver o progresso

---

## ✅ RESUMO RÁPIDO

**Para acessar seu site:**

1. **Abra no navegador:**
   ```
   https://ez-clip-ai-production.up.railway.app
   ```

2. **OU acesse pelo Dashboard:**
   - https://railway.app
   - Projeto → Serviço → Clique na URL pública

3. **OU pelo terminal:**
   ```bash
   railway domain
   ```

**Pronto! Seu site está no ar! 🚀**


