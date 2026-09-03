import { Injectable, computed, effect, signal } from '@angular/core';
import { produtosAtivos } from '../dados/produtos';
import type { AvisoCarrinho, CarrinhoProcessado } from '../tipos/pedido';
import type { ItemCarrinho } from '../tipos/produto';
import { carregarCarrinhoArmazenado, salvarCarrinhoArmazenado } from './armazenamentoCarrinho';
import { processarCarrinho } from './calculoCarrinho';
import { normalizarQuantidade, sanitizarItensCarrinho } from './validacaoCarrinho';

function mesmoItem(item: ItemCarrinho, produtoId: string, variacaoId: string | undefined): boolean {
  return item.produtoId === produtoId && item.variacaoId === variacaoId;
}

/**
 * Estado central do carrinho, compartilhado por toda a aplicação via injeção
 * de dependência. Os itens (apenas produtoId + variacaoId + quantidade) são
 * persistidos no localStorage; o preço nunca é lido de lá — é sempre
 * recalculado a partir do catálogo oficial em `calculoCarrinho.processarCarrinho`.
 */
@Injectable({ providedIn: 'root' })
export class CarrinhoServico {
  private readonly itens = signal<ItemCarrinho[]>(sanitizarItensCarrinho(carregarCarrinhoArmazenado()));
  private readonly _avisos = signal<AvisoCarrinho[]>([]);
  private readonly _aberto = signal(false);
  private readonly _itemAdicionado = signal(false);

  readonly carrinho = computed<CarrinhoProcessado>(() => processarCarrinho(this.itens(), produtosAtivos));
  readonly avisos = this._avisos.asReadonly();
  /** Painel do carrinho aberto/fechado — central aqui pra qualquer tela (ex.: o modal de produto) poder abrir o carrinho sem precisar repassar outputs por vários componentes. */
  readonly aberto = this._aberto.asReadonly();
  readonly itemAdicionado = this._itemAdicionado.asReadonly();

  constructor() {
    // Persiste apenas ids + quantidade a cada mudança no carrinho.
    effect(() => {
      salvarCarrinhoArmazenado(this.itens());
    });

    // Autocorreção: se algo salvo não bate mais com o catálogo (produto
    // removido, variação descontinuada etc.), remove o item e guarda o
    // aviso para ser exibido ao cliente pela interface.
    effect(() => {
      const processado = this.carrinho();
      if (processado.avisos.length === 0) return;

      this._avisos.update((atuais) => [...atuais, ...processado.avisos]);
      this.itens.update((atuais) =>
        atuais.filter((item) =>
          processado.itens.some((item2) => mesmoItem(item, item2.produtoId, item2.variacaoId)),
        ),
      );
    });
  }

  adicionarItem(produtoId: string, variacaoId: string | undefined, quantidade: number): void {
    this.itens.update((atuais) => {
      const existente = atuais.find((item) => mesmoItem(item, produtoId, variacaoId));

      if (!existente) {
        return [...atuais, { produtoId, variacaoId, quantidade: normalizarQuantidade(quantidade) }];
      }

      return atuais.map((item) =>
        mesmoItem(item, produtoId, variacaoId)
          ? { ...item, quantidade: normalizarQuantidade(item.quantidade + quantidade) }
          : item,
      );
    });
  }

  atualizarQuantidade(produtoId: string, variacaoId: string | undefined, quantidade: number): void {
    this.itens.update((atuais) =>
      atuais.map((item) =>
        mesmoItem(item, produtoId, variacaoId)
          ? { ...item, quantidade: normalizarQuantidade(quantidade) }
          : item,
      ),
    );
  }

  removerItem(produtoId: string, variacaoId: string | undefined): void {
    this.itens.update((atuais) => atuais.filter((item) => !mesmoItem(item, produtoId, variacaoId)));
  }

  limparCarrinho(): void {
    this.itens.set([]);
  }

  limparAvisos(): void {
    this._avisos.set([]);
  }

  adicionarAviso(aviso: AvisoCarrinho): void {
    this._avisos.update((atuais) => [...atuais, aviso]);
  }

  abrirCarrinho(): void {
    this._aberto.set(true);
  }

  fecharCarrinho(): void {
    this._aberto.set(false);
  }

  notificarItemAdicionado(): void {
    this._itemAdicionado.set(true);
  }

  ocultarNotificacaoAdicionado(): void {
    this._itemAdicionado.set(false);
  }
}
