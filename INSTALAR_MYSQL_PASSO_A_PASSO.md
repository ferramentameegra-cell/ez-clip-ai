# 📦 INSTALAR MYSQL - PASSO A PASSO

## 🎯 OPÇÃO 1: MySQL via Homebrew (Recomendado para macOS)

### Passo 1: Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Aguarde a instalação terminar (pode levar alguns minutos)**

### Passo 2: Adicionar Homebrew ao PATH (se necessário)

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Passo 3: Instalar MySQL

```bash
brew install mysql
```

### Passo 4: Iniciar MySQL

```bash
brew services start mysql
```

### Passo 5: Criar banco de dados

```bash
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

**Se pedir senha, pressione Enter (senha vazia) ou use a senha que você configurou**

### Passo 6: Ajustar arquivo .env

Edite o arquivo `.env` e altere:

```env
DATABASE_URL=mysql://root:@localhost:3306/viral_clips_ai
```

(Se tiver senha, use: `mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai`)

---

## 🎯 OPÇÃO 2: MySQL via Instalador Oficial

### Passo 1: Baixar MySQL

Acesse: https://dev.mysql.com/downloads/mysql/

Baixe a versão para macOS (DMG)

### Passo 2: Instalar

1. Abra o arquivo DMG baixado
2. Execute o instalador
3. Siga o assistente de instalação
4. **ANOTE A SENHA DO ROOT** que você configurou

### Passo 3: Criar banco de dados

```bash
mysql -u root -p
# Digite a senha que você configurou

# No prompt MySQL:
CREATE DATABASE viral_clips_ai;
EXIT;
```

### Passo 4: Ajustar arquivo .env

Edite o arquivo `.env` e altere:

```env
DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai
```

---

## 🎯 OPÇÃO 3: MySQL via Docker (Se instalar Docker depois)

### Passo 1: Instalar Docker Desktop

Baixe: https://www.docker.com/products/docker-desktop

### Passo 2: Após instalar, execute:

```bash
docker run --name mysql-viral-clips \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=viral_clips_ai \
  -e MYSQL_USER=viral_user \
  -e MYSQL_PASSWORD=viral_pass \
  -p 3306:3306 \
  -d mysql:8.0
```

**Se usar Docker, o arquivo `.env` já está configurado!** ✅

---

## ✅ APÓS INSTALAR MYSQL (QUALQUER OPÇÃO)

### 1. Aplicar Migrations

```bash
npm run db:push
```

### 2. Verificar

```bash
npm run db:studio
```

### 3. Reiniciar Backend

```bash
npm run dev:server
```

---

**Escolha uma opção e me avise qual você prefere! 🚀**

