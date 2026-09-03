import { Component, input } from '@angular/core';
import { configuracoesLoja } from '../../dados/configuracoesLoja';

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

  protected readonly nomeLoja = configuracoesLoja.nome;
  protected readonly subtituloLoja = configuracoesLoja.subtitulo;
}
