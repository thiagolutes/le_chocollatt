import type { ItemCarrinho } from "../tipos/produto";

/** Limite defensivo de unidades por item, evita valores absurdos digitados manualmente. */
export const QUANTIDADE_MAXIMA_POR_ITEM = 50;

function ehQuantidadeValida(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= QUANTIDADE_MAXIMA_POR_ITEM;
}

/**
 * Sanitiza dados vindos do localStorage (ou de qualquer fonte não confiável).
 * Como o usuário pode editar o armazenamento local manualmente, aqui só se
 * aceita a FORMA dos dados (ids em texto, quantidade inteira e dentro de um
 * limite razoável). A existência real do produto/variação no catálogo e o
 * preço são responsabilidade exclusiva de `calculoCarrinho.ts`.
 */
export function sanitizarItensCarrinho(dados: unknown): ItemCarrinho[] {
  if (!Array.isArray(dados)) return [];

  const itensValidos: ItemCarrinho[] = [];

  for (const item of dados) {
    if (!item || typeof item !== "object") continue;

    const { produtoId, variacaoId, quantidade } = item as Record<string, unknown>;

    if (typeof produtoId !== "string" || !produtoId) continue;
    if (variacaoId !== undefined && typeof variacaoId !== "string") continue;
    if (!ehQuantidadeValida(quantidade)) continue;

    itensValidos.push({
      produtoId,
      variacaoId: variacaoId as string | undefined,
      quantidade,
    });
  }

  return itensValidos;
}

export function normalizarQuantidade(valor: number): number {
  if (!Number.isFinite(valor)) return 1;
  const inteiro = Math.trunc(valor);
  return Math.min(Math.max(inteiro, 1), QUANTIDADE_MAXIMA_POR_ITEM);
}
