# 📋 Comandos para Copiar e Colar - GitHub

## Passo 1: Preparar Git (Se ainda não fez)

Abra o Terminal (Mac) ou Prompt de Comando (Windows) e cole os comandos abaixo, um por vez:

```bash
cd Downloads/viral-clips-ai
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit - EZ CLIP AI"
```

```bash
git branch -M main
```

## Passo 2: Conectar ao GitHub

**⚠️ IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

Exemplo: Se seu usuário é `joaosilva`, use:
```bash
git remote add origin https://github.com/joaosilva/ez-clip-ai.git
```

Se você ainda não criou o repositório no GitHub:
1. Acesse: https://github.com/new
2. Nome: `ez-clip-ai`
3. Clique em "Create repository"
4. Depois cole o comando acima (com seu usuário)

## Passo 3: Enviar Código

```bash
git push -u origin main
```

Se pedir login, use seu usuário e senha do GitHub.

**Pronto!** Seu código está no GitHub! ✅

---

## 🆘 Se Der Erro

### Erro: "remote origin already exists"
```bash
git remote remove origin
```
Depois cole novamente o comando do Passo 2.

### Erro: "authentication failed"
1. Vá em: https://github.com/settings/tokens
2. Clique em "Generate new token"
3. Marque "repo"
4. Copie o token
5. Use o token como senha quando pedir

