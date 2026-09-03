import type { ItemCarrinho } from "../tipos/produto";

const CHAVE_ARMAZENAMENTO = "leChocolat.carrinho";

/**
 * Lê o carrinho salvo no navegador. O conteúdo é tratado como não confiável:
 * pode ter sido editado manualmente, corrompido ou vir de uma versão antiga
 * do site. A validação de formato acontece em `validacaoCarrinho.ts`.
 */
export function carregarCarrinhoArmazenado(): unknown {
  try {
    const bruto = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!bruto) return [];
    return JSON.parse(bruto);
  } catch {
    return [];
  }
}

export function salvarCarrinhoArmazenado(itens: ItemCarrinho[]): void {
  try {
    window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens));
  } catch {
    // Armazenamento indisponível (modo privado, cota excedida etc.).
    // O pedido ainda funciona na sessão atual, apenas não persiste.
  }
}
