# Deploy Completo - www.portariaexpressa.com.br

## 🚀 Configuração Completa para Domínio Personalizado

### 1. **BACKEND - Render (API)**

#### **Configuração do Serviço Web:**
- **Nome**: `portaria-expressa-backend`
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Instance Type**: `Starter` ($7/mês) ou `Free` para teste

#### **Variáveis de Ambiente:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=portaria-expressa-jwt-secret-2024-super-secure-key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://www.portariaexpressa.com.br
```

#### **Domínio Personalizado Backend:**
- **Subdomínio**: `api.portariaexpressa.com.br`
- **SSL**: Automático (Let's Encrypt)

### 2. **FRONTEND - Render (Static Site)**

#### **Configuração do Static Site:**
- **Nome**: `portaria-expressa-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

#### **Variáveis de Ambiente:**
```env
VITE_API_URL=https://api.portariaexpressa.com.br
```

#### **Domínio Personalizado Frontend:**
- **Domínio Principal**: `www.portariaexpressa.com.br`
- **SSL**: Automático (Let's Encrypt)

### 3. **CONFIGURAÇÃO DNS**

#### **Registros DNS necessários:**
```
Tipo: A
Nome: @
Valor: [IP do Render - será fornecido]

Tipo: CNAME
Nome: www
Valor: [URL do serviço Render]

Tipo: CNAME
Nome: api
Valor: [URL do backend Render]
```

### 4. **PASSOS PARA IMPLEMENTAR**

#### **Passo 1: Backend no Render**
1. Acesse: https://render.com/
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure as variáveis e comandos acima
5. Clique em "Deploy"

#### **Passo 2: Frontend no Render**
1. No Render, clique "New +" → "Static Site"
2. Conecte o mesmo repositório
3. Configure as variáveis e comandos acima
4. Clique em "Deploy"

#### **Passo 3: Configurar Domínios**
1. **Backend**: Settings → Custom Domains → Add `api.portariaexpressa.com.br`
2. **Frontend**: Settings → Custom Domains → Add `www.portariaexpressa.com.br`

#### **Passo 4: DNS**
1. Acesse seu provedor de domínio (Registro.br, GoDaddy, etc.)
2. Configure os registros DNS conforme especificado acima
3. Aguarde propagação (até 24h)

### 5. **CONFIGURAÇÕES ADICIONAIS**

#### **Nginx Configuration (Frontend):**
```nginx
server {
    listen 80;
    server_name www.portariaexpressa.com.br portariaexpressa.com.br;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass https://api.portariaexpressa.com.br;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### **CORS Configuration (Backend):**
```typescript
app.use(cors({
  origin: [
    'https://www.portariaexpressa.com.br',
    'https://portariaexpressa.com.br'
  ],
  credentials: true
}));
```

### 6. **TESTES PÓS-DEPLOY**

#### **URLs para testar:**
- **Frontend**: https://www.portariaexpressa.com.br
- **API Health**: https://api.portariaexpressa.com.br/health
- **Login**: https://www.portariaexpressa.com.br/login

#### **Credenciais de teste:**
- **Super Admin**: admin@portariaexpressa.com / admin123
- **Empresa**: admin@empresaexemplo.com / admin123
- **Operador**: operador@empresaexemplo.com / operador123

### 7. **MONITORAMENTO**

#### **Logs importantes:**
- Render Dashboard → Logs
- Neon Dashboard → Metrics
- Domínio → SSL Status

#### **Alertas recomendados:**
- Uptime monitoring
- Error rate monitoring
- Database connection monitoring

### 8. **BACKUP E SEGURANÇA**

#### **Backup automático:**
- Neon: Backup automático diário
- Código: GitHub (automático)

#### **Segurança:**
- SSL/TLS automático
- Rate limiting configurado
- JWT tokens seguros
- CORS configurado

## ✅ CHECKLIST FINAL

- [ ] Backend deployado no Render
- [ ] Frontend deployado no Render
- [ ] Domínios configurados
- [ ] DNS propagado
- [ ] SSL funcionando
- [ ] API respondendo
- [ ] Frontend carregando
- [ ] Login funcionando
- [ ] Banco de dados conectado

## 🆘 TROUBLESHOOTING

### Problemas comuns:
1. **DNS não propagou**: Aguarde até 24h
2. **SSL não funcionando**: Verifique DNS + aguarde
3. **CORS error**: Verifique FRONTEND_URL no backend
4. **Database error**: Verifique DATABASE_URL
5. **Build error**: Verifique Node.js version (18+)

### Comandos úteis:
```bash
# Testar DNS
nslookup www.portariaexpressa.com.br
nslookup api.portariaexpressa.com.br

# Testar SSL
curl -I https://www.portariaexpressa.com.br
curl -I https://api.portariaexpressa.com.br/health
```

---
**Pronto para implementar! 🚀**
