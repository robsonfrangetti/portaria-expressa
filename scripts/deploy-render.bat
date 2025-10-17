@echo off
echo 🚀 Deploying Portaria Expressa to Render...
echo ================================================

REM Check if git is clean
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Uncommitted changes detected. Committing them...
    git add .
    git commit -m "Deploy: %date% %time%"
)

REM Push to GitHub
echo ✅ Pushing to GitHub...
git push origin main

echo ✅ Deploy initiated!
echo.
echo 📋 Next steps:
echo 1. Go to https://dashboard.render.com
echo 2. Create Web Service for backend with these settings:
echo    - Build Command: cd backend ^&^& npm install ^&^& npm run build
echo    - Start Command: cd backend ^&^& npm start
echo    - Environment Variables:
echo      * DATABASE_URL: postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
echo      * JWT_SECRET: portaria-expressa-jwt-secret-2024-super-secure-key
echo      * NODE_ENV: production
echo      * PORT: 3001
echo      * FRONTEND_URL: https://www.portariaexpressa.com.br
echo.
echo 3. Create Static Site for frontend with these settings:
echo    - Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo    - Publish Directory: frontend/dist
echo    - Environment Variables:
echo      * VITE_API_URL: https://api.portariaexpressa.com.br
echo.
echo 4. Configure custom domains:
echo    - Backend: api.portariaexpressa.com.br
echo    - Frontend: www.portariaexpressa.com.br
echo.
echo 5. Configure DNS records in your domain provider
echo.
echo 🌐 URLs after deploy:
echo    - Frontend: https://www.portariaexpressa.com.br
echo    - API: https://api.portariaexpressa.com.br/health
echo.
echo ✅ Deploy script completed!
pause
