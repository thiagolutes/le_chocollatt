import { Component, computed, input, output, signal } from '@angular/core';
import type { Produto } from '../../tipos/produto';
import { formatarMoeda } from '../../utilitarios/formatacaoMoeda';
import { ImagemProduto } from '../imagem-produto/imagem-produto';

@Component({
  selector: 'app-cartao-produto',
  imports: [ImagemProduto],
  templateUrl: './cartao-produto.html',
  styleUrl: './cartao-produto.css',
})
export class CartaoProduto {
  readonly produto = input.required<Produto>();
  readonly abrir = output<Produto>();

  /**
   * O zoom da foto no hover é aceso por aqui (e não por CSS `:hover` do
   * card sobre o filho) porque o encapsulamento de estilos do Angular não
   * deixa o CSS de um componente alcançar o conteúdo interno de outro.
   */
  protected readonly emHover = signal(false);

  protected readonly precoExibicao = computed(() => {
    const produto = this.produto();
    if (!produto.variacoes || produto.variacoes.length === 0) {
      return formatarMoeda(produto.preco);
    }
    const precos = produto.variacoes.map((variacao) => variacao.preco);
    const menor = Math.min(...precos);
    const maior = Math.max(...precos);
    return menor === maior ? formatarMoeda(menor) : `A partir de ${formatarMoeda(menor)}`;
  });

  protected aoAbrir(): void {
    if (!this.produto().disponivel) return;
    this.abrir.emit(this.produto());
  }
}
