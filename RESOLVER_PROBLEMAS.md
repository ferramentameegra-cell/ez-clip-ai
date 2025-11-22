# 🔧 RESOLVER PROBLEMAS

## Se o site não estiver funcionando:

### 1. Pare TODOS os servidores
```bash
# Pressione Ctrl+C em todos os terminais que estão rodando
```

### 2. Limpe o cache completamente
```bash
rm -rf node_modules/.vite .vite client/dist
```

### 3. Reinicie o backend
```bash
npm run dev:server
```

### 4. Em OUTRO terminal, reinicie o frontend
```bash
npm run dev
```

### 5. Acesse
- Frontend: http://localhost:3002/ (ou a porta que aparecer)
- Backend: http://localhost:3001/health

---

## Se ainda não funcionar:

### Verificar se os arquivos estão corretos:
```bash
# Verificar se trpc-client.tsx existe
ls -la client/src/lib/trpc-client.tsx

# Verificar conteúdo
cat client/src/lib/trpc-client.tsx
```

### Verificar se o backend está rodando:
```bash
curl http://localhost:3001/health
```

### Verificar erros no console do navegador:
1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Veja os erros

---

## URLs:
- Frontend: http://localhost:3002/
- Backend: http://localhost:3001
