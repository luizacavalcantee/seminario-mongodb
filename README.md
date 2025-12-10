# API - Sistema de Automação Fiscal

Sistema de demonstração para seminário sobre MongoDB - plataforma de automação fiscal.

## 📋 Funcionalidades

- **Captura Automática**: Recebimento de documentos fiscais (NF-e e NFS-e)
- **Validação Inteligente**: Identificação de documentos que necessitam validação manual
- **Flexibilidade de Esquema**: Múltiplos tipos de documentos na mesma coleção
- **Workflow de Aprovação**: Gerenciamento de status e aprovação

## 🚀 Como Executar

### Opção 1: Docker Compose (Recomendado - Tudo em Containers)

Esta opção executa tanto o MongoDB quanto a aplicação Node.js em containers Docker.

#### Pré-requisitos

- Docker instalado
- Docker Compose instalado

#### Comandos:

```powershell
# Iniciar tudo (MongoDB + Aplicação)
docker-compose up --build

# Iniciar em background (modo detached)
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f app

# Parar os containers
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v
```

#### Acessar:

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs

---

### Opção 2: Desenvolvimento Local (Node.js local + MongoDB no Docker)

Esta opção executa apenas o MongoDB no Docker e a aplicação Node.js localmente.

#### Pré-requisitos

- Node.js (v14 ou superior)
- Docker (para MongoDB)

#### Passos:

**1. Iniciar o MongoDB com Docker:**

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**2. Instalar Dependências:**

```powershell
npm install
```

**3. Executar a Aplicação:**

**Modo Desenvolvimento (TypeScript direto com hot reload):**

```powershell
npm run dev
```

**Modo Produção (compilar e executar):**

```powershell
npm run build
npm start
```

#### Acessar:

- **API Base**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs

---

### Opção 3: Apenas Docker da Aplicação (MongoDB local ou externo)

Se você já tem um MongoDB rodando localmente:

```powershell
# Build da imagem
docker build -t v360-api .

# Executar container
docker run -p 3000:3000 -e MONGODB_URI=mongodb://host.docker.internal:27017 v360-api
```

## 📚 Endpoints

| Método | Endpoint                  | Descrição                               |
| ------ | ------------------------- | --------------------------------------- |
| POST   | `/captura`                | Captura automática de documento fiscal  |
| GET    | `/documentos/pendentes`   | Lista documentos pendentes de validação |
| GET    | `/documentos/flexiveis`   | Demonstra flexibilidade de esquema      |
| PATCH  | `/documentos/:id/aprovar` | Aprova documento para pagamento         |

## 🧪 Exemplos de Uso

### Capturar NF-e

```powershell
curl -X POST http://localhost:3000/captura `
  -H "Content-Type: application/json" `
  -d '{
    "tipo_documento": "NFe",
    "numero": "000123",
    "chave_acesso": "35210812345678901234550010001234561234567890",
    "emitente": {
      "cnpj": "12.345.678/0001-90",
      "nome": "Empresa XYZ Ltda"
    },
    "destinatario": {
      "cnpj": "98.765.432/0001-10",
      "nome": "Empresa ABC Ltda"
    },
    "valor_total": 1500.00,
    "data_emissao": "2024-01-15T10:30:00.000Z",
    "itens": [
      {
        "codigo": "PROD001",
        "descricao": "Produto A",
        "quantidade": 10,
        "valor_unitario": 50.00,
        "valor_total": 500.00
      }
    ],
    "impostos_federais": {
      "icms": 150.00,
      "ipi": 75.00,
      "pis": 24.75,
      "cofins": 114.00
    }
  }'
```

### Capturar NFS-e

```powershell
curl -X POST http://localhost:3000/captura `
  -H "Content-Type: application/json" `
  -d '{
    "tipo_documento": "NFSe",
    "numero": "000456",
    "codigo_servico": "01.01",
    "aliquota_iss": 5.0,
    "emitente": {
      "cnpj": "11.222.333/0001-44",
      "nome": "Consultoria Tech"
    },
    "destinatario": {
      "cnpj": "55.666.777/0001-88",
      "nome": "Empresa Cliente Ltda"
    },
    "prestador": {
      "cnpj": "11.222.333/0001-44",
      "nome": "Consultoria Tech",
      "inscricao_municipal": "123456789"
    },
    "descricao_servico": "Consultoria em TI",
    "valor_total": 5000.00,
    "data_emissao": "2024-01-20T14:00:00.000Z"
  }'
```

## 🏗️ Estrutura do Projeto

```
mongodb-seminario/
├── src/
│   ├── config/
│   │   ├── database.ts           # Configuração MongoDB
│   │   └── swagger.ts            # Configuração Swagger
│   ├── routes/
│   │   ├── documentos.ts         # Rotas da API
│   │   └── schemas.ts            # Schemas Swagger
│   ├── types/
│   │   └── documentoFiscal.ts    # Interfaces TypeScript
│   └── server.ts                 # Servidor principal
├── dist/                         # Código compilado (gerado)
├── Dockerfile                    # Imagem Docker da aplicação
├── docker-compose.yml            # Orquestração Docker
├── .dockerignore                 # Arquivos ignorados no build
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
└── README.md                     # Documentação
```

## 🐳 Detalhes Docker

### Arquitetura com Docker Compose

O `docker-compose.yml` cria dois serviços:

- **mongodb**: Container com MongoDB na porta 27017
- **app**: Container com a aplicação Node.js na porta 3000

Os containers se comunicam através de uma rede privada (`v360-network`).

### Variáveis de Ambiente

| Variável      | Padrão                      | Descrição                                     |
| ------------- | --------------------------- | --------------------------------------------- |
| `MONGODB_URI` | `mongodb://localhost:27017` | URI de conexão do MongoDB                     |
| `NODE_ENV`    | -                           | Ambiente de execução (development/production) |

### Healthcheck

O MongoDB possui healthcheck para garantir que está pronto antes de iniciar a aplicação.

## 🔍 Demonstração MongoDB vs SQL

### Vantagens do MongoDB neste projeto:

1. **Esquema Flexível**: NF-e e NFS-e na mesma coleção
2. **Documentos Aninhados**: Estruturas complexas sem JOINs
3. **Arrays**: Lista de itens diretamente no documento
4. **Consultas Poderosas**: Operadores como `$exists`, `$or`, etc.

### Exemplo de Consulta NoSQL:

```javascript
// Busca documentos com 3 ou menos itens
db.documentos_fiscais.find({
  status: "Capturado",
  "itens.3": { $exists: false },
});
```

**Em SQL seria necessário:**

- Tabela separada para itens
- JOIN complexo
- COUNT em subquery
- Esquema rígido para cada tipo de documento

## 📦 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Swagger/OpenAPI** - Documentação da API
- **Docker & Docker Compose** - Containerização e orquestração

## ⚡ Quick Start

```powershell
# Com Docker (mais rápido - tudo incluído)
docker-compose up -d --build

# Local (desenvolvimento)
npm install
docker run -d -p 27017:27017 --name mongodb mongo:latest
npm run dev
```

## 🔧 Comandos Úteis

```powershell
# Build TypeScript
npm run build

# Produção local
npm start

# Desenvolvimento local
npm run dev

# Build Docker
docker build -t v360-api .

# Docker Compose logs
docker-compose logs -f

# Limpar tudo do Docker
docker-compose down -v
docker system prune -a
```

## 🐚 MongoDB Shell (para demonstração do seminário)

### Acessar o MongoDB Shell

```powershell
# Se estiver usando Docker Compose
docker exec -it mongodb-v360 mongosh

# Se tiver mongosh instalado localmente
mongosh "mongodb://localhost:27017"
```

### Popular com dados de exemplo

```powershell
# Executar o script de seed
docker exec -i mongodb-v360 mongosh < seed-data.js

# Ou copiar e colar o conteúdo de seed-data.js no mongosh
```

### Consultas úteis para demonstração

```javascript
// Selecionar o banco
use v360_fiscal

// Ver todos os documentos
db.documentos_fiscais.find().pretty()

// Contar por tipo
db.documentos_fiscais.countDocuments({ tipo_documento: "NFe" })
db.documentos_fiscais.countDocuments({ tipo_documento: "NFSe" })

// Demonstrar flexibilidade de esquema
db.documentos_fiscais.findOne({ tipo_documento: "NFe" })
db.documentos_fiscais.findOne({ tipo_documento: "NFSe" })

// Validação inteligente (≤3 itens)
db.documentos_fiscais.find({
  status: "Capturado",
  "itens.3": { $exists: false }
})

// Agregação - Total por tipo
db.documentos_fiscais.aggregate([
  {
    $group: {
      _id: "$tipo_documento",
      total: { $sum: "$valor_total" },
      quantidade: { $sum: 1 }
    }
  }
])
```

📖 **Guia completo**: Veja `MONGODB_SHELL_GUIDE.md` para mais exemplos e demonstrações.

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido para demonstrar as vantagens do MongoDB em um cenário real de automação fiscal.
