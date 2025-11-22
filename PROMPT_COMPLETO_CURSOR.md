# 🤖 Prompt Completo para Cursor - Viral Clips AI

## 📋 Contexto do Projeto

Você é um desenvolvedor sênior trabalhando no **Viral Clips AI**, uma plataforma SaaS que transforma vídeos longos do YouTube em séries sequenciais virais para TikTok, YouTube Shorts, Instagram Reels e Facebook Reels.

---

## 🎯 Diferencial Único (CRÍTICO - Leia com Atenção)

**NÃO somos como OpusClip ou Vizard.** Eles criam **highlights independentes**. Nós criamos **partes cronológicas sequenciais** que exploram o hack do algoritmo do TikTok:

### O Hack do Algoritmo

1. Usuário vê **PARTE 1/50** de um vídeo
2. Busca ativamente por **PARTE 2/50**
3. TikTok detecta engajamento ativo (busca + tempo de tela)
4. Algoritmo **prioriza e empurra** automaticamente PARTE 2, 3, 4...
5. Todas as partes viralizam em **efeito cascata**

**Resultado:** 1 vídeo de 50min = 50 clipes de 1min = **50x-100x mais views totais**

**SEMPRE que implementar features de corte/edição, lembre-se:** são partes SEQUENCIAIS CRONOLÓGICAS, não highlights.

---

## 🏗️ Stack Técnico

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express 4
- **API**: tRPC 11 (type-safe, end-to-end)
- **Database**: MySQL (TiDB) via Drizzle ORM
- **Storage**: S3 (AWS-compatible)
- **Auth**: Manus OAuth (já configurado)

### Processamento de Vídeo
- **Download**: @distube/ytdl-core (YouTube)
- **Transcrição**: Whisper Large v3 (via Manus Forge API)
- **Processamento**: FFmpeg (corte, legendas, composição)
- **Formato**: MP4, H.264, AAC, 9:16 (vertical)

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **State**: React Query (via tRPC)
- **i18n**: react-i18next (PT/ES/EN)

### APIs Externas
- **YouTube Data API v3**: Publicação de Shorts
- **TikTok API**: Publicação de vídeos
- **Instagram Graph API**: Publicação de Reels
- **Facebook Graph API**: Publicação de Reels

---

## 📁 Estrutura de Pastas

```
viral-clips-ai/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários (trpc, i18n)
│   │   ├── hooks/            # Custom hooks
│   │   └── locales/          # Traduções (pt-BR, es, en)
│   └── public/               # Assets estáticos
├── server/                    # Backend Node.js
│   ├── _core/                # Framework (não editar)
│   ├── routers/              # tRPC routers por feature
│   ├── db.ts                 # Query helpers
│   ├── storage.ts            # S3 helpers
│   ├── videoDownloader.ts    # Download YouTube
│   ├── transcription.ts      # Whisper integration
│   ├── videoProcessor.ts     # FFmpeg processing
│   ├── socialPublisher.ts    # Publicação multi-plataforma
│   └── retentionScorer.ts    # Score de retenção (IA)
├── drizzle/                   # Database schema
│   └── schema.ts             # Tabelas e tipos
├── shared/                    # Código compartilhado
│   ├── types.ts              # TypeScript types
│   ├── nichos.ts             # 20 nichos de conteúdo
│   └── headlines.ts          # Headlines virais por nicho
└── docs/                      # Documentação
```

---

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

**users**
- `id`: int (PK)
- `openId`: varchar(64) (Manus OAuth)
- `name`, `email`, `loginMethod`
- `role`: enum('user', 'admin')
- `credits`: int (créditos de processamento)
- `acceptedTerms`: boolean (aceite de termos)
- `acceptedTermsAt`: timestamp
- `language`: enum('pt-BR', 'es', 'en')
- `createdAt`, `updatedAt`, `lastSignedIn`

**jobs**
- `id`: int (PK)
- `userId`: int (FK → users)
- `youtubeUrl`: text (URL do vídeo original)
- `status`: enum('pending', 'processing', 'completed', 'failed')
- `clipDuration`: int (duração dos clipes em segundos)
- `withCaptions`: boolean
- `withRetentionVideo`: boolean
- `nicho`: varchar(50) (nicho selecionado)
- `headline`: varchar(100) (headline opcional)
- `layoutType`: enum('side-by-side', 'top-bottom', 'bottom-top')
- `totalClips`: int (número total de clipes gerados)
- `progress`: int (0-100)
- `errorMessage`: text
- `createdAt`, `updatedAt`

**clips**
- `id`: int (PK)
- `jobId`: int (FK → jobs)
- `clipNumber`: int (1, 2, 3...)
- `s3Url`: text (URL do clipe no S3)
- `s3Key`: text (chave S3)
- `duration`: int (duração em segundos)
- `retentionScore`: int (0-100, score preditivo)
- `transcription`: text (transcrição do clipe)
- `createdAt`

**retentionVideos**
- `id`: int (PK)
- `userId`: int (FK → users)
- `nicho`: varchar(50)
- `s3Url`: text
- `s3Key`: text
- `duration`: int
- `isActive`: boolean
- `createdAt`

**scheduledPosts**
- `id`: int (PK)
- `clipId`: int (FK → clips)
- `userId`: int (FK → users)
- `platform`: enum('tiktok', 'youtube', 'instagram', 'facebook')
- `scheduledFor`: timestamp (data/hora agendada)
- `status`: enum('pending', 'published', 'failed', 'cancelled')
- `platformPostId`: varchar(255) (ID do post na plataforma)
- `errorMessage`: text
- `publishedAt`: timestamp
- `createdAt`, `updatedAt`

**socialAccounts**
- `id`: int (PK)
- `userId`: int (FK → users)
- `platform`: enum('tiktok', 'youtube', 'instagram', 'facebook')
- `accessToken`: text (criptografado)
- `refreshToken`: text (criptografado)
- `expiresAt`: timestamp
- `platformUserId`: varchar(255)
- `platformUsername`: varchar(255)
- `isActive`: boolean
- `createdAt`, `updatedAt`

---

## 🔄 Fluxo de Processamento

### 1. Usuário Submete Job

```typescript
// client/src/pages/Home.tsx
const createJob = trpc.video.create.useMutation({
  onSuccess: (data) => {
    router.push(`/job/${data.jobId}`);
  }
});

createJob.mutate({
  youtubeUrl: "https://youtube.com/watch?v=...",
  clipDuration: 60, // segundos
  withCaptions: true,
  withRetentionVideo: true,
  nicho: "Podcasts",
  headline: "Como Ganhar R$ 10k/mês",
  layoutType: "side-by-side"
});
```

### 2. Backend Processa (Assíncrono)

```typescript
// server/routers/videoRouter.ts
create: protectedProcedure
  .input(z.object({ ... }))
  .mutation(async ({ ctx, input }) => {
    // 1. Verificar créditos
    if (ctx.user.credits <= 0) throw new Error("Sem créditos");
    
    // 2. Criar job no banco
    const job = await db.insert(jobs).values({ ... });
    
    // 3. Processar em background (não bloquear)
    processJobAsync(job.id);
    
    // 4. Decrementar créditos
    await db.update(users)
      .set({ credits: ctx.user.credits - 1 })
      .where(eq(users.id, ctx.user.id));
    
    return { jobId: job.id };
  });
```

### 3. Processamento Assíncrono

```typescript
// server/jobProcessor.ts
async function processJobAsync(jobId: number) {
  try {
    // 1. Download do YouTube
    updateProgress(jobId, 10, "Baixando vídeo...");
    const videoPath = await downloadYouTubeVideo(youtubeUrl);
    
    // 2. Extração de áudio
    updateProgress(jobId, 20, "Extraindo áudio...");
    const audioPath = await extractAudio(videoPath);
    
    // 3. Transcrição com Whisper
    updateProgress(jobId, 30, "Transcrevendo...");
    const transcription = await transcribeAudio(audioPath);
    
    // 4. Corte sequencial (CRÍTICO: cronológico, não highlights)
    updateProgress(jobId, 40, "Cortando em partes...");
    const segments = splitVideoSequentially(
      videoDuration,
      clipDuration
    );
    
    // 5. Para cada segmento
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // 5a. Cortar vídeo
      const clippedVideo = await cutVideo(
        videoPath,
        segment.start,
        segment.end
      );
      
      // 5b. Adicionar legendas (se solicitado)
      if (withCaptions) {
        const subtitles = generateSubtitles(
          transcription,
          segment.start,
          segment.end
        );
        await addSubtitles(clippedVideo, subtitles);
      }
      
      // 5c. Compor com vídeo de retenção (se solicitado)
      if (withRetentionVideo) {
        const retentionVideo = await getRandomRetentionVideo(nicho);
        await composeVideos(
          clippedVideo,
          retentionVideo,
          layoutType,
          headline
        );
      }
      
      // 5d. Upload para S3
      const s3Url = await uploadToS3(clippedVideo);
      
      // 5e. Calcular score de retenção
      const score = calculateRetentionScore(
        transcription,
        clipDuration,
        nicho
      );
      
      // 5f. Salvar clip no banco
      await db.insert(clips).values({
        jobId,
        clipNumber: i + 1,
        s3Url,
        duration: clipDuration,
        retentionScore: score,
        transcription: subtitles
      });
      
      updateProgress(jobId, 40 + (i / segments.length) * 50);
    }
    
    // 6. Marcar como completo
    updateProgress(jobId, 100, "Concluído!");
    await db.update(jobs)
      .set({ status: 'completed' })
      .where(eq(jobs.id, jobId));
      
  } catch (error) {
    await db.update(jobs)
      .set({ 
        status: 'failed',
        errorMessage: error.message 
      })
      .where(eq(jobs.id, jobId));
  }
}
```

### 4. Corte Sequencial (CRÍTICO)

```typescript
// server/videoProcessor.ts
function splitVideoSequentially(
  videoDuration: number,
  clipDuration: number
): Segment[] {
  const segments: Segment[] = [];
  let currentTime = 0;
  
  while (currentTime < videoDuration) {
    const endTime = Math.min(
      currentTime + clipDuration,
      videoDuration
    );
    
    segments.push({
      start: currentTime,
      end: endTime,
      partNumber: segments.length + 1,
      totalParts: Math.ceil(videoDuration / clipDuration)
    });
    
    currentTime = endTime;
  }
  
  return segments;
}

// Exemplo: vídeo de 150s, clips de 60s
// Resultado:
// PARTE 1/3: 0s-60s
// PARTE 2/3: 60s-120s
// PARTE 3/3: 120s-150s
```

### 5. Composição com Vídeo de Retenção

```typescript
// server/videoProcessor.ts
async function composeVideos(
  mainVideo: string,
  retentionVideo: string,
  layoutType: string,
  headline?: string
) {
  let filterComplex = '';
  
  if (layoutType === 'side-by-side') {
    // Vídeo principal esquerda | Vídeo retenção direita
    filterComplex = `
      [0:v]scale=540:1920,crop=540:1920:0:0[main];
      [1:v]scale=540:1920,crop=540:1920:0:0[retention];
      [main][retention]hstack=inputs=2[composed];
    `;
  } else if (layoutType === 'top-bottom') {
    // Vídeo principal em cima | Vídeo retenção embaixo
    filterComplex = `
      [0:v]scale=1080:960,crop=1080:960:0:0[main];
      [1:v]scale=1080:960,crop=1080:960:0:0[retention];
      [main][retention]vstack=inputs=2[composed];
    `;
  }
  
  // Adicionar headline (se fornecida)
  if (headline) {
    filterComplex += `
      [composed]drawtext=
        text='${headline}':
        fontsize=48:
        fontcolor=white:
        borderw=3:
        bordercolor=black:
        x=(w-text_w)/2:
        y=(h-text_h)/2[final];
    `;
  }
  
  await ffmpeg
    .input(mainVideo)
    .input(retentionVideo)
    .complexFilter(filterComplex)
    .output(outputPath)
    .run();
}
```

---

## 🌍 Sistema Multilíngue (i18n)

### Configuração

```typescript
// client/src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from '@/locales/pt-BR.json';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'es': { translation: es },
      'en': { translation: en }
    },
    lng: localStorage.getItem('language') || 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false }
  });

export default i18n;
```

### Uso no Frontend

```typescript
// client/src/pages/Home.tsx
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
      <Button>{t('home.startButton')}</Button>
    </div>
  );
}
```

### Arquivos de Tradução

```json
// client/src/locales/pt-BR.json
{
  "home": {
    "title": "Multiplique Suas Views por 50x-100x",
    "description": "Transforme 1 vídeo em uma série viral sequencial",
    "startButton": "Começar Grátis"
  },
  "form": {
    "youtubeUrl": "Link do YouTube",
    "clipDuration": "Duração dos Clipes",
    "nicho": "Nicho do Conteúdo",
    "headline": "Headline (Opcional)",
    "submit": "Dividir em Partes"
  }
}

// client/src/locales/es.json
{
  "home": {
    "title": "Multiplica Tus Views por 50x-100x",
    "description": "Transforma 1 video en una serie viral secuencial",
    "startButton": "Comenzar Gratis"
  }
}

// client/src/locales/en.json
{
  "home": {
    "title": "Multiply Your Views by 50x-100x",
    "description": "Transform 1 video into a viral sequential series",
    "startButton": "Start Free"
  }
}
```

---

## 📅 Sistema de Agendamento

### Interface de Agendamento

```typescript
// client/src/pages/JobView.tsx
function ScheduleModal({ clips }: { clips: Clip[] }) {
  const [interval, setInterval] = useState(24); // horas
  const [startDate, setStartDate] = useState(new Date());
  const [platforms, setPlatforms] = useState({
    tiktok: true,
    youtube: true,
    instagram: true,
    facebook: false
  });
  
  const scheduleAll = trpc.schedule.createBulk.useMutation();
  
  const handleSchedule = () => {
    const schedule = clips.map((clip, index) => ({
      clipId: clip.id,
      platforms: Object.keys(platforms).filter(p => platforms[p]),
      scheduledFor: addHours(startDate, interval * index)
    }));
    
    scheduleAll.mutate(schedule);
  };
  
  return (
    <Dialog>
      <DialogContent>
        <h2>Agendar Publicação Automática</h2>
        
        <Label>Intervalo entre posts</Label>
        <Select value={interval} onChange={setInterval}>
          <option value={12}>12 horas</option>
          <option value={24}>24 horas (1 por dia)</option>
          <option value={48}>48 horas (dia sim, dia não)</option>
        </Select>
        
        <Label>Data/hora do primeiro post</Label>
        <DateTimePicker value={startDate} onChange={setStartDate} />
        
        <Label>Plataformas</Label>
        <Checkbox checked={platforms.tiktok} onChange={...}>
          TikTok
        </Checkbox>
        <Checkbox checked={platforms.youtube} onChange={...}>
          YouTube Shorts
        </Checkbox>
        <Checkbox checked={platforms.instagram} onChange={...}>
          Instagram Reels
        </Checkbox>
        <Checkbox checked={platforms.facebook} onChange={...}>
          Facebook Reels
        </Checkbox>
        
        <Button onClick={handleSchedule}>
          Agendar {clips.length} Posts
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

### Backend de Agendamento

```typescript
// server/routers/scheduleRouter.ts
export const scheduleRouter = router({
  createBulk: protectedProcedure
    .input(z.array(z.object({
      clipId: z.number(),
      platforms: z.array(z.enum(['tiktok', 'youtube', 'instagram', 'facebook'])),
      scheduledFor: z.date()
    })))
    .mutation(async ({ ctx, input }) => {
      const posts = [];
      
      for (const item of input) {
        for (const platform of item.platforms) {
          posts.push({
            clipId: item.clipId,
            userId: ctx.user.id,
            platform,
            scheduledFor: item.scheduledFor,
            status: 'pending'
          });
        }
      }
      
      await db.insert(scheduledPosts).values(posts);
      
      return { scheduled: posts.length };
    }),
    
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select()
        .from(scheduledPosts)
        .where(eq(scheduledPosts.userId, ctx.user.id))
        .orderBy(scheduledPosts.scheduledFor);
    }),
    
  cancel: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(scheduledPosts)
        .set({ status: 'cancelled' })
        .where(
          and(
            eq(scheduledPosts.id, input.postId),
            eq(scheduledPosts.userId, ctx.user.id)
          )
        );
    })
});
```

### Worker de Publicação (Cron Job)

```typescript
// server/workers/publishWorker.ts
import cron from 'node-cron';

// Rodar a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  
  // Buscar posts pendentes que já passaram da hora
  const pendingPosts = await db.select()
    .from(scheduledPosts)
    .where(
      and(
        eq(scheduledPosts.status, 'pending'),
        lte(scheduledPosts.scheduledFor, now)
      )
    )
    .limit(10);
  
  for (const post of pendingPosts) {
    try {
      // Buscar clip e conta social
      const clip = await db.select()
        .from(clips)
        .where(eq(clips.id, post.clipId))
        .limit(1);
        
      const account = await db.select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.userId, post.userId),
            eq(socialAccounts.platform, post.platform),
            eq(socialAccounts.isActive, true)
          )
        )
        .limit(1);
      
      if (!account[0]) {
        throw new Error(`Conta ${post.platform} não conectada`);
      }
      
      // Publicar na plataforma
      const platformPostId = await publishToPlatform(
        post.platform,
        clip[0].s3Url,
        account[0].accessToken,
        {
          title: `PARTE ${clip[0].clipNumber}/${clip[0].totalClips}`,
          description: clip[0].transcription
        }
      );
      
      // Atualizar status
      await db.update(scheduledPosts)
        .set({
          status: 'published',
          platformPostId,
          publishedAt: new Date()
        })
        .where(eq(scheduledPosts.id, post.id));
        
    } catch (error) {
      // Marcar como falha
      await db.update(scheduledPosts)
        .set({
          status: 'failed',
          errorMessage: error.message
        })
        .where(eq(scheduledPosts.id, post.id));
    }
  }
});
```

---

## 🔐 Termos de Uso Obrigatórios

### Checkbox no Formulário

```typescript
// client/src/pages/Home.tsx
function VideoForm() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { user } = useAuth();
  
  const createJob = trpc.video.create.useMutation({
    onError: (error) => {
      if (error.message.includes('termos')) {
        toast.error('Você precisa aceitar os Termos de Uso');
      }
    }
  });
  
  const handleSubmit = () => {
    if (!user?.acceptedTerms && !acceptedTerms) {
      toast.error('Aceite os Termos de Uso para continuar');
      return;
    }
    
    createJob.mutate({ ...formData, acceptedTerms });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos do formulário ... */}
      
      {!user?.acceptedTerms && (
        <div className="flex items-start gap-2 p-4 border rounded">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
          />
          <Label className="text-sm">
            Li e aceito os{" "}
            <a href="/terms" target="_blank" className="text-primary underline">
              Termos de Uso
            </a>
            . Declaro que possuo todos os direitos sobre o conteúdo que
            estou processando e assumo total responsabilidade por violações
            de direitos autorais.
          </Label>
        </div>
      )}
      
      <Button type="submit" disabled={!user?.acceptedTerms && !acceptedTerms}>
        Processar Vídeo
      </Button>
    </form>
  );
}
```

### Validação no Backend

```typescript
// server/routers/videoRouter.ts
create: protectedProcedure
  .input(z.object({
    // ... outros campos ...
    acceptedTerms: z.boolean().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    // Verificar se usuário já aceitou termos
    if (!ctx.user.acceptedTerms) {
      if (!input.acceptedTerms) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Você deve aceitar os Termos de Uso'
        });
      }
      
      // Salvar aceitação
      await db.update(users)
        .set({
          acceptedTerms: true,
          acceptedTermsAt: new Date()
        })
        .where(eq(users.id, ctx.user.id));
    }
    
    // ... resto do processamento ...
  });
```

---

## 🎨 Diretrizes de UI/UX

### Design System

**Cores Principais:**
- Primary: `#8B5CF6` (roxo vibrante)
- Secondary: `#EC4899` (rosa)
- Accent: `#10B981` (verde)
- Background: `#0F172A` (dark slate)
- Foreground: `#F1F5F9` (light slate)

**Tipografia:**
- Heading: `font-bold text-4xl md:text-6xl`
- Subheading: `text-xl text-muted-foreground`
- Body: `text-base`

**Espaçamento:**
- Seções: `py-16 px-4`
- Cards: `p-6`
- Gaps: `gap-4` ou `gap-6`

### Componentes Principais

**Hero Section (Landing Page)**
```tsx
<section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
  <div className="container max-w-4xl text-center">
    <Badge className="mb-4">🚀 Hack do Algoritmo</Badge>
    <h1 className="text-5xl md:text-6xl font-bold mb-6">
      Multiplique Suas Views por{" "}
      <span className="text-primary">50x-100x</span>
    </h1>
    <p className="text-xl text-muted-foreground mb-8">
      Transforme 1 vídeo em uma série viral sequencial que o
      algoritmo do TikTok empurra automaticamente
    </p>
    <Button size="lg">Começar Grátis</Button>
  </div>
</section>
```

**Card de Feature**
```tsx
<Card>
  <CardHeader>
    <Icon className="h-10 w-10 text-primary mb-2" />
    <CardTitle>Título da Feature</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Descrição...</p>
  </CardContent>
</Card>
```

**Progress Bar**
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Processando...</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} />
  <p className="text-xs text-muted-foreground">{statusMessage}</p>
</div>
```

---

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
pnpm install          # Instalar dependências
pnpm dev              # Rodar dev server (localhost:3000)
pnpm build            # Build para produção
pnpm start            # Rodar produção
```

### Database
```bash
pnpm db:push          # Aplicar mudanças no schema
pnpm db:studio        # Abrir Drizzle Studio (GUI)
pnpm db:seed          # Popular banco com dados de exemplo
```

### Testes
```bash
pnpm test             # Rodar testes
pnpm test:watch       # Rodar testes em modo watch
```

---

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos**: camelCase (`videoProcessor.ts`)
- **Componentes**: PascalCase (`VideoForm.tsx`)
- **Funções**: camelCase (`processVideo()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_CLIP_DURATION`)
- **Types**: PascalCase (`type VideoJob = ...`)

### Estrutura de Funções
```typescript
/**
 * Descrição clara do que a função faz
 * @param param1 - Descrição do parâmetro
 * @returns Descrição do retorno
 */
async function functionName(param1: Type): Promise<ReturnType> {
  // 1. Validação de entrada
  if (!param1) throw new Error("param1 é obrigatório");
  
  // 2. Lógica principal
  const result = await doSomething(param1);
  
  // 3. Retorno
  return result;
}
```

### Error Handling
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('[ModuleName] Error:', error);
  throw new Error(`Falha ao executar operação: ${error.message}`);
}
```

---

## 🎯 Prioridades de Implementação

### ✅ Já Implementado (95%)
1. Sistema de processamento de vídeo completo
2. Download YouTube, transcrição, corte sequencial
3. Legendas automáticas estilizadas
4. Vídeos de retenção por nicho
5. Layouts múltiplos (lado a lado, top/bottom)
6. Sistema de créditos e planos
7. Integração Stripe
8. Upload S3 e download ZIP
9. Score de retenção preditivo
10. Estrutura de publicação automática

### 🚧 Em Progresso (Próximos 7 dias)
1. **Sistema multilíngue (i18n)** - PT/ES/EN
2. **Agendamento automático** - calendário inteligente
3. **Preview de thumbnails** - por plataforma
4. **Termos de Uso obrigatórios** - compliance
5. **Landing page reposicionada** - hack do algoritmo
6. **Integração Facebook Reels** - 4ª plataforma

### 📋 Backlog (Próximos 30 dias)
1. Painel de analytics com métricas reais
2. A/B testing de thumbnails/títulos
3. Detecção de melhor horário (IA)
4. Edição de transcrição inline
5. Diarização de falantes
6. API pública

---

## 🐛 Debugging

### Logs Importantes
```typescript
// Sempre adicionar logs em operações críticas
console.log('[VideoProcessor] Starting processing for job:', jobId);
console.log('[FFmpeg] Command:', ffmpegCommand);
console.log('[S3] Uploading to:', s3Key);
console.log('[Whisper] Transcription completed:', transcription.length);
```

### Variáveis de Ambiente para Debug
```env
DEBUG=true
LOG_LEVEL=debug
FFMPEG_DEBUG=true
```

### Testar Localmente
```bash
# Testar download YouTube
node -e "require('./server/videoDownloader').downloadVideo('URL')"

# Testar transcrição
node -e "require('./server/transcription').transcribe('audio.mp3')"

# Testar FFmpeg
ffmpeg -i input.mp4 -ss 0 -t 60 -c copy output.mp4
```

---

## 📞 Recursos Adicionais

- **Documentação tRPC**: https://trpc.io/docs
- **Documentação Drizzle**: https://orm.drizzle.team/docs
- **FFmpeg Filters**: https://ffmpeg.org/ffmpeg-filters.html
- **Whisper API**: https://platform.openai.com/docs/guides/speech-to-text
- **TikTok API**: https://developers.tiktok.com/
- **YouTube Data API**: https://developers.google.com/youtube/v3

---

## 🎯 Lembre-se Sempre

1. **Cortes são SEQUENCIAIS, não highlights**
2. **Numeração PARTE X/Y é obrigatória**
3. **Hack do algoritmo é o diferencial único**
4. **Responsabilidade do usuário sobre direitos autorais**
5. **Multi-plataforma desde o início**
6. **Experiência multilíngue (PT/ES/EN)**

**Boa sorte no desenvolvimento! 🚀**
