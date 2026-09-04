/** Espelha `ConfiguracaoLojaCompletoDTO` da API, com nomes já adaptados ao que os
 * componentes do site esperam (ver `configuracoesLoja` — este tipo substitui aquele mock). */
export interface ConfiguracaoLoja {
  nome: string;
  subtitulo: string;
  frase: string;
  fraseCmpl: string;
  cidade: string;
  estado: string;
  instagram: string;
  telefoneWhatsApp: string;
  diasMinimosEncomenda: number;
  formasPagamento: string[];
  /** Loja aceita receber pedido via Instagram Direct. */
  aceitaInstagram: boolean;
  /** Loja aceita receber pedido via WhatsApp. */
  aceitaWhatsapp: boolean;
}

/** Valor inicial usado enquanto a config real ainda não chegou da API (não deveria durar,
 * já que `provideAppInitializer` espera o carregamento terminar antes do app renderizar). */
export const configuracaoLojaVazia: ConfiguracaoLoja = {
  nome: '',
  subtitulo: '',
  frase: '',
  fraseCmpl: '',
  cidade: '',
  estado: '',
  instagram: '',
  telefoneWhatsApp: '',
  diasMinimosEncomenda: 0,
  formasPagamento: [],
  aceitaInstagram: false,
  aceitaWhatsapp: false,
};
