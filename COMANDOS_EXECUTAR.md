# ⚡ COMANDOS PARA EXECUTAR - PASSO A PASSO

## 🎯 ORDEM DE EXECUÇÃO

### 1️⃣ INSTALAR MYSQL

**Escolha UMA das opções:**

#### Opção A: Docker (Mais Fácil) ⭐

```bash
# Se tiver Docker instalado:
docker run --name mysql-viral-clips \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  -e MYSQL_USER=viral_user \
  -e MYSQL_PASSWORD=viral_pass \
  -p 3306:3306 \
  -d mysql:8.0

# Aguardar 10 segundos
sleep 10

# Verificar se está rodando
docker ps | grep mysql
```

**Se usar Docker, o arquivo .env já está correto!** ✅

#### Opção B: Homebrew

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql

# Criar banco
mysql -u root -p -e "CREATE DATABASE viral_clips_ai;"
```

**Se usar Homebrew, ajuste o .env:**
```bash
# Edite .env e altere a senha:
# DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai
```

---

### 2️⃣ APLICAR MIGRATIONS (CRIAR TABELAS)

```bash
npm run db:push
```

**Resultado esperado:** ✅ Tabelas criadas com sucesso!

---

### 3️⃣ VERIFICAR SE FUNCIONOU

```bash
npm run db:studio
```

**Resultado esperado:** Abre uma página no navegador mostrando as tabelas! ✅

---

### 4️⃣ REINICIAR BACKEND

```bash
# Parar o backend atual (Ctrl+C no terminal onde está rodando)
# Depois iniciar:
npm run dev:server
```

**Resultado esperado:** Não deve mais aparecer erros `ECONNREFUSED`! ✅

---

### 5️⃣ ACESSAR O SITE

🌐 **Acesse:** http://localhost:3000

---

### 6️⃣ CRIAR SUA CONTA

1. Clique em **"Criar conta"** ou **"Registrar"**
2. Preencha:
   - Nome
   - Email
   - Senha (mínimo 8 caracteres)
3. Clique em **"Cadastrar"**

✅ Você receberá **3 créditos grátis**!

---

## 📋 CHECKLIST

- [ ] MySQL instalado e rodando
- [ ] Arquivo `.env` configurado
- [ ] `npm run db:push` executado com sucesso
- [ ] `npm run db:studio` abre no navegador
- [ ] Backend rodando sem erros `ECONNREFUSED`
- [ ] Frontend acessível em http://localhost:3000
- [ ] Conta criada com sucesso

---

## 🐛 SE DER ERRO

### Erro: "ECONNREFUSED"
```bash
# Verificar se MySQL está rodando
# Docker:
docker ps | grep mysql

# Homebrew:
brew services list | grep mysql

# Se não estiver, iniciar:
# Docker: docker start mysql-viral-clips
# Homebrew: brew services start mysql
```

### Erro: "Access denied"
```bash
# Verificar senha no .env
cat .env | grep DATABASE_URL

# Testar conexão manualmente
mysql -u root -p
```

### Erro: "Database doesn't exist"
```bash
# Criar banco manualmente
mysql -u root -p -e "CREATE DATABASE viral_clips_ai;"
```

---

**Execute os comandos na ordem acima! 🚀**

