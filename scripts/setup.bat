@echo off
echo 🚀 Configurando Portaria Expressa...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale o Node.js 18+ primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar se o PostgreSQL está instalado
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL não encontrado. Certifique-se de ter o PostgreSQL instalado.
)

REM Instalar dependências
echo 📦 Instalando dependências...

REM Backend
echo 📦 Instalando dependências do backend...
cd backend
call npm install
cd ..

REM Frontend
echo 📦 Instalando dependências do frontend...
cd frontend
call npm install
cd ..

REM Configurar arquivos de ambiente
echo ⚙️  Configurando arquivos de ambiente...

REM Backend .env
if not exist backend\.env (
    echo 📝 Criando arquivo .env para o backend...
    copy backend\env.example backend\.env
    echo ⚠️  Edite o arquivo backend\.env com suas configurações
)

REM Gerar Prisma client
echo 🔧 Gerando Prisma client...
cd backend
call npx prisma generate
cd ..

echo ✅ Configuração inicial concluída!
echo.
echo 📋 Próximos passos:
echo 1. Edite o arquivo backend\.env com suas configurações de banco
echo 2. Execute as migrações: cd backend ^&^& npx prisma db push
echo 3. Execute o seed (opcional): cd backend ^&^& npm run seed
echo 4. Inicie o desenvolvimento: npm run dev
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health

pause
