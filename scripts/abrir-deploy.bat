@echo off
echo 🚀 ABRINDO PÁGINAS PARA DEPLOY AUTOMÁTICO...
echo ================================================

echo.
echo 📋 Abrindo páginas do Render...
echo.

REM Abrir páginas do Render
start "" "https://dashboard.render.com/web/new"
timeout /t 2 /nobreak >nul
start "" "https://dashboard.render.com/new/static-site"

echo.
echo 📋 Abrindo páginas de configuração DNS...
echo.

REM Abrir páginas de DNS
start "" "https://registro.br"
timeout /t 2 /nobreak >nul
start "" "https://dnschecker.org"

echo.
echo 📋 Abrindo documentação...
echo.

REM Abrir documentação
start "" "https://render.com/docs"
timeout /t 2 /nobreak >nul
start "" "https://neon.tech/docs"

echo.
echo ✅ TODAS AS PÁGINAS ABERTAS!
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. BACKEND (Web Service):
echo    - Build Command: cd backend ^&^& npm install ^&^& npm run build
echo    - Start Command: cd backend ^&^& npm start
echo    - Environment Variables:
echo      * DATABASE_URL: postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
echo      * JWT_SECRET: portaria-expressa-jwt-secret-2024-super-secure-key
echo      * NODE_ENV: production
echo      * PORT: 3001
echo      * FRONTEND_URL: https://www.portariaexpressa.com.br
echo.
echo 2. FRONTEND (Static Site):
echo    - Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo    - Publish Directory: frontend/dist
echo    - Environment Variables:
echo      * VITE_API_URL: https://api.portariaexpressa.com.br
echo.
echo 3. DOMÍNIOS:
echo    - Backend: api.portariaexpressa.com.br
echo    - Frontend: www.portariaexpressa.com.br
echo.
echo 4. DNS:
echo    - CNAME api → [URL do backend]
echo    - CNAME www → [URL do frontend]
echo.
echo 🌐 URLs FINAIS:
echo    - Site: https://www.portariaexpressa.com.br
echo    - API: https://api.portariaexpressa.com.br/health
echo.
echo 👤 CREDENCIAIS:
echo    - Super Admin: admin@portariaexpressa.com / admin123
echo    - Empresa: admin@empresaexemplo.com / admin123
echo    - Operador: operador@empresaexemplo.com / operador123
echo.
pause
