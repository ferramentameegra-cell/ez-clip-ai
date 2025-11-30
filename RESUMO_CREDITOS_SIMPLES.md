# 💳 Sistema de Créditos - Resumo Simples

## 🎯 Resposta Direta

**"Um crédito faz um vídeo de 60s?"**

**NÃO!** A regra é:

### ✅ **1 crédito = 1 clipe gerado** (não importa a duração!)

- Clipe de 30s = **1 crédito**
- Clipe de 60s = **1 crédito**  
- Clipe de 90s = **1 crédito**

---

## 📊 Como Funciona Hoje

### Sistema de Pacotes

| Pacote | Quantos Clipes | Duração/Clipe | Créditos |
|--------|----------------|---------------|----------|
| **Pack 5** | 5 clipes | ~90s | 5 créditos |
| **Pack 10** | 10 clipes | ~60s | 10 créditos |
| **Pack 50** | 50 clipes | ~45s | 50 créditos |
| **Pack 100** | 100 clipes | ~30s | 100 créditos |

**Importante:**
- ✅ Você paga apenas pelos clipes **realmente gerados**
- ✅ Se escolher Pack 10 mas só gerar 7 clipes = paga 7 créditos
- ✅ **A duração do clipe NÃO importa!**

---

### Exemplo Real

**Pacote 10 (60s por clipe):**
- Escolhe Pack 10 → precisa de 10 créditos
- Processa vídeo → gera 10 clipes de 60s cada
- Sistema debita: **10 créditos**
- **Resultado:** 1 crédito = 1 clipe de 60s ✅

---

## 💡 Resumo

**Regra Principal:**
- ✅ **1 crédito = 1 clipe gerado**
- ✅ Duração não importa (30s, 60s, 90s = mesmo preço)
- ✅ Paga apenas pelos clipes gerados

---

## 🔧 Onde Está no Código

1. **Verificação:** `server/routers/video.ts` - Verifica créditos antes
2. **Débito:** `server/jobProcessor.ts` - Debita após gerar clipes
3. **Gerenciamento:** `server/creditsManager.ts` - Funções principais

---

**Ficou claro?** 💪

