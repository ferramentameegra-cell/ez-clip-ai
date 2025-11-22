# 📋 TODO Priorizado - Viral Clips AI

## 🎯 Legenda de Prioridades

- 🔴 **P0 (Crítico)** - Bloqueador para lançamento, fazer AGORA
- 🟠 **P1 (Alta)** - Importante para sucesso inicial, fazer em 7 dias
- 🟡 **P2 (Média)** - Melhora experiência, fazer em 30 dias
- 🟢 **P3 (Baixa)** - Nice to have, fazer em 60-90 dias

---

## 🔴 P0 - Crítico (Fazer AGORA)

### 1. Termos de Uso e Compliance
**Por quê:** Proteção legal obrigatória antes de lançar

- [ ] Criar página `/terms` com Termos de Uso completos
- [ ] Criar página `/privacy` com Política de Privacidade (LGPD)
- [ ] Adicionar checkbox obrigatório "Aceito os Termos" no formulário
- [ ] Salvar `acceptedTerms` e `acceptedTermsAt` no banco (tabela users)
- [ ] Bloquear processamento se usuário não aceitar
- [ ] Adicionar disclaimer de direitos autorais no formulário
- [ ] Adicionar links Termos/Privacidade no footer

**Estimativa:** 4-6 horas  
**Arquivos:** `client/src/pages/TermsOfService.tsx`, `client/src/pages/Privacy.tsx`, `drizzle/schema.ts`

---

### 2. Testar Fluxo Completo End-to-End
**Por quê:** Validar que tudo funciona antes de lançar

- [ ] Testar download de vídeo do YouTube (2-3min)
- [ ] Testar transcrição com Whisper
- [ ] Testar corte sequencial em 3 partes
- [ ] Testar legendas automáticas
- [ ] Testar composição com vídeo de retenção
- [ ] Testar upload para S3
- [ ] Testar download em ZIP
- [ ] Testar sistema de créditos (decrementar após processar)
- [ ] Validar numeração "PARTE X/Y" nos clipes

**Estimativa:** 2-3 horas  
**Arquivos:** Todos os módulos de processamento

---

### 3. Corrigir Bugs Críticos
**Por quê:** Garantir estabilidade básica

- [ ] Validar que `@distube/ytdl-core` funciona em produção
- [ ] Corrigir erros de FFmpeg (se houver)
- [ ] Validar que S3 upload funciona
- [ ] Corrigir race conditions em processamento assíncrono
- [ ] Adicionar error handling robusto em todas as etapas

**Estimativa:** 3-5 horas  
**Arquivos:** `server/videoDownloader.ts`, `server/videoProcessor.ts`, `server/jobProcessor.ts`

---

## 🟠 P1 - Alta Prioridade (7 dias)

### 4. Sistema Multilíngue (i18n)
**Por quê:** Expandir para mercado LATAM e global

- [ ] Instalar `react-i18next` e `i18next`
- [ ] Criar estrutura de arquivos de tradução
  - `client/src/locales/pt-BR.json`
  - `client/src/locales/es.json`
  - `client/src/locales/en.json`
- [ ] Traduzir landing page completa
- [ ] Traduzir dashboard e formulários
- [ ] Traduzir mensagens de erro e sucesso
- [ ] Traduzir emails e notificações
- [ ] Adicionar seletor de idioma no header
- [ ] Salvar preferência de idioma no `localStorage` e banco
- [ ] Traduzir Termos de Uso e Política de Privacidade

**Estimativa:** 8-12 horas  
**Arquivos:** `client/src/lib/i18n.ts`, `client/src/locales/*`, todos os componentes

---

### 5. Agendamento Automático Multi-Plataforma
**Por quê:** Feature #1 mais solicitada, aumenta conversão em 30-40%

- [ ] Criar tabela `scheduledPosts` no schema
- [ ] Criar interface de calendário de publicação
  - Seletor de intervalo (12h, 24h, 48h)
  - Seletor de data/hora inicial
  - Checkboxes de plataformas (TikTok, YouTube, Instagram, Facebook)
- [ ] Implementar tRPC router `schedule`
  - `createBulk` - agendar múltiplos posts
  - `list` - listar posts agendados
  - `cancel` - cancelar post específico
  - `pause` - pausar série
  - `resume` - retomar série
- [ ] Criar worker de publicação (cron job a cada 5min)
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar notificações de sucesso/falha
- [ ] Criar painel de controle de posts agendados

**Estimativa:** 12-16 horas  
**Arquivos:** `drizzle/schema.ts`, `server/routers/scheduleRouter.ts`, `server/workers/publishWorker.ts`, `client/src/pages/ScheduleManager.tsx`

---

### 6. Preview de Thumbnails por Plataforma
**Por quê:** Usuário precisa ver como vai aparecer antes de publicar

- [ ] Gerar thumbnail automático do primeiro frame
- [ ] Criar componente `ThumbnailPreview`
  - Preview TikTok (9:16 com logo)
  - Preview YouTube Shorts (9:16 com título)
  - Preview Instagram Reels (9:16 com username)
  - Preview Facebook Reels (9:16 com logo)
- [ ] Permitir edição de thumbnail personalizado
- [ ] Upload de thumbnail customizado
- [ ] Aplicar thumbnail na publicação

**Estimativa:** 6-8 horas  
**Arquivos:** `server/thumbnailGenerator.ts`, `client/src/components/ThumbnailPreview.tsx`

---

### 7. Integração Facebook Reels API
**Por quê:** Completar suporte às 4 plataformas principais

- [ ] Criar app no Facebook Developers
- [ ] Implementar OAuth flow para Facebook
- [ ] Adicionar `platform: 'facebook'` em `socialAccounts`
- [ ] Implementar `publishToFacebook()` em `socialPublisher.ts`
- [ ] Testar upload de vídeo para Facebook Reels
- [ ] Adicionar checkbox Facebook no agendamento

**Estimativa:** 4-6 horas  
**Arquivos:** `server/socialPublisher.ts`, `server/routers/oauthRouter.ts`

---

### 8. Landing Page Reposicionada (Hack do Algoritmo)
**Por quê:** Comunicar diferencial único e aumentar conversão

- [ ] Reescrever hero section focando no hack
  - Título: "Multiplique Suas Views por 50x-100x"
  - Subtítulo: Explicar efeito cascata
- [ ] Criar seção "Como Funciona o Hack"
  - Diagrama visual do efeito cascata
  - Passo a passo: PARTE 1 → busca → PARTE 2 → viraliza
- [ ] Adicionar calculadora de ROI de views
  - Input: duração do vídeo
  - Output: "1 vídeo = X clipes = Y views totais"
- [ ] Criar seção "Diferencial vs Concorrentes"
  - Tabela comparativa: OpusClip vs Vizard vs Viral Clips AI
- [ ] Adicionar casos de uso específicos
  - Filmes completos no TikTok
  - Podcasts em 80 dias
  - Cursos virais
- [ ] Adicionar seção de prova social
  - "Testamos com 10 criadores: 50x mais views"
- [ ] Atualizar copy de todos os CTAs

**Estimativa:** 8-12 horas  
**Arquivos:** `client/src/pages/Landing.tsx`, `client/src/components/ROICalculator.tsx`

---

## 🟡 P2 - Média Prioridade (30 dias)

### 9. Score de Retenção Visível na UI
**Por quê:** Backend já implementado, falta mostrar no frontend

- [ ] Criar componente `RetentionScoreCard`
  - Score 0-100 com gauge visual
  - Curva de retenção prevista (gráfico)
  - Comparação com baseline do nicho
  - Dicas para melhorar score
- [ ] Integrar no `JobView.tsx`
- [ ] Adicionar tooltip explicando cada fator
- [ ] Mostrar score individual por clipe

**Estimativa:** 4-6 horas  
**Arquivos:** `client/src/components/RetentionScoreCard.tsx`, `client/src/pages/JobView.tsx`

---

### 10. Configurar OAuth das APIs Sociais
**Por quê:** Necessário para publicação automática funcionar

#### YouTube Data API v3
- [ ] Criar projeto no Google Cloud Console
- [ ] Ativar YouTube Data API v3
- [ ] Criar OAuth 2.0 Client ID
- [ ] Configurar redirect URI
- [ ] Testar fluxo de autenticação
- [ ] Testar publicação de Short

**Estimativa:** 2-3 horas

#### TikTok API
- [ ] Criar app no TikTok Developers
- [ ] Solicitar aprovação de Video Upload scope
- [ ] Configurar redirect URI
- [ ] Testar fluxo de autenticação
- [ ] Testar upload de vídeo

**Estimativa:** 2-3 horas (+ tempo de aprovação do TikTok)

#### Instagram Graph API
- [ ] Criar app no Facebook Developers
- [ ] Adicionar produto Instagram Basic Display
- [ ] Configurar redirect URI
- [ ] Testar fluxo de autenticação
- [ ] Testar publicação de Reel

**Estimativa:** 2-3 horas

---

### 11. Painel de Analytics com Métricas Reais
**Por quê:** Usuários querem ver resultados (views, engajamento)

- [ ] Conectar YouTube Analytics API
- [ ] Conectar TikTok Analytics API
- [ ] Conectar Instagram Insights API
- [ ] Conectar Facebook Insights API
- [ ] Criar tabela `clipMetrics` no banco
- [ ] Worker para coletar métricas a cada 6h
- [ ] Dashboard com gráficos
  - Views por clipe
  - Retenção por segundo
  - CTR (Click-Through Rate)
  - Engajamento (likes, comments, shares)
- [ ] Comparação antes/depois
- [ ] Relatório mensal automatizado

**Estimativa:** 16-20 horas  
**Arquivos:** `server/routers/analyticsRouter.ts`, `server/workers/metricsCollector.ts`, `client/src/pages/Analytics.tsx`

---

### 12. A/B Testing de Thumbnails e Títulos
**Por quê:** Otimizar performance automaticamente

- [ ] Gerar 3 variações de thumbnail automaticamente
  - Variação A: Primeiro frame
  - Variação B: Frame do meio
  - Variação C: Último frame
- [ ] Gerar 3 variações de título/hook
  - Usar LLM para gerar variações
- [ ] Publicar variações em janelas de 24-48h
- [ ] Coletar métricas de cada variação
- [ ] Escolher automaticamente a melhor versão
- [ ] Continuar publicando com a vencedora

**Estimativa:** 12-16 horas  
**Arquivos:** `server/abTesting.ts`, `server/routers/abTestRouter.ts`

---

### 13. Detecção de Melhor Horário (IA)
**Por quê:** Maximizar views publicando no horário ideal

- [ ] Coletar dados históricos de performance por horário
- [ ] Treinar modelo simples de ML
- [ ] Prever melhor horário por nicho
- [ ] Sugerir horários no agendamento
- [ ] Ajustar automaticamente horários com base em resultados

**Estimativa:** 8-12 horas  
**Arquivos:** `server/bestTimePredictor.ts`

---

### 14. Edição de Transcrição Inline
**Por quê:** Whisper erra ~5%, usuário precisa corrigir

- [ ] Criar editor de texto inline
- [ ] Mostrar transcrição com timestamps
- [ ] Permitir editar texto
- [ ] Regenerar legendas após edição
- [ ] Adicionar atalhos de teclado
- [ ] Auto-save durante edição
- [ ] Sugestões de correção ortográfica PT-BR

**Estimativa:** 8-12 horas  
**Arquivos:** `client/src/components/TranscriptionEditor.tsx`

---

## 🟢 P3 - Baixa Prioridade (60-90 dias)

### 15. Diarização de Falantes
**Por quê:** Identificar quem está falando (útil para podcasts)

- [ ] Integrar Whisper com diarização
- [ ] Identificar automaticamente speakers
- [ ] Criar legendas separadas por pessoa
- [ ] Adicionar cortes limpos entre falantes
- [ ] Permitir edição manual de speakers

**Estimativa:** 12-16 horas

---

### 16. API Pública
**Por quê:** Permitir integrações de terceiros

- [ ] Criar documentação OpenAPI
- [ ] Implementar autenticação via API keys
- [ ] Rate limiting por API key
- [ ] Endpoints principais:
  - `POST /api/v1/jobs` - Criar job
  - `GET /api/v1/jobs/:id` - Status do job
  - `GET /api/v1/clips/:id` - Download de clipe
- [ ] Criar playground interativo
- [ ] Publicar em RapidAPI

**Estimativa:** 16-20 horas

---

### 17. White Label para Agências
**Por quê:** Monetizar B2B com plano enterprise

- [ ] Permitir customização de logo
- [ ] Permitir customização de cores
- [ ] Domínio customizado por agência
- [ ] Multi-tenancy (isolamento de dados)
- [ ] Faturamento por agência
- [ ] Painel de admin para agências

**Estimativa:** 24-32 horas

---

### 18. Upload de Vídeo Local
**Por quê:** Alguns usuários não têm vídeos no YouTube

- [ ] Adicionar input de upload de arquivo
- [ ] Validar formato (MP4, MOV, AVI)
- [ ] Validar tamanho (máx 2GB)
- [ ] Upload para S3 temporário
- [ ] Processar igual vídeo do YouTube
- [ ] Limpar arquivo temporário após processamento

**Estimativa:** 6-8 horas

---

### 19. Biblioteca de Hooks Treinados em PT-BR
**Por quê:** Melhorar qualidade das headlines geradas

- [ ] Coletar 1000+ hooks virais BR
- [ ] Treinar modelo de geração de hooks
- [ ] Sugerir hooks baseados no nicho
- [ ] A/B testing de hooks
- [ ] Aprendizado contínuo com resultados

**Estimativa:** 20-24 horas

---

### 20. Auto-Hashtags por Nicho
**Por quê:** Otimizar descoberta nas plataformas

- [ ] Criar banco de hashtags por nicho
- [ ] Analisar hashtags trending
- [ ] Sugerir automaticamente 5-10 hashtags
- [ ] Permitir edição manual
- [ ] Aplicar hashtags na publicação

**Estimativa:** 4-6 horas

---

## 📊 Resumo de Estimativas

| Prioridade | Total de Horas | Prazo |
|------------|---------------|-------|
| **P0 (Crítico)** | 9-14h | Hoje |
| **P1 (Alta)** | 44-62h | 7 dias |
| **P2 (Média)** | 60-88h | 30 dias |
| **P3 (Baixa)** | 90-128h | 60-90 dias |
| **TOTAL** | 203-292h | 90 dias |

---

## 🎯 Roadmap Sugerido

### Semana 1 (P0 + P1 Crítico)
- ✅ Termos de Uso e Compliance
- ✅ Testar fluxo end-to-end
- ✅ Corrigir bugs críticos
- 🚧 Sistema multilíngue (50%)

### Semana 2 (P1 Continuação)
- ✅ Sistema multilíngue (100%)
- ✅ Agendamento automático
- ✅ Preview de thumbnails
- 🚧 Landing page reposicionada (50%)

### Semana 3-4 (P1 Final + P2 Início)
- ✅ Landing page reposicionada (100%)
- ✅ Integração Facebook Reels
- ✅ Configurar OAuth APIs
- ✅ Score de retenção na UI
- 🚧 Painel de analytics (30%)

### Mês 2 (P2)
- ✅ Painel de analytics (100%)
- ✅ A/B testing
- ✅ Detecção de melhor horário
- ✅ Edição de transcrição

### Mês 3 (P3)
- ✅ Diarização de falantes
- ✅ API pública
- 🚧 White label (planejamento)

---

## 🚀 Próximos Passos Imediatos

1. **Hoje**: Implementar Termos de Uso (4-6h)
2. **Hoje**: Testar fluxo completo (2-3h)
3. **Amanhã**: Começar sistema multilíngue (8-12h)
4. **Esta semana**: Agendamento automático (12-16h)

**Meta**: Lançar versão beta pública em 7-10 dias! 🎉
