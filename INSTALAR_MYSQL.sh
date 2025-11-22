#!/bin/bash

echo "📦 Instalando MySQL via Homebrew..."
echo ""

# Verificar se Homebrew está instalado
if ! command -v brew &> /dev/null; then
    echo "⚠️  Homebrew não encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Adicionar ao PATH
    if [ -f "/opt/homebrew/bin/brew" ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

echo "✅ Homebrew instalado!"
echo ""

# Instalar MySQL
echo "📦 Instalando MySQL..."
brew install mysql

echo ""
echo "🚀 Iniciando MySQL..."
brew services start mysql

echo ""
echo "⏳ Aguardando MySQL iniciar (5 segundos)..."
sleep 5

echo ""
echo "📊 Criando banco de dados..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS viral_clips_ai;" 2>/dev/null || {
    echo "⚠️  Não foi possível criar banco automaticamente."
    echo "   Execute manualmente: mysql -u root -p -e 'CREATE DATABASE viral_clips_ai;'"
}

echo ""
echo "✅ MySQL instalado e configurado!"
echo ""
echo "📝 Próximos passos:"
echo "   1. npm run db:push"
echo "   2. npm run db:studio"
echo "   3. npm run dev:server"
