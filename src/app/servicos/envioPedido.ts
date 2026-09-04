import type { ConfiguracaoLoja } from "../tipos/loja";
import type { DadosCliente } from "../tipos/pedido";
import type { CarrinhoProcessado } from "../tipos/pedido";
import { formatarDataBrasileira } from "../utilitarios/formatacaoData";
import { formatarMoeda } from "../utilitarios/formatacaoMoeda";

const rotuloModalidade: Record<DadosCliente["modalidade"], string> = {
  entrega: "Entrega",
  retirada: "Retirada",
};

/**
 * Monta o texto do pedido. Deve ser chamada sempre com um `CarrinhoProcessado`
 * já recalculado na hora (ver `calculoCarrinho.processarCarrinho`), nunca com
 * valores antigos guardados em estado ou no localStorage.
 */
export function montarMensagemPedido(
  configuracaoLoja: ConfiguracaoLoja,
  dados: DadosCliente,
  carrinho: CarrinhoProcessado,
): string {
  const linhas: string[] = [];

  linhas.push(`Olá! Gostaria de fazer um pedido na ${configuracaoLoja.nome}.`, "");

  linhas.push("DADOS DO CLIENTE");
  linhas.push(`Nome: ${dados.nome}`);
  linhas.push("");

  linhas.push("ATENDIMENTO");
  linhas.push(`Modalidade: ${rotuloModalidade[dados.modalidade]}`);
  linhas.push(`Data desejada: ${formatarDataBrasileira(dados.dataDesejada)}`);
  linhas.push("");

  if (dados.modalidade === "entrega") {
    linhas.push(`Endereço: ${dados.endereco}`, "");
  }

  linhas.push("PEDIDO");
  linhas.push("");
  for (const item of carrinho.itens) {
    const nomeVariacao = item.variacao ? ` - ${item.variacao.nome}` : "";
    linhas.push(`- ${item.quantidade}x ${item.produto.nome}${nomeVariacao}`);
    linhas.push(`  Valor unitário: ${formatarMoeda(item.precoUnitario)}`);
    linhas.push(`  Subtotal: ${formatarMoeda(item.subtotal)}`);
    linhas.push("");
  }

  linhas.push(`TOTAL: ${formatarMoeda(carrinho.total)}`);
  linhas.push("");

  linhas.push("Observações:");
  linhas.push(dados.observacoes.trim() || "Nenhuma");

  return linhas.join("\n");
}

/**
 * Link para abrir uma conversa no Direct do Instagram já com a loja.
 * Diferente do wa.me do WhatsApp, o Instagram não tem um parâmetro público
 * pra pré-preencher o texto da mensagem — por isso o pedido é copiado pra
 * área de transferência à parte (ver `Carrinho.aoConfirmarPedido`) e o
 * cliente cola manualmente na conversa.
 */
export function montarLinkInstagram(configuracaoLoja: ConfiguracaoLoja): string {
  const usuario = configuracaoLoja.instagram.replace(/^@/, "");
  return `https://ig.me/m/${usuario}`;
}

/**
 * Link do WhatsApp já com o texto do pedido preenchido — diferente do
 * Instagram, não precisa de copiar/colar manual.
 */
export function montarLinkWhatsApp(configuracaoLoja: ConfiguracaoLoja, mensagem: string): string {
  return `https://wa.me/${configuracaoLoja.telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`;
}
