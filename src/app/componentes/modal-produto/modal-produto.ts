import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import type { Produto, VariacaoProduto } from '../../tipos/produto';
import { criarFechamentoAnimado } from '../../utilitarios/fechamentoAnimado';
import { formatarMoeda } from '../../utilitarios/formatacaoMoeda';
import { Botao } from '../botao/botao';
import { GaleriaProduto } from '../galeria-produto/galeria-produto';

@Component({
  selector: 'app-modal-produto',
  imports: [GaleriaProduto, Botao],
  templateUrl: './modal-produto.html',
  styleUrl: './modal-produto.css',
})
export class ModalProduto {
  private readonly carrinhoServico = inject(CarrinhoServico);
  private readonly documento = inject(DOCUMENT);

  readonly produto = input.required<Produto>();
  /** Só mostra a navegação entre produtos quando há mais de um produto na lista atual. */
  readonly mostrarNavegacaoProdutos = input(false);
  readonly fechar = output<void>();
  readonly produtoAnterior = output<void>();
  readonly produtoProximo = output<void>();

  protected readonly painel = viewChild<ElementRef<HTMLElement>>('painel');
  protected readonly variacoes = computed(() => this.produto().variacoes ?? []);
  protected readonly variacaoSelecionada = signal<VariacaoProduto | undefined>(undefined);
  protected readonly quantidade = signal(1);

  protected readonly precoUnitario = computed(() => this.variacaoSelecionada()?.preco ?? this.produto().preco);
  protected readonly subtotal = computed(() => this.precoUnitario() * this.quantidade());
  protected readonly formatarMoeda = formatarMoeda;

  /** Fotos globais do produto + fotos específicas da variação escolhida, nessa ordem. */
  protected readonly imagensGaleria = computed(() => {
    const produto = this.produto();
    const globais = produto.imagens && produto.imagens.length > 0 ? produto.imagens : [produto.imagem];
    const especificas = this.variacaoSelecionada()?.imagens ?? [];
    return [...globais, ...especificas];
  });

  private readonly fechamento = criarFechamentoAnimado(() => this.fechar.emit());
  protected readonly fechando = this.fechamento.fechando;

  /** Direção da troca de PRODUTO em andamento, usada só para a animação de saída do conteúdo. */
  protected readonly trocandoProduto = signal<'proxima' | 'anterior' | null>(null);
  private readonly DURACAO_TROCA_PRODUTO_MS = 180;

  constructor() {
    effect(() => {
      const produto = this.produto();
      this.variacaoSelecionada.set(produto.variacoes?.[0]);
      this.quantidade.set(1);
    });

    afterNextRender(() => this.painel()?.nativeElement.focus());

    const estiloOriginal = this.documento.body.style.overflow;
    this.documento.body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => {
      this.documento.body.style.overflow = estiloOriginal;
    });

    // Botões de voltar/avançar do mouse trocam de produto em vez de navegar
    // no histórico do navegador. O Chrome decide se vai navegar já no
    // "mousedown" do botão lateral (não espera o "mouseup"), então
    // precisamos interceptar os dois eventos, na fase de captura, para
    // ter a melhor chance de vencer a navegação nativa antes que ela comece.
    // Mesmo assim, em algumas versões/plataformas o navegador pode navegar
    // de qualquer forma — é uma limitação da plataforma, não deste componente.
    const ehBotaoLateral = (evento: MouseEvent) => evento.button === 3 || evento.button === 4;

    const aoPressionarBotaoLateral = (evento: MouseEvent) => {
      if (!this.mostrarNavegacaoProdutos() || !ehBotaoLateral(evento)) return;
      evento.preventDefault();
      evento.stopPropagation();
    };

    const aoSoltarBotaoLateral = (evento: MouseEvent) => {
      if (!this.mostrarNavegacaoProdutos() || !ehBotaoLateral(evento)) return;
      evento.preventDefault();
      evento.stopPropagation();
      this.navegarProduto(evento.button === 3 ? 'anterior' : 'proxima');
    };

    this.documento.addEventListener('mousedown', aoPressionarBotaoLateral, { capture: true });
    this.documento.addEventListener('mouseup', aoSoltarBotaoLateral, { capture: true });
    this.documento.addEventListener('auxclick', aoPressionarBotaoLateral, { capture: true });
    inject(DestroyRef).onDestroy(() => {
      this.documento.removeEventListener('mousedown', aoPressionarBotaoLateral, { capture: true });
      this.documento.removeEventListener('mouseup', aoSoltarBotaoLateral, { capture: true });
      this.documento.removeEventListener('auxclick', aoPressionarBotaoLateral, { capture: true });
    });
  }

  protected selecionarVariacao(variacao: VariacaoProduto): void {
    this.variacaoSelecionada.set(variacao);
  }

  protected aumentarQuantidade(): void {
    this.quantidade.update((atual) => Math.min(atual + 1, 50));
  }

  protected diminuirQuantidade(): void {
    this.quantidade.update((atual) => Math.max(atual - 1, 1));
  }

  protected atualizarQuantidade(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    const quantidade = Math.max(1, Math.min(50, parseInt(valor, 10) || 1));
    this.quantidade.set(quantidade);
  }

  protected adicionarAoCarrinho(): void {
    this.carrinhoServico.adicionarItem(this.produto().id, this.variacaoSelecionada()?.id, this.quantidade());
    this.carrinhoServico.notificarItemAdicionado();
    this.fechamento.iniciarFechamento();
  }

  protected iniciarFechamento(): void {
    this.fechamento.iniciarFechamento();
  }

  /**
   * Troca para o próximo/anterior produto da lista atual (infinito: do
   * último volta ao primeiro e vice-versa). O conteúdo desliza para fora
   * na direção da navegação antes de o pai trocar o produto exibido.
   */
  protected navegarProduto(direcao: 'proxima' | 'anterior'): void {
    if (!this.mostrarNavegacaoProdutos() || this.trocandoProduto()) return;
    this.trocandoProduto.set(direcao);
    setTimeout(() => {
      if (direcao === 'proxima') {
        this.produtoProximo.emit();
      } else {
        this.produtoAnterior.emit();
      }
      this.trocandoProduto.set(null);
    }, this.DURACAO_TROCA_PRODUTO_MS);
  }

  protected aoClicarFundo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.iniciarFechamento();
    }
  }

  /**
   * Setas do teclado trocam de produto (não de foto). Ignora quando o foco
   * está num campo que já usa as setas pra si mesmo — ex.: o grupo de rádio
   * das variações, que navega nativamente entre opções com ←/→.
   */
  protected aoTeclaNavegacao(evento: Event, direcao: 'proxima' | 'anterior'): void {
    const alvo = evento.target as HTMLElement | null;
    if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.tagName === 'SELECT')) return;
    this.navegarProduto(direcao);
  }
}
