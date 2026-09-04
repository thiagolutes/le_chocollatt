import { Component, inject, input } from '@angular/core';
import { DadosLojaServico } from '../../servicos/dados-loja-servico';

/** Wordmark da loja, recriado a partir do padrão visual observado no logo oficial. */
@Component({
  selector: 'app-marca',
  imports: [],
  templateUrl: './marca.html',
  styleUrl: './marca.css',
})
export class Marca {
  readonly como = input<'h1' | 'p'>('p');
  readonly tamanho = input<'padrao' | 'grande'>('padrao');

  private readonly configuracaoLoja = inject(DadosLojaServico).configuracaoLoja();
  protected readonly nomeLoja = this.configuracaoLoja.nome;
  protected readonly subtituloLoja = this.configuracaoLoja.subtitulo;
}
