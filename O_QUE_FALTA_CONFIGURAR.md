# ⚙️ O QUE FALTA CONFIGURAR - EZ CLIP AI

## ✅ RESUMO

O **código está 100% pronto**, mas falta configurar alguns serviços externos no Railway.

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### 1. **FFmpeg no Railway** ⚠️

**O que é:** Biblioteca para processar vídeos (cortar, compor, adicionar legendas)

**Como configurar:**

**Opção A: Via Dockerfile** (Recomendado)
1. Criar arquivo `Dockerfile` na raiz do projeto:
```dockerfile
FROM node:20-slim

# Instalar FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Resto da configuração do projeto
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["npm", "start"]
```

**Opção B: Via buildpack no Railway**
- Railway detecta automaticamente Dockerfile
- Se não tiver, usar buildpack do Node.js + instalar FFmpeg manualmente

---

### 2. **API de Transcrição** ⚠️

**O que é:** Serviço para transcrever áudio em texto e gerar timestamps

**Como configurar:**

**Opção A: Manus Forge** (Recomendado)
1. Acessar: https://manusforge.com
2. Criar conta e obter API Key
3. No Railway → Variables → Adicionar:
   - `BUILT_IN_FORGE_API_KEY=seu_api_key_aqui`
   - `BUILT_IN_FORGE_API_URL=https://api.manusforge.com`

**Opção B: OpenAI Whisper**
1. Acessar: https://platform.openai.com
2. Criar conta e obter API Key
3. No Railway → Variables → Adicionar:
   - `OPENAI_API_KEY=sk-...`

**Status atual:**
- ❌ Nenhuma API configurada
- ⚠️ Sem isso, o sistema não consegue transcrever e decidir onde cortar

---

### 3. **AWS S3** ⚠️

**O que é:** Armazenamento na nuvem para salvar vídeos processados

**Como configurar:**

1. **Criar conta AWS**
   - Acessar: https://aws.amazon.com
   - Criar conta (se não tiver)

2. **Criar bucket S3**
   - Ir para: https://s3.console.aws.amazon.com
   - Criar bucket (ex: `ez-clip-ai-videos`)
   - Escolher região (ex: `us-east-1`)

3. **Criar usuário IAM com permissões S3**
   - Ir para: https://console.aws.amazon.com/iam
   - Criar usuário com "Programmatic access"
   - Anexar política `AmazonS3FullAccess` (ou criar política customizada)
   - Salvar `Access Key ID` e `Secret Access Key`

4. **Configurar no Railway → Variables:**
   - `AWS_ACCESS_KEY_ID=AKIA...`
   - `AWS_SECRET_ACCESS_KEY=...`
   - `AWS_S3_BUCKET=ez-clip-ai-videos`
   - `AWS_REGION=us-east-1`

**Status atual:**
- ❌ Não configurado
- ⚠️ Sem isso, vídeos processados não podem ser salvos

---

### 4. **Redis** ✅ (Provavelmente já configurado)

**O que é:** Fila de processamento para jobs assíncronos

**Como verificar:**
1. Railway → Project → Services
2. Verificar se existe serviço "Redis"
3. Se não existir, adicionar:
   - Railway → New Service → Add Redis
4. A variável `REDIS_URL` será configurada automaticamente

**Status atual:**
- ⚠️ Verificar se está configurado
- ✅ Se já existe serviço Redis no Railway, está OK

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Fase 1: Instalação de Dependências
- [ ] Criar `Dockerfile` com FFmpeg
- [ ] Configurar build no Railway para usar Dockerfile

### Fase 2: APIs Externas
- [ ] Criar conta Manus Forge OU OpenAI
- [ ] Obter API Key
- [ ] Adicionar variável no Railway (`BUILT_IN_FORGE_API_KEY` ou `OPENAI_API_KEY`)

### Fase 3: Armazenamento
- [ ] Criar conta AWS
- [ ] Criar bucket S3
- [ ] Criar usuário IAM com permissões S3
- [ ] Adicionar variáveis no Railway:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_S3_BUCKET`
  - [ ] `AWS_REGION`

### Fase 4: Verificação
- [ ] Verificar se Redis está configurado
- [ ] Verificar se `DATABASE_URL` está configurado
- [ ] Testar processamento de vídeo

---

## 🚀 DEPOIS DE CONFIGURAR

Quando tudo estiver configurado:

1. ✅ FFmpeg instalado → Vídeos podem ser cortados
2. ✅ API de transcrição → Sistema sabe onde cortar
3. ✅ AWS S3 → Vídeos podem ser salvos
4. ✅ Redis → Jobs podem ser processados

**Resultado:** Sistema funcionando 100%! 🎉

---

## 💰 CUSTOS ESTIMADOS

| Serviço | Custo Mensal Estimado |
|---------|----------------------|
| **Manus Forge** | ~$10-50 (depende do uso) |
| **OpenAI Whisper** | ~$0.006/minuto de áudio |
| **AWS S3** | ~$0.023/GB armazenado + $0.005/GB transferido |
| **Redis (Railway)** | Incluído no plano Railway |
| **Total** | ~$20-100/mês (depende do volume) |

---

## 📞 PRÓXIMOS PASSOS

1. **Configurar FFmpeg** (mais fácil, 5 minutos)
2. **Configurar API de transcrição** (15 minutos)
3. **Configurar AWS S3** (30 minutos)
4. **Testar processamento completo** (10 minutos)

**Total:** ~1 hora de configuração para ter tudo funcionando! 🚀
