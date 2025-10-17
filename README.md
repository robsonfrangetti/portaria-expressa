# Portaria Expressa

Sistema de portaria para controle de acesso em predios com funcionalidades multi-tenant.

## Funcionalidades

- ✅ Controle de entrada e saída de pessoas
- ✅ Sistema multi-tenant (cada empresa tem seu espaço)
- ✅ Relatórios diários, quinzenais e mensais
- ✅ Interface responsiva para tablets/celulares
- ✅ Dashboard em tempo real
- ✅ Autenticação segura

## Stack Tecnológica

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT para autenticação
- Multer para upload de imagens

### Frontend
- React + TypeScript
- Tailwind CSS + Headless UI
- Zustand para gerenciamento de estado
- React Query para cache de dados

### Infraestrutura
- Deploy: Vercel (frontend) + Railway (backend)
- Banco: PostgreSQL na nuvem
- CI/CD: GitHub Actions

## Instalação

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Executar em modo desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
portaria-expressa/
├── backend/          # API Node.js + Express
├── frontend/         # Interface React
├── docs/            # Documentação
└── scripts/         # Scripts de deploy
```

## Configuração

1. Configure as variáveis de ambiente no arquivo `.env`
2. Execute as migrações do banco: `npm run db:migrate`
3. Inicie o servidor: `npm run dev`

## Deploy

O sistema está configurado para deploy automático:
- Frontend: Vercel
- Backend: Railway
- Banco: Supabase PostgreSQL
