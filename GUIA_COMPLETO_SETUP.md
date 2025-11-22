# 🚀 GUIA COMPLETO - Configuração do Banco de Dados

## 📋 PASSO A PASSO COMPLETO

### ✅ PASSO 1: Verificar Node.js

```bash
node --version
# Deve mostrar: v22.x ou superior
```

Se não tiver Node.js, instale: https://nodejs.org/

---

### ✅ PASSO 2: Instalar MySQL

#### Opção A: MySQL via Homebrew (macOS)

```bash
# 1. Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar MySQL
brew install mysql

# 3. Iniciar MySQL
brew services start mysql

# 4. Verificar se está rodando
brew services list | grep mysql
# Deve mostrar: mysql started
```

#### Opção B: MySQL via Docker (Mais Fácil)

```bash
# 1. Instalar Docker Desktop
# Baixe de: https://www.docker.com/products/docker-desktop

# 2. Após instalar, execute:
docker run --name mysql-viral-clips \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  -e MYSQL_USER=viral_user \
  -e MYSQL_PASSWORD=viral_pass \
  -p 3306:3306 \
  -d mysql:8.0

# 3. Verificar se está rodando
docker ps | grep mysql
```

#### Opção C: MySQL via Instalador Oficial

1. Baixe: https://dev.mysql.com/downloads/mysql/
2. Instale seguindo o assistente
3. Anote a senha do root que você configurou

---

### ✅ PASSO 3: Configurar Arquivo .env

O arquivo `.env` já foi criado! Agora você precisa ajustar a senha:

**Se instalou via Homebrew ou Instalador Oficial:**

Edite o arquivo `.env` e altere:

```env
DATABASE_URL=mysql://root:SUA_SENHA_ROOT@localhost:3306/viral_clips_ai
```

**Se instalou via Docker:**

O arquivo `.env` já está configurado corretamente! Não precisa alterar nada.

---

### ✅ PASSO 4: Criar Banco de Dados

**Se instalou via Homebrew ou Instalador Oficial:**

```bash
# Conectar ao MySQL
mysql -u root -p
# Digite sua senha quando pedir

# No prompt MySQL, execute:
CREATE DATABASE IF NOT EXISTS viral_clips_ai;
EXIT;
```

**Se instalou via Docker:**

O banco já foi criado automaticamente! Pule para o próximo passo.

---

### ✅ PASSO 5: Aplicar Migrations (Criar Tabelas)

```bash
npm run db:push
```

Isso criará todas as tabelas necessárias no banco.

---

### ✅ PASSO 6: Verificar se Funcionou

```bash
# Abrir Drizzle Studio (interface visual do banco)
npm run db:studio
```

Se abrir uma página no navegador, está tudo OK! ✅

---

### ✅ PASSO 7: Reiniciar Backend

```bash
# Parar o backend atual (Ctrl+C)
# Depois iniciar novamente:
npm run dev:server
```

Agora não deve mais aparecer erros `ECONNREFUSED`!

---

### ✅ PASSO 8: Criar Sua Conta

1. Acesse: **http://localhost:3000**
2. Vá para a página de **Login**
3. Clique em **"Criar conta"** ou **"Registrar"**
4. Preencha:
   - **Nome:** Seu nome
   - **Email:** seu@email.com
   - **Senha:** mínimo 8 caracteres
5. Clique em **"Cadastrar"**

✅ Você receberá **3 créditos grátis** automaticamente!

---

## 🎯 RESUMO RÁPIDO

```bash
# 1. Instalar MySQL (escolha uma opção acima)

# 2. Ajustar .env (se necessário)

# 3. Criar banco (se não usou Docker)
mysql -u root -p
CREATE DATABASE viral_clips_ai;
EXIT;

# 4. Aplicar migrations
npm run db:push

# 5. Verificar
npm run db:studio

# 6. Reiniciar backend
npm run dev:server

# 7. Acessar site
# http://localhost:3000
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "mysql: command not found"
- MySQL não está instalado
- Instale seguindo o PASSO 2

### Erro: "ECONNREFUSED"
- MySQL não está rodando
- **Homebrew:** `brew services start mysql`
- **Docker:** `docker start mysql-viral-clips`
- **Instalador:** Verifique se o serviço MySQL está rodando

### Erro: "Access denied"
- Senha incorreta no `.env`
- Verifique a senha do MySQL

### Erro: "Database doesn't exist"
- Banco não foi criado
- Execute: `CREATE DATABASE viral_clips_ai;`

### Erro: "npm: command not found"
- Node.js não está instalado
- Instale: https://nodejs.org/

---

## 📞 PRÓXIMOS PASSOS

Após configurar o banco:

1. ✅ Backend rodando sem erros
2. ✅ Frontend acessível em http://localhost:3000
3. ✅ Criar sua conta
4. ✅ Começar a usar o sistema!

---

**Precisa de ajuda em algum passo específico? Me avise! 🚀**

