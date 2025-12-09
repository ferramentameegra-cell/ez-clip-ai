#!/bin/bash

# Script para executar SQL no Railway via CLI
# Execute: bash EXECUTAR_SQL_RAILWAY_CLI.sh

echo "🔧 Executando SQL no Railway via CLI..."
echo ""

# Ler variáveis do Railway
echo "📋 Obtendo variáveis do Railway..."
MYSQLHOST=$(railway variables --service mysql --json | grep -o '"MYSQLHOST":"[^"]*"' | cut -d'"' -f4 || railway variables --json | grep -o '"MYSQLHOST":"[^"]*"' | cut -d'"' -f4)
MYSQLUSER=$(railway variables --service mysql --json | grep -o '"MYSQLUSER":"[^"]*"' | cut -d'"' -f4 || railway variables --json | grep -o '"MYSQLUSER":"[^"]*"' | cut -d'"' -f4)
MYSQLPASSWORD=$(railway variables --service mysql --json | grep -o '"MYSQLPASSWORD":"[^"]*"' | cut -d'"' -f4 || railway variables --json | grep -o '"MYSQLPASSWORD":"[^"]*"' | cut -d'"' -f4)
MYSQLDATABASE=$(railway variables --service mysql --json | grep -o '"MYSQLDATABASE":"[^"]*"' | cut -d'"' -f4 || railway variables --json | grep -o '"MYSQLDATABASE":"[^"]*"' | cut -d'"' -f4)

if [ -z "$MYSQLHOST" ]; then
    echo "⚠️  Variáveis MySQL não encontradas."
    echo ""
    echo "💡 SOLUÇÃO MAIS FÁCIL:"
    echo ""
    echo "1. Acesse: https://railway.app"
    echo "2. Entre no projeto 'ez-clip-ai'"
    echo "3. Clique no MySQL"
    echo "4. Vá em 'Query' ou 'Connect'"
    echo "5. Cole e execute:"
    echo ""
    echo "ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;"
    echo "ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);"
    echo "ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;"
    echo ""
    exit 1
fi

echo "✅ Variáveis encontradas!"
echo ""
echo "📋 Executando SQL..."
echo ""

# Executar SQL
railway run --service mysql mysql -h "$MYSQLHOST" -u "$MYSQLUSER" -p"$MYSQLPASSWORD" "$MYSQLDATABASE" -e "ALTER TABLE users ADD COLUMN onboarding_use_case TEXT; ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255); ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SQL executado com sucesso!"
    echo ""
    echo "🔍 Verificando colunas..."
    railway run --service mysql mysql -h "$MYSQLHOST" -u "$MYSQLUSER" -p"$MYSQLPASSWORD" "$MYSQLDATABASE" -e "SHOW COLUMNS FROM users LIKE 'onboarding%';"
    echo ""
    echo "✅ Concluído!"
else
    echo ""
    echo "❌ Erro ao executar. Use o método via Dashboard acima."
fi

