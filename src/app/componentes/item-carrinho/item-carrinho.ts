import { Component, computed, inject, input } from '@angular/core';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import type { ItemProcessado } from '../../tipos/pedido';
import { formatarMoeda } from '../../utilitarios/formatacaoMoeda';
import { ImagemProduto } from '../imagem-produto/imagem-produto';

/** Nome da classe evita colidir com a interface `ItemCarrinho` (tipos/produto.ts). */
@Component({
  selector: 'app-item-carrinho',
  imports: [ImagemProduto],
  templateUrl: './item-carrinho.html',
  styleUrl: './item-carrinho.css',
})
export class ItemCarrinhoLinha {
  private readonly carrinhoServico = inject(CarrinhoServico);

  readonly item = input.required<ItemProcessado>();

  protected readonly formatarMoeda = formatarMoeda;
  protected readonly podeDiminuir = computed(() => this.item().quantidade > 1);

  protected aumentar(): void {
    const item = this.item();
    this.carrinhoServico.atualizarQuantidade(item.produtoId, item.variacaoId, item.quantidade + 1);
  }

  protected diminuir(): void {
    const item = this.item();
    if (item.quantidade <= 1) return;
    this.carrinhoServico.atualizarQuantidade(item.produtoId, item.variacaoId, item.quantidade - 1);
  }

  protected atualizarQuantidade(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    const item = this.item();
    const quantidade = Math.max(1, Math.min(50, parseInt(valor, 10) || 1));
    this.carrinhoServico.atualizarQuantidade(item.produtoId, item.variacaoId, quantidade);
  }

  protected remover(): void {
    const item = this.item();
    this.carrinhoServico.removerItem(item.produtoId, item.variacaoId);
  }
}
