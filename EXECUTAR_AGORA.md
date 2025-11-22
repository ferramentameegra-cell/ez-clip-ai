# ⚡ EXECUTAR AGORA - COMANDOS UM A UM

## 🎯 SITUAÇÃO ATUAL

- ✅ Node.js instalado (v22.20.0)
- ✅ Arquivo `.env` criado
- ✅ Scripts configurados
- ❌ MySQL não instalado

---

## 📋 COMANDOS PARA EXECUTAR (UM A UM)

### PASSO 1: Instalar Homebrew (se não tiver)

**Execute no terminal:**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Aguarde terminar (pode pedir sua senha de administrador)**

---

### PASSO 2: Adicionar Homebrew ao PATH

**Execute:**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

### PASSO 3: Instalar MySQL

**Execute:**

```bash
brew install mysql
```

**Aguarde a instalação terminar**

---

### PASSO 4: Iniciar MySQL

**Execute:**

```bash
brew services start mysql
```

---

### PASSO 5: Criar Banco de Dados

**Execute:**

```bash
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

**Se pedir senha, pressione Enter (senha vazia)**

---

### PASSO 6: Ajustar Arquivo .env (se necessário)

**Se o MySQL tiver senha, edite o arquivo `.env`:**

```bash
# Abra o arquivo .env e altere a linha:
# DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai
```

**Se não tiver senha, o arquivo já está correto!**

---

### PASSO 7: Aplicar Migrations

**Execute:**

```bash
npm run db:push
```

**Resultado esperado:** ✅ Tabelas criadas!

---

### PASSO 8: Verificar

**Execute:**

```bash
npm run db:studio
```

**Resultado esperado:** Abre página no navegador! ✅

---

### PASSO 9: Reiniciar Backend

**Execute:**

```bash
npm run dev:server
```

**Resultado esperado:** Sem erros `ECONNREFUSED`! ✅

---

### PASSO 10: Acessar Site

🌐 **Acesse:** http://localhost:3000

---

### PASSO 11: Criar Conta

1. Clique em "Criar conta"
2. Preencha o formulário
3. Clique em "Cadastrar"

✅ **3 créditos grátis!**

---

## 🚨 ALTERNATIVA: Se não conseguir instalar Homebrew

### Opção: Baixar MySQL Manualmente

1. Acesse: https://dev.mysql.com/downloads/mysql/
2. Baixe o instalador para macOS
3. Instale seguindo o assistente
4. Anote a senha do root
5. Execute os passos 5-11 acima

---

## 📝 RESUMO DOS COMANDOS

```bash
# 1. Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Adicionar ao PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 3. Instalar MySQL
brew install mysql

# 4. Iniciar MySQL
brew services start mysql

# 5. Criar banco
mysql -u root -e "CREATE DATABASE viral_clips_ai;"

# 6. Aplicar migrations
npm run db:push

# 7. Verificar
npm run db:studio

# 8. Reiniciar backend
npm run dev:server
```

---

**Execute os comandos na ordem acima! 🚀**

