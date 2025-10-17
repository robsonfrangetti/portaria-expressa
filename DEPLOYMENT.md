# Guia de Deploy - Portaria Expressa

Este documento explica como fazer o deploy do sistema Portaria Expressa em diferentes ambientes.

## Opções de Deploy

### 1. Deploy Local com Docker (Recomendado para desenvolvimento)

```bash
# Clone o repositório
git clone <seu-repositorio>
cd portaria-expressa

# Execute com Docker Compose
docker-compose up -d

# Acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# PostgreSQL: localhost:5432
```

### 2. Deploy em Produção - Vercel + Railway

#### Frontend (Vercel)

1. **Conecte o repositório ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub
   - Configure o Build Command: `cd frontend && npm run build`
   - Configure o Output Directory: `frontend/dist`

2. **Variáveis de ambiente:**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```

#### Backend (Railway)

1. **Conecte o repositório ao Railway:**
   - Acesse [railway.app](https://railway.app)
   - Importe o projeto do GitHub
   - Configure o Build Command: `cd backend && npm run build`
   - Configure o Start Command: `cd backend && npm start`

2. **Variáveis de ambiente:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://usuario:senha@host:porta/banco
   JWT_SECRET=sua-chave-secreta-super-segura
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

3. **Banco de dados PostgreSQL:**
   - Adicione o plugin PostgreSQL no Railway
   - Use a URL de conexão fornecida na variável `DATABASE_URL`

#### Configuração do Banco

```bash
# Execute as migrações
cd backend
npx prisma migrate deploy

# Execute o seed (opcional)
npx prisma db seed
```

### 3. Deploy Manual (VPS/Servidor)

#### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Nginx (opcional)

#### Backend

```bash
# Clone e configure
git clone <seu-repositorio>
cd portaria-expressa/backend
npm install
npm run build

# Configure variáveis de ambiente
cp env.example .env
# Edite o .env com suas configurações

# Execute migrações
npx prisma migrate deploy

# Inicie o servidor
npm start
```

#### Frontend

```bash
cd ../frontend
npm install
npm run build

# Sirva os arquivos estáticos
# Opção 1: com serve
npx serve -s dist -l 3000

# Opção 2: com nginx (recomendado)
# Copie os arquivos de dist/ para o diretório do nginx
```

### 4. Deploy com Docker em Produção

```bash
# Build das imagens
docker build -t portaria-backend ./backend
docker build -t portaria-frontend ./frontend

# Execute os containers
docker run -d --name portaria-postgres -e POSTGRES_PASSWORD=senha postgres:15
docker run -d --name portaria-backend --link portaria-postgres -p 3001:3001 portaria-backend
docker run -d --name portaria-frontend --link portaria-backend -p 80:80 portaria-frontend
```

## Configurações Importantes

### Variáveis de Ambiente

#### Backend
- `DATABASE_URL`: URL de conexão com PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT (use uma chave forte)
- `JWT_EXPIRES_IN`: Tempo de expiração do token (ex: 7d)
- `PORT`: Porta do servidor (padrão: 3001)
- `NODE_ENV`: Ambiente (development/production)
- `FRONTEND_URL`: URL do frontend para CORS

#### Frontend
- `VITE_API_URL`: URL da API backend

### Segurança

1. **JWT Secret**: Use uma chave forte e única
2. **HTTPS**: Configure SSL/TLS em produção
3. **CORS**: Configure corretamente as origens permitidas
4. **Rate Limiting**: Já configurado no backend
5. **Helmet**: Headers de segurança já configurados

### Monitoramento

- Configure logs adequados
- Monitore performance e erros
- Configure alertas para falhas críticas
- Use ferramentas como Sentry para tracking de erros

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   - Verifique se o PostgreSQL está rodando
   - Confirme a URL de conexão
   - Verifique as credenciais

2. **Erro de CORS:**
   - Verifique se `FRONTEND_URL` está configurado corretamente
   - Confirme se o frontend está acessando a URL correta da API

3. **Erro de JWT:**
   - Verifique se `JWT_SECRET` está configurado
   - Confirme se o token não expirou

4. **Problemas de build:**
   - Verifique se todas as dependências estão instaladas
   - Confirme se o Node.js está na versão correta (18+)

### Logs

```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Railway
railway logs

# Vercel
vercel logs
```

## Próximos Passos

1. Configure um domínio personalizado
2. Implemente backup automático do banco
3. Configure monitoramento avançado
4. Implemente CDN para assets estáticos
5. Configure CI/CD automático
