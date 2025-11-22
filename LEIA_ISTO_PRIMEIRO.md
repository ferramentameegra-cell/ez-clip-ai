# ⚡ LEIA ISTO PRIMEIRO - Resumo Rápido

## 🎯 SITUAÇÃO ATUAL

- ✅ Node.js instalado
- ✅ Arquivo `.env` criado  
- ✅ Scripts configurados
- ❌ **MySQL NÃO está instalado** (por isso os erros `ECONNREFUSED`)

---

## 🚀 SOLUÇÃO: Instalar MySQL

### **OPÇÃO 1: Homebrew (Mais Fácil)**

Execute estes comandos **UM A UM** no terminal:

```bash
# 1. Instalar Homebrew (pode pedir sua senha)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Aguarde terminar (pode levar 5-10 minutos)**

```bash
# 2. Adicionar ao PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

```bash
# 3. Instalar MySQL
brew install mysql
```

**Aguarde terminar**

```bash
# 4. Iniciar MySQL
brew services start mysql
```

```bash
# 5. Criar banco
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

```bash
# 6. Aplicar migrations
npm run db:push
```

```bash
# 7. Verificar
npm run db:studio
```

```bash
# 8. Reiniciar backend
npm run dev:server
```

---

### **OPÇÃO 2: Download Manual**

1. Baixe: https://dev.mysql.com/downloads/mysql/
2. Instale o DMG
3. Anote a senha do root
4. Execute os passos 5-8 acima
5. Ajuste o `.env` com a senha

---

## ✅ DEPOIS DE INSTALAR MYSQL

1. Acesse: **http://localhost:3000**
2. Clique em **"Criar conta"**
3. Preencha o formulário
4. ✅ **3 créditos grátis!**

---

## 📝 RESUMO DOS COMANDOS

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

---

**Execute os comandos na ordem! 🚀**

