import { MongoClient, Db, Collection } from "mongodb";
import { DocumentoFiscal } from "../types/documentoFiscal";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db: Db;
let documentosCollection: Collection<DocumentoFiscal>;

export async function connectDatabase(): Promise<void> {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB! 💾");

    db = client.db("v360_fiscal");
    documentosCollection = db.collection<DocumentoFiscal>("documentos_fiscais");
  } catch (error) {
    console.error("\n❌ ERRO FATAL: Falha ao conectar ao MongoDB.");
    console.error("Verifique se o Docker está rodando na porta 27017.");
    if (error instanceof Error) {
      console.error("Detalhe do Erro:", error.message);
    }
    process.exit(1);
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error(
      "Database não inicializado. Execute connectDatabase() primeiro."
    );
  }
  return db;
}

export function getDocumentosCollection(): Collection<DocumentoFiscal> {
  if (!documentosCollection) {
    throw new Error(
      "Collection não inicializada. Execute connectDatabase() primeiro."
    );
  }
  return documentosCollection;
}

export async function closeDatabase(): Promise<void> {
  await client.close();
  console.log("🔌 Conexão com MongoDB fechada.");
}
