/**
 * Configurações centrais da loja. Alterar aqui reflete em todo o site
 * (cabeçalho, rodapé e a mensagem de pedido enviada via Instagram/WhatsApp).
 */
export const configuracoesLoja = {
  nome: "Le Chocolat",
  subtitulo: "Doces Artesanais",
  frase: "Feitos com amor, para momentos especiais.",
  fraseCmpl: "Cada detalhe é feito com carinho para adoçar seu dia",
  cidade: "Belo Horizonte",
  estado: "MG",
  instagram: "@le_chocollatt",
  /**
   * Número no formato internacional, apenas dígitos (DDI + DDD + número).
   * Substitua pelo número real da loja antes de publicar o site.
   */
  telefoneWhatsApp: "5500000000000",
  diasMinimosEncomenda: 2,
  formasPagamento: ["Cartão", "Pix", "Dinheiro"],
} as const;
