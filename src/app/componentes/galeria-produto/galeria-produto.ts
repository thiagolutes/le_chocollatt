import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import type { Produto } from '../../tipos/produto';
import { IconeCategoria } from '../icone-categoria/icone-categoria';

/** Fração da largura do visor que precisa ser arrastada para trocar de foto. */
const LIMIAR_TROCA = 0.2;
/** Reduz o deslocamento ao arrastar além da primeira/última foto (efeito de "borracha"). */
const RESISTENCIA_BORDA = 0.35;

/**
 * Carrossel de fotos do produto: a lista recebida já vem combinada pelo
 * chamador (fotos globais do produto + fotos específicas da variação
 * selecionada). O trilho é deslocado via `transform`, arrastável com o dedo
 * ou o mouse (Pointer Events cobre os dois), com uma pequena animação de
 * acomodação ao soltar — como um carrossel de verdade, não um scroll nativo.
 */
@Component({
  selector: 'app-galeria-produto',
  imports: [IconeCategoria],
  templateUrl: './galeria-produto.html',
  styleUrl: './galeria-produto.css',
})
export class GaleriaProduto {
  readonly imagens = input.required<string[]>();
  readonly produto = input.required<Produto>();

  protected readonly visor = viewChild<ElementRef<HTMLElement>>('visor');
  protected readonly indiceAtual = signal(0);
  protected readonly arrasto = signal(0);
  protected readonly arrastando = signal(false);
  protected readonly imagensComFalha = signal<ReadonlySet<number>>(new Set());
  protected readonly temAnterior = computed(() => this.indiceAtual() > 0);
  protected readonly temProxima = computed(() => this.indiceAtual() < this.imagens().length - 1);

  protected readonly transformTrilho = computed(() => {
    const deslocamentoBase = this.indiceAtual() * -100;
    const arrastoPercentual = this.larguraVisor > 0 ? (this.arrasto() / this.larguraVisor) * 100 : 0;
    return `translateX(calc(${deslocamentoBase}% + ${arrastoPercentual}%))`;
  });

  private larguraVisor = 0;
  private inicioX = 0;
  private ponteiroAtivo: number | null = null;

  constructor() {
    // Sempre que a lista de fotos mudar (ex.: trocou de variação), volta pro início.
    effect(() => {
      this.imagens();
      this.imagensComFalha.set(new Set());
      this.indiceAtual.set(0);
      this.arrasto.set(0);
    });
  }

  protected aoPressionar(evento: PointerEvent): void {
    if (evento.pointerType === 'mouse' && evento.button !== 0) return;
    // As setas de navegação vivem dentro do visor: sem isso, o pointerdown
    // nelas "vaza" pro contêiner, inicia um arrasto e captura o ponteiro —
    // o que rouba o clique do botão antes de ele disparar.
    if ((evento.target as HTMLElement).closest('button')) return;
    const elemento = this.visor()?.nativeElement;
    if (!elemento || this.imagens().length <= 1) return;

    this.larguraVisor = elemento.clientWidth;
    this.inicioX = evento.clientX;
    this.ponteiroAtivo = evento.pointerId;
    this.arrastando.set(true);
    elemento.setPointerCapture(evento.pointerId);
  }

  protected aoMover(evento: PointerEvent): void {
    if (!this.arrastando() || evento.pointerId !== this.ponteiroAtivo) return;

    let distancia = evento.clientX - this.inicioX;
    const alemDoLimite = (distancia > 0 && !this.temAnterior()) || (distancia < 0 && !this.temProxima());
    if (alemDoLimite) distancia *= RESISTENCIA_BORDA;

    this.arrasto.set(distancia);
  }

  protected aoSoltar(evento: PointerEvent): void {
    if (!this.arrastando() || evento.pointerId !== this.ponteiroAtivo) return;

    const limiarPx = this.larguraVisor * LIMIAR_TROCA;
    const distancia = this.arrasto();

    if (distancia <= -limiarPx && this.temProxima()) {
      this.indiceAtual.update((indice) => indice + 1);
    } else if (distancia >= limiarPx && this.temAnterior()) {
      this.indiceAtual.update((indice) => indice - 1);
    }

    this.visor()?.nativeElement.releasePointerCapture(evento.pointerId);
    this.ponteiroAtivo = null;
    this.arrastando.set(false);
    this.arrasto.set(0);
  }

  protected irParaImagem(indice: number): void {
    this.indiceAtual.set(indice);
  }

  protected irParaAnterior(): void {
    if (!this.temAnterior()) return;
    this.indiceAtual.update((indice) => indice - 1);
  }

  protected irParaProxima(): void {
    if (!this.temProxima()) return;
    this.indiceAtual.update((indice) => indice + 1);
  }

  protected marcarFalha(indice: number): void {
    this.imagensComFalha.update((atuais) => new Set(atuais).add(indice));
  }

  protected imagemFalhou(indice: number): boolean {
    return this.imagensComFalha().has(indice);
  }
}
