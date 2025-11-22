#!/bin/bash

# Script para configurar tudo no Railway
# Execute: bash railway-setup.sh

echo "🚀 Configurando EZ CLIP AI no Railway..."
echo ""

# 1. Instalar Railway CLI
echo "📦 Passo 1: Instalando Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo "Instalando Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
else
    echo "✅ Railway CLI já está instalado"
fi

echo ""
echo "🔐 Passo 2: Fazendo login no Railway..."
railway login

echo ""
echo "🔗 Passo 3: Conectando ao projeto..."
cd "$(dirname "$0")"
railway link

echo ""
echo "📊 Passo 4: Verificando status do projeto..."
railway status

echo ""
echo "✅ Configuração completa!"
echo ""
echo "Próximos passos:"
echo "1. No Railway dashboard, adicione MySQL (Database → MySQL)"
echo "2. No Railway dashboard, adicione Redis (Database → Redis)"
echo "3. Configure variáveis de ambiente (veja VARIABLES_RAILWAY.txt)"
echo "4. Execute: railway run npm run db:push"
echo ""

