# 🚀 Guia Simples: Como Finalizar o Viral Clips AI no Cursor

## Para Quem Não É Programador

Este guia vai te ensinar a finalizar o projeto **sem precisar programar**. Basta copiar e colar os comandos!

---

## 📋 O Que Você Vai Fazer

Você vai adicionar 3 coisas no site:

1. **Seletor de Nicho** - Dropdown para escolher Política, Futebol, Séries, etc
2. **Galeria de Vídeos** - Mostrar vídeos de retenção do nicho escolhido
3. **Upload de Vídeos** - Permitir usuário fazer upload dos próprios vídeos

**Tempo estimado:** 30-60 minutos (a IA faz tudo sozinha!)

---

## 🛠️ Passo 1: Baixar o Código

### 1.1. Baixar o ZIP do projeto

Clique no link do checkpoint que eu te enviei:
```
manus-webdev://2873d643
```

Vai abrir uma página. Clique em **"Download Código"** ou **"Baixar ZIP"**.

### 1.2. Extrair o ZIP

- **Windows:** Clique com botão direito → "Extrair Tudo"
- **Mac:** Clique duas vezes no arquivo ZIP

Vai criar uma pasta chamada `viral-clips-ai`.

---

## 🖥️ Passo 2: Instalar o Cursor

### 2.1. Baixar o Cursor

Acesse: **https://cursor.sh/**

Clique em **"Download"** e instale.

### 2.2. Abrir o projeto no Cursor

1. Abra o Cursor
2. Clique em **"File" → "Open Folder"**
3. Selecione a pasta `viral-clips-ai` que você extraiu
4. Clique em **"Abrir"**

---

## 🤖 Passo 3: Deixar a IA Fazer Tudo

### 3.1. Abrir o Chat da IA

No Cursor, pressione:
- **Windows/Linux:** `Ctrl + L`
- **Mac:** `Cmd + L`

Vai abrir uma caixa de chat na lateral direita.

### 3.2. Copiar e Colar o Prompt Mágico

**COPIE TUDO ABAIXO** e cole no chat do Cursor:

```
Olá! Preciso finalizar a implementação do sistema de verticais nichados.

Contexto: Este projeto já tem 70% implementado. O backend está pronto (schema, routers, APIs). Falta apenas criar os componentes frontend.

TAREFAS A FAZER:

1. CRIAR SELETOR DE VERTICAL NO FORMULÁRIO
   - Adicionar dropdown "Escolha o Nicho" no formulário Home.tsx
   - Opções: Política, Futebol, Séries/Filmes, Comédia, Religião, Profissões, Novelas, Programas TV
   - Mostrar apenas quando "Vídeo de Retenção" estiver ativado
   - Salvar seleção no estado do formulário

2. CRIAR GALERIA DE VÍDEOS DE RETENÇÃO POR VERTICAL
   - Quando usuário selecionar um vertical, buscar vídeos via trpc.retention.list({ vertical })
   - Mostrar grid de vídeos com thumbnails
   - Permitir seleção de 1 vídeo
   - Atualizar preview quando vídeo for selecionado

3. CRIAR COMPONENTE DE UPLOAD DE VÍDEOS DO USUÁRIO
   - Criar página "Meus Vídeos de Retenção" acessível pelo menu
   - Permitir upload de vídeo (máx 100MB)
   - Mostrar lista de vídeos do usuário
   - Permitir deletar vídeos
   - Usar trpc.userContent.uploadRetentionVideo e trpc.userContent.listRetentionVideos

4. ADICIONAR OPÇÃO "USAR EMOJI 3D" NO FORMULÁRIO
   - Adicionar radio button para escolher entre:
     * Vídeos da Plataforma
     * Meus Vídeos
     * Emojis 3D
   - Se escolher "Emojis 3D", mostrar galeria de emojis via trpc.userContent.listGenericEmojis

IMPORTANTE:
- Use os componentes shadcn/ui que já existem (Button, Card, Select, etc)
- Siga o padrão visual do projeto (cores, espaçamento)
- Teste cada funcionalidade depois de implementar
- O backend JÁ ESTÁ PRONTO, só precisa conectar o frontend

Arquivos importantes para consultar:
- shared/verticais.ts (configuração dos verticais)
- server/routers/userContentRouter.ts (APIs prontas)
- client/src/pages/Home.tsx (formulário principal)

Pode começar? Implemente uma tarefa por vez e me avise quando terminar cada uma.
```

### 3.3. Pressionar Enter

A IA vai começar a trabalhar sozinha! Ela vai:
1. Ler o código existente
2. Criar os componentes novos
3. Integrar com o backend
4. Testar se funciona

**Você não precisa fazer NADA!** Só esperar.

---

## ⏱️ Passo 4: Acompanhar o Progresso

A IA vai te mostrar o que está fazendo:

```
✅ Criando seletor de vertical...
✅ Adicionando dropdown no formulário...
✅ Conectando com API de vídeos...
✅ Criando galeria de vídeos...
```

**Se a IA perguntar algo**, responda com "Sim" ou "Continue".

**Se der erro**, a IA vai tentar consertar sozinha. Se não conseguir, ela vai te avisar.

---

## 🧪 Passo 5: Testar o Site

### 5.1. Iniciar o servidor

No Cursor, abra o **Terminal** (menu "Terminal" → "New Terminal") e digite:

```bash
pnpm install
pnpm dev
```

Vai aparecer:
```
Server running on http://localhost:3000/
```

### 5.2. Abrir no navegador

Abra o Chrome e acesse:
```
http://localhost:3000
```

### 5.3. Testar as funcionalidades

1. **Testar Seletor de Nicho:**
   - Ative "Vídeo de Retenção"
   - Veja se aparece dropdown "Escolha o Nicho"
   - Selecione "Futebol"
   - Veja se aparecem vídeos de futebol

2. **Testar Upload:**
   - Clique em "Meus Vídeos" no menu
   - Faça upload de um vídeo pequeno (teste)
   - Veja se aparece na lista

3. **Testar Emojis:**
   - No formulário, escolha "Emojis 3D"
   - Veja se aparecem os emojis animados

---

## 🐛 Se Algo Der Errado

### Erro: "Comando não encontrado"

**Solução:** Instale o Node.js primeiro
- Acesse: https://nodejs.org/
- Baixe e instale a versão LTS
- Feche e abra o Cursor novamente
- Tente de novo

### Erro: "Porta 3000 já está em uso"

**Solução:** Mude a porta
```bash
PORT=3001 pnpm dev
```

Depois acesse: `http://localhost:3001`

### Erro: "Database not available"

**Solução:** Configure o banco de dados
1. Crie conta no Railway: https://railway.app
2. Crie um banco MySQL
3. Copie a URL de conexão
4. Crie arquivo `.env` na raiz do projeto:
```
DATABASE_URL="mysql://usuario:senha@host:porta/database"
```

### A IA não está fazendo nada

**Solução:** Cole o prompt novamente
- Aperte `Ctrl + L` (ou `Cmd + L`)
- Cole o prompt de novo
- Adicione: "Por favor, continue de onde parou"

---

## 📞 Precisa de Ajuda?

Se nada funcionar, você tem 3 opções:

### Opção 1: Perguntar para a IA do Cursor
```
"Estou tendo o erro [copie o erro aqui]. Como resolver?"
```

### Opção 2: Contratar um desenvolvedor freelancer
- **Upwork:** https://upwork.com
- **Fiverr:** https://fiverr.com
- Busque por: "React + TypeScript developer"
- Mostre este guia e o código
- Tempo estimado: 2-4 horas
- Custo: R$ 200-400

### Opção 3: Usar o Claude/ChatGPT
1. Acesse: https://claude.ai ou https://chat.openai.com
2. Cole o conteúdo do arquivo `PROMPT_COMPLETO_CURSOR.md`
3. Pergunte: "Como implementar [funcionalidade X]?"

---

## ✅ Checklist Final

Antes de considerar pronto, verifique:

- [ ] Dropdown de nicho aparece no formulário
- [ ] Galeria de vídeos filtra por nicho
- [ ] Página "Meus Vídeos" funciona
- [ ] Upload de vídeo funciona
- [ ] Galeria de emojis 3D aparece
- [ ] Preview atualiza quando seleciona vídeo
- [ ] Não tem erros no console do navegador (F12)

---

## 🎉 Pronto!

Se tudo funcionou, você tem um sistema completo de verticais nichados!

**Próximo passo:** Fazer deploy no Railway (veja `RAILWAY_DEPLOY_GUIDE.md`)

---

## 💡 Dicas Extras

### Dica 1: Salve Sempre
O Cursor salva automaticamente, mas é bom pressionar `Ctrl + S` de vez em quando.

### Dica 2: Use o Git
Se algo quebrar, você pode voltar atrás:
```bash
git status
git checkout .
```

### Dica 3: Leia os Erros
Quando der erro, leia a mensagem. Geralmente ela diz o que está errado.

### Dica 4: Teste Pequeno
Não teste tudo de uma vez. Teste cada funcionalidade separadamente.

---

**Boa sorte! 🚀**
