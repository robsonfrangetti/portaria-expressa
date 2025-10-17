# ✅ CHECKLIST DEPLOY - portariaexpressa.com.br

## 🚀 **STATUS DO DEPLOY**

### **1. BACKEND - Web Service**
- [ ] **Criado serviço web no Render**
- [ ] **Configurado repositório**: robsonfrangetti/portaria-expressa
- [ ] **Build Command**: `cd backend && npm install && npm run build`
- [ ] **Start Command**: `cd backend && npm start`
- [ ] **Variáveis de ambiente configuradas**:
  - [ ] `DATABASE_URL` = postgresql://neondb_owner:npg_lvI8tZTbP7xJ@ep-spring-smoke-ac68dzir-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
  - [ ] `JWT_SECRET` = portaria-expressa-jwt-secret-2024-super-secure-key
  - [ ] `NODE_ENV` = production
  - [ ] `PORT` = 3001
  - [ ] `FRONTEND_URL` = https://www.portariaexpressa.com.br
- [ ] **Deploy iniciado**
- [ ] **Build concluído com sucesso**
- [ ] **Servidor rodando**
- [ ] **URL do backend anotada**: `https://portaria-expressa-backend-xxxx.onrender.com`

### **2. FRONTEND - Static Site**
- [ ] **Criado static site no Render**
- [ ] **Configurado repositório**: robsonfrangetti/portaria-expressa
- [ ] **Build Command**: `cd frontend && npm install && npm run build`
- [ ] **Publish Directory**: `frontend/dist`
- [ ] **Variáveis de ambiente configuradas**:
  - [ ] `VITE_API_URL` = https://api.portariaexpressa.com.br
- [ ] **Deploy iniciado**
- [ ] **Build concluído com sucesso**
- [ ] **Site funcionando**
- [ ] **URL do frontend anotada**: `https://portaria-expressa-frontend-xxxx.onrender.com`

### **3. DOMÍNIOS PERSONALIZADOS**
- [ ] **Backend - Domínio configurado**:
  - [ ] Adicionado domínio: `api.portariaexpressa.com.br`
  - [ ] SSL configurado automaticamente
- [ ] **Frontend - Domínios configurados**:
  - [ ] Adicionado domínio: `www.portariaexpressa.com.br`
  - [ ] Adicionado domínio: `portariaexpressa.com.br`
  - [ ] SSL configurado automaticamente

### **4. CONFIGURAÇÃO DNS**
- [ ] **Acessado painel do provedor de domínio**
- [ ] **Configurado registro CNAME**:
  - [ ] `api` → `portaria-expressa-backend-xxxx.onrender.com`
  - [ ] `www` → `portaria-expressa-frontend-xxxx.onrender.com`
  - [ ] `@` → `portaria-expressa-frontend-xxxx.onrender.com`
- [ ] **DNS propagado** (verificado em https://dnschecker.org)

### **5. ATUALIZAÇÃO DE VARIÁVEIS**
- [ ] **Backend atualizado**:
  - [ ] `FRONTEND_URL` = https://www.portariaexpressa.com.br
- [ ] **Frontend atualizado**:
  - [ ] `VITE_API_URL` = https://api.portariaexpressa.com.br
- [ ] **Deploy manual executado** para aplicar mudanças

### **6. TESTES FINAIS**
- [ ] **Health Check da API**: https://api.portariaexpressa.com.br/health
- [ ] **Site principal**: https://www.portariaexpressa.com.br
- [ ] **Site sem www**: https://portariaexpressa.com.br
- [ ] **Login funcionando**: https://www.portariaexpressa.com.br/login
- [ ] **Testado com credenciais**:
  - [ ] Super Admin: admin@portariaexpressa.com / admin123
  - [ ] Empresa: admin@empresaexemplo.com / admin123
  - [ ] Operador: operador@empresaexemplo.com / operador123

### **7. MONITORAMENTO**
- [ ] **Logs do backend verificados**
- [ ] **Logs do frontend verificados**
- [ ] **Performance monitorada**
- [ ] **Alertas configurados** (opcional)

## 🎯 **RESULTADO ESPERADO**

### **URLs Finais:**
- **Site Principal**: https://www.portariaexpressa.com.br ✅
- **API**: https://api.portariaexpressa.com.br ✅
- **Health Check**: https://api.portariaexpressa.com.br/health ✅

### **Funcionalidades:**
- ✅ Sistema de login/registro
- ✅ Gestão de empresas (multi-tenant)
- ✅ Cadastro de visitantes
- ✅ Controle de entrada/saída
- ✅ Geração de relatórios
- ✅ Upload de fotos
- ✅ Interface responsiva
- ✅ SSL/HTTPS automático
- ✅ Backup automático do banco

### **Performance:**
- ✅ Tempo de carregamento < 3s
- ✅ API response time < 500ms
- ✅ Uptime > 99.9%
- ✅ SSL Score A+

## 📊 **MÉTRICAS DE SUCESSO**

### **Técnicas:**
- [ ] Build sem erros
- [ ] Deploy bem-sucedido
- [ ] SSL funcionando
- [ ] DNS propagado
- [ ] API respondendo
- [ ] Frontend carregando
- [ ] Banco conectado

### **Funcionais:**
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] CRUD de visitantes
- [ ] Controle de entrada/saída
- [ ] Relatórios gerando
- [ ] Upload de arquivos
- [ ] Multi-tenant funcionando

## 🆘 **TROUBLESHOOTING**

### **Problemas Comuns:**
- [ ] **Build Error**: Verificar Node.js version (18+)
- [ ] **Database Error**: Verificar DATABASE_URL
- [ ] **CORS Error**: Verificar FRONTEND_URL
- [ ] **SSL Error**: Aguardar propagação DNS
- [ ] **404 Error**: Verificar rotas do frontend

### **Comandos de Teste:**
```bash
# Testar DNS
nslookup www.portariaexpressa.com.br
nslookup api.portariaexpressa.com.br

# Testar SSL
curl -I https://www.portariaexpressa.com.br
curl -I https://api.portariaexpressa.com.br/health

# Testar API
curl https://api.portariaexpressa.com.br/health
```

## 🎉 **DEPLOY COMPLETO!**

**Quando todos os itens estiverem marcados, seu sistema estará 100% funcional em produção!**

---
**Última atualização**: $(date)
**Status**: 🚀 Em andamento
