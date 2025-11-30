# ✅ Créditos Ilimitados para Administradores

## 🎯 O Que Foi Implementado

### Emails com Créditos Ilimitados:

1. ✅ **daniel.braun@hotmail.com**
2. ✅ **Josyasborba@hotmail.com**

**E também qualquer usuário com role `admin`!**

---

## 🔧 Como Funciona

### 1. Verificação Automática

O sistema verifica **automaticamente**:
- ✅ Se o usuário tem **role = 'admin'** no banco
- ✅ Se o email está na **lista de administradores** (hardcoded)

**Se qualquer condição for verdadeira:**
- ✅ **Nunca verifica créditos** antes de processar
- ✅ **Nunca debita créditos** após processar
- ✅ **Pode processar vídeos ilimitados!**

---

## 📋 O Que Foi Atualizado

### Arquivo: `server/creditsManager.ts`

**Mudanças:**

1. ✅ Função `isAdminUser()` criada
   - Verifica role no banco
   - Verifica email na lista de admins

2. ✅ Função `decrementUserCredits()` atualizada
   - **NÃO debita créditos** se for admin
   - Retorna antes de debitar

3. ✅ Função `hasEnoughCredits()` atualizada
   - **Sempre retorna `true`** se for admin
   - Não verifica créditos no banco

---

## 🚀 Como Aplicar

### Opção 1: Marcar como Admin no Banco (Recomendado)

**Execute este SQL no Railway MySQL:**

```sql
UPDATE users 
SET role = 'admin' 
WHERE email IN ('daniel.braun@hotmail.com', 'Josyasborba@hotmail.com');
```

**Vantagens:**
- ✅ Funciona por role (mais seguro)
- ✅ Acesso ao painel admin
- ✅ Fácil de gerenciar

---

### Opção 2: Funciona Automaticamente

**Não precisa fazer nada!** 

O código já verifica pelo email mesmo sem role admin.

**Mas recomendamos marcar como admin no banco para:**
- Acesso ao painel admin (`/admin`)
- Gerenciar outros usuários
- Ver métricas do sistema

---

## ✅ Teste

1. **Faça login** com `daniel.braun@hotmail.com` ou `Josyasborba@hotmail.com`
2. **Crie um job** de vídeo
3. **Verifique nos logs:**
   ```
   [Credits] Usuário X é administrador - créditos ilimitados
   ```
4. **Após processar:**
   ```
   [Credits] Usuário X é administrador - créditos não serão debitados
   ```
5. **Verifique no banco:** Créditos **não diminuíram** ✅

---

## 📊 Onde Está Implementado

### 1. Verificação de Créditos
- ✅ `server/routers/video.ts` - Usa `hasEnoughCredits()` (nunca bloqueia admin)

### 2. Débito de Créditos
- ✅ `server/jobProcessor.ts` - Usa `decrementUserCredits()` (nunca debita admin)
- ✅ `server/creditsManager.ts` - Lógica principal

---

## 🔒 Segurança

- ✅ Lista de emails está hardcoded no código
- ✅ Verificação também por role (mais seguro)
- ✅ Logs registram quando admin usa sistema

---

## 📝 Adicionar Mais Admins

**Opção 1: Via Código**
1. Edite `server/creditsManager.ts`
2. Adicione email em `ADMIN_EMAILS`:
```typescript
const ADMIN_EMAILS = [
  'daniel.braun@hotmail.com',
  'Josyasborba@hotmail.com',
  'novo-admin@exemplo.com', // Adicionar aqui
].map(email => email.toLowerCase());
```

**Opção 2: Via Banco (Recomendado)**
```sql
UPDATE users SET role = 'admin' WHERE email = 'novo-admin@exemplo.com';
```

---

## ✅ Status

- ✅ Código atualizado
- ✅ Verificação automática implementada
- ✅ Créditos nunca serão debitados
- ✅ Sistema pronto para usar

**Execute o SQL para marcar como admin (recomendado)!** 🚀

---

**Arquivo SQL criado:** `MARCAR_ADMINS_SQL.sql`

