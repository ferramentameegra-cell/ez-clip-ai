# 🧪 Como Testar Agora - Guia Prático

## 🎯 Situação

Você tem duas opções de teste:
1. **Testar localmente** (precisa de MySQL local)
2. **Testar no Railway** (banco já configurado)

---

## 🚀 Opção 1: Testar no Railway (Recomendado)

O banco já está configurado no Railway! Só precisa aplicar as migrations lá.

### Passo 1: Aplicar Migrations no Railway

**Opção A: Via Railway CLI (mais fácil)**

```bash
# Se ainda não tem, instale Railway CLI
railway login

# Conecte ao seu projeto
railway link

# Aplique migrations
railway run npm run db:push
```

**Opção B: Via SQL direto no Railway**

1. Acesse: https://railway.app
2. Vá no serviço **MySQL**
3. Clique em **"Connect"** ou **"Database"**
4. Execute o SQL:

```sql
ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT,
ADD COLUMN onboarding_niche VARCHAR(255),
ADD COLUMN onboarding_at TIMESTAMP;
```

---

### Passo 2: Testar no Site em Produção

1. Acesse a URL do seu site no Railway
2. Crie um novo usuário
3. Deve redirecionar para onboarding
4. Complete o onboarding
5. Teste o painel admin (torne um usuário admin primeiro)

---

## 💻 Opção 2: Testar Localmente

Se você tem MySQL instalado localmente:

### Passo 1: Configurar .env

Certifique-se que tem `DATABASE_URL` no `.env`:

```env
DATABASE_URL=mysql://user:password@localhost:3306/nome_do_banco
```

### Passo 2: Aplicar Migrations

```bash
npm run db:push
```

### Passo 3: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Passo 4: Testar

1. Acesse: http://localhost:3000
2. Siga os passos do `TESTE_RAPIDO.md`

---

## ⚡ Teste Rápido (Depois de Aplicar Migrations)

### 1. Testar Onboarding

1. **Crie um novo usuário** no site
2. **Deve redirecionar** para `/onboarding`
3. **Preencha as 2 perguntas:**
   - "Para que você usará o site?" → Ex: `Criar clipes para YouTube`
   - "Qual é o seu nicho?" → Ex: `Marketing Digital`
4. **Clique em "Continuar"**
5. **Resultado:** Redireciona para home ✅

---

### 2. Testar Admin

**Primeiro, torne um usuário admin:**

**Via Railway Dashboard (MySQL):**
1. Acesse Railway → MySQL → Connect
2. Execute:
```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

**Depois:**
1. **Faça login** com esse usuário
2. **Link "Admin" deve aparecer** no menu
3. **Acesse** `/admin`
4. **Verifique:**
   - Dashboard com métricas ✅
   - Página de usuários ✅
   - Página de jobs ✅

---

## 📋 Checklist de Teste Rápido

- [ ] Migrations aplicadas (local ou Railway)
- [ ] Novo usuário criado
- [ ] Redirecionamento para onboarding funciona
- [ ] Onboarding completo salva dados
- [ ] Redirecionamento para home após onboarding
- [ ] Usuário admin criado
- [ ] Link Admin aparece no menu
- [ ] Dashboard admin carrega
- [ ] Páginas de usuários e jobs funcionam

---

## 🐛 Problemas Comuns

### "Não redireciona para onboarding"

**Solução:** Verifique se os campos foram adicionados no banco:
```sql
DESCRIBE users;
```
Deve mostrar `onboarding_use_case`, `onboarding_niche`, `onboarding_at`

---

### "Link Admin não aparece"

**Solução:** Verifique se o usuário tem role 'admin':
```sql
SELECT email, role FROM users WHERE email = 'seu-email@exemplo.com';
```

Se não for 'admin', atualize:
```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

---

### "Erro ao acessar /admin"

**Solução:** Verifique:
1. Usuário tem role 'admin'?
2. Token está válido? (faça logout/login)
3. Console do navegador tem erros?

---

## ✅ Pronto!

**Depois de aplicar as migrations, você pode testar tudo!**

**Dica:** Se estiver no Railway, a forma mais fácil é via SQL direto no dashboard do MySQL.

---

**Precisa de ajuda com algo específico?** 🚀

