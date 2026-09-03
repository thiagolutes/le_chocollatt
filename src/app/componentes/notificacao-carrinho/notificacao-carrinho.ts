import { Component, DestroyRef, effect, inject } from '@angular/core';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import { Botao } from '../botao/botao';

const DURACAO_AUTO_FECHAR_MS = 5000;

/**
 * Toast exibido ao adicionar um item ao carrinho, montado uma única vez na
 * raiz do app (ver `app.html`) — assim ele continua visível mesmo depois que
 * o modal do produto (bem mais aninhado) já fechou.
 */
@Component({
  selector: 'app-notificacao-carrinho',
  imports: [Botao],
  templateUrl: './notificacao-carrinho.html',
  styleUrl: './notificacao-carrinho.css',
})
export class NotificacaoCarrinho {
  protected readonly carrinhoServico = inject(CarrinhoServico);

  private temporizador: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      if (!this.carrinhoServico.itemAdicionado()) return;
      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(
        () => this.carrinhoServico.ocultarNotificacaoAdicionado(),
        DURACAO_AUTO_FECHAR_MS,
      );
    });

    inject(DestroyRef).onDestroy(() => clearTimeout(this.temporizador));
  }

  protected irParaCarrinho(): void {
    this.carrinhoServico.ocultarNotificacaoAdicionado();
    this.carrinhoServico.abrirCarrinho();
  }

  protected fechar(): void {
    this.carrinhoServico.ocultarNotificacaoAdicionado();
  }
}
