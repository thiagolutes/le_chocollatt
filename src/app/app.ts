import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './componentes/cabecalho/cabecalho';
import { Carrinho } from './componentes/carrinho/carrinho';
import { NotificacaoCarrinho } from './componentes/notificacao-carrinho/notificacao-carrinho';
import { Rodape } from './componentes/rodape/rodape';
import { CarrinhoServico } from './servicos/carrinho-servico';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape, Carrinho, NotificacaoCarrinho],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly carrinhoServico = inject(CarrinhoServico);
}
