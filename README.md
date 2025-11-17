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
A aplicação já esta configurada para executar as migrations e popular o banco no momento da incialização.

```bash
 docker-compose up
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


## Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal (Ports and Adapters)**, separando as regras de negócio de implementações externas.

### Estrutura de Camadas

**Domain** (`src/domain/`)

- Entidades de negócio
- Regras de negócio puras

**Application** (`src/application/`)

- Casos de uso (use cases)
- Interfaces de repositórios
- Lógica de aplicação
- Orquestração de domínio

**Infrastructure** (`src/infra/`)

- Controladores HTTP (NestJS)
- Repositórios Prisma
- Persistência de dados
- DTOs externos com validações e Swagger
- Adaptadores de frameworks

## Regras de Negócio

### Perfis de Usuários

- **PRODUCER**: Cria produtos e recebe comissão sobre vendas
- **AFFILIATE**: Indica vendas e recebe comissão quando participa
- **COPRODUCER**: Colabora na criação do produto e recebe comissão quando participa
- **PLATFORM**: Administrador que recebe comissão em todas as transações
- **CUSTOMER**: Cliente que realiza compras

### Sistema de Taxas

- Taxas configuráveis por país (ISO 3166-1 alpha-2)
- Taxa padrão (`isDefault: true`) usada quando não há taxa específica
- Cálculo: `feeAmount = grossAmount × feePercentage`
- Valor líquido: `netAmount = grossAmount - feeAmount` (usado para comissões)

### Sistema de Comissões

- Configuradas por produto (percentual sobre valor líquido)
- Soma das comissões não pode exceder 100%
- Se há comissão de AFFILIATE/COPRODUCER configurada → participante é obrigatório no pagamento
- Participantes devem ter a role correta (validação automática)
- PRODUCER e PLATFORM são sempre participantes (buscados automaticamente)

### Sistema de Balances

- Cada usuário possui um saldo único, inicializado em 0
- Saldo incrementado automaticamente quando recebe comissões
- Atualizações são atômicas (transação de banco de dados)
- Histórico completo mantido em `TransactionSplit` para auditoria

### Processamento de Pagamentos

**Fluxo:**
1. Valida valor, produto e comprador (do token JWT)
2. Busca e calcula taxa por país
3. Valida comissões e participantes obrigatórios
4. Calcula repasses para cada participante
5. Persiste transação, splits e atualiza saldos atomicamente

**Validações:**
- `buyerId` vem automaticamente do token (não pode ser enviado no body)
- `affiliateId` e `coproducerId` são opcionais, mas obrigatórios se houver comissão configurada
- Participantes devem existir e ter a role correta

## Fluxo de Uso da API


### 1. Autenticação

```http
POST /auth/login
{
  "email": "cliente@example.com",
  "password": "password123"
}
```

Salve o `accessToken` retornado.

### 2. Consultar Produtos

```http
GET /products
Authorization: Bearer {TOKEN}
```

Salve o `productId` desejado.

### 3. Obter IDs dos Participantes (requer token PLATFORM)

```http
GET /users?role=AFFILIATE
GET /users?role=COPRODUCER
Authorization: Bearer {PLATFORM_TOKEN}
```

Salve os IDs: `affiliateId` e `coproducerId`.

### 4. Processar Pagamento

```http
POST /payments
Authorization: Bearer {CUSTOMER_TOKEN}
{
  "amount": 100.50,
  "countryCode": "BR",
  "productId": "product-uuid",
  "affiliateId": "affiliate-uuid",
  "coproducerId": "coproducer-uuid"
}
```

**Nota:** O `buyerId` é extraído automaticamente do token.

### 5. Verificar Saldos

```http
GET /balances/me
Authorization: Bearer {TOKEN}
```

### Usuários de Teste (Seed)

Senha padrão: `password123`

| Email | Role |
|-------|------|
| `cliente@example.com` | CUSTOMER |
| `joao.silva@example.com` | PRODUCER |
| `maria.santos@example.com` | AFFILIATE |
| `pedro.oliveira@example.com` | COPRODUCER |
| `admin@payments-platform.com` | PLATFORM |

### Exemplo de Cálculo

**Pagamento:** R$ 100,00 no Brasil (taxa 4.5%)

1. Taxa: R$ 4,50 → Valor líquido: R$ 95,50
2. Comissões (60% PRODUCER, 20% AFFILIATE, 10% COPRODUCER, 10% PLATFORM):
   - PRODUCER: R$ 57,30
   - AFFILIATE: R$ 19,10
   - COPRODUCER: R$ 9,55
   - PLATFORM: R$ 9,55


## Licença

Este projeto está licenciado sob a MIT License.

## Autor

**Douglas Vinicius Caldas Bonin**
