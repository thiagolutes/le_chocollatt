import type { Categoria, Produto } from "../tipos/produto";

/**
 * Catálogo oficial de produtos. Fonte central e única de verdade para preços —
 * o carrinho nunca confia em valores vindos do localStorage, sempre relê daqui.
 *
 * Para adicionar um produto novo: inclua um objeto no array `produtos`.
 * Para trocar uma foto: substitua o arquivo em `public/produtos/` mantendo o
 * mesmo nome, ou atualize o campo `imagem`. Enquanto a foto real não existir,
 * a interface mostra automaticamente um ícone ilustrativo da categoria.
 */
export const produtos: Produto[] = [
  {
    id: "brigadeiro",
    nome: "Brigadeiro",
    slug: "brigadeiro",
    descricao: "Brigadeiro artesanal, enrolado à mão, feito com ingredientes selecionados.",
    categoria: "brigadeiros",
    preco: 4,
    imagem: "/produtos/brigadeiro/brigadeiro-marca-meio-tm.png",
    // Fotos gerais do brigadeiro — aparecem na galeria independente do sabor escolhido.
    // Mockadas em SVG só para dar pra testar a galeria; troque pelos arquivos reais depois.
    imagens: ["/produtos/brigadeiro/brigadeiro-marca-meio-tm.png", "/produtos/brigadeiro/brigadeiro.svg", "/produtos/brigadeiro/brigadeiro-detalhe.svg"],
    ativo: true,
    disponivel: true,
    destaque: true,
    ordem: 1,
    unidade: "unidade",
    variacoes: [
      { id: "ao-leite", nome: "Ao Leite", preco: 4, imagens: ["/produtos/brigadeiro/brigadeiro-ao-leite.svg"] },
      { id: "meio-amargo", nome: "Meio Amargo", preco: 4, imagens: ["/produtos/brigadeiro/brigadeiro-marca-meio-tm.png"] },
      { id: "ninho", nome: "Ninho", preco: 4, imagens: ["/produtos/brigadeiro/brigadeiro-ninho.svg"] },
    ],
  },
  {
    id: "coxinha-morango",
    nome: "Coxinha de Morango",
    slug: "coxinha-de-morango",
    descricao: "Docinho em formato de coxinha com morango e cobertura de chocolate.",
    categoria: "coxinhas",
    preco: 8,
    imagem: "/produtos/cox-morango/coxMorango-marca-meio-tm.jpeg",
    ativo: true,
    disponivel: true,
    ordem: 2,
    unidade: "unidade",
    variacoes: [
      { id: "ao-leite", nome: "Ao Leite", preco: 8 },
      { id: "meio-amargo", nome: "Meio Amargo", preco: 8 },
      { id: "ninho", nome: "Ninho", preco: 8 },
    ],
  },
  {
    id: "cookie",
    nome: "Cookie",
    slug: "cookie",
    descricao: "Cookie artesanal, crocante por fora e macio por dentro.",
    categoria: "cookies",
    preco: 7,
    imagem: "/produtos/cookies/cookie-trad-tm.jpeg",
    ativo: true,
    disponivel: true,
    ordem: 3,
    unidade: "unidade",
    variacoes: [
      { id: "tradicional", nome: "Tradicional", preco: 7, imagens: ["/produtos/cookies/cookie-trad-tm.jpeg"] },
      { id: "chocolate", nome: "Chocolate", preco: 7 },
    ],
  },
  {
    id: "palha-italiana",
    nome: "Palha Italiana",
    slug: "palha-italiana",
    descricao: "Clássica palha italiana, cremosa e coberta com chocolate granulado.",
    categoria: "palha-italiana",
    preco: 8,
    imagem: "/produtos/palha-italiana.jpg",
    ativo: true,
    disponivel: true,
    ordem: 4,
    unidade: "unidade",
  },
  {
    id: "brownie-tradicional",
    nome: "Brownie Tradicional",
    slug: "brownie-tradicional",
    descricao: "Brownie de chocolate com textura densa e úmida.",
    categoria: "brownies",
    preco: 8,
    imagem: "/produtos/brownie.jpg",
    ativo: true,
    disponivel: true,
    ordem: 5,
    unidade: "unidade",
    variacoes: [
      { id: "com-nozes", nome: "Com Nozes", preco: 8 },
      { id: "sem-nozes", nome: "Sem Nozes", preco: 8 },
    ],
  },
  {
    id: "copinho-ninho-meio-amargo",
    nome: "Copinho de Ninho e Meio Amargo",
    slug: "copinho-ninho-meio-amargo",
    descricao: "Camadas de creme de ninho e chocolate meio amargo em copinho individual.",
    categoria: "copinhos",
    preco: 12,
    imagem: "/produtos/copinho-ninho-meio-amargo.jpg",
    ativo: true,
    disponivel: true,
    ordem: 6,
    unidade: "copo",
  },
  {
    id: "copinho-ao-leite-meio-amargo",
    nome: "Copinho de Ao Leite e Meio Amargo",
    slug: "copinho-ao-leite-meio-amargo",
    descricao: "Camadas de chocolate ao leite e meio amargo em copinho individual.",
    categoria: "copinhos",
    preco: 12,
    imagem: "/produtos/copinho-ao-leite-meio-amargo.jpg",
    ativo: true,
    disponivel: true,
    ordem: 7,
    unidade: "copo",
  },
  {
    id: "copinho-ninho-ao-leite",
    nome: "Copinho de Ninho e Ao Leite",
    slug: "copinho-ninho-ao-leite",
    descricao: "Camadas de creme de ninho e chocolate ao leite em copinho individual.",
    categoria: "copinhos",
    preco: 12,
    imagem: "/produtos/copinho-ninho-ao-leite.jpg",
    ativo: true,
    disponivel: true,
    ordem: 8,
    unidade: "copo",
  },
  {
    id: "copinho-morango-meio-amargo-ninho",
    nome: "Copinho de Morango, Meio Amargo e Ninho",
    slug: "copinho-morango-meio-amargo-ninho",
    descricao: "Morango com camadas de chocolate meio amargo e creme de ninho.",
    categoria: "copinhos",
    preco: 16,
    imagem: "/produtos/copinho-morango-meio-amargo-ninho.jpg",
    ativo: true,
    disponivel: true,
    destaque: true,
    ordem: 9,
    unidade: "copo",
  },
  {
    id: "copinho-morango-meio-amargo-ao-leite",
    nome: "Copinho de Morango, Meio Amargo e Ao Leite",
    slug: "copinho-morango-meio-amargo-ao-leite",
    descricao: "Morango com camadas de chocolate meio amargo e ao leite.",
    categoria: "copinhos",
    preco: 16,
    imagem: "/produtos/copinho-morango-meio-amargo-ao-leite.jpg",
    ativo: true,
    disponivel: true,
    ordem: 10,
    unidade: "copo",
  },
  {
    id: "copinho-morango-ninho-ao-leite",
    nome: "Copinho de Morango, Ninho e Ao Leite",
    slug: "copinho-morango-ninho-ao-leite",
    descricao: "Morango com camadas de creme de ninho e chocolate ao leite.",
    categoria: "copinhos",
    preco: 16,
    imagem: "/produtos/copinho-morango-ninho-ao-leite.jpg",
    ativo: true,
    disponivel: true,
    ordem: 11,
    unidade: "copo",
  },
  {
    id: "copinho-brownie-meio-amargo-ninho",
    nome: "Copinho de Brownie, Meio Amargo e Ninho",
    slug: "copinho-brownie-meio-amargo-ninho",
    descricao: "Pedaços de brownie com camadas de chocolate meio amargo e creme de ninho.",
    categoria: "copinhos",
    preco: 16,
    imagem: "/produtos/copinho-brownie-meio-amargo-ninho.jpg",
    ativo: true,
    disponivel: true,
    ordem: 12,
    unidade: "copo",
  },
  {
    id: "morango-cravejado",
    nome: "Morango cravejado",
    slug: "morango-cravejado",
    descricao: "Morango envolvido em brigadeiro de ninho com uma casquinha de chocolate branco com pedacinho dê açúcar.",
    categoria: "outros",
    preco: 10,
    imagem: "/produtos/copinho-brownie-meio-amargo-ninho.jpg",
    ativo: true,
    disponivel: true,
    ordem: 13,
    unidade: "copo",
  },
];

const ordemCategorias = [
  "brigadeiros",
  "coxinhas",
  "cookies",
  "palha-italiana",
  "brownies",
  "copinhos",
  "combos",
  "outros",
];

const nomesCategorias: Record<string, string> = {
  brigadeiros: "Brigadeiros",
  coxinhas: "Coxinhas",
  cookies: "Cookies",
  "palha-italiana": "Palha Italiana",
  brownies: "Brownies",
  copinhos: "Copinhos",
  combos: "Combos",
  outros: "Outros",
};

/**
 * Produtos visíveis no catálogo. Para tirar um produto de circulação sem
 * apagar seus dados (sazonal, em pausa etc.), troque apenas `ativo: false`
 * em `produtos.ts` — ele some da vitrine mas continua no código.
 */
export const produtosAtivos: Produto[] = produtos.filter((produto) => produto.ativo);

/**
 * Categorias derivadas dos produtos ativos — uma categoria só aparece na
 * navegação quando existe pelo menos um produto ativo nela, evitando abas vazias.
 */
export const categorias: Categoria[] = Array.from(
  new Set(produtosAtivos.map((produto) => produto.categoria)),
)
  .sort((a, b) => ordemCategorias.indexOf(a) - ordemCategorias.indexOf(b))
  .map((id) => ({ id, nome: nomesCategorias[id] ?? id }));

export function buscarProdutoPorId(produtoId: string): Produto | undefined {
  return produtosAtivos.find((produto) => produto.id === produtoId);
}
