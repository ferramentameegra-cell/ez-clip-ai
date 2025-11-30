# 🚀 Teste Rápido - Onboarding e Admin

## ⚡ Teste Rápido em 3 Passos

### 1️⃣ Aplicar Migrations

```bash
npm run db:push
```

**Isso adiciona os campos de onboarding no banco!**

---

### 2️⃣ Testar Onboarding

1. **Acesse:** http://localhost:3000
2. **Crie um novo usuário:**
   - Email: `teste@exemplo.com`
   - Senha: `12345678`
3. **Após cadastro:** Deve redirecionar para `/onboarding`
4. **Preencha as 2 perguntas** e clique em "Continuar"
5. **Resultado esperado:** Redireciona para `/` (home)

---

### 3️⃣ Testar Admin

1. **Torne um usuário admin** (via SQL):
```sql
UPDATE users SET role = 'admin' WHERE email = 'teste@exemplo.com';
```

2. **Faça login** com `teste@exemplo.com`

3. **Acesse:** http://localhost:3000/admin

4. **Resultado esperado:**
   - Dashboard admin carrega
   - Métricas aparecem
   - Links para "Usuários" e "Jobs" funcionam

---

## ✅ Pronto!

Se tudo funcionou, está tudo certo! 🎉

---

**Dúvidas? Veja o `GUIA_TESTE_ONBOARDING_ADMIN.md` para teste completo!**

