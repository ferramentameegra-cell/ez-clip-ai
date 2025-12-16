# 🧪 Testes do Sistema de Login - Completamente Refeito

## ✅ Checklist de Testes Obrigatórios

### 1. ✅ Login com Usuário Válido

**Cenário:** Usuário existe no banco com email e senha corretos

**Passos:**
1. Acessar página de login
2. Preencher email válido: `teste@example.com`
3. Preencher senha correta
4. Clicar em "Entrar"

**Resultado Esperado:**
- ✅ Requisição completa em < 3 segundos
- ✅ Status HTTP 200
- ✅ Token JWT retornado
- ✅ Dados do usuário retornados
- ✅ Redirecionamento para `/onboarding`
- ✅ Dados salvos no `localStorage`

**Logs Esperados:**
```
[Auth] [req-xxx] ➡️ Requisição de login recebida
[Auth] [req-xxx] 🔍 Buscando usuário: teste@example.com
[Auth] [req-xxx] ✅ Conexão obtida: XXms
[Auth] [req-xxx] ✅ Query executada: XXms
[Auth] [req-xxx] 🔐 Verificando senha...
[Auth] [req-xxx] ✅ Verificação de senha: XXms
[Auth] [req-xxx] 🎫 Gerando token...
[Auth] [req-xxx] ✅ Login bem-sucedido: XXXms
```

---

### 2. ✅ Login com Senha Errada

**Cenário:** Usuário existe mas senha está incorreta

**Passos:**
1. Preencher email válido: `teste@example.com`
2. Preencher senha incorreta
3. Clicar em "Entrar"

**Resultado Esperado:**
- ✅ Requisição completa em < 3 segundos
- ✅ Status HTTP 401
- ✅ Mensagem: "Email ou senha incorretos"
- ✅ Loading finaliza
- ✅ Não redireciona

**Logs Esperados:**
```
[Auth] [req-xxx] ➡️ Requisição de login recebida
[Auth] [req-xxx] 🔍 Buscando usuário: teste@example.com
[Auth] [req-xxx] ✅ Query executada: XXms
[Auth] [req-xxx] 🔐 Verificando senha...
[Auth] [req-xxx] ⚠️ Senha inválida: XXXms
```

---

### 3. ✅ Login com Usuário Inexistente

**Cenário:** Email não existe no banco

**Passos:**
1. Preencher email inexistente: `naoexiste@example.com`
2. Preencher qualquer senha
3. Clicar em "Entrar"

**Resultado Esperado:**
- ✅ Requisição completa em < 3 segundos
- ✅ Status HTTP 401
- ✅ Mensagem: "Email ou senha incorretos"
- ✅ Loading finaliza
- ✅ Não redireciona

**Logs Esperados:**
```
[Auth] [req-xxx] ➡️ Requisição de login recebida
[Auth] [req-xxx] 🔍 Buscando usuário: naoexiste@example.com
[Auth] [req-xxx] ✅ Query executada: XXms
[Auth] [req-xxx] ⚠️ Usuário não encontrado: XXXms
```

---

### 4. ✅ Banco de Dados Fora do Ar

**Cenário:** DATABASE_URL incorreta ou banco inacessível

**Passos:**
1. Configurar DATABASE_URL incorreta no Railway
2. Tentar fazer login

**Resultado Esperado:**
- ✅ Requisição completa em < 3 segundos (timeout)
- ✅ Status HTTP 500
- ✅ Mensagem: "Erro ao conectar com o banco de dados"
- ✅ Loading finaliza
- ✅ Não redireciona

**Logs Esperados:**
```
[Auth] [req-xxx] ➡️ Requisição de login recebida
[Auth] [req-xxx] 🔍 Buscando usuário: teste@example.com
[Auth] [req-xxx] ❌ Erro no banco de dados: ECONNREFUSED
```

---

### 5. ✅ Timeout Forçado

**Cenário:** Query demora mais de 2 segundos

**Passos:**
1. Simular banco lento (ou timeout real)
2. Tentar fazer login

**Resultado Esperado:**
- ✅ Timeout após 2 segundos na query
- ✅ Status HTTP 500
- ✅ Mensagem: "Erro ao conectar com o banco de dados"
- ✅ Loading finaliza em < 5 segundos (frontend)
- ✅ Não redireciona

**Logs Esperados:**
```
[Auth] [req-xxx] ➡️ Requisição de login recebida
[Auth] [req-xxx] 🔍 Buscando usuário: teste@example.com
[Auth] [req-xxx] ❌ Erro no banco de dados: Query timeout (2s)
```

---

### 6. ✅ Validação de Entrada

**Cenário:** Dados inválidos no formulário

**Teste 6.1: Email vazio**
- Preencher apenas senha
- Clicar em "Entrar"
- ✅ Mensagem: "Email é obrigatório"
- ✅ Não envia requisição

**Teste 6.2: Senha vazia**
- Preencher apenas email
- Clicar em "Entrar"
- ✅ Mensagem: "Senha é obrigatória"
- ✅ Não envia requisição

**Teste 6.3: Email inválido**
- Preencher email sem @: `testeexample.com`
- Clicar em "Entrar"
- ✅ Mensagem: "Email inválido"
- ✅ Status HTTP 400

---

### 7. ✅ Cancelamento de Requisição

**Cenário:** Usuário clica novamente ou navega para outra página

**Passos:**
1. Preencher formulário
2. Clicar em "Entrar"
3. Imediatamente clicar novamente ou navegar

**Resultado Esperado:**
- ✅ Requisição anterior é cancelada (AbortController)
- ✅ Não há requisições duplicadas
- ✅ Loading finaliza

---

### 8. ✅ Timeout do Frontend

**Cenário:** Requisição demora mais de 5 segundos

**Passos:**
1. Simular requisição lenta (ou timeout real)
2. Aguardar 5 segundos

**Resultado Esperado:**
- ✅ Timeout após 5 segundos
- ✅ Mensagem: "A requisição demorou muito..."
- ✅ Loading finaliza
- ✅ Não redireciona

---

## 📊 Métricas de Performance

### Tempos Esperados:

- **Conexão com pool:** < 100ms
- **Query SQL:** < 200ms
- **Verificação de senha:** < 100ms
- **Geração de token:** < 10ms
- **Total:** < 500ms (normal)
- **Máximo:** < 3 segundos (timeout backend)

---

## 🔍 Como Executar os Testes

### 1. Teste Manual

1. Acessar: `https://seu-site.railway.app`
2. Ir para página de login
3. Executar cada cenário acima
4. Verificar logs no Railway Dashboard
5. Verificar console do navegador (F12)

### 2. Verificar Logs

**Backend (Railway Dashboard):**
- Deployments → Último deploy → Logs
- Procurar por `[Auth]` e `[LoginNew]`

**Frontend (Console do Navegador):**
- F12 → Console
- Procurar por `[LoginNew]`

---

## ✅ Critérios de Aprovação

O login só pode ser considerado **PRONTO** se:

- [x] ✅ Todos os 8 testes acima passarem
- [x] ✅ Nenhuma requisição demora mais de 3 segundos (backend)
- [x] ✅ Nenhuma requisição demora mais de 5 segundos (frontend)
- [x] ✅ Loading sempre finaliza (nunca infinito)
- [x] ✅ Todos os erros retornam status HTTP claro
- [x] ✅ Logs são claros e suficientes
- [x] ✅ Redirecionamento funciona após sucesso
- [x] ✅ Dados são salvos corretamente no localStorage

---

## 🚨 Problemas Conhecidos e Soluções

### Problema: Timeout mesmo com banco funcionando

**Causa:** DATABASE_URL incorreta ou banco inacessível

**Solução:**
1. Verificar `DATABASE_URL` no Railway
2. Usar `MYSQL_PUBLIC_URL` (não `mysql.railway.internal`)
3. Verificar se MySQL está rodando

### Problema: Loading infinito

**Causa:** Frontend não está cancelando requisição ou timeout não está funcionando

**Solução:**
1. Verificar se `AbortController` está sendo usado
2. Verificar se timeout de 5s está configurado
3. Verificar console do navegador para erros

### Problema: Erro 500 sempre

**Causa:** Pool não inicializado ou erro no código

**Solução:**
1. Verificar logs do servidor
2. Verificar se pool foi inicializado globalmente
3. Verificar se `getConnectionPool()` está exportado

---

**Testes devem ser executados ANTES de considerar o login pronto!** 🧪

