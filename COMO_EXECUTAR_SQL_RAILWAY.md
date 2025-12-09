# 💳 Como Executar SQL no Railway MySQL

## ✅ MÉTODO MAIS FÁCIL: Via Railway Dashboard

1. **Acesse o Railway Dashboard:**
   - https://railway.app/dashboard
   - Selecione o projeto `gentle-fulfillment`

2. **Abra o MySQL Database:**
   - Clique no serviço **MySQL**
   - Clique na aba **"Query"** ou **"Data"**

3. **Cole e execute o SQL:**
```sql
UPDATE users 
SET credits = 10000
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');
```

4. **Verificar se funcionou:**
```sql
SELECT id, name, email, credits, role 
FROM users 
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');
```

---

## 🔧 MÉTODO ALTERNATIVO: Via Script Node.js

Se você preferir via terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Obter DATABASE_URL do Railway
railway variables | grep DATABASE_URL

# Copiar a URL completa e executar:
DATABASE_URL="mysql://root:senha@host:port/database" node scripts/executar-sql-creditos-admins.js
```

---

## 📋 SQL Completo

Arquivo: `SQL_ADICIONAR_10000_CREDITOS_ADMINS.sql`

```sql
-- Adicionar 10000 créditos para emails de administradores
UPDATE users 
SET credits = 10000
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');

-- Verificar se funcionou
SELECT id, name, email, credits, role 
FROM users 
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');
```

---

**O método mais fácil é pelo Dashboard do Railway!** 🚀

