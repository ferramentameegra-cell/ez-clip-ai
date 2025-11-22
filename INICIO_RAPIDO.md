# 🚀 INÍCIO RÁPIDO - Viral Clips AI

## ⚡ Configuração em 3 Passos

### 1️⃣ Instalar e Configurar Banco de Dados

**Opção A: Usando Docker (Recomendado - Mais Fácil)**

```bash
# Executar script de setup
./setup-database.sh
```

**Opção B: Manual**

Siga o guia completo: `CONFIGURAR_BANCO_DADOS.md`

---

### 2️⃣ Iniciar Servidores

```bash
# Rodar frontend e backend juntos
npm run dev:all

# Ou separado:
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev
```

---

### 3️⃣ Acessar o Site

🌐 **Frontend:** http://localhost:3000

🔧 **Backend:** http://localhost:3001

---

## 📝 Criar Conta

1. Acesse: http://localhost:3000
2. Clique em "Criar conta" ou "Registrar"
3. Preencha:
   - Nome
   - Email
   - Senha (mínimo 8 caracteres)
4. Clique em "Cadastrar"

✅ Você receberá **3 créditos grátis** ao se cadastrar!

---

## 🐛 Problemas?

### Erro: "ECONNREFUSED"
- MySQL não está rodando
- Execute: `./setup-database.sh` novamente

### Erro: "Database doesn't exist"
- Execute: `npm run db:push`

### Frontend não carrega
- Verifique se está rodando: `npm run dev`
- Verifique a porta no terminal

---

## 📚 Documentação Completa

- `CONFIGURAR_BANCO_DADOS.md` - Guia completo de configuração
- `PROMPT_COMPLETO_100_PORCENTO.md` - Documentação completa do projeto
- `INSTALACAO_E_CONFIGURACAO.md` - Guia de instalação detalhado

---

**Pronto para começar! 🎉**

