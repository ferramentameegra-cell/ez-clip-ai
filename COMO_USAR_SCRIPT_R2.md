# 🚀 Como Criar Token R2 com o Script

## ✅ Você Tem Tudo Que Precisa!

- Account ID: `45a4af538d59d53aa52ef8179165e0da`
- Token: `nt4Lq9mD91OUrUD9Pw9Vkd7TExuMCe128MUcPjcM`

---

## 🔧 Opção 1: Via API do Cloudflare (Mais Simples)

Vou criar um comando curl que você pode executar diretamente no terminal!

---

## 🚀 Comando para Executar

Copie e cole este comando no seu terminal:

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/45a4af538d59d53aa52ef8179165e0da/r2/api-token" \
  -H "Authorization: Bearer nt4Lq9mD91OUrUD9Pw9Vkd7TExuMCe128MUcPjcM" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ez-clip-ai-r2-token"
  }'
```

---

## 📋 O Que Esperar

Se funcionar, você verá algo como:

```json
{
  "result": {
    "access_key_id": "a1b2c3d4e5f6...",
    "secret_access_key": "xyz123abc456..."
  }
}
```

**⚠️ COPIE AS CREDENCIAIS AGORA!**

---

## 🆘 Se Não Funcionar

Se o comando não funcionar, pode ser que o token precise de permissões específicas.

**Nesse caso, vamos criar manualmente:**

1. Acesse: https://dash.cloudflare.com
2. R2 → Seu bucket → Settings
3. Procure por "S3 API" ou "API Access"

---

## ✅ Próxima Ação

**Execute o comando acima no terminal e me diga o resultado!** 🚀

Se funcionar, você terá:
- Access Key ID
- Secret Access Key

**E depois eu configuro tudo no Railway para você!** 💪

