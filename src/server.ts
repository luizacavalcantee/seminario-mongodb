import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { connectDatabase } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import documentosRoutes from "./routes/documentos";

const app: Application = express();
const port = 3000;

// Middleware: Permite que o Express leia o corpo das requisições em formato JSON
app.use(express.json());

// Documentação da API com Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API V360 - Documentação",
  })
);

// Rotas da aplicação
app.use("/", documentosRoutes);

// Rota raiz para informações básicas
app.get("/", (req, res) => {
  res.json({
    mensagem: "🚀 API Gestão Fiscal - Sistema de Automação Fiscal",
    versao: "1.0.0",
    documentacao: `http://localhost:${port}/api-docs`,
    endpoints: {
      captura: "POST /captura",
      pendentes: "GET /documentos/pendentes",
      flexiveis: "GET /documentos/flexiveis",
      aprovar: "PATCH /documentos/:id/aprovar",
    },
  });
});

/**
 * Função para iniciar o servidor
 */
async function startServer(): Promise<void> {
  try {
    // Conexão com o MongoDB
    await connectDatabase();

    // Início do Servidor Express
    app.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 API Gestão Fiscal rodando em: http://localhost:${port}`);
      console.log(`📚 Documentação Swagger: http://localhost:${port}/api-docs`);
      console.log(`======================================================\n`);
      console.log(`Endpoints disponíveis:`);
      console.log(`  POST   /captura                  - Captura de documentos`);
      console.log(`  GET    /documentos/pendentes     - Validação inteligente`);
      console.log(
        `  GET    /documentos/flexiveis     - Demonstração flexibilidade`
      );
      console.log(`  PATCH  /documentos/:id/aprovar   - Workflow de aprovação`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error("\n❌ ERRO FATAL: Não foi possível iniciar o servidor.");
    if (error instanceof Error) {
      console.error("Detalhe do Erro:", error.message);
    }
    process.exit(1);
  }
}

// Inicializa a aplicação
startServer();
