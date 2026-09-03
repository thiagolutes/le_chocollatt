import type { ItemCarrinho, Produto } from "../tipos/produto";
import type { AvisoCarrinho, CarrinhoProcessado, ItemProcessado } from "../tipos/pedido";
import { sanitizarItensCarrinho } from "./validacaoCarrinho";

/**
 * Função centralizada de recálculo e validação do carrinho.
 *
 * Este é o ÚNICO lugar do app que transforma itens salvos (apenas
 * produtoId + variacaoId + quantidade) em itens com preço. Nunca usar um
 * preço vindo do localStorage: ele é sempre relido do catálogo oficial
 * (`produtos.ts`) aqui dentro, no momento da leitura.
 *
 * Isso protege contra o usuário editar o localStorage manualmente, mas não
 * substitui uma validação no servidor — como este protótipo não tem backend,
 * esta é a validação adequada para a etapa atual do projeto.
 */
export function processarCarrinho(dadosBrutos: unknown, produtos: Produto[]): CarrinhoProcessado {
  const itensSaneados = sanitizarItensCarrinho(dadosBrutos);

  const itens: ItemProcessado[] = [];
  const avisos: AvisoCarrinho[] = [];

  for (const item of itensSaneados) {
    const avisoOuItem = validarItemContraCatalogo(item, produtos);

    if ("mensagem" in avisoOuItem) {
      avisos.push(avisoOuItem);
      continue;
    }

    itens.push(avisoOuItem);
  }

  const total = itens.reduce((soma, item) => soma + item.subtotal, 0);
  const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return { itens, avisos, total, quantidadeTotal };
}

function validarItemContraCatalogo(
  item: ItemCarrinho,
  produtos: Produto[],
): ItemProcessado | AvisoCarrinho {
  const produto = produtos.find((candidato) => candidato.id === item.produtoId);

  if (!produto) {
    return {
      produtoId: item.produtoId,
      variacaoId: item.variacaoId,
      mensagem: "Este produto não existe mais no cardápio e foi removido do carrinho.",
    };
  }

  if (!produto.disponivel) {
    return {
      produtoId: item.produtoId,
      variacaoId: item.variacaoId,
      mensagem: `"${produto.nome}" está indisponível no momento e foi removido do carrinho.`,
    };
  }

  const variacao = item.variacaoId
    ? produto.variacoes?.find((candidata) => candidata.id === item.variacaoId)
    : undefined;

  if (item.variacaoId && !variacao) {
    return {
      produtoId: item.produtoId,
      variacaoId: item.variacaoId,
      mensagem: `A opção escolhida de "${produto.nome}" não existe mais e o item foi removido do carrinho.`,
    };
  }

  const precoUnitario = variacao ? variacao.preco : produto.preco;

  return {
    produtoId: item.produtoId,
    variacaoId: item.variacaoId,
    quantidade: item.quantidade,
    produto,
    variacao,
    precoUnitario,
    subtotal: precoUnitario * item.quantidade,
  };
}
