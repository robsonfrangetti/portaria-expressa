# Configuração DNS - portariaexpressa.com.br

## 📋 Registros DNS Necessários

### **Provedor de Domínio (Registro.br, GoDaddy, etc.)**

#### **1. Registros A (Apontamento para IP do Render)**
```
Tipo: A
Nome: @
TTL: 3600
Valor: [IP fornecido pelo Render após deploy]
```

#### **2. Registros CNAME (Subdomínios)**
```
Tipo: CNAME
Nome: www
TTL: 3600
Valor: [URL do serviço frontend no Render]

Tipo: CNAME
Nome: api
TTL: 3600
Valor: [URL do serviço backend no Render]
```

#### **3. Configuração SSL (Automática)**
- O Render configura SSL automaticamente via Let's Encrypt
- Aguarde até 24h para propagação completa

## 🔧 Configuração por Provedor

### **Registro.br**
1. Acesse: https://registro.br
2. Faça login na sua conta
3. Vá em "Meus Domínios" → portariaexpressa.com.br
4. Clique em "DNS"
5. Configure os registros acima

### **GoDaddy**
1. Acesse: https://dcc.godaddy.com
2. Encontre portariaexpressa.com.br
3. Clique em "Gerenciar DNS"
4. Configure os registros acima

### **Cloudflare**
1. Adicione o domínio no Cloudflare
2. Configure os registros DNS
3. Ative SSL/TLS (Full)

## ⏱️ Tempos de Propagação

- **Local**: 5-10 minutos
- **Nacional**: 1-6 horas
- **Global**: 6-24 horas

## 🧪 Testes de DNS

### **Comandos para testar:**
```bash
# Testar DNS
nslookup www.portariaexpressa.com.br
nslookup api.portariaexpressa.com.br

# Testar conectividade
ping www.portariaexpressa.com.br
ping api.portariaexpressa.com.br

# Testar SSL
curl -I https://www.portariaexpressa.com.br
curl -I https://api.portariaexpressa.com.br/health
```

### **Ferramentas online:**
- https://dnschecker.org
- https://whatsmydns.net
- https://www.whatsmydns.net

## 🚨 Troubleshooting DNS

### **Problemas comuns:**

1. **DNS não propagou**
   - Aguarde até 24h
   - Verifique com ferramentas online
   - Confirme TTL baixo (3600)

2. **SSL não funciona**
   - DNS deve estar propagado
   - Aguarde configuração automática do Render
   - Verifique se domínio está ativo no Render

3. **Subdomínio não funciona**
   - Verifique se CNAME está correto
   - Confirme se backend está rodando
   - Teste URL direta do Render

## 📞 Suporte

### **Render Support:**
- Email: support@render.com
- Docs: https://render.com/docs

### **Provedor DNS:**
- Registro.br: https://registro.br/suporte
- GoDaddy: https://br.godaddy.com/help

---
**Configuração DNS concluída! 🌐**
