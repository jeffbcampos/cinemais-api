# Cinemais API

API REST para gerenciamento de mídias (filmes e séries) e favoritos de usuários, desenvolvida com NestJS e Prisma.

## 📋 Descrição do Projeto

O Cinemais API é um sistema backend que permite:
- Cadastro e listagem de mídias (filmes e séries)
- Gerenciamento de favoritos por usuário
- Consulta paginada de mídias e favoritos

## 🎯 Escolhas Técnicas

### Framework: NestJS
- **Arquitetura modular**: Facilita a organização e manutenção do código
- **TypeScript nativo**: Maior segurança de tipos e produtividade no desenvolvimento
- **Dependency Injection**: Facilita testes e desacoplamento de componentes
- **Decorators**: Código mais limpo e declarativo
- **Ecossistema robusto**: Integração nativa com Swagger, validação, etc.

### Banco de Dados: PostgreSQL + Prisma ORM
- **PostgreSQL**: Banco robusto, open-source e com suporte a tipos complexos
- **Prisma ORM**: 
  - Type-safety em queries
  - Migrations automáticas
  - Excelente DX (Developer Experience)
  - Schema declarativo e intuitivo
  - Cliente gerado automaticamente

### Arquitetura: Clean Architecture / DDD
- **Separação de camadas**: Domain, Application, Infrastructure
- **Inversão de dependências**: Facilita testes e manutenção
- **Use Cases**: Lógica de negócio isolada e testável

## 🚀 Como Rodar o Projeto

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cinemais-api

# Crie o arquivo .env (ou copie o .env.example)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/cinemais"
PORT=3000

# Suba os containers
docker-compose up

# A API estará disponível em http://localhost:3000
# O Swagger estará disponível em http://localhost:3000/docs
```

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 20+
- PostgreSQL 16+
- npm ou yarn

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cinemais-api

# Instale as dependências
npm install

# Configure o arquivo .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/cinemais"
PORT=3000

# Gere o Prisma Client
npm run prisma:generate

# Execute as migrations
npm run prisma:migrate

# Execute o seed (dados iniciais)
npm run prisma:seed

# Inicie o servidor em modo desenvolvimento
npm run start:dev

# A API estará disponível em http://localhost:3000
# O Swagger estará disponível em http://localhost:3000/docs
```

## 🧪 Como Rodar os Testes

```bash
# Testes unitários
npm run test

# Testes unitários em modo watch
npm run test:watch

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo watch
npm run start:debug        # Inicia com debug

# Build
npm run build              # Compila o projeto

# Prisma
npm run prisma:generate    # Gera o Prisma Client
npm run prisma:migrate     # Executa migrations
npm run prisma:seed        # Popula o banco com dados iniciais

# Testes
npm run test               # Testes unitários
npm run test:watch         # Testes em modo watch
npm run test:e2e          # Testes e2e
npm run test:cov          # Cobertura de testes

# Linting
npm run lint              # Executa ESLint
npm run format            # Formata código com Prettier
```

## 🏗️ Estrutura do Projeto

```
src/
├── modules/
│   ├── media/              # Módulo de mídias
│   │   ├── application/    # Use cases e DTOs
│   │   ├── domain/         # Entidades e interfaces
│   │   └── infra/          # Controllers e repositories
│   └── users/              # Módulo de usuários
│       ├── application/    # Use cases e DTOs
│       ├── domain/         # Entidades e interfaces
│       └── infra/          # Controllers e repositories
└── shared/                 # Recursos compartilhados
    └── infra/
        └── prisma/         # Configuração do Prisma
```