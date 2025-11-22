# 🚀 Passo a Passo SUPER SIMPLES - Enviar para GitHub

## ⚠️ IMPORTANTE

Eu não consigo acessar seu GitHub diretamente, mas preparei **TUDO** para você. Só precisa copiar e colar os comandos abaixo!

---

## 📋 PASSO 1: Criar Repositório no GitHub

### 1.1: Acessar GitHub

1. Abra seu navegador
2. Vá em: **https://github.com/new**
3. Faça login (se não estiver logado)

### 1.2: Criar Repositório

1. **Nome do repositório:** Digite `ez-clip-ai`
2. **Descrição:** (opcional) "EZ CLIP AI - Plataforma de processamento de vídeos"
3. Deixe **Privado** ou **Público** (sua escolha)
4. **NÃO marque** nenhuma opção (não marque README, .gitignore, etc)
5. Clique no botão verde **"Create repository"**

**✅ Pronto!** Anote o nome do repositório que você criou.

---

## 📋 PASSO 2: Preparar Código Localmente

### 2.1: Abrir Terminal

**No Mac:**
- Pressione `Cmd + Espaço`
- Digite "Terminal"
- Pressione Enter

**No Windows:**
- Pressione `Windows + R`
- Digite `cmd`
- Pressione Enter

### 2.2: Ir até a Pasta do Projeto

Cole este comando e pressione Enter:

```bash
cd Downloads/viral-clips-ai
```

### 2.3: Inicializar Git (se ainda não fez)

Cole este comando e pressione Enter:

```bash
git init
```

### 2.4: Adicionar Todos os Arquivos

Cole este comando e pressione Enter:

```bash
git add .
```

### 2.5: Fazer Primeiro Commit

Cole este comando e pressione Enter:

```bash
git commit -m "Initial commit - EZ CLIP AI"
```

### 2.6: Renomear Branch para "main"

Cole este comando e pressione Enter:

```bash
git branch -M main
```

---

## 📋 PASSO 3: Conectar ao GitHub

### 3.1: Adicionar Repositório Remoto

**⚠️ IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

**Exemplo:** Se seu usuário é `joaosilva`, o comando seria:
```bash
git remote add origin https://github.com/joaosilva/ez-clip-ai.git
```

**Cole o comando acima com SEU usuário e pressione Enter.**

### 3.2: Enviar Código para GitHub

Cole este comando e pressione Enter:

```bash
git push -u origin main
```

**Se pedir login:**
- **Usuário:** Seu nome de usuário do GitHub
- **Senha:** Use um **Personal Access Token** (veja abaixo como criar)

---

## 🔑 PASSO 4: Criar Personal Access Token (Se Pedir Senha)

Se o GitHub pedir senha, você precisa criar um token:

### 4.1: Criar Token

1. Acesse: **https://github.com/settings/tokens**
2. Clique em **"Generate new token" → "Generate new token (classic)"**
3. Dê um nome: `EZ CLIP AI`
4. Marque a opção **"repo"** (todas as permissões de repositório)
5. Role até o final e clique em **"Generate token"**
6. **COPIE O TOKEN** (você só verá ele uma vez!)

### 4.2: Usar o Token

Quando pedir senha no terminal:
- **Usuário:** Seu nome de usuário do GitHub
- **Senha:** Cole o token que você copiou (não sua senha normal!)

---

## ✅ PRONTO!

Se aparecer algo como:
```
Enumerating objects: X, done.
Writing objects: 100% (X/X), done.
```

**Parabéns! Seu código está no GitHub!** 🎉

---

## 🆘 SE DER ERRO

### Erro: "remote origin already exists"

Cole este comando:
```bash
git remote remove origin
```

Depois cole novamente o comando do Passo 3.1.

### Erro: "authentication failed"

1. Crie um Personal Access Token (Passo 4)
2. Use o token como senha (não sua senha normal)

### Erro: "fatal: not a git repository"

Você não está na pasta certa. Cole:
```bash
cd Downloads/viral-clips-ai
```

E tente novamente.

### Erro: "nothing to commit"

Isso significa que já está tudo commitado. Pule para o Passo 3.

---

## 📝 RESUMO DOS COMANDOS (Copiar e Colar)

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub!**

```bash
cd Downloads/viral-clips-ai
git init
git add .
git commit -m "Initial commit - EZ CLIP AI"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git
git push -u origin main
```

**Pronto! É só isso!** 🚀

