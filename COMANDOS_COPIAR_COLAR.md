# 📋 COMANDOS PARA COPIAR E COLAR

## ⚠️ IMPORTANTE: MySQL não está instalado!

Você precisa instalar o MySQL primeiro. Escolha UMA das opções abaixo:

---

## 🎯 OPÇÃO 1: Instalar MySQL via Homebrew (Recomendado)

### Execute estes comandos UM A UM no terminal:

```bash
# 1. Instalar Homebrew (pode pedir sua senha de administrador)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Aguarde terminar (pode levar alguns minutos)**

```bash
# 2. Adicionar Homebrew ao PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

```bash
# 3. Instalar MySQL
brew install mysql
```

**Aguarde a instalação terminar**

```bash
# 4. Iniciar MySQL
brew services start mysql
```

```bash
# 5. Criar banco de dados
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

**Se pedir senha, pressione Enter (senha vazia)**

```bash
# 6. Ajustar arquivo .env (se MySQL tiver senha)
# Edite o arquivo .env e altere:
# DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai
# Se não tiver senha, não precisa alterar nada!
```

```bash
# 7. Aplicar migrations (criar tabelas)
npm run db:push
```

```bash
# 8. Verificar se funcionou
npm run db:studio
```

**Deve abrir uma página no navegador! ✅**

```bash
# 9. Reiniciar backend
npm run dev:server
```

**Não deve mais aparecer erros `ECONNREFUSED`! ✅**

```bash
# 10. Acessar o site
# Abra no navegador: http://localhost:3000
```

---

## 🎯 OPÇÃO 2: Baixar MySQL Manualmente

### Passo 1: Baixar MySQL

1. Acesse: https://dev.mysql.com/downloads/mysql/
2. Baixe o instalador para macOS (DMG)
3. Execute o instalador
4. **ANOTE A SENHA DO ROOT** que você configurou

### Passo 2: Criar banco de dados

```bash
mysql -u root -p
# Digite a senha que você configurou

# No prompt MySQL, execute:
CREATE DATABASE viral_clips_ai;
EXIT;
```

### Passo 3: Ajustar arquivo .env

Edite o arquivo `.env` e altere:

```env
DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai
```

### Passo 4: Aplicar migrations

```bash
npm run db:push
```

### Passo 5: Verificar

```bash
npm run db:studio
```

### Passo 6: Reiniciar backend

```bash
npm run dev:server
```

---

## ✅ APÓS INSTALAR MYSQL (QUALQUER OPÇÃO)

### Criar sua conta:

1. Acesse: **http://localhost:3000**
2. Clique em **"Criar conta"**
3. Preencha:
   - Nome
   - Email
   - Senha (mínimo 8 caracteres)
4. Clique em **"Cadastrar"**

✅ **Você receberá 3 créditos grátis!**

---

## 📝 RESUMO RÁPIDO

**Se usar Homebrew:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
npm run db:push
npm run db:studio
npm run dev:server
```

**Depois acesse:** http://localhost:3000

---

**Execute os comandos na ordem! 🚀**
