# 🗄️ CONFIGURAR BANCO DE DADOS - PASSO A PASSO

## 📋 PASSO 1: INSTALAR MYSQL

### macOS (usando Homebrew):

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql

# Verificar se está rodando
brew services list | grep mysql
```

### Alternativa: MySQL via Docker (mais fácil)

```bash
# Instalar Docker Desktop (se não tiver)
# Baixe de: https://www.docker.com/products/docker-desktop

# Rodar MySQL em container
docker run --name mysql-viral-clips \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  -e MYSQL_USER=viral_user \
  -e MYSQL_PASSWORD=viral_pass \
  -p 3306:3306 \
  -d mysql:8.0

# Verificar se está rodando
docker ps | grep mysql
```

---

## 📋 PASSO 2: CRIAR ARQUIVO .env

Crie o arquivo `.env` na raiz do projeto com estas configurações:

### Se instalou MySQL via Homebrew:

```env
# Banco de Dados (ajuste user e password conforme sua instalação)
DATABASE_URL=mysql://root:SUA_SENHA_ROOT@localhost:3306/viral_clips_ai

# JWT (gere uma chave aleatória)
JWT_SECRET=viral-clips-secret-key-change-in-production-2024

# Manus Forge API (Whisper) - OPCIONAL por enquanto
BUILT_IN_FORGE_API_KEY=
BUILT_IN_FORGE_API_URL=https://api.manus.im

# S3 Storage - OPCIONAL por enquanto
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips

# OAuth APIs - OPCIONAL
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

# Stripe - OPCIONAL por enquanto
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Se instalou MySQL via Docker:

```env
# Banco de Dados (usando as credenciais do Docker)
DATABASE_URL=mysql://viral_user:viral_pass@localhost:3306/viral_clips_ai

# JWT
JWT_SECRET=viral-clips-secret-key-change-in-production-2024

# ... resto igual acima
```

---

## 📋 PASSO 3: CRIAR BANCO DE DADOS

### Se instalou MySQL via Homebrew:

```bash
# Conectar ao MySQL (pode pedir senha)
mysql -u root -p

# No prompt do MySQL, execute:
CREATE DATABASE viral_clips_ai;
EXIT;
```

### Se instalou MySQL via Docker:

O banco já foi criado automaticamente! Pule para o próximo passo.

---

## 📋 PASSO 4: APLICAR MIGRATIONS

```bash
# Aplicar schema do banco
npm run db:push
```

Isso criará todas as tabelas necessárias.

---

## 📋 PASSO 5: VERIFICAR CONEXÃO

```bash
# Testar conexão
npm run db:studio
```

Isso abrirá o Drizzle Studio no navegador. Se abrir, está tudo OK!

---

## 📋 PASSO 6: CRIAR USUÁRIO DE TESTE (OPCIONAL)

Você pode criar um usuário diretamente no banco:

```bash
# Conectar ao MySQL
mysql -u root -p viral_clips_ai

# Criar usuário (senha: "senha123")
# Primeiro, gere o hash da senha usando Node.js:
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('senha123', 10).then(h => console.log(h))"
```

Depois, use o hash gerado:

```sql
INSERT INTO users (email, password_hash, name, login_method, credits, accepted_terms, accepted_terms_at, language, role)
VALUES (
  'teste@exemplo.com',
  'HASH_GERADO_AQUI', -- Cole o hash gerado acima
  'Usuário Teste',
  'email',
  3,
  true,
  NOW(),
  'pt-BR',
  'user'
);
```

---

## ✅ VERIFICAÇÃO FINAL

1. ✅ MySQL instalado e rodando
2. ✅ Arquivo `.env` criado
3. ✅ Banco `viral_clips_ai` criado
4. ✅ Migrations aplicadas (`npm run db:push`)
5. ✅ Backend consegue conectar (sem erros `ECONNREFUSED`)

---

## 🚀 PRÓXIMOS PASSOS

1. Reinicie o backend: `npm run dev:server`
2. Acesse: http://localhost:3000
3. Crie sua conta na página de login
4. Faça login e comece a usar!

---

## 🐛 PROBLEMAS COMUNS

### Erro: "ECONNREFUSED"
- MySQL não está rodando
- Verifique: `brew services list` ou `docker ps`
- Inicie: `brew services start mysql` ou `docker start mysql-viral-clips`

### Erro: "Access denied"
- Senha incorreta no `.env`
- Verifique a senha do MySQL

### Erro: "Database doesn't exist"
- Banco não foi criado
- Execute: `CREATE DATABASE viral_clips_ai;`

---

**Pronto! Agora você pode usar o sistema! 🎉**

