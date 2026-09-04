import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, output, signal, viewChild } from '@angular/core';
import { CarrinhoServico } from '../../servicos/carrinho-servico';
import { DadosLojaServico } from '../../servicos/dados-loja-servico';
import { montarLinkInstagram, montarLinkWhatsApp, montarMensagemPedido } from '../../servicos/envioPedido';
import { dadosClienteVazio } from '../../tipos/pedido';
import type { DadosCliente } from '../../tipos/pedido';
import { criarFechamentoAnimado } from '../../utilitarios/fechamentoAnimado';
import { formatarMoeda } from '../../utilitarios/formatacaoMoeda';
import { Botao } from '../botao/botao';
import { FormularioPedido } from '../formulario-pedido/formulario-pedido';
import { ItemCarrinhoLinha } from '../item-carrinho/item-carrinho';
import { RevisaoPedido } from '../revisao-pedido/revisao-pedido';

type EtapaCarrinho = 'carrinho' | 'formulario' | 'revisao' | 'enviado';

const titulosPorEtapa: Record<EtapaCarrinho, string> = {
  carrinho: 'Seu carrinho',
  formulario: 'Seus dados',
  revisao: 'Revisar pedido',
  enviado: 'Quase lá!',
};

@Component({
  selector: 'app-carrinho',
  imports: [Botao, ItemCarrinhoLinha, FormularioPedido, RevisaoPedido],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  protected readonly carrinhoServico = inject(CarrinhoServico);
  private readonly dadosLojaServico = inject(DadosLojaServico);
  private readonly documento = inject(DOCUMENT);

  readonly fechar = output<void>();

  protected readonly painel = viewChild<ElementRef<HTMLElement>>('painel');
  protected readonly etapa = signal<EtapaCarrinho>('carrinho');
  protected readonly dadosCliente = signal<DadosCliente>(dadosClienteVazio);
  protected readonly titulo = computed(() => titulosPorEtapa[this.etapa()]);
  protected readonly mostrarRodape = computed(
    () => this.etapa() !== 'carrinho' || this.carrinhoServico.carrinho().itens.length > 0,
  );
  protected readonly formatarMoeda = formatarMoeda;
  protected readonly mensagemEnviada = signal('');

  /** Quais canais a loja aceita — configurável pelo admin (config da loja). */
  protected readonly aceitaInstagram = computed(() => this.dadosLojaServico.configuracaoLoja().aceitaInstagram);
  protected readonly aceitaWhatsapp = computed(() => this.dadosLojaServico.configuracaoLoja().aceitaWhatsapp);
  protected readonly nenhumCanalConfigurado = computed(
    () => !this.aceitaInstagram() && !this.aceitaWhatsapp(),
  );
  protected readonly textoConfirmar = computed(() => {
    if (this.aceitaInstagram() && this.aceitaWhatsapp()) return 'Confirmar pedido';
    if (this.aceitaInstagram()) return 'Confirmar e enviar via Instagram';
    if (this.aceitaWhatsapp()) return 'Confirmar e enviar via WhatsApp';
    return 'Confirmar pedido';
  });

  private readonly fechamento = criarFechamentoAnimado(() => this.fechar.emit());
  protected readonly fechando = this.fechamento.fechando;

  constructor() {
    afterNextRender(() => this.painel()?.nativeElement.focus());

    const estiloOriginal = this.documento.body.style.overflow;
    this.documento.body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => {
      this.documento.body.style.overflow = estiloOriginal;
    });
  }

  protected iniciarFechamento(): void {
    this.fechamento.iniciarFechamento();
  }

  protected aoReceberDadosCliente(dados: DadosCliente): void {
    this.dadosCliente.set(dados);
    this.etapa.set('revisao');
  }

  /**
   * A etapa "enviado" deixa o texto do pedido visível e mostra um botão por
   * canal habilitado na config da loja (Instagram e/ou WhatsApp).
   */
  protected async aoConfirmarPedido(): Promise<void> {
    const mensagem = montarMensagemPedido(
      this.dadosLojaServico.configuracaoLoja(),
      this.dadosCliente(),
      this.carrinhoServico.carrinho(),
    );
    this.mensagemEnviada.set(mensagem);

    this.carrinhoServico.limparCarrinho();
    this.etapa.set('enviado');
  }

  /**
   * Diferente do WhatsApp, o Instagram não aceita pré-preencher o texto da
   * mensagem — por isso o pedido é copiado pra área de transferência e o
   * cliente cola manualmente na conversa.
   */
  protected async enviarViaInstagram(): Promise<void> {
    const mensagem = this.mensagemEnviada();

    this.carrinhoServico.adicionarAviso({
      produtoId: '',
      mensagem: 'Atenção! Vamos copiar sua mensagem de pedido. Por favor, aguarde abrir o Instagram e cole a mensagem (Ctrl+V) na conversa com a gente. Isso garante que seu pedido chegue corretamente!'
    });

    await this.copiarParaAreaDeTransferencia(mensagem);

    window.open(montarLinkInstagram(this.dadosLojaServico.configuracaoLoja()), '_blank', 'noopener,noreferrer');
  }

  /** O wa.me já abre a conversa com o texto pronto — sem precisar copiar/colar. */
  protected enviarViaWhatsapp(): void {
    const link = montarLinkWhatsApp(this.dadosLojaServico.configuracaoLoja(), this.mensagemEnviada());
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  private async copiarParaAreaDeTransferencia(texto: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Área de transferência indisponível/negada — a mensagem completa
      // continua visível na tela pra o cliente selecionar e copiar manualmente.
    }
  }

  protected aoClicarFundo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.iniciarFechamento();
    }
  }
}
