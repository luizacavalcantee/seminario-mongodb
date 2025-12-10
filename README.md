# API V360 - Sistema de Automação Fiscal

Sistema de demonstração para seminário sobre MongoDB, simulando o V360 - plataforma de automação fiscal.

## 📋 Funcionalidades

- **Captura Automática**: Recebimento de documentos fiscais (NF-e e NFS-e)
- **Validação Inteligente**: Identificação de documentos que necessitam validação manual
- **Flexibilidade de Esquema**: Múltiplos tipos de documentos na mesma coleção
- **Workflow de Aprovação**: Gerenciamento de status e aprovação

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v14 ou superior)
- Docker (para MongoDB)

### 1. Iniciar o MongoDB com Docker

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Instalar Dependências

```powershell
npm install
```

### 3. Executar a Aplicação

**Modo Desenvolvimento (TypeScript direto):**

```powershell
npm run dev
```

**Modo Produção (compilar e executar):**

```powershell
npm run build
npm start
```

### 4. Acessar a API

- **API Base**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs

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
│   │   ├── database.ts      # Configuração MongoDB
│   │   └── swagger.ts       # Configuração Swagger
│   ├── routes/
│   │   ├── documentos.ts    # Rotas da API
│   │   └── schemas.ts       # Schemas Swagger
│   ├── types/
│   │   └── documentoFiscal.ts # Interfaces TypeScript
│   └── server.ts            # Servidor principal
├── dist/                    # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

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
- **Swagger** - Documentação da API
- **Docker** - Containerização do MongoDB

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido para demonstrar as vantagens do MongoDB em um cenário real de automação fiscal.
