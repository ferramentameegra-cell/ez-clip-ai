# ✂️ QUEM FAZ OS CORTES - Sistema de Edição do EZ CLIP AI

## 🎯 RESPOSTA DIRETA:

Os cortes são feitos pelo **FFmpeg**, que é uma ferramenta profissional de processamento de vídeo.

---

## 🔧 SISTEMA PRINCIPAL: **FFmpeg**

### O que é FFmpeg?

**FFmpeg** é uma ferramenta de linha de comando usada por profissionais para:
- ✅ Cortar vídeos
- ✅ Compor vídeos (juntar, sobrepor)
- ✅ Adicionar legendas
- ✅ Converter formatos
- ✅ Redimensionar vídeos
- ✅ Processar áudio

**É o mesmo sistema usado por:**
- YouTube (para processar vídeos)
- Netflix (para streaming)
- Adobe Premiere (internamente)
- E muitos outros

---

## 📋 COMO FUNCIONA NO EZ CLIP AI:

### Passo 1: Decidir ONDE cortar

O sistema usa **2 opções** para decidir onde fazer os cortes:

#### Opção A: **IA (Opcional)**
- Usa **Anthropic Claude** (se configurado)
- Analisa a transcrição do vídeo
- Identifica **pontos lógicos** para cortar
- Divide baseado em **conteúdo semântico**

#### Opção B: **Algoritmo (Padrão)**
- Usa a **transcrição do Whisper**
- Divide a transcrição em **segmentos sequenciais**
- Define onde cada clipe começa e termina
- Usa **overlap** (sobreposição) entre clipes

**Exemplo:**
```
Vídeo de 60 minutos
↓
Transcrição com timestamps
↓
Dividido em 60 clipes de 1 minuto cada
↓
Clipe 1: 0s - 60s
Clipe 2: 58s - 118s (overlap de 2s)
Clipe 3: 116s - 176s
...
```

---

### Passo 2: Cortar com FFmpeg

Depois de decidir os pontos de corte, o **FFmpeg** executa:

```typescript
ffmpeg(videoPath)
  .setStartTime(clipStart)      // Ex: 0s
  .setDuration(duration)         // Ex: 60s
  .outputOptions(['-c:v libx264', '-preset fast'])
  .output(mainClipPath)
  .run();
```

**O que isso faz:**
- ✅ Corta o vídeo do segundo `clipStart` até `clipStart + duration`
- ✅ Mantém qualidade (codec H.264)
- ✅ Processa rápido (`-preset fast`)
- ✅ Cria arquivo MP4

---

### Passo 3: Processamento Adicional (Também com FFmpeg)

Após cortar, o FFmpeg também faz:

1. **Composição vertical** (se houver vídeo de retenção):
   - Junta vídeo principal + vídeo de retenção
   - Layout: lado a lado ou top/bottom
   - Formato: 1080x1920px (vertical para TikTok/Instagram)

2. **Adicionar legendas**:
   - Sobrepoem legendas estilizadas no vídeo
   - Posicionamento correto (safe zones)
   - Estilo: fonte grande, contorno, animação

3. **Otimização**:
   - Compressão inteligente
   - Qualidade adequada para redes sociais
   - Formato correto (MP4, codec H.264)

---

## 🎬 EXEMPLO COMPLETO:

### Vídeo de 10 minutos do YouTube:

1. **Download** → Vídeo completo baixado
2. **Transcrição** → Whisper transcreve e cria timestamps
3. **Divisão** → Sistema decide: 10 clipes de 60s cada
4. **Corte 1** → FFmpeg corta: 0s-60s → Clipe 1
5. **Processamento** → FFmpeg adiciona legendas e composição
6. **Corte 2** → FFmpeg corta: 58s-118s → Clipe 2
7. **Processamento** → FFmpeg adiciona legendas e composição
8. ... (repetir para todos os clipes)

---

## 📊 SISTEMA DE DIVISÃO (Onde Cortar):

### 1. **Divisão Fixa** (Modo: `fixed`)
- Divide em intervalos fixos (ex: 60s cada)
- Simples e rápido
- Não considera conteúdo

### 2. **Divisão Semântica** (Modo: `semantic`)
- Analisa a transcrição
- Identifica pausas naturais
- Corta em pontos lógicos
- Usa IA (se configurada)

### 3. **Divisão Híbrida** (Modo: `hybrid`)
- Combina fixo + semântico
- Tenta manter duração próxima do alvo
- Mas ajusta em pontos lógicos

---

## 🔧 TECNOLOGIAS USADAS:

| Ferramenta | Função |
|------------|--------|
| **FFmpeg** | ✂️ Faz os cortes físicos dos vídeos |
| **fluent-ffmpeg** | 📦 Biblioteca Node.js para usar FFmpeg |
| **Whisper** | 🎤 Transcreve áudio e fornece timestamps |
| **IA (Claude)** | 🧠 Decide pontos de corte (opcional) |
| **Algoritmo** | 🧮 Divide sequencialmente (padrão) |

---

## ✅ VANTAGENS DO FFMPEG:

1. ✅ **Profissional** - Mesmo sistema usado por grandes plataformas
2. ✅ **Rápido** - Processamento eficiente
3. ✅ **Preciso** - Cortes exatos frame-a-frame
4. ✅ **Flexível** - Suporta muitos formatos e opções
5. ✅ **Confiável** - Ferramenta madura e testada

---

## 📝 RESUMO:

### Quem decide ONDE cortar?
- **IA (opcional)** ou **Algoritmo** - baseado na transcrição

### Quem faz o corte físico?
- **FFmpeg** - ferramenta profissional de vídeo

### Quem processa depois?
- **FFmpeg** - adiciona legendas, composição, otimização

---

## 🎯 CONCLUSÃO:

**FFmpeg** é o sistema que faz os cortes físicos dos vídeos. É uma ferramenta profissional, rápida e confiável.

O EZ CLIP AI usa:
- **Whisper** → Para saber o que foi dito e quando
- **IA/Algoritmo** → Para decidir onde cortar
- **FFmpeg** → Para fazer o corte real do vídeo

**Tudo funciona automaticamente! 🚀**

