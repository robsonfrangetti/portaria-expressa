# 🚀 DEPLOY AUTOMÁTICO COMPLETO - portariaexpressa.com.br

## ✅ **PASSO A PASSO AUTOMATIZADO**

### **1. BACKEND - Deploy no Render**

#### **A. Acesse o Render:**
- **URL**: https://dashboard.render.com/web/new
- **Login**: Use sua conta GitHub

#### **B. Configure o Web Service:**
```
Repository: robsonfrangetti/portaria-expressa
Name: portaria-expressa-backend
Runtime: Node
Region: Oregon (US West)
Branch: master
```

#### **C. Build & Deploy:**
```
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
```

#### **D. Environment Variables:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=portaria-expressa-jwt-secret-2024-super-secure-key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://www.portariaexpressa.com.br
```

#### **E. Instance Type:**
```
Free: $0/month (para teste)
Starter: $7/month (recomendado)
```

#### **F. Deploy:**
- Clique em **"Create Web Service"**
- Aguarde o build (2-5 minutos)
- Anote a URL gerada: `https://portaria-expressa-backend-xxxx.onrender.com`

### **2. FRONTEND - Deploy no Render**

#### **A. Acesse o Render:**
- **URL**: https://dashboard.render.com/new/static-site

#### **B. Configure o Static Site:**
```
Repository: robsonfrangetti/portaria-expressa
Name: portaria-expressa-frontend
Branch: master
```

#### **C. Build Settings:**
```
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

#### **D. Environment Variables:**
```env
VITE_API_URL=https://portaria-expressa-backend-xxxx.onrender.com
```

#### **E. Deploy:**
- Clique em **"Create Static Site"**
- Aguarde o build (1-3 minutos)
- Anote a URL gerada: `https://portaria-expressa-frontend-xxxx.onrender.com`

### **3. CONFIGURAR DOMÍNIOS PERSONALIZADOS**

#### **A. Backend Domain:**
1. Vá para o serviço backend no Render
2. Clique em **"Settings"** → **"Custom Domains"**
3. Adicione: `api.portariaexpressa.com.br`
4. Clique em **"Add Domain"**

#### **B. Frontend Domain:**
1. Vá para o serviço frontend no Render
2. Clique em **"Settings"** → **"Custom Domains"**
3. Adicione: `www.portariaexpressa.com.br`
4. Adicione: `portariaexpressa.com.br`
5. Clique em **"Add Domain"**

### **4. CONFIGURAR DNS**

#### **A. Registros DNS necessários:**
```
Tipo: CNAME
Nome: api
Valor: portaria-expressa-backend-xxxx.onrender.com

Tipo: CNAME
Nome: www
Valor: portaria-expressa-frontend-xxxx.onrender.com

Tipo: CNAME
Nome: @
Valor: portaria-expressa-frontend-xxxx.onrender.com
```

#### **B. Configure no seu provedor de domínio:**
- **Registro.br**: https://registro.br
- **GoDaddy**: https://dcc.godaddy.com
- **Cloudflare**: https://dash.cloudflare.com

### **5. ATUALIZAR VARIÁVEIS DE AMBIENTE**

#### **A. Backend - Atualizar FRONTEND_URL:**
```env
FRONTEND_URL=https://www.portariaexpressa.com.br
```

#### **B. Frontend - Atualizar VITE_API_URL:**
```env
VITE_API_URL=https://api.portariaexpressa.com.br
```

### **6. TESTES FINAIS**

#### **A. URLs para testar:**
```
https://api.portariaexpressa.com.br/health
https://www.portariaexpressa.com.br
https://portariaexpressa.com.br
```

#### **B. Credenciais de teste:**
```
Super Admin: admin@portariaexpressa.com / admin123
Empresa: admin@empresaexemplo.com / admin123
Operador: operador@empresaexemplo.com / operador123
```

### **7. MONITORAMENTO**

#### **A. Render Dashboard:**
- Logs em tempo real
- Métricas de performance
- Status de uptime

#### **B. Neon Dashboard:**
- Conexões de banco
- Performance queries
- Backup automático

## 🎯 **RESULTADO FINAL**

### **URLs Finais:**
- **Site Principal**: https://www.portariaexpressa.com.br
- **API**: https://api.portariaexpressa.com.br
- **Health Check**: https://api.portariaexpressa.com.br/health

### **Funcionalidades:**
- ✅ Login/Registro
- ✅ Gestão de visitantes
- ✅ Controle de entrada/saída
- ✅ Relatórios
- ✅ Multi-tenant (empresas)
- ✅ SSL automático
- ✅ Backup automático

### **Custos Mensais:**
- **Render**: $7 (Starter) + $0 (Static)
- **Neon**: $0 (Free tier)
- **Total**: $7/mês

## 🆘 **SUPORTE**

### **Em caso de problemas:**
1. Verifique os logs no Render Dashboard
2. Teste as URLs de health check
3. Verifique propagação DNS: https://dnschecker.org
4. Verifique SSL: https://www.ssllabs.com/ssltest/

### **Contatos:**
- **Render Support**: support@render.com
- **Neon Support**: support@neon.tech

---
## 🚀 **SISTEMA PRONTO PARA PRODUÇÃO!**

**Tempo estimado de deploy completo: 15-30 minutos**
**Tempo de propagação DNS: 1-24 horas**
