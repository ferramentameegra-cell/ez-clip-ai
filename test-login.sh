#!/bin/bash

# Script de teste do endpoint de login
# Uso: ./test-login.sh [URL_BACKEND]

BACKEND_URL="${1:-http://localhost:3001}"
echo "🧪 Testando endpoint de login em: $BACKEND_URL/auth/login"
echo ""

# Teste 1: Login com dados válidos (se você tiver um usuário)
echo "📝 Teste 1: Login com email e senha"
echo "Email: teste@example.com"
echo "Senha: (forneça a senha)"
echo ""
echo "curl -X POST $BACKEND_URL/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"teste@example.com\",\"password\":\"sua_senha\"}'"
echo ""

# Teste 2: Email inválido
echo "📝 Teste 2: Email inválido"
curl -X POST "$BACKEND_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"email-invalido","password":"senha123"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' || echo "Resposta recebida"
echo ""

# Teste 3: Email vazio
echo "📝 Teste 3: Email vazio"
curl -X POST "$BACKEND_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"","password":"senha123"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' || echo "Resposta recebida"
echo ""

# Teste 4: Senha vazia
echo "📝 Teste 4: Senha vazia"
curl -X POST "$BACKEND_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"teste@example.com","password":""}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' || echo "Resposta recebida"
echo ""

# Teste 5: Health check
echo "📝 Teste 5: Health check"
curl -X GET "$BACKEND_URL/health" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' || echo "Resposta recebida"
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "Para testar login real, execute:"
echo "curl -X POST $BACKEND_URL/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"seu_email@example.com\",\"password\":\"sua_senha\"}'"

