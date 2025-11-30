# 💳 Como Funciona o Sistema de Créditos - Explicação Completa

## 🎯 Resposta Direta à Sua Pergunta

**"Um crédito faz um vídeo de 60s?"**

**NÃO exatamente!** O sistema funciona assim:

### ✅ **1 crédito = 1 clipe gerado** (não importa a duração!)

- ✅ Clipe de 30s = 1 crédito
- ✅ Clipe de 60s = 1 crédito
- ✅ Clipe de 90s = 1 crédito

**A duração NÃO importa!** O que importa é **quantos clipes** foram gerados.

---

## 📊 Sistema Atual de Créditos

### Sistema de Pacotes (Principal)

Quando o usuário escolhe um **packageSize**:

| Pacote | Clipes | Duração/Clipe | Créditos Necessários |
|--------|--------|---------------|---------------------|
| **Pack 5** | 5 clipes | ~90s cada | 5 créditos |
| **Pack 10** | 10 clipes | ~60s cada | 10 créditos |
| **Pack 50** | 50 clipes | ~45s cada | 50 créditos |
| **Pack 100** | 100 clipes | ~30s cada | 100 créditos |

**Como funciona:**

1. **Antes de processar:** Verifica se tem créditos suficientes (tamanho do pacote)
2. **Processa o vídeo:** Gera os clipes
3. **Após processar:** Debita apenas os clipes **realmente gerados**

**Exemplo:**
- Usuário escolhe **Pacote 10** (precisa de 10 créditos)
- Vídeo só gerou **7 clipes** (vídeo curto)
- Sistema debita: **7 créditos** (não 10!)
- ✅ **Economia:** Só paga pelo que foi gerado

---

### Sistema Legado (Sem Pacote)

Se o usuário **não escolher pacote**:

- ✅ **1 crédito = 1 job completo**
- ✅ Não importa quantos clipes foram gerados
- ✅ Debitado após processar

---

## 🔍 Exemplo Prático

### Exemplo 1: Pacote 10 (60s por clipe)

1. Usuário escolhe **Pacote 10**
2. Sistema verifica: precisa de **10 créditos** ✅
3. Processa vídeo de 15 minutos
4. Gera **10 clipes** de 60s cada
5. Sistema debita: **10 créditos**

**Resultado:** 1 crédito = 1 clipe de 60s ✅

---

### Exemplo 2: Pacote 5 (90s por clipe)

1. Usuário escolhe **Pacote 5**
2. Sistema verifica: precisa de **5 créditos** ✅
3. Processa vídeo de 10 minutos
4. Gera **5 clipes** de 90s cada
5. Sistema debita: **5 créditos**

**Resultado:** 1 crédito = 1 clipe de 90s ✅

---

### Exemplo 3: Vídeo Curto

1. Usuário escolhe **Pacote 10**
2. Sistema verifica: precisa de **10 créditos** ✅
3. Processa vídeo de 3 minutos (muito curto)
4. Gera apenas **3 clipes** de 60s cada
5. Sistema debita: **3 créditos** (não 10!)

**Resultado:** Pagou apenas pelos 3 clipes gerados! ✅

---

## 💡 Resumo

**Sistema de Pacotes:**
- ✅ 1 crédito = 1 clipe gerado
- ✅ Duração do clipe não importa (30s, 60s, 90s = mesmo preço)
- ✅ Paga apenas pelos clipes realmente gerados

**Sistema Legado:**
- ✅ 1 crédito = 1 job completo
- ✅ Não importa quantos clipes foram gerados

---

## 📋 Onde Está Implementado

**Verificação (Antes):** `server/routers/video.ts`
- Verifica se tem créditos suficientes para o pacote escolhido

**Débito (Depois):** `server/jobProcessor.ts`
- Debita apenas os clipes realmente gerados

**Gerenciamento:** `server/creditsManager.ts`
- Funções de verificar e debitar créditos

---

**Ficou claro?** A regra é: **1 crédito = 1 clipe gerado** (não importa a duração)! 💪

