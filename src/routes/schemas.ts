/**
 * @swagger
 * components:
 *   schemas:
 *     Emitente:
 *       type: object
 *       required:
 *         - cnpj
 *         - nome
 *       properties:
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-90"
 *         nome:
 *           type: string
 *           example: "Empresa XYZ Ltda"
 *         endereco:
 *           type: string
 *           example: "Rua A, 123 - São Paulo/SP"
 *
 *     Destinatario:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         cnpj:
 *           type: string
 *           example: "98.765.432/0001-10"
 *         cpf:
 *           type: string
 *           example: "123.456.789-00"
 *         nome:
 *           type: string
 *           example: "Empresa ABC Ltda"
 *         endereco:
 *           type: string
 *           example: "Av. B, 456 - Rio de Janeiro/RJ"
 *
 *     ItemNFe:
 *       type: object
 *       required:
 *         - codigo
 *         - descricao
 *         - quantidade
 *         - valor_unitario
 *         - valor_total
 *       properties:
 *         codigo:
 *           type: string
 *           example: "PROD001"
 *         descricao:
 *           type: string
 *           example: "Produto A"
 *         quantidade:
 *           type: number
 *           example: 10
 *         valor_unitario:
 *           type: number
 *           example: 50.00
 *         valor_total:
 *           type: number
 *           example: 500.00
 *         ncm:
 *           type: string
 *           example: "12345678"
 *
 *     ImpostosFederais:
 *       type: object
 *       required:
 *         - icms
 *         - ipi
 *         - pis
 *         - cofins
 *       properties:
 *         icms:
 *           type: number
 *           example: 150.00
 *         ipi:
 *           type: number
 *           example: 75.00
 *         pis:
 *           type: number
 *           example: 24.75
 *         cofins:
 *           type: number
 *           example: 114.00
 *
 *     Prestador:
 *       type: object
 *       required:
 *         - cnpj
 *         - nome
 *         - inscricao_municipal
 *       properties:
 *         cnpj:
 *           type: string
 *           example: "11.222.333/0001-44"
 *         nome:
 *           type: string
 *           example: "Consultoria Tech"
 *         inscricao_municipal:
 *           type: string
 *           example: "123456789"
 *         endereco:
 *           type: string
 *           example: "Rua C, 789 - Belo Horizonte/MG"
 *
 *     NFe:
 *       type: object
 *       required:
 *         - tipo_documento
 *         - numero
 *         - chave_acesso
 *         - emitente
 *         - destinatario
 *         - valor_total
 *         - data_emissao
 *         - itens
 *         - impostos_federais
 *       properties:
 *         tipo_documento:
 *           type: string
 *           enum: [NFe]
 *           example: "NFe"
 *         numero:
 *           type: string
 *           example: "000123"
 *         chave_acesso:
 *           type: string
 *           example: "35210812345678901234550010001234561234567890"
 *         emitente:
 *           $ref: '#/components/schemas/Emitente'
 *         destinatario:
 *           $ref: '#/components/schemas/Destinatario'
 *         valor_total:
 *           type: number
 *           example: 1500.00
 *         data_emissao:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         itens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemNFe'
 *         impostos_federais:
 *           $ref: '#/components/schemas/ImpostosFederais'
 *         status:
 *           type: string
 *           enum: [Capturado, Pronto para Pagamento, Pago, Cancelado]
 *           example: "Capturado"
 *         data_recebimento:
 *           type: string
 *           format: date-time
 *         data_aprovacao:
 *           type: string
 *           format: date-time
 *         aprovador:
 *           type: string
 *           example: "Sistema V360"
 *
 *     NFSe:
 *       type: object
 *       required:
 *         - tipo_documento
 *         - numero
 *         - codigo_servico
 *         - aliquota_iss
 *         - emitente
 *         - destinatario
 *         - prestador
 *         - descricao_servico
 *         - valor_total
 *         - data_emissao
 *       properties:
 *         tipo_documento:
 *           type: string
 *           enum: [NFSe]
 *           example: "NFSe"
 *         numero:
 *           type: string
 *           example: "000456"
 *         codigo_servico:
 *           type: string
 *           example: "01.01"
 *         aliquota_iss:
 *           type: number
 *           example: 5.0
 *         emitente:
 *           $ref: '#/components/schemas/Emitente'
 *         destinatario:
 *           $ref: '#/components/schemas/Destinatario'
 *         prestador:
 *           $ref: '#/components/schemas/Prestador'
 *         descricao_servico:
 *           type: string
 *           example: "Consultoria em tecnologia da informação"
 *         valor_total:
 *           type: number
 *           example: 5000.00
 *         data_emissao:
 *           type: string
 *           format: date-time
 *           example: "2024-01-20T14:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [Capturado, Pronto para Pagamento, Pago, Cancelado]
 *           example: "Capturado"
 *         data_recebimento:
 *           type: string
 *           format: date-time
 *         data_aprovacao:
 *           type: string
 *           format: date-time
 *         aprovador:
 *           type: string
 *           example: "Sistema V360"
 */

// Este arquivo serve apenas para definir os schemas do Swagger
// A exportação vazia é necessária para que o TypeScript trate como módulo
export {};
