/**
 * Formas de dados exatamente como a API Java (le-chocollatt-api) devolve/espera —
 * IDs numéricos, nomes de campo iguais aos dos DTOs do backend. Usadas pelos
 * serviços que falam com a API; o restante do site continua usando os tipos de
 * `tipos/produto.ts`/`tipos/loja.ts` (com id `string`), convertidos em `dados-loja-servico.ts`.
 */

export interface VariacaoProdutoApi {
  id: number;
  nome: string;
  preco: number;
  imagens?: string[] | null;
}

export interface ProdutoCompletoApi {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  categoriaId: number;
  categoriaNome: string;
  preco: number;
  imagemCapa: string;
  imagens?: string[] | null;
  ativo: boolean;
  disponivel: boolean;
  destaque: boolean;
  ordem: number;
  observacao?: string;
  unidade?: string;
  tempoPreparo?: string;
  variacoes?: VariacaoProdutoApi[];
}

export interface ProdutoBuscaApi {
  id: number;
  nome: string;
  slug: string;
  categoriaId: number;
  categoriaNome: string;
  preco: number;
  imagemCapa: string;
  ativo: boolean;
  disponivel: boolean;
  destaque: boolean;
  ordem: number;
  unidade?: string;
}

/** Payload de criação/atualização de produto — espelha `ProdutoCriacaoDTO`/`ProdutoAtualizacaoDTO`. */
export interface ProdutoPayload {
  nome: string;
  slug?: string;
  descricao?: string;
  categoriaId: number;
  preco: number;
  imagemCapa?: string;
  imagens?: string[];
  ativo: boolean;
  disponivel: boolean;
  destaque: boolean;
  ordem?: number;
  observacao?: string;
  unidade?: string;
  tempoPreparo?: string;
  variacoes?: VariacaoProdutoApi[];
}

export interface CategoriaApi {
  id: number;
  nome: string;
  ordem: number;
}

export interface CategoriaPayload {
  nome: string;
  ordem?: number;
}

export interface ConfiguracaoLojaApi {
  nome: string;
  subtitulo?: string;
  frase?: string;
  fraseComplementar?: string;
  cidade?: string;
  estado?: string;
  instagramHandle?: string;
  telefoneWhatsapp?: string;
  diasMinimosEncomenda: number;
  formasPagamento?: string[];
  aceitaInstagram: boolean;
  aceitaWhatsapp: boolean;
}

export type ConfiguracaoLojaPayload = ConfiguracaoLojaApi;
