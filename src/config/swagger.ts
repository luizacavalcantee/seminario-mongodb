import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API V360 - Automação Fiscal",
      version: "1.0.0",
      description: `
## Sistema de Automação Fiscal V360

Esta API demonstra o uso do MongoDB para gerenciar documentos fiscais (NF-e e NFS-e) 
com esquema flexível, aproveitando as vantagens do modelo NoSQL.

### Funcionalidades Principais:
- **Captura Automática**: Recebimento e armazenamento de diferentes tipos de documentos fiscais
- **Validação Inteligente**: Identificação de documentos que necessitam validação manual
- **Flexibilidade de Esquema**: Suporte a múltiplos tipos de documentos na mesma coleção
- **Workflow de Aprovação**: Gerenciamento de status e aprovação de documentos

### Tipos de Documentos Suportados:
- **NF-e** (Nota Fiscal Eletrônica): Possui chave de acesso, itens e impostos federais
- **NFS-e** (Nota Fiscal de Serviço): Possui código de serviço, alíquota ISS e dados do prestador
      `,
      contact: {
        name: "Seminário MongoDB",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Captura",
        description: "Endpoints para captura automática de documentos fiscais",
      },
      {
        name: "Consulta",
        description: "Endpoints para consulta e validação de documentos",
      },
      {
        name: "Workflow",
        description: "Endpoints para gerenciamento de workflow e aprovação",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"], // Caminho para os arquivos com anotações JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
