#!/bin/bash

echo "🚀 Deploying Portaria Expressa to Render..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    print_warning "Uncommitted changes detected. Committing them..."
    git add .
    git commit -m "Deploy: $(date)"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main

print_status "Deploy initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create Web Service for backend with these settings:"
echo "   - Build Command: cd backend && npm install && npm run build"
echo "   - Start Command: cd backend && npm start"
echo "   - Environment Variables:"
echo "     * DATABASE_URL: postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo "     * JWT_SECRET: portaria-expressa-jwt-secret-2024-super-secure-key"
echo "     * NODE_ENV: production"
echo "     * PORT: 3001"
echo "     * FRONTEND_URL: https://www.portariaexpressa.com.br"
echo ""
echo "3. Create Static Site for frontend with these settings:"
echo "   - Build Command: cd frontend && npm install && npm run build"
echo "   - Publish Directory: frontend/dist"
echo "   - Environment Variables:"
echo "     * VITE_API_URL: https://api.portariaexpressa.com.br"
echo ""
echo "4. Configure custom domains:"
echo "   - Backend: api.portariaexpressa.com.br"
echo "   - Frontend: www.portariaexpressa.com.br"
echo ""
echo "5. Configure DNS records in your domain provider"
echo ""
echo "🌐 URLs after deploy:"
echo "   - Frontend: https://www.portariaexpressa.com.br"
echo "   - API: https://api.portariaexpressa.com.br/health"
echo ""
print_status "Deploy script completed!"
