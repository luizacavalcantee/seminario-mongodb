const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const app = express();
const port = 3000; // Porta onde a API irá rodar

// Middleware: Permite que o Express leia o corpo das requisições em formato JSON
app.use(express.json());

// 1. Configuração do MongoDB
const uri = "mongodb://localhost:27017"; // URL de conexão (local onde o Docker está rodando)
const client = new MongoClient(uri);

let db; // Variável para o banco de dados
let documentosCollection; // Variável para a coleção de documentos fiscais

// 2. Definição dos Endpoints (Rotas da API)

// POST /documentos: Simula a Captura Automática de um novo documento
app.post('/documentos', async (req, res) => {
    // req.body contém o JSON enviado na requisição HTTP (dados brutos da NF)
    const novoDocumento = {
        ...req.body, // Pega os dados brutos (NF, emitente, itens, etc.)
        status: "Capturado", // Define o status inicial do workflow
        data_recebimento: new Date()
    };
    
    try {
        const result = await documentosCollection.insertOne(novoDocumento);
        
        // Retorna o status HTTP 201 (Created) e o documento inserido
        res.status(201).json({ 
            mensagem: "Documento Capturado com sucesso!", 
            _id: result.insertedId,
            documento: novoDocumento
        });
    } catch (error) {
        console.error("Erro ao inserir documento:", error);
        res.status(500).json({ error: "Erro interno ao inserir documento fiscal." });
    }
});

// GET /documentos/validar: Simula a Validação Inteligente (busca por pendências)
app.get('/documentos/validar', async (req, res) => {
    try {
        // Exemplo de consulta que simula a "Validação Inteligente":
        // Busca documentos que ainda estão 'Capturados' E têm valor_total maior que 1000
        // (Assumindo que valores altos exigem uma validação extra manual no workflow)
        const documentosPendentes = await documentosCollection.find({
            status: "Capturado",
            valor_total: { $gt: 1000 } 
        }).toArray();

        // Retorna a lista de documentos que precisam de atenção
        res.status(200).json({ 
            mensagem: "Fila de documentos para validação manual:",
            total: documentosPendentes.length, 
            documentos: documentosPendentes 
        });
    } catch (error) {
        console.error("Erro ao consultar documentos:", error);
        res.status(500).json({ error: "Erro interno ao consultar documentos para validação." });
    }
});

// PATCH /documentos/:id/aprovar: Simula a aprovação via Workflow/Gestão de Pagamentos
app.patch('/documentos/:id/aprovar', async (req, res) => {
    const docId = req.params.id; // Pega o ID do documento na URL

    // Validação básica do ID
    if (!docId) {
        return res.status(400).json({ mensagem: "ID do documento é obrigatório." });
    }
    
    try {
        // Encontra o documento pelo ID e atualiza o status
        const result = await documentosCollection.updateOne(
            { _id: new ObjectId(docId) },
            { $set: { 
                status: "Pronto para Pagamento", // Novo status no workflow
                data_aprovacao: new Date(),
                aprovador: req.body.aprovador || "Sistema V360" // Pode receber o nome do aprovador
            }}
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: "Documento não encontrado ou ID inválido." });
        }
        
        // Retorna sucesso
        res.status(200).json({ 
            mensagem: `Documento ${docId} aprovado e pronto para pagamento.`,
            modificados: result.modifiedCount
        });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ error: "Erro interno ao processar aprovação." });
    }
});

// 3. Função para Conectar ao MongoDB e Iniciar o Servidor Express
async function startServer() {
    try {
        // Conexão com o MongoDB
        await client.connect();
        
        db = client.db("v360_fiscal");
        documentosCollection = db.collection("documentos_fiscais");

        // Início do Servidor Express
        app.listen(port, () => {
            console.log(`\n======================================================`);
            console.log(`API V360 rodando! Acesse: http://localhost:${port} 🚀`);
            console.log(`======================================================`);
        });

    } catch (e) {
        console.error("\n❌ ERRO FATAL: Falha ao conectar ao MongoDB. Verifique se o Docker está rodando na porta 27017.");
        console.error("Detalhe do Erro:", e.message);
        process.exit(1); // Encerra o processo se a conexão falhar
    }
}

// 4. Inicia o workflow da aplicação
startServer();