# 🎬 Sistema de Edição Automática de Vídeos

## 📋 Visão Geral

O sistema **Viral Clips AI** processa automaticamente vídeos do YouTube, transformando um vídeo longo em múltiplos clipes sequenciais otimizados para TikTok/Shorts, com edição automática, legendas, e composição vertical.

---

## 🔄 Fluxo Completo do Processamento

### **1. ENTRADA DO USUÁRIO** 
📄 `client/src/pages/Home.tsx`

O usuário preenche o formulário:
- ✅ URL do YouTube
- ✅ Duração dos clipes (60-90s)
- ✅ Adicionar legendas (sim/não)
- ✅ Escolher nicho (Política, Futebol, etc.)
- ✅ Tipo de conteúdo secundário (vídeo de retenção, emoji 3D)
- ✅ Headline opcional

**Quando clica em "Criar Job":**
```typescript
// client/src/pages/Home.tsx
const createJob = trpc.video.create.useMutation();
await createJob.mutateAsync({
  youtubeUrl: "https://youtube.com/watch?v=...",
  clipDuration: 60,
  withSubtitles: true,
  vertical: "politica",
  secondaryContentType: "platform",
  headline: "Título do vídeo"
});
```

---

### **2. BACKEND RECEBE A REQUISIÇÃO**
📄 `server/routers/video.ts`

```typescript
// server/routers/video.ts - linha 16-67
create: protectedProcedure
  .mutation(async ({ input, ctx }) => {
    // 1. Valida URL do YouTube
    // 2. Verifica créditos do usuário
    // 3. Cria job no banco de dados
    // 4. Inicia processamento ASSÍNCRONO
    processVideoJob(jobId).catch(...);
  })
```

**O que acontece:**
- ✅ Valida se a URL é válida
- ✅ Verifica se o usuário tem créditos
- ✅ Salva o job no banco com status `pending`
- ✅ **Inicia processamento em background** (não bloqueia a resposta)

---

### **3. PROCESSAMENTO AUTOMÁTICO**
📄 `server/jobProcessor.ts`

Este é o **coração do sistema**. Processa o vídeo em 6 etapas:

#### **ETAPA 1: Download do YouTube** (10% progresso)
📄 `server/youtubeDownloader.ts`

```typescript
// server/jobProcessor.ts - linha 19-24
const { videoPath, audioPath, title, duration } = 
  await downloadYouTubeVideo(job.sourceUrl!);
```

**O que faz:**
- ✅ Baixa o vídeo completo do YouTube usando `@distube/ytdl-core`
- ✅ Extrai o áudio separadamente
- ✅ Retorna caminhos dos arquivos temporários

**Tecnologia:** `@distube/ytdl-core` + `fluent-ffmpeg`

---

#### **ETAPA 2: Transcrição com IA** (30% progresso)
📄 `server/transcription.ts` + `server/_core/voiceTranscription.ts`

```typescript
// server/jobProcessor.ts - linha 26-30
const transcription = await transcribeAudio(audioPath, 'pt');
```

**O que faz:**
- ✅ Envia o áudio para **Whisper Large v3** (via Manus Forge API)
- ✅ Recebe transcrição completa com timestamps
- ✅ Retorna segmentos de texto com início/fim de cada frase

**Tecnologia:** Whisper Large v3 (OpenAI) via API

**Exemplo de saída:**
```json
{
  "segments": [
    { "start": 0.0, "end": 3.5, "text": "Olá pessoal, bem-vindos..." },
    { "start": 3.5, "end": 7.2, "text": "Hoje vou falar sobre..." }
  ]
}
```

---

#### **ETAPA 3: Divisão em Clipes Sequenciais** (50% progresso)
📄 `server/transcription.ts`

```typescript
// server/jobProcessor.ts - linha 32-36
const clips = splitIntoSequentialClips(
  transcription, 
  job.clipDuration || 75
);
```

**O que faz:**
- ✅ Divide o vídeo em partes sequenciais (não highlights!)
- ✅ Cada clipe tem duração definida (ex: 60 segundos)
- ✅ Os clipes são **cronológicos** (parte 1, parte 2, parte 3...)
- ✅ Garante que não corta palavras no meio

**Exemplo:**
- Vídeo de 10 minutos → 10 clipes de 60 segundos cada
- Clipe 1: 0:00 - 1:00
- Clipe 2: 1:00 - 2:00
- Clipe 3: 2:00 - 3:00
- ...

---

#### **ETAPA 4: Obter Vídeo de Retenção** (50% progresso)
📄 `server/db.ts`

```typescript
// server/jobProcessor.ts - linha 38-48
if (job.withRetention) {
  const retentionVideos = await getRetentionVideosByVertical(
    job.vertical || 'geral'
  );
  const randomVideo = retentionVideos[Math.floor(Math.random() * ...)];
}
```

**O que faz:**
- ✅ Busca vídeos de retenção do nicho selecionado
- ✅ Seleciona um vídeo aleatório
- ✅ Usa para composição vertical (explicado na próxima etapa)

**Tipos de conteúdo secundário:**
- `platform`: Vídeos da plataforma (Minecraft, GTA, etc.)
- `user`: Vídeos enviados pelo usuário
- `emoji`: Emojis 3D animados

---

#### **ETAPA 5: Processar Cada Clipe** (60-95% progresso)
📄 `server/videoProcessor.ts`

```typescript
// server/jobProcessor.ts - linha 50-83
for (let i = 0; i < clips.length; i++) {
  const processedClip = await processClip({
    videoPath,
    retentionVideoPath,
    clipStart: clip.start,
    clipEnd: clip.end,
    partNumber: clip.partNumber,
    totalParts: clips.length,
    headline: job.headline,
    withSubtitles: job.withSubtitles,
    transcriptionSegments: transcription.segments,
    vertical: job.vertical
  });
}
```

**Esta é a etapa mais complexa!** Para cada clipe, o sistema:

##### **5a. Cortar Vídeo Principal**
```typescript
// server/videoProcessor.ts - linha 63-78
ffmpeg(videoPath)
  .setStartTime(clipStart)
  .setDuration(duration)
  .output(mainClipPath)
```

**O que faz:**
- ✅ Corta o vídeo no tempo exato (ex: 0:00 - 1:00)
- ✅ Converte para formato vertical (1080x1920px)
- ✅ Ajusta qualidade (H.264, AAC 128kbps, 30fps)

---

##### **5b. Criar Composição Vertical** (se houver vídeo de retenção)
```typescript
// server/videoProcessor.ts - linha 80-92
if (retentionVideoPath) {
  finalVideoPath = await createVerticalComposition(
    mainClipPath,
    retentionVideoPath,
    duration,
    headline,
    partNumber,
    totalParts
  );
}
```

**Layout exato (pixel a pixel):**

```
┌─────────────────────┐
│   SAFE ZONE TOP     │ 0-200px
│   (notch area)      │
├─────────────────────┤
│                     │
│   VÍDEO PRINCIPAL   │ 200-900px (700px)
│   (top half)        │
│                     │
├─────────────────────┤
│   HEADLINE          │ 900-940px (40px)
│   "Título do vídeo" │
├─────────────────────┤
│                     │
│   VÍDEO RETENÇÃO    │ 940-1620px (680px)
│   (bottom half)     │
│                     │
├─────────────────────┤
│   LEGENDAS          │ 1620-1720px (100px)
│   (subtitles)       │
├─────────────────────┤
│   SAFE ZONE BOTTOM  │ 1720-1920px (200px)
│   (buttons area)    │
└─────────────────────┘
```

**Tecnologia:** FFmpeg com filtros complexos (`overlay`, `scale`, `drawtext`)

---

##### **5c. Adicionar Legendas Automáticas** (se solicitado)
```typescript
// server/videoProcessor.ts - linha 94-102
if (withSubtitles && transcriptionSegments) {
  finalVideoPath = await addSubtitles(
    finalVideoPath,
    transcriptionSegments,
    clipStart,
    clipEnd
  );
}
```

**O que faz:**
- ✅ Gera arquivo SRT com legendas
- ✅ Sincroniza com o áudio usando timestamps da transcrição
- ✅ Posiciona legendas na zona segura (1620-1720px)
- ✅ Estilo: fonte branca, borda preta, centralizado

**Tecnologia:** FFmpeg `subtitles` filter

---

##### **5d. Upload para S3**
```typescript
// server/videoProcessor.ts - linha 104-107
const videoBuffer = fs.readFileSync(finalVideoPath);
const videoKey = `clips/${vertical}/${Date.now()}_part${partNumber}.mp4`;
const { url: videoUrl } = await storagePut(videoKey, videoBuffer, 'video/mp4');
```

**O que faz:**
- ✅ Faz upload do vídeo processado para AWS S3
- ✅ Gera URL pública para download
- ✅ Organiza por nicho: `clips/politica/1234567890_part1.mp4`

**Tecnologia:** AWS SDK S3

---

##### **5e. Salvar no Banco de Dados**
```typescript
// server/jobProcessor.ts - linha 73-82
await createClip({
  jobId,
  videoKey: processedClip.videoKey,
  videoUrl: processedClip.videoUrl,
  startTime: processedClip.startTime,
  endTime: processedClip.endTime,
  partNumber: processedClip.partNumber,
  transcriptionText: clip.text
});
```

**O que faz:**
- ✅ Salva informações do clipe no banco
- ✅ Vincula ao job original
- ✅ Armazena URL do S3 para download

---

#### **ETAPA 6: Finalizar** (100% progresso)
```typescript
// server/jobProcessor.ts - linha 85-89
await updateJobStatus(jobId, 'completed', 100);
await decrementUserCredits(job.userId);
```

**O que faz:**
- ✅ Atualiza status do job para `completed`
- ✅ Desconta 1 crédito do usuário
- ✅ Limpa arquivos temporários

---

## 📊 Monitoramento em Tempo Real

### **Frontend:**
📄 `client/src/pages/JobsList.tsx`

```typescript
// Polling a cada 2 segundos
const { data: status } = trpc.video.getStatus.useQuery(
  { jobId },
  { refetchInterval: 2000 }
);
```

**O que mostra:**
- ✅ Progresso em % (0-100%)
- ✅ Status atual (`downloading`, `transcribing`, `cutting`, `rendering`, `completed`)
- ✅ Quantidade de clipes processados
- ✅ Link de download quando concluído

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| **@distube/ytdl-core** | Download de vídeos do YouTube |
| **fluent-ffmpeg** | Edição de vídeo (corte, composição, legendas) |
| **Whisper Large v3** | Transcrição de áudio com IA |
| **AWS S3** | Armazenamento de vídeos processados |
| **MySQL/TiDB** | Banco de dados (jobs, clipes, usuários) |
| **tRPC** | API type-safe entre frontend e backend |
| **Node.js 22** | Runtime do backend |

---

## 📁 Arquivos Principais

### **Backend:**
- `server/jobProcessor.ts` - Orquestrador principal
- `server/youtubeDownloader.ts` - Download do YouTube
- `server/transcription.ts` - Transcrição e divisão em clipes
- `server/videoProcessor.ts` - Edição de vídeo (FFmpeg)
- `server/routers/video.ts` - API endpoints
- `server/storage.ts` - Upload para S3
- `server/db.ts` - Queries do banco

### **Frontend:**
- `client/src/pages/Home.tsx` - Formulário de criação
- `client/src/pages/JobsList.tsx` - Lista de jobs e progresso

---

## ⚙️ Configuração Necessária

### **Variáveis de Ambiente (.env):**
```bash
# YouTube
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...

# Whisper (Manus Forge)
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=https://api.manusforge.com

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips-ai

# Database
DATABASE_URL=mysql://user:password@localhost:3306/viral_clips_ai
```

### **Dependências:**
```bash
npm install @distube/ytdl-core fluent-ffmpeg @aws-sdk/client-s3 mysql2
```

### **FFmpeg:**
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

---

## 🎯 Exemplo de Uso Completo

1. **Usuário acessa:** `http://localhost:3000`
2. **Preenche formulário:**
   - URL: `https://youtube.com/watch?v=abc123`
   - Duração: 60 segundos
   - Legendas: ✅ Sim
   - Nicho: Política
   - Conteúdo secundário: Vídeos da Plataforma
3. **Clica em "Criar Job"**
4. **Sistema processa automaticamente:**
   - ⬇️ Baixa vídeo (10%)
   - 🎤 Transcreve áudio (30%)
   - ✂️ Divide em clipes (50%)
   - 🎬 Edita cada clipe (60-95%)
   - ☁️ Faz upload para S3 (95%)
   - ✅ Finaliza (100%)
5. **Usuário vê progresso em tempo real**
6. **Quando concluído, pode baixar todos os clipes**

---

## 🚀 Próximos Passos

Para o sistema funcionar 100%, você precisa:

1. ✅ **Instalar MySQL** (veja `ERRO_MYSQL_SOLUCAO.md`)
2. ✅ **Configurar AWS S3** (criar bucket e chaves)
3. ✅ **Configurar API do Whisper** (Manus Forge)
4. ✅ **Instalar FFmpeg** (`brew install ffmpeg`)
5. ✅ **Aplicar migrations** (`npm run db:push`)

---

**🎉 O sistema está 100% implementado e pronto para processar vídeos automaticamente!**

