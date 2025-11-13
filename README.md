# Payments System


## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Docker
- Docker Compose

## Configuração do Ambiente

1. Clone o repositório para sua máquina local
2. Navegue até a pasta do projeto
3. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `env.example`:

```bash
cp env.example .env
```

## Executando a Aplicação

**Com Docker:**

```bash
docker-compose up -d db
docker-compose up api-dev
```

**Executar comandos npm dentro do Docker:**

```bash
docker-compose run --rm npm <comando>
```

Exemplos:
```bash
docker-compose run --rm npm run prisma:generate
docker-compose run --rm npm run prisma:migrate
docker-compose run --rm npm run prisma:studio
```

**Produção:**

```bash
docker-compose up api-prod
```

## Documentação da API

A API possui documentação interativa através do Swagger UI, disponível em:

**http://localhost:[PORT]/api/docs**

Navegando para esta URL, você encontrará:

- Todos os endpoints disponíveis
- Descrição de cada endpoint
- Exemplos de requisições e respostas
- Possibilidade de testar os endpoints diretamente pelo navegador

**Nota:** O endpoint de health check (`/health`) não aparece na documentação Swagger, pois é um endpoint interno de monitoramento.

## Endpoints Disponíveis

### Health Check

**Endpoint:** `GET /health`

**Descrição:** Verifica o status da aplicação e a conexão com o banco de dados

**Resposta de Sucesso (200):**

```json
{
  "status": "ok",
  "database": "healthy"
}
```

**Resposta de Erro (503):**

```json
{
  "status": "error",
  "database": "unhealthy"
}
```

O endpoint retorna `503 Service Unavailable` quando o banco de dados não está acessível.

## CI/CD com GitHub Actions

O projeto utiliza GitHub Actions para integração contínua com um workflow principal que orquestra os seguintes jobs:

### Workflow Principal (`.github/workflows/ci.yml`)

- Executa automaticamente em push para `main` e em pull requests
- Orquestra os jobs de build, lint e tests em paralelo

### Jobs Reutilizáveis

#### 1. Build (`.github/workflows/build.yml`)

- Executa o build do projeto
- Verifica se o código compila corretamente
- Usa Node.js 22

#### 2. Lint (`.github/workflows/lint.yml`)

- Executa o ESLint para garantir padrões de código
- Valida a formatação e estilo do código
- Usa Node.js 22

#### 3. Tests (`.github/workflows/tests.yml`)

- Executa testes unitários
- Usa cache do npm para otimização
- Usa Node.js 22

Todos os workflows são executados automaticamente garantindo a qualidade do código em cada alteração.

## Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal (Ports and Adapters)**, separando as regras de negócio de implementações externas.

### Estrutura de Camadas

**Domain** (`src/domain/`)

- Entidades de negócio
- Regras de negócio puras

**Application** (`src/application/`)

- Casos de uso (use cases)
- Interfaces de repositórios
- DTOs internos
- Lógica de aplicação
- Orquestração de domínio

**Infrastructure** (`src/infrastructure/`)

- Controladores HTTP (NestJS)
- Repositórios Prisma
- Persistência de dados
- DTOs externos com validações e Swagger
- Adaptadores de frameworks

## Scripts Disponíveis

```bash
npm run build          # Compila o projeto
npm run start:dev      # Inicia em modo watch
npm run start:prod     # Inicia em modo produção
npm test               # Executa testes unitários
npm run test:e2e       # Executa testes E2E
npm run lint           # Executa o ESLint
npm run format         # Formata o código com Prettier
npm run prisma:generate  # Gera o Prisma Client
npm run prisma:migrate   # Executa migrações
npm run prisma:migrate:deploy  # Aplica migrações em produção
npm run prisma:studio    # Abre o Prisma Studio
```

## Licença

Este projeto está licenciado sob a MIT License.

## Autor

**Douglas Vinicius Caldas Bonin**
