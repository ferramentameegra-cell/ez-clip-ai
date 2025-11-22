# 🌍 Sistema de Idiomas - Viral Clips AI

## 📋 Respostas às suas perguntas:

### 1. ✅ **Sim, nas configurações tem opção de mudar o idioma**

A página de **Configurações** (`/settings`) possui um seletor de idioma na seção "Preferências":
- 🇧🇷 Português (pt-BR)
- 🇺🇸 English (en)
- 🇪🇸 Español (es)

O idioma selecionado é salvo:
- No `localStorage` do navegador
- No perfil do usuário no banco de dados
- Persiste entre sessões

---

### 2. ✅ **Sim, o idioma muda automaticamente de acordo com a localização**

O sistema detecta automaticamente o idioma do navegador na primeira visita:

**Ordem de prioridade:**
1. **localStorage** (preferência salva anteriormente)
2. **Perfil do usuário** (se estiver logado)
3. **Idioma do navegador** (detecção automática)
4. **Padrão: Português (pt-BR)**

**Detecção automática:**
- Se o navegador estiver em inglês → `en`
- Se o navegador estiver em espanhol → `es`
- Se o navegador estiver em português → `pt-BR`
- Qualquer outro idioma → `pt-BR` (padrão)

---

### 3. ❌ **NÃO, cada idioma é independente**

**As traduções são separadas por idioma no código:**

```typescript
export const translations = {
  'pt-BR': {
    'home.title': 'Transforme 1 Vídeo em 60 Dias...',
    // ... todas as traduções em português
  },
  'en': {
    'home.title': 'Transform 1 Video into 60 Days...',
    // ... todas as traduções em inglês
  },
  'es': {
    'home.title': 'Transforma 1 Video en 60 Días...',
    // ... todas as traduções em espanhol
  },
};
```

**Isso significa:**
- ✅ Alterar uma tradução em português **NÃO** altera inglês ou espanhol
- ✅ Cada idioma tem suas próprias strings
- ✅ Você pode ter traduções diferentes para cada idioma
- ✅ Se uma tradução não existir em um idioma, o sistema usa o português como fallback

---

## 🔧 Como funciona tecnicamente:

### 1. **Hook `useI18n`** (`client/src/hooks/useI18n.ts`)

```typescript
const { t, language, setLanguage } = useI18n();
```

- `t(key)` - Função para traduzir uma chave
- `language` - Idioma atual
- `setLanguage(lang)` - Mudar idioma

### 2. **Função de tradução** (`shared/i18n.ts`)

```typescript
getTranslation('home.title', 'pt-BR') // Retorna tradução em português
getTranslation('home.title', 'en')    // Retorna tradução em inglês
```

### 3. **Uso nos componentes**

```tsx
<h1>{t('home.title')}</h1>
// Se language = 'pt-BR' → "Transforme 1 Vídeo em 60 Dias..."
// Se language = 'en' → "Transform 1 Video into 60 Days..."
```

---

## 📝 Como adicionar/editar traduções:

### Adicionar nova chave de tradução:

1. Abra `shared/i18n.ts`
2. Adicione a chave nos 3 idiomas:

```typescript
export const translations = {
  'pt-BR': {
    // ... traduções existentes
    'nova.chave': 'Texto em português',
  },
  'en': {
    // ... traduções existentes
    'nova.chave': 'Text in English',
  },
  'es': {
    // ... traduções existentes
    'nova.chave': 'Texto en español',
  },
};
```

3. Use no componente:

```tsx
{t('nova.chave')}
```

### Editar tradução existente:

1. Abra `shared/i18n.ts`
2. Encontre a chave no idioma desejado
3. Altere apenas aquele idioma
4. Os outros idiomas permanecem inalterados

**Exemplo:**
```typescript
// Alterar apenas português
'pt-BR': {
  'home.title': 'NOVO TEXTO EM PORTUGUÊS', // ← Alterado
},
'en': {
  'home.title': 'Transform 1 Video...', // ← Não alterado
},
'es': {
  'home.title': 'Transforma 1 Video...', // ← Não alterado
},
```

---

## 🎯 Fluxo completo:

1. **Primeira visita:**
   - Sistema detecta idioma do navegador
   - Salva no `localStorage`
   - Aplica traduções automaticamente

2. **Usuário muda idioma nas configurações:**
   - Seleciona novo idioma
   - Clica em "Salvar"
   - Idioma é salvo no perfil do usuário
   - Toda a interface atualiza instantaneamente

3. **Próxima visita:**
   - Sistema carrega idioma do perfil do usuário
   - Se não houver perfil, usa `localStorage`
   - Se não houver `localStorage`, detecta navegador

---

## ✅ Resumo:

| Pergunta | Resposta |
|----------|----------|
| Tem opção de mudar idioma nas configurações? | ✅ Sim |
| Detecta idioma automaticamente? | ✅ Sim, pela localização do navegador |
| Alterar um idioma afeta os outros? | ❌ Não, cada idioma é independente |
| Traduções são salvas no perfil? | ✅ Sim |
| Persiste entre sessões? | ✅ Sim |

---

## 🚀 Próximos passos (opcional):

- [ ] Adicionar mais idiomas (francês, italiano, etc.)
- [ ] Sistema de tradução colaborativa
- [ ] Exportar/importar traduções
- [ ] Editor visual de traduções

