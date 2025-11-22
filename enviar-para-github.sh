#!/bin/bash

# Script para enviar código EZ CLIP AI para GitHub
# Execute este script no terminal

echo "🚀 Preparando EZ CLIP AI para GitHub..."
echo ""

# Verificar se está na pasta certa
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta do projeto!"
    echo "   Use: cd Downloads/viral-clips-ai"
    exit 1
fi

# Inicializar Git (se não estiver inicializado)
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
fi

# Adicionar todos os arquivos
echo "📝 Adicionando arquivos..."
git add .

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "Initial commit - EZ CLIP AI" || echo "⚠️  Nada para commitar (já está tudo commitado)"

# Renomear branch para main
echo "🔄 Renomeando branch para main..."
git branch -M main

echo ""
echo "✅ Preparação local concluída!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Crie o repositório no GitHub:"
echo "   Acesse: https://github.com/new"
echo "   Nome: ez-clip-ai"
echo "   NÃO marque nenhuma opção"
echo "   Clique em 'Create repository'"
echo ""
echo "2. Depois que criar, cole este comando (substitua SEU_USUARIO):"
echo ""
echo "   git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git"
echo "   git push -u origin main"
echo ""
echo "   ⚠️  IMPORTANTE: Substitua SEU_USUARIO pelo seu nome de usuário do GitHub!"
echo ""
echo "3. Se pedir login, use um Personal Access Token:"
echo "   Acesse: https://github.com/settings/tokens"
echo "   Clique em 'Generate new token (classic)'"
echo "   Marque 'repo' e gere o token"
echo "   Use o token como senha (não sua senha normal)"
echo ""

