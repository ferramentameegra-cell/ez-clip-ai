# ❌ ERRO: "Common Error" ao Criar Conta

## 🔍 O QUE ESTÁ ACONTECENDO?

Quando você tenta criar uma conta, aparece o erro **"Common Error"** porque:

**O MySQL não está instalado ou não está rodando no seu computador.**

O backend precisa do MySQL para salvar os dados dos usuários, mas ele não consegue conectar porque o MySQL não está disponível.

---

## ✅ SOLUÇÃO RÁPIDA

### **PASSO 1: Instalar Homebrew** (se ainda não tiver)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Aguarde terminar** (pode levar 5-10 minutos)

---

### **PASSO 2: Configurar Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

### **PASSO 3: Instalar MySQL**

```bash
brew install mysql
```

**Aguarde terminar** (pode levar alguns minutos)

---

### **PASSO 4: Iniciar MySQL**

```bash
brew services start mysql
```

---

### **PASSO 5: Criar o Banco de Dados**

```bash
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

---

### **PASSO 6: Aplicar as Tabelas (Migrations)**

```bash
npm run db:push
```

---

### **PASSO 7: Verificar se Funcionou**

```bash
npm run db:studio
```

Se abrir uma interface web, está funcionando! ✅

---

### **PASSO 8: Reiniciar o Backend**

Pare o backend (Ctrl+C) e inicie novamente:

```bash
npm run dev:server
```

---

## 🎉 DEPOIS DISSO

1. Acesse: **http://localhost:3000**
2. Clique em **"Criar conta"**
3. Preencha o formulário
4. ✅ **Funcionará!**

---

## 📝 RESUMO DOS COMANDOS (Copie e Cole)

```bash
# 1. Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Configurar Homebrew
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

## ❓ PRECISA DE AJUDA?

Se algum comando der erro, me avise qual foi o erro e eu te ajudo! 🚀

