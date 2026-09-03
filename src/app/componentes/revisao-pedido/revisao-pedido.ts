import { Component, input } from '@angular/core';
import type { CarrinhoProcessado, DadosCliente } from '../../tipos/pedido';
import { formatarDataBrasileira } from '../../utilitarios/formatacaoData';
import { formatarMoeda } from '../../utilitarios/formatacaoMoeda';

@Component({
  selector: 'app-revisao-pedido',
  imports: [],
  templateUrl: './revisao-pedido.html',
  styleUrl: './revisao-pedido.css',
})
export class RevisaoPedido {
  readonly dadosCliente = input.required<DadosCliente>();
  readonly carrinho = input.required<CarrinhoProcessado>();

  protected readonly formatarMoeda = formatarMoeda;
  protected readonly formatarDataBrasileira = formatarDataBrasileira;
}
