# 💳 Como Funciona o Sistema de Créditos - EZ Clip AI

## 🎯 Resumo Rápido

**1 crédito = 1 clipe gerado** (independente da duração)

---

## 📊 Sistema Atual de Créditos

### Sistema de Pacotes (Novo)

Quando o usuário escolhe um **packageSize** (5, 10, 50, 100):

- ✅ **1 crédito = 1 clipe gerado**
- ✅ **Pacote 5** = Consome até 5 créditos (se gerar 5 clipes)
- ✅ **Pacote 10** = Consome até 10 créditos (se gerar 10 clipes)
- ✅ **Pacote 50** = Consome até 50 créditos (se gerar 50 clipes)
- ✅ **Pacote 100** = Consome até 100 créditos (se gerar 100 clipes)

**Exemplo:**
- Usuário escolhe **Pacote 10**
- Sistema verifica: precisa de **10 créditos** antes de processar
- Após processar: gera **10 clipes** de ~60s cada
- Sistema debita: **10 créditos** (1 por clipe)

---

### Sistema Legado (Sem Pacote)

Se o usuário **não escolher pacote**:

- ✅ **1 crédito = 1 job completo**
- ✅ Não importa quantos clipes sejam gerados
- ✅ Debitado após o processamento completo

---

## 🔍 Como Está Implementado

### 1. Verificação de Créditos (Antes de Processar)

**Arquivo:** `server/routers/video.ts`

```typescript
// Se usar pacote
if (input.packageSize) {
  creditsNeeded = packageSize; // Ex: 5, 10, 50, 100
}

// Verifica se tem créditos suficientes
const hasCredits = await hasEnoughCredits(userId, creditsNeeded);
if (!hasCredits) {
  throw new Error('Créditos insuficientes');
}
```

---

### 2. Débito de Créditos (Após Processar)

**Arquivo:** `server/jobProcessor.ts`

```typescript
// Após gerar todos os clipes
const creditsToConsume = clips.length; // Número de clipes gerados
await decrementUserCredits(job.userId, creditsToConsume);
```

**Importante:** Debita **quantos clipes foram realmente gerados**, não o tamanho do pacote!

---

## 📋 Exemplos Práticos

### Exemplo 1: Pacote 10

1. Usuário tem **15 créditos**
2. Escolhe **Pacote 10**
3. Sistema verifica: precisa de **10 créditos** ✅
4. Processa vídeo e gera **10 clipes** de 60s cada
5. Sistema debita: **10 créditos**
6. Sobram: **5 créditos**

---

### Exemplo 2: Sem Pacote (Legado)

1. Usuário tem **5 créditos**
2. Não escolhe pacote
3. Sistema verifica: precisa de **1 crédito** ✅
4. Processa vídeo e gera **8 clipes** de 60s cada
5. Sistema debita: **1 crédito** (sistema legado)
6. Sobram: **4 créditos**

---

### Exemplo 3: Vídeo Curto (Pacote 10)

1. Usuário escolhe **Pacote 10**
2. Vídeo original tem apenas **3 minutos** (180s)
3. Sistema só consegue gerar **3 clipes** de 60s
4. Sistema debita: **3 créditos** (não 10!)
5. ✅ **Economia:** Usuário só paga pelo que foi gerado

---

## ✅ Regras Importantes

1. ✅ **1 crédito = 1 clipe gerado** (não importa a duração)
2. ✅ **Debita apenas clipes gerados** (não o tamanho do pacote)
3. ✅ **Verifica créditos antes** de processar
4. ✅ **Debita após** processar (se falhar, não debita)
5. ✅ **Admins não pagam** (daniel.braun@hotmail.com e Josyasborba@hotmail.com)

---

## 💰 Créditos Iniciais

**Novo usuário recebe:** 3 créditos grátis

**Onde está definido:**
- `server/auth.ts` - Linha 106: `credits: 3`

---

## 🔧 Configuração dos Pacotes

**Arquivo:** `server/presets.ts`

Cada pacote tem:
- **Tamanho:** 5, 10, 50, 100 clipes
- **Duração alvo:** 30s, 45s, 60s, 90s
- **Overlap:** 0.4s a 2.0s entre clipes
- **Modo:** fixed, semantic, hybrid

---

## 📊 Tabela de Pacotes

| Pacote | Clipes | Duração/Clipe | Créditos Necessários |
|--------|--------|---------------|---------------------|
| **Pack 5** | 5 | ~90s | 5 créditos |
| **Pack 10** | 10 | ~60s | 10 créditos |
| **Pack 50** | 50 | ~45s | 50 créditos |
| **Pack 100** | 100 | ~30s | 100 créditos |

**Importante:** Se gerar menos clipes que o pacote, debita apenas os gerados!

---

## 🎯 Resumo Final

**Como funciona hoje:**

1. **Sistema de Pacotes (Principal):**
   - 1 crédito = 1 clipe gerado
   - Verifica créditos antes (tamanho do pacote)
   - Debita depois (quantidade de clipes gerados)

2. **Sistema Legado:**
   - 1 crédito = 1 job completo
   - Não importa quantos clipes

3. **Admins:**
   - Créditos ilimitados
   - Nunca são debitados

---

**Está claro?** 💪

