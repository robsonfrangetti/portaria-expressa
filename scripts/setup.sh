#!/bin/bash

# Script de configuração inicial do Portaria Expressa
echo "🚀 Configurando Portaria Expressa..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL não encontrado. Certifique-se de ter o PostgreSQL instalado."
fi

# Instalar dependências
echo "📦 Instalando dependências..."

# Backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Configurar arquivos de ambiente
echo "⚙️  Configurando arquivos de ambiente..."

# Backend .env
if [ ! -f backend/.env ]; then
    echo "📝 Criando arquivo .env para o backend..."
    cp backend/env.example backend/.env
    echo "⚠️  Edite o arquivo backend/.env com suas configurações"
fi

# Gerar Prisma client
echo "🔧 Gerando Prisma client..."
cd backend
npx prisma generate
cd ..

echo "✅ Configuração inicial concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite o arquivo backend/.env com suas configurações de banco"
echo "2. Execute as migrações: cd backend && npx prisma db push"
echo "3. Execute o seed (opcional): cd backend && npm run seed"
echo "4. Inicie o desenvolvimento: npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
