import { Component, input, output } from '@angular/core';
import type { Produto } from '../../tipos/produto';
import { CartaoProduto } from '../cartao-produto/cartao-produto';

/**
 * Apenas exibe a lista já filtrada/ordenada recebida do componente pai.
 * O filtro fica na página porque ela também precisa da lista para calcular
 * "próximo/anterior produto" na navegação do modal.
 */
@Component({
  selector: 'app-lista-produtos',
  imports: [CartaoProduto],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  readonly produtos = input.required<Produto[]>();
  readonly abrirProduto = output<Produto>();
}
