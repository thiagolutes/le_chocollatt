import { signal } from '@angular/core';

/**
 * Coordena uma animação de saída em CSS antes de executar a ação real de
 * fechamento (ex.: emitir o output que remove o componente do DOM via @if).
 * Usado pelo Carrinho e pelo ModalProduto, que têm a mesma necessidade:
 * tocar a transição de saída e só então desmontar o overlay.
 */
export function criarFechamentoAnimado(aoFechar: () => void, duracaoMs = 220) {
  const fechando = signal(false);

  function iniciarFechamento(): void {
    if (fechando()) return;
    fechando.set(true);
    setTimeout(aoFechar, duracaoMs);
  }

  return { fechando, iniciarFechamento };
}
