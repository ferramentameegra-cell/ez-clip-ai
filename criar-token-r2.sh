#!/bin/bash

# Script para criar token R2 no Cloudflare via API

ACCOUNT_ID="45a4af538d59d53aa52ef8179165e0da"
API_TOKEN="nt4Lq9mD91OUrUD9Pw9Vkd7TExuMCe128MUcPjcM"

echo "🔄 Criando token R2 no Cloudflare..."
echo ""

# Tentar criar token R2
RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/api-token" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ez-clip-ai-r2-token",
    "permissions": ["object_read_write"]
  }')

# Verificar se funcionou
if echo "$RESPONSE" | grep -q "access_key_id\|Access Key ID"; then
  echo "✅ Token criado com sucesso!"
  echo ""
  echo "📋 CREDENCIAIS - COPIE AGORA:"
  echo "═══════════════════════════════════════════════════════════"
  echo "$RESPONSE" | grep -o '"access_key_id":"[^"]*"' | cut -d'"' -f4
  echo ""
  echo "$RESPONSE" | grep -o '"secret_access_key":"[^"]*"' | cut -d'"' -f4
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "⚠️  IMPORTANTE: A Secret Access Key só aparece uma vez!"
  echo "    Copie e guarde em local seguro!"
else
  echo "❌ Erro ao criar token via API"
  echo ""
  echo "💡 SOLUÇÃO MANUAL:"
  echo "1. Acesse: https://dash.cloudflare.com"
  echo "2. Vá em R2 → Overview"
  echo "3. Procure por 'Manage R2 API Tokens' ou 'API Access'"
  echo "4. Crie um novo token"
  echo ""
  echo "Ou me envie o erro abaixo:"
  echo "$RESPONSE"
fi

