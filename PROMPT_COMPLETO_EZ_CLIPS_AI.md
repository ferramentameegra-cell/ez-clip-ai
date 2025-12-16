# 🚀 PROMPT COMPLETO - EZ CLIPS AI

## 📋 VISÃO GERAL

**EZ Clips AI** (anteriormente Viral Clips AI) é uma plataforma SaaS completa que transforma vídeos longos do YouTube em séries sequenciais virais para TikTok, YouTube Shorts, Instagram Reels e Facebook Reels.

### 🎯 Diferencial Único (CRÍTICO)

**NÃO somos como OpusClip ou Vizard.** Eles criam **highlights independentes**. Nós criamos **partes cronológicas sequenciais** que exploram o hack do algoritmo do TikTok:

#### O Hack do Algoritmo:

1. Usuário vê **PARTE 1/50** de um vídeo
2. Busca ativamente por **PARTE 2/50**
3. TikTok detecta engajamento ativo (busca + tempo de tela)
4. Algoritmo **prioriza e empurra** automaticamente PARTE 2, 3, 4...
5. Todas as partes viralizam em **efeito cascata**

**Resultado:** 1 vídeo de 50min = 50 clipes de 1min = **50x-100x mais views totais**

**SEMPRE que implementar features de corte/edição, lembre-se:** são partes SEQUENCIAIS CRONOLÓGICAS, não highlights.

---

## 🏗️ STACK TECNOLÓGICO

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express 5
- **API**: tRPC 11 (type-safe, end-to-end)
- **Database**: MySQL (via Railway)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: JWT (bcryptjs)
- **Queue**: Bull (Redis via Railway)
- **Logging**: Winston

### Processamento de Vídeo
- **Download**: @distube/ytdl-core (YouTube)
- **Transcrição**: Whisper Large v3 (via Manus Forge API ou OpenAI)
- **Processamento**: FFmpeg (fluent-ffmpeg)
- **Formato**: MP4, H.264, AAC, 9:16 (vertical - 1080x1920px)

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **State**: React Query (via tRPC)
- **i18n**: react-i18next (PT-BR por padrão)

### APIs Externas
- **YouTube Data API v3**: Publicação de Shorts
- **TikTok API**: Publicação de vídeos
- **Instagram Graph API**: Publicação de Reels
- **Facebook Graph API**: Publicação de Reels
- **Stripe**: Pagamentos e assinaturas

---

## 📁 ESTRUTURA DE PASTAS

```
viral-clips-ai/                    # PASTA MÃE
├── client/                        # Frontend React
│   ├── src/
│   │   ├── pages/                # Páginas da aplicação
│   │   │   ├── Home.tsx          # Landing page + formulário
│   │   │   ├── Login.tsx         # Login/Registro
│   │   │   ├── Signup.tsx        # Cadastro
│   │   │   ├── Dashboard.tsx     # Dashboard do usuário
│   │   │   └── ...
│   │   ├── components/           # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   └── ui/               # Componentes shadcn/ui
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilitários (trpc, i18n)
│   │   ├── locales/              # Traduções (pt-BR.json)
│   │   └── contexts/             # Contextos (Theme)
│   └── public/
│
├── server/                        # Backend Node.js
│   ├── _core/                    # Framework core
│   │   ├── index.ts              # Servidor Express + tRPC
│   │   ├── router.ts             # Router principal
│   │   └── trpc.ts               # Setup tRPC
│   ├── routers/                  # tRPC routers
│   │   ├── auth.ts               # Autenticação
│   │   ├── video.ts              # Processamento de vídeo
│   │   ├── userContent.ts        # Conteúdo do usuário
│   │   ├── schedule.ts           # Agendamento
│   │   ├── payment.ts            # Stripe
│   │   ├── onboarding.ts         # Onboarding
│   │   └── admin.ts              # Admin
│   ├── lib/                      # Biblioteca
│   │   ├── jobQueue.ts           # Bull/Redis queue
│   │   ├── logger.ts             # Winston logger
│   │   ├── stripe.ts             # Stripe client
│   │   └── ...
│   ├── middleware/               # Middlewares
│   │   └── rateLimit.ts          # Rate limiting
│   ├── webhooks/                 # Webhooks
│   │   └── stripe.ts             # Stripe webhooks
│   ├── youtubeDownloader.ts      # Download YouTube
│   ├── transcription.ts          # Transcrição Whisper
│   ├── videoProcessor.ts         # FFmpeg processing
│   ├── jobProcessor.ts           # Orquestração de jobs
│   ├── creditsManager.ts         # Sistema de créditos
│   ├── storage.ts                # Cloudflare R2
│   └── ...
│
├── drizzle/                      # Database schema
│   └── schema.ts                 # Tabelas e tipos
│
├── shared/                       # Código compartilhado
│   ├── types.ts                  # TypeScript types
│   ├── nichos.ts                 # 20 nichos de conteúdo
│   └── headlines.ts              # Headlines virais
│
├── scripts/                      # Scripts utilitários
│   └── ...
│
└── prompts/                      # Prompts de IA
    └── ...
```

---

## 🗄️ SCHEMA DO BANCO DE DADOS

### Tabelas Principais

**users**
- `id`: int (PK)
- `email`: varchar(255) (unique)
- `name`: varchar(255)
- `passwordHash`: varchar(255)
- `role`: enum('user', 'admin')
- `credits`: int (default: 0)
- `acceptedTerms`: boolean
- `acceptedTermsAt`: timestamp
- `language`: enum('pt-BR', 'es', 'en')
- `onboardingUseCase`: text
- `onboardingNiche`: varchar(255)
- `onboardingAt`: timestamp
- `stripeCustomerId`: varchar(256) (unique)
- `createdAt`, `updatedAt`, `lastSignedIn`

**jobs**
- `id`: int (PK)
- `userId`: int (FK → users)
- `sourceUrl`: text (YouTube URL)
- `startTime`: int (tempo início - opcional, para trim)
- `endTime`: int (tempo fim - opcional, para trim)
- `status`: enum('pending', 'downloading', 'transcribing', 'cutting', 'rendering', 'completed', 'failed')
- `packageSize`: int (5, 10, 50, 100)
- `targetDurationSec`: int
- `overlapSec`: varchar(10)
- `segmentationMode`: varchar(20) ('fixed', 'semantic', 'hybrid')
- `durationTolerance`: varchar(10)
- `clipDuration`: int (legado)
- `withSubtitles`: boolean
- `withRetention`: boolean
- `vertical`: varchar(50)
- `secondaryContentType`: varchar(50)
- `secondaryContentId`: int
- `headline`: varchar(100)
- `layoutType`: enum('side-by-side', 'top-bottom')
- `totalClips`: int
- `progress`: int (0-100)
- `errorMessage`: text
- `createdAt`, `updatedAt`

**clips**
- `id`: int (PK)
- `jobId`: int (FK → jobs)
- `clipNumber`: int (1, 2, 3...)
- `videoKey`: varchar(255) (R2 key)
- `videoUrl`: text (R2 URL)
- `thumbnailKey`: varchar(255)
- `thumbnailUrl`: text
- `startTime`: int (segundos)
- `endTime`: int (segundos)
- `duration`: int
- `retentionScore`: int (0-100)
- `transcriptionText`: text
- `createdAt`

**subscriptions** (Stripe)
- `id`: int (PK)
- `userId`: int (FK → users)
- `stripeCustomerId`: varchar(256)
- `stripeSubscriptionId`: varchar(256) (unique)
- `priceId`: varchar(256)
- `planKey`: varchar(256) ('starter', 'creator', 'pro')
- `billingInterval`: varchar(256) ('month', 'year')
- `status`: varchar(256)
- `currentPeriodStart`: timestamp
- `currentPeriodEnd`: timestamp
- `cancelAtPeriodEnd`: boolean
- `createdAt`, `updatedAt`

**creditLedgers** (Stripe)
- `id`: int (PK)
- `userId`: int (FK → users)
- `delta`: int (positivo ou negativo)
- `reason`: varchar(256)
- `meta`: JSON
- `createdAt`

**retentionVideos**
- `id`: int (PK)
- `userId`: int (FK → users, nullable - null = vídeo da plataforma)
- `vertical`: varchar(50)
- `name`: varchar(255)
- `videoKey`: varchar(255)
- `videoUrl`: text
- `duration`: int
- `isActive`: boolean
- `createdAt`

**genericEmojis**
- `id`: int (PK)
- `name`: varchar(255)
- `emoji`: varchar(10)
- `videoKey`: varchar(255)
- `videoUrl`: text
- `category`: varchar(50)
- `isActive`: boolean
- `createdAt`

**scheduledPosts**
- `id`: int (PK)
- `clipId`: int (FK → clips)
- `userId`: int (FK → users)
- `platform`: enum('youtube', 'tiktok', 'instagram', 'facebook')
- `scheduledTime`: timestamp
- `status`: enum('pending', 'published', 'failed', 'cancelled')
- `platformPostId`: varchar(255)
- `errorMessage`: text
- `publishedAt`: timestamp
- `createdAt`, `updatedAt`

---

## 🎨 LAYOUT DO VÍDEO FINAL

### Dimensões: 1080x1920px (9:16 vertical)

```
┌─────────────────────────────────┐
│ Top Safe Zone: 0-200px          │ ← Logo TikTok/Instagram
├─────────────────────────────────┤
│ Vídeo Principal: 200-900px      │ ← 700px (36.46%)
├─────────────────────────────────┤
│ Headline: 900-940px             │ ← 40px (2.08%)
├─────────────────────────────────┤
│ Vídeo Retenção: 940-1620px      │ ← 680px (35.42%)
├─────────────────────────────────┤
│ Legendas: 1620-1720px           │ ← 100px (5.21%) - VISÍVEL
├─────────────────────────────────┤
│ Bottom Safe Zone: 1720-1920px   │ ← 200px (10.42%) - Botões
└─────────────────────────────────┘
```

**Formato de Vídeo:**
- Resolução: 1080x1920px
- Codec: H.264 (libx264)
- Preset: ultrafast (otimizado para velocidade)
- CRF: 30 (qualidade vs velocidade)
- Áudio: AAC 64kbps
- FPS: 30
- Duração: 30-180 segundos (configurável)

---

## 🔄 FLUXO DE PROCESSAMENTO

### 1. Usuário Submete Job

```typescript
// client/src/pages/Home.tsx
const createJob = trpc.video.create.useMutation({
  onSuccess: (data) => {
    router.push(`/dashboard`);
  }
});

createJob.mutate({
  youtubeUrl: "https://youtube.com/watch?v=...",
  startTime: 60,        // Opcional: trim início
  endTime: 1200,        // Opcional: trim fim
  packageSize: "10",    // 5, 10, 50, 100
  withSubtitles: true,
  vertical: "Podcasts",
  secondaryContentType: "platform",
  headline: "Como Ganhar R$ 10k/mês",
  layoutType: "top-bottom"
});
```

### 2. Backend Processa (Assíncrono via Bull Queue)

```typescript
// server/routers/video.ts
create: protectedProcedure
  .mutation(async ({ ctx, input }) => {
    // 1. Verificar créditos (admins nunca pagam)
    const hasCredits = await hasEnoughCredits(ctx.user.id, creditsNeeded);
    
    // 2. Criar job no banco
    const job = await db.insert(jobs).values({ ... });
    
    // 3. Adicionar à fila Bull
    await videoQueue.add('processVideo', { jobId, ... });
    
    return { jobId };
  });
```

### 3. Worker Processa Job

```typescript
// server/jobProcessor.ts
async function processVideoJob(jobId: number) {
  // 1. Download do YouTube (com trim se startTime/endTime)
  const { videoPath, audioPath } = await downloadYouTubeVideo(
    youtubeUrl,
    '/tmp/viral-clips',
    startTime,
    endTime
  );
  
  // 2. Transcrição com Whisper
  const transcription = await transcribeAudio(audioPath, 'pt');
  
  // 3. Divisão em clipes sequenciais (CRÍTICO: cronológico)
  const clips = splitIntoSequentialClipsWithOverlap(
    transcription,
    packageSize,
    targetDurationSec,
    overlapSec,
    mode
  );
  
  // 4. Processar cada clipe
  for (const clip of clips) {
    // 4a. Cortar vídeo
    const clipped = await cutVideo(videoPath, clip.start, clip.end);
    
    // 4b. Adicionar legendas (se solicitado)
    if (withSubtitles) {
      await addSubtitles(clipped, transcription, clip.start, clip.end);
    }
    
    // 4c. Compor com vídeo de retenção (se solicitado)
    if (withRetention) {
      const retentionVideo = await getRetentionVideo(vertical);
      await composeVideos(clipped, retentionVideo, layoutType, headline);
    }
    
    // 4d. Upload para R2
    const { videoKey, videoUrl } = await storagePut(clipped);
    
    // 4e. Calcular score de retenção
    const score = calculateRetentionScore(transcription, clip, vertical);
    
    // 4f. Salvar no banco
    await db.insert(clips).values({ ... });
  }
  
  // 5. Consumir créditos (admins não pagam)
  await decrementUserCredits(userId, clips.length);
}
```

### 4. Corte Sequencial (CRÍTICO - NÃO Highlights)

```typescript
// server/transcription.ts
function splitIntoSequentialClipsWithOverlap(
  transcription: Transcription,
  packageSize: PackageSize,
  targetDuration: number,
  overlapSec: number,
  mode: 'fixed' | 'semantic' | 'hybrid'
): ClipSegment[] {
  // Exemplo: vídeo de 150s, clips de 60s, overlap 2s
  // Resultado:
  // PARTE 1/3: 0s-60s
  // PARTE 2/3: 58s-118s (overlap 2s)
  // PARTE 3/3: 116s-150s (overlap 2s)
  
  // SEMPRE sequencial cronológico, NUNCA highlights!
}
```

---

## 💳 SISTEMA DE CRÉDITOS E ADMINISTRADORES

### Créditos

- Usuários novos recebem créditos iniciais (configurável)
- Cada clipe processado consome 1 crédito
- Administradores **NUNCA** pagam créditos (créditos ilimitados)

### Emails de Administradores (Configurado)

```typescript
// server/creditsManager.ts
const ADMIN_EMAILS = [
  'daniel.braun@hotmail.com',
  'josyasborba@hotmail.com',
];

// Admins têm:
// - Créditos ilimitados (não pagam)
// - 10.000 créditos disponíveis (para exibição)
```

---

## 🎯 SISTEMA DE PACOTES

### Pacotes Disponíveis

| Pacote | Clipes | Duração Alvo | Overlap | Custo |
|--------|--------|--------------|---------|-------|
| **5**  | 5      | 60s          | 2s      | 1 crédito |
| **10** | 10     | 60s          | 2s      | 1 crédito |
| **50** | 50     | 60s          | 2s      | 1 crédito |
| **100**| 100    | 60s          | 2s      | 1 crédito |

### Modos de Segmentação

1. **fixed**: Cortes fixos por duração (padrão)
2. **semantic**: Cortes em momentos semânticos (IA)
3. **hybrid**: Combinação de fixed + semantic

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

### JWT Authentication

```typescript
// server/auth.ts
- Hash de senha: bcrypt (10 rounds)
- Token JWT: expira em 7 dias
- Verificação: middleware `protectedProcedure`
```

### Rate Limiting

```typescript
// server/middleware/rateLimit.ts
- Global: 100 requests / 15 minutos
- Job Creation: 10 jobs / hora
- Upload: 5 uploads / hora
- Auth: 5 tentativas / 15 minutos
```

### Admin Protection

```typescript
// server/routers/admin.ts
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Verificar role === 'admin'
  // Rejeitar se não for admin
});
```

---

## 💰 INTEGRAÇÃO STRIPE

### Planos

| Plano | Créditos/mês | Preço Mensal | Preço Anual |
|-------|--------------|--------------|-------------|
| **Starter** | 10 | R$ 29 | R$ 299 |
| **Creator** | 50 | R$ 79 | R$ 799 |
| **Pro** | 200 | R$ 199 | R$ 1.999 |

### Webhooks

- `customer.subscription.created` - Criar subscription
- `customer.subscription.updated` - Atualizar subscription
- `invoice.payment_succeeded` - Adicionar créditos
- `customer.subscription.deleted` - Cancelar subscription

---

## 🌍 INTERNACIONALIZAÇÃO (i18n)

### Idiomas Suportados

- **pt-BR** (padrão)
- **es** (Espanhol)
- **en** (Inglês)

### Arquivos de Tradução

```typescript
// client/src/locales/pt-BR.json
{
  "common": { ... },
  "home": {
    "title": "Multiplique Suas Views por 50x-100x",
    "subtitle": "Transforme 1 vídeo em uma série viral sequencial"
  },
  "dashboard": { ... },
  "login": { ... },
  ...
}
```

---

## 🎨 DESIGN SYSTEM

### Cores

```typescript
// client/src/tokens/colors.ts
- Primary: Indigo (#6366F1)
- Secondary: Purple (#8B5CF6)
- Accent: Pink (#EC4899)
- Grays: Slate scale
- Semantic: Success, Error, Warning, Info
```

### Componentes UI

- shadcn/ui components
- Dark mode support
- Responsive design
- Acessibilidade (a11y)

---

## 🚀 DEPLOY E INFRAESTRUTURA

### Railway

- **Backend**: Node.js 22
- **Database**: MySQL (Railway)
- **Redis**: Redis (Railway)
- **Storage**: Cloudflare R2
- **Deploy**: Automático via GitHub

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=mysql://...

# Redis
REDIS_URL=redis://...
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASSWORD=...

# Cloudflare R2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=auto
AWS_S3_BUCKET=...
AWS_S3_ENDPOINT=...

# OpenAI / Manus Forge
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=...
OPENAI_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# JWT
JWT_SECRET=...

# Frontend
FRONTEND_URL=...
NEXT_PUBLIC_APP_URL=...
```

---

## 📝 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Core (100%)

- [x] Download YouTube
- [x] Transcrição Whisper
- [x] Corte sequencial cronológico
- [x] Legendas estilizadas
- [x] Vídeos de retenção
- [x] Composição vertical
- [x] Sistema de créditos
- [x] Integração Stripe
- [x] Upload R2
- [x] Download ZIP
- [x] Score de retenção
- [x] Onboarding
- [x] Admin panel
- [x] Rate limiting
- [x] Logging (Winston)

### 🚧 Em Progresso

- [ ] Agendamento automático completo
- [ ] Preview de thumbnails
- [ ] Publicação automática (OAuth)
- [ ] Analytics dashboard

### 📋 Backlog

- [ ] A/B testing
- [ ] Detecção de melhor horário (IA)
- [ ] Edição de transcrição inline
- [ ] Diarização de falantes
- [ ] API pública

---

## 🎯 NICHOS (VERTICAIS)

### 20 Nichos Disponíveis

1. **Política** (🗳️)
2. **Futebol** (⚽)
3. **Séries/Filmes** (🎬)
4. **Comédia** (😂)
5. **Religião** (🙏)
6. **Profissões** (💼)
7. **Novelas** (📺)
8. **Programas TV** (📡)
9. **Saúde** (🏥)
10. **Bem-estar** (🧘)
11. **Qualidade de vida** (✨)
12. **Educação** (📚)
13. ... e mais

---

## 🐛 OTIMIZAÇÕES DE VELOCIDADE

### Download YouTube

- Cache de `ytdl.getInfo` (5 minutos)
- Qualidade mínima (360p-480p)
- Buffer reduzido (8MB)

### FFmpeg

- Preset: `ultrafast`
- CRF: 30 (tradeoff qualidade/velocidade)
- Áudio: 64kbps
- Threads: 0 (todos os cores)
- Tune: `fastdecode`

### Redis

- `maxRetriesPerRequest: null` (sem limite)
- Conexão dedicada para Bull
- Conexão dedicada para ytdl

---

## 📚 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev              # Frontend
npm run dev:server       # Backend
npm run dev:all          # Ambos

# Build
npm run build            # Build produção

# Database
npm run db:push          # Aplicar migrations
npm run db:studio        # Drizzle Studio

# Deploy
git push origin main     # Deploy automático Railway
railway up               # Deploy manual
railway logs             # Ver logs
```

---

## 🎯 LEMBRE-SE SEMPRE

1. **Cortes são SEQUENCIAIS, não highlights**
2. **Numeração PARTE X/Y é obrigatória**
3. **Hack do algoritmo é o diferencial único**
4. **Administradores nunca pagam créditos**
5. **Multi-plataforma desde o início**
6. **Velocidade de entrega é fundamental**

---

## 📞 INFORMAÇÕES DO PROJETO

- **Repositório**: https://github.com/ferramentameegra-cell/ez-clip-ai.git
- **Deploy**: Railway
- **Storage**: Cloudflare R2
- **Nome do Projeto**: **EZ CLIP AI** (não "Viral Clips AI")

---

**Este é o prompt completo de todo o projeto EZ CLIPS AI! 🚀**

Para continuar desenvolvendo, use este prompt como referência completa do sistema.


