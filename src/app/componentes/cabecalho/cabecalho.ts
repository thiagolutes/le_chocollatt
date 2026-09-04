import { Component, inject } from '@angular/core';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import { DadosLojaServico } from '../../servicos/dados-loja-servico';
import { Marca } from '../marca/marca';

@Component({
  selector: 'app-cabecalho',
  imports: [Marca],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
})
export class Cabecalho {
  protected readonly carrinhoServico = inject(CarrinhoServico);
  protected readonly frase = inject(DadosLojaServico).configuracaoLoja().frase;
}
