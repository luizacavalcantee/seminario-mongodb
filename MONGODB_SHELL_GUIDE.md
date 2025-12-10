# 🐚 Guia MongoDB Shell - Projeto Gestão Fiscal

Este guia mostra como usar o MongoDB Shell (mongosh) para demonstrar o funcionamento do projeto durante o seminário.

## 📥 Acessar o MongoDB Shell

### Opção 1: MongoDB Shell no Container Docker

Se você está usando o Docker Compose:

```powershell
# Acessar o shell do MongoDB no container
docker exec -it mongodb-gestao-fiscal mongosh

# Ou em uma linha:
docker exec -it mongodb-gestao-fiscal mongosh --eval "use gestao_fiscal_db"
```

### Opção 2: MongoDB Shell Local

Se você tem o mongosh instalado localmente:

```powershell
mongosh "mongodb://localhost:27017"
```

---

## 🎯 Comandos Essenciais para o Seminário

### 1. Selecionar o Banco de Dados

```javascript
use gestao_fiscal_db
```

### 2. Ver Todas as Coleções

```javascript
show collections
```

### 3. Contar Documentos

```javascript
// Total de documentos
db.documentos_fiscais.countDocuments();

// Por tipo
db.documentos_fiscais.countDocuments({ tipo_documento: "NFe" });
db.documentos_fiscais.countDocuments({ tipo_documento: "NFSe" });

// Por status
db.documentos_fiscais.countDocuments({ status: "Capturado" });
db.documentos_fiscais.countDocuments({ status: "Pronto para Pagamento" });
```

---

## 📊 Consultas de Demonstração

### 4. Listar Todos os Documentos (formatado)

```javascript
db.documentos_fiscais.find().pretty();

// Limitar a 5 documentos
db.documentos_fiscais.find().limit(5).pretty();
```

### 5. Buscar por Tipo de Documento

```javascript
// Apenas NF-e
db.documentos_fiscais.find({ tipo_documento: "NFe" }).pretty();

// Apenas NFS-e
db.documentos_fiscais.find({ tipo_documento: "NFSe" }).pretty();
```

### 6. Demonstrar Flexibilidade de Esquema

**Mostrar que NF-e tem campo "chave_acesso":**

```javascript
db.documentos_fiscais.find(
  { tipo_documento: "NFe" },
  { numero: 1, chave_acesso: 1, tipo_documento: 1 }
);
```

**Mostrar que NFS-e tem campo "codigo_servico":**

```javascript
db.documentos_fiscais.find(
  { tipo_documento: "NFSe" },
  { numero: 1, codigo_servico: 1, aliquota_iss: 1, tipo_documento: 1 }
);
```

### 7. Consultas Avançadas (Validação Inteligente)

**Documentos com 3 ou menos itens (a regra da API):**

```javascript
db.documentos_fiscais
  .find({
    status: "Capturado",
    "itens.3": { $exists: false },
  })
  .pretty();
```

**Documentos com valor alto (maior que 1000):**

```javascript
db.documentos_fiscais
  .find({
    valor_total: { $gt: 1000 },
  })
  .pretty();
```

### 8. Buscar por Status

```javascript
// Documentos capturados
db.documentos_fiscais.find({ status: "Capturado" }).pretty();

// Documentos prontos para pagamento
db.documentos_fiscais.find({ status: "Pronto para Pagamento" }).pretty();
```

### 9. Projeções (Mostrar apenas campos específicos)

```javascript
// Apenas campos relevantes
db.documentos_fiscais
  .find(
    {},
    {
      numero: 1,
      tipo_documento: 1,
      valor_total: 1,
      status: 1,
      data_recebimento: 1,
    }
  )
  .pretty();
```

### 10. Agregações (Análises Complexas)

**Total de valores por tipo de documento:**

```javascript
db.documentos_fiscais.aggregate([
  {
    $group: {
      _id: "$tipo_documento",
      total: { $sum: "$valor_total" },
      quantidade: { $sum: 1 },
      media: { $avg: "$valor_total" },
    },
  },
]);
```

**Distribuição por status:**

```javascript
db.documentos_fiscais.aggregate([
  {
    $group: {
      _id: "$status",
      quantidade: { $sum: 1 },
    },
  },
  {
    $sort: { quantidade: -1 },
  },
]);
```

**Documentos por emitente:**

```javascript
db.documentos_fiscais.aggregate([
  {
    $group: {
      _id: "$emitente.nome",
      total_documentos: { $sum: 1 },
      valor_total: { $sum: "$valor_total" },
    },
  },
  {
    $sort: { valor_total: -1 },
  },
]);
```

---

## 🎨 Demonstrações Visuais

### 11. Mostrar Estrutura de um Documento NFe

```javascript
db.documentos_fiscais.findOne({ tipo_documento: "NFe" });
```

### 12. Mostrar Estrutura de um Documento NFSe

```javascript
db.documentos_fiscais.findOne({ tipo_documento: "NFSe" });
```

### 13. Comparar Esquemas (Demonstrar Flexibilidade)

```javascript
// Ver todos os campos de NFe
Object.keys(db.documentos_fiscais.findOne({ tipo_documento: "NFe" }));

// Ver todos os campos de NFSe
Object.keys(db.documentos_fiscais.findOne({ tipo_documento: "NFSe" }));
```

---

## 🔍 Consultas Complexas com Operadores

### 14. Operador $or (OU)

```javascript
// Documentos capturados OU com valor alto
db.documentos_fiscais
  .find({
    $or: [{ status: "Capturado" }, { valor_total: { $gt: 5000 } }],
  })
  .pretty();
```

### 15. Operador $and (E)

```javascript
// NFe capturadas com valor alto
db.documentos_fiscais
  .find({
    $and: [
      { tipo_documento: "NFe" },
      { status: "Capturado" },
      { valor_total: { $gt: 1000 } },
    ],
  })
  .pretty();
```

### 16. Buscar em Arrays (itens da NFe)

```javascript
// NFe com produto específico
db.documentos_fiscais
  .find({
    "itens.descricao": /Produto/i,
  })
  .pretty();

// Contar itens em cada documento
db.documentos_fiscais.aggregate([
  { $match: { tipo_documento: "NFe" } },
  {
    $project: {
      numero: 1,
      quantidade_itens: { $size: "$itens" },
    },
  },
]);
```

### 17. Buscar em Objetos Aninhados

```javascript
// Buscar por CNPJ do emitente
db.documentos_fiscais
  .find({
    "emitente.cnpj": "12.345.678/0001-90",
  })
  .pretty();

// Buscar por nome do prestador (NFS-e)
db.documentos_fiscais
  .find({
    "prestador.nome": /Consultoria/i,
  })
  .pretty();
```

---

## 📈 Índices e Performance

### 18. Ver Índices Existentes

```javascript
db.documentos_fiscais.getIndexes();
```

### 19. Criar Índices (Opcional - para demonstrar performance)

```javascript
// Índice simples
db.documentos_fiscais.createIndex({ tipo_documento: 1 });

// Índice composto
db.documentos_fiscais.createIndex({ status: 1, valor_total: -1 });

// Índice de texto para buscas
db.documentos_fiscais.createIndex({
  "emitente.nome": "text",
  "destinatario.nome": "text",
});
```

### 20. Explain (Mostrar Plano de Execução)

```javascript
db.documentos_fiscais.find({ tipo_documento: "NFe" }).explain("executionStats");
```

---

## 🧹 Comandos de Manutenção

### 21. Estatísticas da Coleção

```javascript
db.documentos_fiscais.stats();
```

### 22. Limpar Todos os Documentos (CUIDADO!)

```javascript
// Apenas para resetar durante demonstração
db.documentos_fiscais.deleteMany({});
```

### 23. Remover Documentos Específicos

```javascript
// Remover documentos cancelados
db.documentos_fiscais.deleteMany({ status: "Cancelado" });
```

---

## 🎬 Script de Demonstração Completo

Execute este script sequencial para uma demonstração completa:

```javascript
// 1. Selecionar banco
use gestao_fiscal_db

// 2. Verificar quantos documentos temos
print("=== TOTAL DE DOCUMENTOS ===")
db.documentos_fiscais.countDocuments()

// 3. Distribuição por tipo
print("\n=== DISTRIBUIÇÃO POR TIPO ===")
db.documentos_fiscais.aggregate([
  { $group: { _id: "$tipo_documento", total: { $sum: 1 } } }
])

// 4. Demonstrar flexibilidade de esquema
print("\n=== EXEMPLO DE NFe ===")
db.documentos_fiscais.findOne({ tipo_documento: "NFe" })

print("\n=== EXEMPLO DE NFSe ===")
db.documentos_fiscais.findOne({ tipo_documento: "NFSe" })

// 5. Validação inteligente
print("\n=== DOCUMENTOS PENDENTES (≤3 itens) ===")
db.documentos_fiscais.find({
  status: "Capturado",
  "itens.3": { $exists: false }
}).count()

// 6. Análise de valores
print("\n=== ANÁLISE DE VALORES ===")
db.documentos_fiscais.aggregate([
  {
    $group: {
      _id: "$tipo_documento",
      valor_total: { $sum: "$valor_total" },
      valor_medio: { $avg: "$valor_total" },
      quantidade: { $sum: 1 }
    }
  }
])
```

---

## 💡 Dicas para o Seminário

### Comparação MongoDB vs SQL

**MongoDB (Consulta Simples):**

```javascript
db.documentos_fiscais.find({ tipo_documento: "NFe" });
```

**SQL Equivalente (Complexo):**

```sql
SELECT * FROM documentos_fiscais
LEFT JOIN itens ON documentos_fiscais.id = itens.documento_id
LEFT JOIN impostos ON documentos_fiscais.id = impostos.documento_id
WHERE tipo_documento = 'NFe'
```

### Vantagens a Destacar:

1. **Esquema Flexível**: NFe e NFSe na mesma coleção
2. **Sem JOINs**: Dados aninhados (itens, impostos, prestador)
3. **Arrays Nativos**: Lista de itens diretamente no documento
4. **Consultas Poderosas**: Operadores como `$exists`, `$gt`, `$or`
5. **JSON Nativo**: Estrutura familiar para desenvolvedores

---

## 🚀 Quick Commands (Cole e Execute)

```javascript
// Ver tudo resumido
use gestao_fiscal_db
db.documentos_fiscais.find({}, {numero: 1, tipo_documento: 1, valor_total: 1, status: 1}).pretty()

// Análise rápida
db.documentos_fiscais.aggregate([{$group: {_id: "$tipo_documento", total: {$sum: 1}, valor: {$sum: "$valor_total"}}}])

// Validação inteligente
db.documentos_fiscais.find({status: "Capturado", "itens.3": {$exists: false}}).count()
```
