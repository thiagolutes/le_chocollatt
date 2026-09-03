import { Component, input, signal } from '@angular/core';
import type { Produto } from '../../tipos/produto';
import { IconeCategoria } from '../icone-categoria/icone-categoria';

/**
 * Mostra a foto do produto e, caso o arquivo ainda não exista ou falhe ao
 * carregar, recua para um ícone ilustrativo da categoria — sem imagens
 * genéricas de banco de imagens, mantendo a identidade da marca.
 */
@Component({
  selector: 'app-imagem-produto',
  imports: [IconeCategoria],
  templateUrl: './imagem-produto.html',
  styleUrl: './imagem-produto.css',
})
export class ImagemProduto {
  readonly produto = input.required<Produto>();
  readonly proporcao = input<'quadrada' | 'retangular'>('quadrada');
  /** Controlado pelo pai (ex.: hover do card inteiro) para dar zoom só na foto, sem esticar a moldura. */
  readonly destacado = input(false);

  protected readonly falhouCarregamento = signal(false);

  protected marcarFalha(): void {
    this.falhouCarregamento.set(true);
  }
}
