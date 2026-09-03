import { Component, inject } from '@angular/core';
import { configuracoesLoja } from '../../dados/configuracoesLoja';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import { Marca } from '../marca/marca';

@Component({
  selector: 'app-cabecalho',
  imports: [Marca],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
})
export class Cabecalho {
  protected readonly carrinhoServico = inject(CarrinhoServico);
  protected readonly frase = configuracoesLoja.frase;
}
