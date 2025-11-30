# 🧪 Guia de Teste - Onboarding e Admin

## 📋 Checklist Pré-Teste

Antes de começar, certifique-se de que:

- [ ] Backend está rodando (`npm run dev:server`)
- [ ] Frontend está rodando (`npm run dev`)
- [ ] Banco de dados está configurado
- [ ] Migrations foram aplicadas (`npm run db:push`)

---

## 🚀 Teste 1: Aplicar Migrations

### Passo 1: Aplicar mudanças no banco

```bash
npm run db:push
```

**O que isso faz:**
- Adiciona os campos `onboarding_use_case`, `onboarding_niche`, `onboarding_at` na tabela `users`

**Esperado:**
- ✅ Migrations aplicadas com sucesso
- ✅ Campos adicionados na tabela

---

## 🧪 Teste 2: Onboarding (Novo Usuário)

### Passo 1: Criar novo usuário

1. Acesse: http://localhost:3000
2. Clique em "Criar conta"
3. Preencha:
   - Nome: `Teste Onboarding`
   - Email: `teste.onboarding@exemplo.com`
   - Senha: `12345678`
4. Clique em "Cadastrar"

**Esperado:**
- ✅ Cadastro bem-sucedido
- ✅ **Redirecionamento automático para `/onboarding`**

---

### Passo 2: Verificar página de onboarding

**O que você deve ver:**
- ✅ Título: "Bem-vindo ao EZ Clip AI! 🎯"
- ✅ Subtítulo: "Responda rapidinho para personalizarmos sua experiência"
- ✅ Campo 1: "Para que você usará o site?"
- ✅ Campo 2: "Qual é o seu nicho?"
- ✅ Botão: "Continuar →"

---

### Passo 3: Completar onboarding

1. Preencha o primeiro campo:
   - Exemplo: `Criar clipes para meu canal no YouTube`
2. Preencha o segundo campo:
   - Exemplo: `Marketing Digital`
3. Clique em "Continuar →"

**Esperado:**
- ✅ Mensagem de sucesso: "Onboarding concluído! Bem-vindo ao EZ Clip AI! 🎉"
- ✅ **Redirecionamento para `/` (home)**

---

### Passo 4: Verificar que não pode pular onboarding

1. Tente acessar diretamente: http://localhost:3000/profile
2. Ou: http://localhost:3000/jobs

**Esperado:**
- ✅ **Redirecionamento automático para `/onboarding`**
- ✅ Não consegue acessar outras páginas até completar

---

### Passo 5: Verificar que pode acessar após completar

1. Após completar onboarding, acesse: http://localhost:3000/profile

**Esperado:**
- ✅ Acesso permitido
- ✅ Página carrega normalmente

---

## 🧪 Teste 3: Painel Admin

### Passo 1: Criar usuário admin

**Opção A: Via SQL direto (mais rápido)**

1. Abra seu cliente MySQL
2. Execute:
```sql
UPDATE users SET role = 'admin' WHERE email = 'teste.onboarding@exemplo.com';
```

**Opção B: Via código (temporário)**

Crie um arquivo temporário `make-admin.ts` na raiz:

```typescript
import { getDb } from './server/db';
import { users } from './drizzle/schema';
import { eq } from 'drizzle-orm';

async function makeAdmin() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(users)
    .set({ role: 'admin' })
    .where(eq(users.email, 'teste.onboarding@exemplo.com'));

  console.log('✅ Usuário agora é admin!');
  process.exit(0);
}

makeAdmin();
```

Execute:
```bash
tsx make-admin.ts
```

---

### Passo 2: Fazer login como admin

1. Faça logout (se estiver logado)
2. Faça login com: `teste.onboarding@exemplo.com`

**Esperado:**
- ✅ Login bem-sucedido
- ✅ **Link "Admin" aparece no menu do Header**

---

### Passo 3: Acessar dashboard admin

1. Clique em "Admin" no menu
2. Ou acesse: http://localhost:3000/admin

**Esperado:**
- ✅ Página carrega
- ✅ **Título**: "Painel Administrativo"
- ✅ **6 Cards de métricas**:
  - Total de Usuários
  - Total de Jobs
  - Taxa de Sucesso
  - Total de Clipes
  - Créditos Totais
  - Jobs Falhados
- ✅ Botões: "Usuários" e "Jobs"

---

### Passo 4: Testar página de usuários

1. Clique em "Usuários" no dashboard admin
2. Ou acesse: http://localhost:3000/admin/users

**Esperado:**
- ✅ Tabela com todos os usuários
- ✅ Colunas: ID, Nome, Email, Role, Créditos, Use Case, Nicho, Criado em, Ações
- ✅ Campo de busca no topo
- ✅ Paginação (se houver mais de 20 usuários)

---

### Passo 5: Editar usuário

1. Na tabela de usuários, clique no ícone de lápis (✏️) de um usuário
2. **Esperado:**
   - ✅ Campos de créditos e role ficam editáveis
   - ✅ Botões "Salvar" e "Cancelar" aparecem
3. Altere os créditos (ex: 100 → 150)
4. Clique em "Salvar"

**Esperado:**
- ✅ Mensagem de sucesso: "Usuário atualizado com sucesso!"
- ✅ Tabela atualiza com novos valores
- ✅ Campos voltam ao modo visualização

---

### Passo 6: Buscar usuário

1. No campo de busca, digite parte do nome ou email
2. Pressione Enter ou aguarde

**Esperado:**
- ✅ Tabela filtra mostrando apenas usuários que correspondem
- ✅ Contador atualiza ("X usuários encontrados")

---

### Passo 7: Testar página de jobs

1. Clique em "Jobs" no dashboard admin
2. Ou acesse: http://localhost:3000/admin/jobs

**Esperado:**
- ✅ Tabela com todos os jobs
- ✅ Colunas: ID, Usuário, URL, Status, Progresso, Clipes, Erro, Criado em, Ações
- ✅ Filtro de status no topo
- ✅ Paginação

---

### Passo 8: Filtrar jobs por status

1. No filtro de status, selecione "failed" (ou outro status)
2. **Esperado:**
   - ✅ Tabela filtra mostrando apenas jobs com aquele status
   - ✅ Contador atualiza

---

### Passo 9: Testar reprocessar job (se houver job falhado)

1. Se houver um job com status "failed", veja a coluna "Ações"
2. Deve haver botão "Reprocessar"
3. Clique nele

**Esperado:**
- ✅ Mensagem de sucesso: "Job será reprocessado!"
- ✅ Status do job muda para "pending"
- ✅ Job volta para a fila de processamento

---

## 🧪 Teste 4: Proteção de Rotas Admin

### Passo 1: Tentar acessar admin sem ser admin

1. Faça logout
2. Crie um novo usuário normal (não admin)
3. Tente acessar: http://localhost:3000/admin

**Esperado:**
- ✅ **Redirecionamento para `/` (home)**
- ✅ Mensagem de erro (opcional)
- ✅ Link "Admin" não aparece no menu

---

### Passo 2: Verificar que usuário normal não vê link Admin

**Esperado:**
- ✅ Link "Admin" **NÃO aparece** no dropdown do menu
- ✅ Apenas links normais (Perfil, Configurações, Sair)

---

## 🐛 Troubleshooting

### Problema: Redirecionamento infinito

**Causa:** Onboarding sempre redireciona mesmo após completar

**Solução:**
1. Verifique no banco se `onboarding_at` foi salvo:
```sql
SELECT id, email, onboarding_at, onboarding_use_case, onboarding_niche FROM users WHERE email = 'seu-email@exemplo.com';
```

2. Se `onboarding_at` for NULL, complete o onboarding novamente

---

### Problema: Link Admin não aparece

**Causa:** Usuário não tem role 'admin'

**Solução:**
1. Verifique no banco:
```sql
SELECT id, email, role FROM users WHERE email = 'seu-email@exemplo.com';
```

2. Se role for 'user', atualize:
```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

---

### Problema: Erro ao salvar onboarding

**Causa:** Campos não foram adicionados ao banco

**Solução:**
```bash
npm run db:push
```

---

### Problema: Erro 401 (Unauthorized) no admin

**Causa:** Token não está sendo enviado ou expirou

**Solução:**
1. Faça logout e login novamente
2. Verifique no console do navegador se há erros

---

## ✅ Checklist Final de Teste

- [ ] Migrations aplicadas com sucesso
- [ ] Novo usuário redirecionado para onboarding
- [ ] Onboarding completo salva dados e redireciona
- [ ] Usuário não consegue acessar outras páginas sem onboarding
- [ ] Usuário consegue acessar após completar onboarding
- [ ] Usuário admin criado com sucesso
- [ ] Link Admin aparece no menu para admin
- [ ] Dashboard admin carrega e mostra métricas
- [ ] Página de usuários lista todos os usuários
- [ ] Busca de usuários funciona
- [ ] Edição de usuários funciona
- [ ] Página de jobs lista todos os jobs
- [ ] Filtro de jobs funciona
- [ ] Reprocessar job funciona (se houver job falhado)
- [ ] Usuário normal não consegue acessar `/admin`
- [ ] Usuário normal não vê link Admin

---

## 🎉 Sucesso!

Se todos os testes passarem, está tudo funcionando perfeitamente! 🚀

---

**Pronto para testar? Siga os passos acima!** 🧪

