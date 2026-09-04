import { Component, computed, inject, signal } from '@angular/core';
import { BuscaProdutos } from '../../componentes/busca-produtos/busca-produtos';
import { ListaProdutos } from '../../componentes/lista-produtos/lista-produtos';
import { ModalProduto } from '../../componentes/modal-produto/modal-produto';
import { NavegacaoCategorias } from '../../componentes/navegacao-categorias/navegacao-categorias';
import { DadosLojaServico } from '../../servicos/dados-loja-servico';
import type { Produto } from '../../tipos/produto';

@Component({
  selector: 'app-pagina-inicial',
  imports: [BuscaProdutos, NavegacaoCategorias, ListaProdutos, ModalProduto],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css',
})
export class PaginaInicial {
  private readonly dadosLojaServico = inject(DadosLojaServico);

  protected readonly categorias = this.dadosLojaServico.categoriasComProdutos;

  protected readonly termoBusca = signal('');
  protected readonly categoriaSelecionada = signal('');
  protected readonly produtoSelecionado = signal<Produto | undefined>(undefined);

  /**
   * Lista filtrada/ordenada que a grade mostra. Fica aqui (e não em
   * ListaProdutos) porque a navegação de produto anterior/próximo do modal
   * precisa da mesma lista para calcular o próximo item.
   */
  protected readonly produtosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const categoria = this.categoriaSelecionada();

    return this.dadosLojaServico
      .produtos()
      .filter((produto) => produto.ativo)
      .filter((produto) => (categoria ? produto.categoria === categoria : true))
      .filter((produto) => (termo ? produto.nome.toLowerCase().includes(termo) : true))
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  });

  protected readonly mostrarNavegacaoProdutos = computed(() => this.produtosFiltrados().length > 1);

  protected irParaProdutoAnterior(): void {
    this.navegarProduto(-1);
  }

  protected irParaProximoProduto(): void {
    this.navegarProduto(1);
  }

  private navegarProduto(passo: -1 | 1): void {
    const lista = this.produtosFiltrados();
    const atual = this.produtoSelecionado();
    if (lista.length === 0 || !atual) return;

    const indiceAtual = lista.findIndex((produto) => produto.id === atual.id);
    if (indiceAtual === -1) return;

    const proximoIndice = (indiceAtual + passo + lista.length) % lista.length;
    this.produtoSelecionado.set(lista[proximoIndice]);
  }
}
