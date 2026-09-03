import type { Produto, VariacaoProduto } from "./produto";

export type ModalidadeEntrega = "entrega" | "retirada";

export interface DadosCliente {
  nome: string;
  modalidade: ModalidadeEntrega;
  endereco: string;
  dataDesejada: string;
  observacoes: string;
}

export const dadosClienteVazio: DadosCliente = {
  nome: "",
  modalidade: "retirada",
  endereco: "",
  dataDesejada: "",
  observacoes: "",
};

export type ErrosFormularioPedido = Partial<Record<keyof DadosCliente, string>>;

/**
 * Item de carrinho já validado contra o catálogo oficial: o preço nunca vem
 * do localStorage, é sempre recalculado a partir de `produtos.ts` no momento do uso.
 */
export interface ItemProcessado {
  produtoId: string;
  variacaoId?: string;
  quantidade: number;
  produto: Produto;
  variacao?: VariacaoProduto;
  precoUnitario: number;
  subtotal: number;
}

export interface AvisoCarrinho {
  produtoId: string;
  variacaoId?: string;
  mensagem: string;
}

export interface CarrinhoProcessado {
  itens: ItemProcessado[];
  avisos: AvisoCarrinho[];
  total: number;
  quantidadeTotal: number;
}
