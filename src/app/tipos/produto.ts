export interface VariacaoProduto {
  id: string;
  nome: string;
  preco: number;
  /** Fotos específicas dessa variação, somadas às fotos globais do produto na galeria. */
  imagens?: string[];
}

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  categoria: string;
  preco: number;
  imagem: string;
  /** Fotos globais: aparecem na galeria independente da variação escolhida. */
  imagens?: string[];
  /** Controla se o produto aparece no catálogo. Para tirar de circulação sem apagar os dados, troque só esta flag. */
  ativo: boolean;
  /** Produto visível no catálogo, mas sem poder ser pedido no momento (ex.: em falta). */
  disponivel: boolean;
  destaque?: boolean;
  ordem?: number;
  variacoes?: VariacaoProduto[];
  observacao?: string;
  unidade?: string;
  tempoPreparo?: string;
}

export interface Categoria {
  id: string;
  nome: string;
}

export interface ItemCarrinho {
  produtoId: string;
  variacaoId?: string;
  quantidade: number;
}
