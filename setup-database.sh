#!/bin/bash

echo "🗄️  Configurando Banco de Dados para Viral Clips AI"
echo ""

# Verificar se Docker está instalado
if command -v docker &> /dev/null; then
    echo "✅ Docker encontrado!"
    echo ""
    echo "📦 Iniciando MySQL via Docker..."
    
    # Parar container existente se houver
    docker stop mysql-viral-clips 2>/dev/null
    docker rm mysql-viral-clips 2>/dev/null
    
    # Criar e iniciar container MySQL
    docker run --name mysql-viral-clips \
      -e MYSQL_ROOT_PASSWORD=root123 \
      -e MYSQL_DATABASE=viral_clips_ai \
      -e MYSQL_USER=viral_user \
      -e MYSQL_PASSWORD=viral_pass \
      -p 3306:3306 \
      -d mysql:8.0
    
    echo "⏳ Aguardando MySQL iniciar (10 segundos)..."
    sleep 10
    
    echo "✅ MySQL rodando em Docker!"
    echo ""
    echo "📝 Atualizando .env..."
    
    # Atualizar DATABASE_URL no .env
    if [ -f .env ]; then
        sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=mysql://viral_user:viral_pass@localhost:3306/viral_clips_ai|' .env
        echo "✅ .env atualizado!"
    else
        echo "⚠️  Arquivo .env não encontrado. Criando..."
        cat > .env << 'ENVEOF'
# Banco de Dados
DATABASE_URL=mysql://viral_user:viral_pass@localhost:3306/viral_clips_ai

# JWT
JWT_SECRET=viral-clips-secret-key-change-in-production-2024

# Manus Forge API (Whisper) - OPCIONAL
BUILT_IN_FORGE_API_KEY=
BUILT_IN_FORGE_API_URL=https://api.manus.im

# S3 Storage - OPCIONAL
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=viral-clips

# OAuth APIs - OPCIONAL
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

# Stripe - OPCIONAL
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:3000
ENVEOF
        echo "✅ Arquivo .env criado!"
    fi
    
    echo ""
    echo "📊 Aplicando migrations..."
    npm run db:push
    
    echo ""
    echo "✅ CONFIGURAÇÃO COMPLETA!"
    echo ""
    echo "📋 Credenciais do banco:"
    echo "   Host: localhost:3306"
    echo "   Database: viral_clips_ai"
    echo "   User: viral_user"
    echo "   Password: viral_pass"
    echo ""
    echo "🚀 Próximos passos:"
    echo "   1. Reinicie o backend: npm run dev:server"
    echo "   2. Acesse: http://localhost:3000"
    echo "   3. Crie sua conta na página de login"
    echo ""
    
elif command -v brew &> /dev/null; then
    echo "✅ Homebrew encontrado!"
    echo ""
    echo "📦 Instalando MySQL via Homebrew..."
    brew install mysql
    
    echo "🚀 Iniciando MySQL..."
    brew services start mysql
    
    echo "⏳ Aguardando MySQL iniciar (5 segundos)..."
    sleep 5
    
    echo "📝 Criando banco de dados..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS viral_clips_ai;"
    
    echo "✅ MySQL configurado!"
    echo ""
    echo "⚠️  IMPORTANTE: Ajuste a senha no arquivo .env"
    echo "   DATABASE_URL=mysql://root:SUA_SENHA@localhost:3306/viral_clips_ai"
    echo ""
    echo "📊 Aplicando migrations..."
    npm run db:push
    
    echo ""
    echo "✅ CONFIGURAÇÃO COMPLETA!"
    
else
    echo "❌ Docker ou Homebrew não encontrados!"
    echo ""
    echo "Por favor, instale uma das opções:"
    echo "  1. Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo "  2. Homebrew: https://brew.sh"
    echo ""
    echo "Ou configure MySQL manualmente seguindo: CONFIGURAR_BANCO_DADOS.md"
    exit 1
fi

