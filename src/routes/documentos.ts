import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDocumentosCollection } from "../config/database";
import { DocumentoFiscal } from "../types/documentoFiscal";

const router = Router();

/**
 * @swagger
 * /captura:
 *   post:
 *     summary: Captura automática de documento fiscal
 *     description: Simula o recebimento automático de um novo documento fiscal (NF-e ou NFS-e) e o armazena no MongoDB com status "Capturado"
 *     tags: [Captura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/NFe'
 *               - $ref: '#/components/schemas/NFSe'
 *           examples:
 *             NFe:
 *               summary: Exemplo de NF-e
 *               value:
 *                 tipo_documento: "NFe"
 *                 numero: "000123"
 *                 chave_acesso: "35210812345678901234550010001234561234567890"
 *                 emitente:
 *                   cnpj: "12.345.678/0001-90"
 *                   nome: "Empresa XYZ Ltda"
 *                   endereco: "Rua A, 123 - São Paulo/SP"
 *                 destinatario:
 *                   cnpj: "98.765.432/0001-10"
 *                   nome: "Empresa ABC Ltda"
 *                   endereco: "Av. B, 456 - Rio de Janeiro/RJ"
 *                 valor_total: 1500.00
 *                 data_emissao: "2024-01-15T10:30:00.000Z"
 *                 itens:
 *                   - codigo: "PROD001"
 *                     descricao: "Produto A"
 *                     quantidade: 10
 *                     valor_unitario: 50.00
 *                     valor_total: 500.00
 *                     ncm: "12345678"
 *                   - codigo: "PROD002"
 *                     descricao: "Produto B"
 *                     quantidade: 20
 *                     valor_unitario: 50.00
 *                     valor_total: 1000.00
 *                     ncm: "87654321"
 *                 impostos_federais:
 *                   icms: 150.00
 *                   ipi: 75.00
 *                   pis: 24.75
 *                   cofins: 114.00
 *             NFSe:
 *               summary: Exemplo de NFS-e
 *               value:
 *                 tipo_documento: "NFSe"
 *                 numero: "000456"
 *                 codigo_servico: "01.01"
 *                 aliquota_iss: 5.0
 *                 emitente:
 *                   cnpj: "11.222.333/0001-44"
 *                   nome: "Consultoria Tech"
 *                 destinatario:
 *                   cnpj: "55.666.777/0001-88"
 *                   nome: "Empresa Cliente Ltda"
 *                 prestador:
 *                   cnpj: "11.222.333/0001-44"
 *                   nome: "Consultoria Tech"
 *                   inscricao_municipal: "123456789"
 *                   endereco: "Rua C, 789 - Belo Horizonte/MG"
 *                 descricao_servico: "Consultoria em tecnologia da informação"
 *                 valor_total: 5000.00
 *                 data_emissao: "2024-01-20T14:00:00.000Z"
 *     responses:
 *       201:
 *         description: Documento capturado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Documento Capturado com sucesso!"
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 documento:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/NFe'
 *                     - $ref: '#/components/schemas/NFSe'
 *       400:
 *         description: Dados inválidos ou tipo de documento não especificado
 *       500:
 *         description: Erro interno ao processar a captura
 */
router.post("/captura", async (req: Request, res: Response) => {
  try {
    const documentosCollection = getDocumentosCollection();

    // Validação básica
    if (
      !req.body.tipo_documento ||
      !["NFe", "NFSe"].includes(req.body.tipo_documento)
    ) {
      return res.status(400).json({
        error:
          "Campo 'tipo_documento' é obrigatório e deve ser 'NFe' ou 'NFSe'",
      });
    }

    const novoDocumento: Partial<DocumentoFiscal> = {
      ...req.body,
      status: "Capturado",
      data_recebimento: new Date(),
      data_emissao: new Date(req.body.data_emissao),
    };

    const result = await documentosCollection.insertOne(
      novoDocumento as DocumentoFiscal
    );

    res.status(201).json({
      mensagem: "Documento Capturado com sucesso!",
      _id: result.insertedId,
      documento: novoDocumento,
    });
  } catch (error) {
    console.error("Erro ao inserir documento:", error);
    res.status(500).json({
      error: "Erro interno ao capturar documento fiscal.",
    });
  }
});

/**
 * @swagger
 * /documentos/pendentes:
 *   get:
 *     summary: Lista documentos pendentes de validação
 *     description: Simula a "Validação Inteligente" retornando documentos com status "Capturado" que possuem 3 ou menos itens (necessitam validação manual)
 *     tags: [Consulta]
 *     responses:
 *       200:
 *         description: Lista de documentos pendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Documentos pendentes de validação manual"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 documentos:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/NFe'
 *                       - $ref: '#/components/schemas/NFSe'
 *       500:
 *         description: Erro ao consultar documentos
 */
router.get("/documentos/pendentes", async (req: Request, res: Response) => {
  try {
    const documentosCollection = getDocumentosCollection();

    // Validação Inteligente: Busca documentos Capturados com 3 ou menos itens
    // Para NFS-e (que não tem array de itens), também inclui na validação
    const documentosPendentes = await documentosCollection
      .find({
        status: "Capturado",
        $or: [
          { "itens.3": { $exists: false } }, // NFe com 3 ou menos itens
          { tipo_documento: "NFSe" }, // Todas as NFSe capturadas
        ],
      })
      .toArray();

    res.status(200).json({
      mensagem: "Documentos pendentes de validação manual",
      total: documentosPendentes.length,
      documentos: documentosPendentes,
    });
  } catch (error) {
    console.error("Erro ao consultar documentos pendentes:", error);
    res.status(500).json({
      error: "Erro interno ao consultar documentos para validação.",
    });
  }
});

/**
 * @swagger
 * /documentos/flexiveis:
 *   get:
 *     summary: Lista todos os documentos fiscais
 *     description: Demonstra a flexibilidade de esquema do MongoDB retornando todos os documentos (NF-e e NFS-e) armazenados na mesma coleção
 *     tags: [Consulta]
 *     responses:
 *       200:
 *         description: Lista de todos os documentos fiscais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Demonstração de flexibilidade de esquema no MongoDB"
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 tipos_encontrados:
 *                   type: object
 *                   properties:
 *                     NFe:
 *                       type: integer
 *                       example: 10
 *                     NFSe:
 *                       type: integer
 *                       example: 5
 *                 documentos:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/NFe'
 *                       - $ref: '#/components/schemas/NFSe'
 *       500:
 *         description: Erro ao consultar documentos
 */
router.get("/documentos/flexiveis", async (req: Request, res: Response) => {
  try {
    const documentosCollection = getDocumentosCollection();

    // Busca TODOS os documentos da coleção (NFe e NFSe misturados)
    const todosDocumentos = await documentosCollection.find({}).toArray();

    // Conta quantos de cada tipo existem
    const tiposEncontrados = todosDocumentos.reduce((acc, doc) => {
      acc[doc.tipo_documento] = (acc[doc.tipo_documento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      mensagem: "Demonstração de flexibilidade de esquema no MongoDB",
      total: todosDocumentos.length,
      tipos_encontrados: tiposEncontrados,
      documentos: todosDocumentos,
    });
  } catch (error) {
    console.error("Erro ao consultar todos os documentos:", error);
    res.status(500).json({
      error: "Erro interno ao consultar documentos.",
    });
  }
});

/**
 * @swagger
 * /documentos/{id}/aprovar:
 *   patch:
 *     summary: Aprova um documento fiscal
 *     description: Simula o workflow de aprovação, atualizando o status do documento para "Pronto para Pagamento" e adicionando dados de auditoria
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID do documento fiscal (ObjectId do MongoDB)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aprovador:
 *                 type: string
 *                 example: "João Silva"
 *                 description: Nome do responsável pela aprovação (opcional)
 *     responses:
 *       200:
 *         description: Documento aprovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Documento 507f1f77bcf86cd799439011 aprovado e pronto para pagamento."
 *                 modificados:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: ID não fornecido ou inválido
 *       404:
 *         description: Documento não encontrado
 *       500:
 *         description: Erro ao processar aprovação
 */
router.patch("/documentos/:id/aprovar", async (req: Request, res: Response) => {
  try {
    const docId = req.params.id;

    if (!docId) {
      return res.status(400).json({
        mensagem: "ID do documento é obrigatório.",
      });
    }

    // Validação do ObjectId
    if (!ObjectId.isValid(docId)) {
      return res.status(400).json({
        mensagem: "ID do documento inválido.",
      });
    }

    const documentosCollection = getDocumentosCollection();

    const result = await documentosCollection.updateOne(
      { _id: new ObjectId(docId) },
      {
        $set: {
          status: "Pronto para Pagamento",
          data_aprovacao: new Date(),
          aprovador: req.body.aprovador || "Sistema Gestão Fiscal",
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        mensagem: "Documento não encontrado.",
      });
    }

    res.status(200).json({
      mensagem: `Documento ${docId} aprovado e pronto para pagamento.`,
      modificados: result.modifiedCount,
    });
  } catch (error) {
    console.error("Erro ao aprovar documento:", error);
    res.status(500).json({
      error: "Erro interno ao processar aprovação.",
    });
  }
});

export default router;
