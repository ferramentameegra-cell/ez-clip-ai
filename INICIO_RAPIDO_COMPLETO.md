# 🚀 INÍCIO RÁPIDO COMPLETO - Viral Clips AI

## ⚡ CONFIGURAÇÃO EM 5 MINUTOS

### 📋 PASSO 1: Instalar MySQL

**Escolha a opção mais fácil para você:**

#### 🐳 Opção A: Docker (Recomendado - Mais Fácil)

```bash
# 1. Instalar Docker Desktop (se não tiver)
# Baixe: https://www.docker.com/products/docker-desktop

# 2. Após instalar Docker, execute:
docker run --name mysql-viral-clips \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  -e MYSQL_USER=viral_user \
  -e MYSQL_PASSWORD=viral_pass \
  -p 3306:3306 \
  -d mysql:8.0

# 3. Aguardar MySQL iniciar (10 segundos)
sleep 10

# 4. Verificar se está rodando
docker ps | grep mysql
```

✅ **Se usar Docker, o arquivo `.env` já está configurado!** Não precisa alterar nada.

---

#### 🍺 Opção B: Homebrew (macOS)

```bash
# 1. Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar MySQL
brew install mysql

# 3. Iniciar MySQL
brew services start mysql

# 4. Criar banco de dados
mysql -u root -p -e "CREATE DATABASE viral_clips_ai;"
# Digite sua senha quando pedir
```

⚠️ **Se usar Homebrew, ajuste o arquivo `.env`:**
```bash
# Edite .env e altere a linha:
# DATABASE_URL=mysql://root:SUA_SENHA_AQUI@localhost:3306/viral_clips_ai
```

---

### 📋 PASSO 2: Aplicar Migrations (Criar Tabelas)

```bash
npm run db:push
```

**Resultado esperado:**
```
✓ Tables created successfully!
```

---

### 📋 PASSO 3: Verificar se Funcionou

```bash
npm run db:studio
```

**Resultado esperado:** Abre uma página no navegador mostrando as tabelas do banco! ✅

---

### 📋 PASSO 4: Reiniciar Backend

```bash
# Parar o backend atual (Ctrl+C)
# Depois iniciar novamente:
npm run dev:server
```

**Resultado esperado:** Não deve mais aparecer erros `ECONNREFUSED`! ✅

---

### 📋 PASSO 5: Acessar o Site

🌐 **Acesse:** http://localhost:3000

---

### 📋 PASSO 6: Criar Sua Conta

1. Na página inicial, clique em **"Criar conta"** ou **"Registrar"**
2. Preencha o formulário:
   - **Nome:** Seu nome
   - **Email:** seu@email.com
   - **Senha:** mínimo 8 caracteres
3. Clique em **"Cadastrar"**

✅ **Você receberá 3 créditos grátis automaticamente!**

---

## 🎯 RESUMO DOS COMANDOS

```bash
# 1. Instalar MySQL (escolha uma opção acima)

# 2. Aplicar migrations
npm run db:push

# 3. Verificar
npm run db:studio

# 4. Reiniciar backend
npm run dev:server

# 5. Acessar site
# http://localhost:3000
```

---

## ✅ CHECKLIST FINAL

- [ ] MySQL instalado e rodando
- [ ] Arquivo `.env` configurado (se necessário)
- [ ] `npm run db:push` executado com sucesso
- [ ] `npm run db:studio` abre no navegador
- [ ] Backend rodando sem erros
- [ ] Frontend acessível em http://localhost:3000
- [ ] Conta criada com sucesso

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "ECONNREFUSED"

**Problema:** MySQL não está rodando

**Solução:**
```bash
# Docker:
docker start mysql-viral-clips

# Homebrew:
brew services start mysql

# Verificar:
docker ps | grep mysql  # ou
brew services list | grep mysql
```

---

### ❌ Erro: "Access denied"

**Problema:** Senha incorreta no `.env`

**Solução:**
```bash
# Verificar .env
cat .env | grep DATABASE_URL

# Testar conexão manualmente
mysql -u root -p
# Se conectar, a senha está correta
```

---

### ❌ Erro: "Database doesn't exist"

**Problema:** Banco não foi criado

**Solução:**
```bash
# Criar banco manualmente
mysql -u root -p -e "CREATE DATABASE viral_clips_ai;"
```

---

### ❌ Erro: "npm: command not found"

**Problema:** Node.js não está instalado

**Solução:** Instale Node.js: https://nodejs.org/

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- `GUIA_COMPLETO_SETUP.md` - Guia detalhado
- `CONFIGURAR_BANCO_DADOS.md` - Configuração do banco
- `COMANDOS_EXECUTAR.md` - Lista de comandos
- `PROMPT_COMPLETO_100_PORCENTO.md` - Documentação completa

---

## 🎉 PRONTO!

Após seguir todos os passos:

1. ✅ Banco de dados configurado
2. ✅ Backend funcionando
3. ✅ Frontend acessível
4. ✅ Conta criada
5. ✅ 3 créditos grátis disponíveis

**Agora você pode começar a usar o sistema! 🚀**

---

## 📞 PRECISA DE AJUDA?

Se tiver algum problema, verifique:
1. MySQL está rodando?
2. Arquivo `.env` está correto?
3. Migrations foram aplicadas?
4. Backend está rodando sem erros?

**Boa sorte! 🎯**

