import { ObjectId } from "mongodb";

// Interface base para todos os documentos fiscais
export interface DocumentoFiscalBase {
  _id?: ObjectId;
  tipo_documento: "NFe" | "NFSe";
  numero: string;
  emitente: {
    cnpj: string;
    nome: string;
    endereco?: string;
  };
  destinatario: {
    cnpj?: string;
    cpf?: string;
    nome: string;
    endereco?: string;
  };
  valor_total: number;
  data_emissao: Date;
  status: "Capturado" | "Pronto para Pagamento" | "Pago" | "Cancelado";
  data_recebimento?: Date;
  data_aprovacao?: Date;
  aprovador?: string;
}

// Interface para itens de NF-e
export interface ItemNFe {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  ncm?: string;
}

// Interface para impostos federais da NF-e
export interface ImpostosFederais {
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
}

// Interface específica para NF-e (Nota Fiscal Eletrônica)
export interface NFe extends DocumentoFiscalBase {
  tipo_documento: "NFe";
  chave_acesso: string;
  itens: ItemNFe[];
  impostos_federais: ImpostosFederais;
}

// Interface para prestador de NFS-e
export interface Prestador {
  cnpj: string;
  nome: string;
  inscricao_municipal: string;
  endereco?: string;
}

// Interface específica para NFS-e (Nota Fiscal de Serviço)
export interface NFSe extends DocumentoFiscalBase {
  tipo_documento: "NFSe";
  codigo_servico: string;
  aliquota_iss: number;
  prestador: Prestador;
  descricao_servico: string;
}

// Union type para qualquer tipo de documento fiscal
export type DocumentoFiscal = NFe | NFSe;
