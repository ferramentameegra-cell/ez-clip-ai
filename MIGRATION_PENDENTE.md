# ⚠️ Migration Pendente

## ❌ Erro ao Executar Migration

O comando `npm run db:push` falhou porque o **MySQL não está instalado ou não está rodando**.

---

## ✅ Solução

### **1. Instalar MySQL** (se ainda não tiver)

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Configurar Homebrew
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql

# Criar banco de dados
mysql -u root -e "CREATE DATABASE viral_clips_ai;"
```

### **2. Verificar .env**

Certifique-se de que o arquivo `.env` tem a `DATABASE_URL` correta:

```bash
DATABASE_URL=mysql://root@localhost:3306/viral_clips_ai
```

### **3. Executar Migration**

Depois que o MySQL estiver rodando:

```bash
npm run db:push
```

---

## 📋 Campos que Serão Adicionados

A migration adicionará os seguintes campos à tabela `jobs`:

- `packageSize` (int) - Tamanho do pacote (5, 10, 50, 100)
- `targetDurationSec` (int) - Duração alvo por clipe
- `overlapSec` (varchar) - Overlap entre clipes (0.4-2.0s)
- `segmentationMode` (varchar) - Modo de segmentação (fixed, semantic, hybrid)
- `durationTolerance` (varchar) - Tolerância de duração (0.1 = 10%)

---

## ✅ Status da Implementação

- ✅ **Backend:** 100% completo
- ✅ **Frontend:** 100% completo
- ✅ **Schema:** Atualizado
- ⏳ **Migration:** Pendente (requer MySQL rodando)

---

## 🚀 Depois da Migration

Quando a migration for executada com sucesso, o sistema estará 100% funcional e pronto para processar pacotes sequenciais!

---

**Veja também:** `ERRO_MYSQL_SOLUCAO.md` para instruções detalhadas de instalação do MySQL.

