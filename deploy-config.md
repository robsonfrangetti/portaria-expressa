# Configuração de Deploy - portariaexpressa.com.br

## Opções de Deploy Recomendadas:

### 1. **Vercel (Frontend) + Railway (Backend) - MAIS FÁCIL**

**Frontend (Vercel):**
1. Acesse: https://vercel.com
2. Conecte sua conta GitHub
3. Importe o projeto
4. Configure:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://seu-backend.railway.app`

**Backend (Railway):**
1. Acesse: https://railway.app
2. Conecte sua conta GitHub
3. Importe o projeto
4. Configure:
   - Build Command: `cd backend && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `DATABASE_URL`: URL do banco PostgreSQL
     - `JWT_SECRET`: sua-chave-secreta
     - `FRONTEND_URL`: `https://portariaexpressa.com.br`

### 2. **Deploy Manual (VPS) - MAIS CONTROLE**

**Requisitos:**
- VPS com Ubuntu 20.04+
- Node.js 18+
- PostgreSQL 15+
- Nginx

**Passos:**
1. Configure DNS do domínio para apontar para o IP do VPS
2. Instale dependências no servidor
3. Configure SSL com Let's Encrypt
4. Configure Nginx como proxy reverso

### 3. **Docker + VPS - MAIS PROFISSIONAL**

**Vantagens:**
- Isolamento completo
- Fácil backup
- Escalabilidade
- Monitoramento

## Próximos Passos:

1. **Escolha uma opção acima**
2. **Configure o DNS** do domínio
3. **Configure SSL** (HTTPS)
4. **Teste o sistema** online

## Qual opção você prefere?
