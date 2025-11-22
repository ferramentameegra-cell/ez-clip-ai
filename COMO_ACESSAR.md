# 🌐 COMO ACESSAR O SITE

## 📍 URLs Locais

### Frontend (Interface)
**http://localhost:3002/**

*Nota: O Vite pode usar portas diferentes (3000, 3001, 3002) dependendo do que estiver disponível.*

### Backend (API)
**http://localhost:3001**
- Health check: http://localhost:3001/health
- tRPC endpoint: http://localhost:3001/trpc

---

## 🚀 Como Iniciar

### 1. Terminal 1 - Backend
```bash
npm run dev:server
```

### 2. Terminal 2 - Frontend
```bash
npm run dev
```

### 3. Acessar
Abra o navegador em: **http://localhost:3002/** (ou a porta que o Vite mostrar)

---

## ✅ Verificar se está funcionando

1. **Backend:** Acesse http://localhost:3001/health
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **Frontend:** Acesse http://localhost:3002/
   - Deve mostrar a página inicial

---

## 🔧 Se não funcionar

1. **Limpar cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

2. **Reiniciar servidores:**
   - Pare ambos (Ctrl+C)
   - Inicie novamente

3. **Verificar portas:**
   ```bash
   lsof -ti:3000,3001,3002
   ```

