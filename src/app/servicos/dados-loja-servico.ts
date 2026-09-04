import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Categoria, Produto } from '../tipos/produto';
import type { ConfiguracaoLoja } from '../tipos/loja';
import { configuracaoLojaVazia } from '../tipos/loja';
import type { CategoriaApi, ConfiguracaoLojaApi, ProdutoCompletoApi } from '../tipos/admin';

/**
 * Catálogo + config da loja vindos da API pública (`/api/public/**`), substituindo os
 * mocks estáticos que existiam em `dados/produtos.ts` e `dados/configuracoesLoja.ts`.
 * `carregar()` é chamado uma vez no bootstrap (ver `app.config.ts`, `provideAppInitializer`),
 * então os componentes leem os signals já populados, sem precisar de estado de "carregando".
 */
@Injectable({ providedIn: 'root' })
export class DadosLojaServico {
  private readonly http = inject(HttpClient);

  readonly produtos = signal<Produto[]>([]);
  /** Todas as categorias cadastradas (usado pelo admin, inclusive as sem produto ainda). */
  readonly categorias = signal<Categoria[]>([]);
  readonly configuracaoLoja = signal<ConfiguracaoLoja>(configuracaoLojaVazia);

  /** Só categorias com pelo menos 1 produto — o que a navegação pública deve mostrar (evita abas vazias). */
  readonly categoriasComProdutos = computed(() => {
    const idsComProduto = new Set(this.produtos().map((produto) => produto.categoria));
    return this.categorias().filter((categoria) => idsComProduto.has(categoria.id));
  });

  async carregar(): Promise<void> {
    try {
      const [produtosApi, categoriasApi, configuracaoApi] = await Promise.all([
        firstValueFrom(this.http.get<ProdutoCompletoApi[]>(`${environment.apiUrl}/public/produtos`)),
        firstValueFrom(this.http.get<CategoriaApi[]>(`${environment.apiUrl}/public/categorias`)),
        firstValueFrom(this.http.get<ConfiguracaoLojaApi>(`${environment.apiUrl}/public/configuracao-loja`)),
      ]);

      this.produtos.set(produtosApi.map(produtoApiParaProduto));
      this.categorias.set(categoriasApi.map(categoriaApiParaCategoria));
      this.configuracaoLoja.set(configuracaoApiParaConfiguracaoLoja(configuracaoApi));
    } catch (erro) {
      console.error('Falha ao carregar dados da loja pela API', erro);
    }
  }

  /** Chamado pelas páginas de admin após criar/editar/excluir, pra vitrine ficar em dia se o admin voltar pra home. */
  async recarregar(): Promise<void> {
    await this.carregar();
  }
}

export function produtoApiParaProduto(dto: ProdutoCompletoApi): Produto {
  return {
    id: String(dto.id),
    nome: dto.nome,
    slug: dto.slug,
    descricao: dto.descricao,
    categoria: String(dto.categoriaId),
    preco: dto.preco,
    imagem: dto.imagemCapa,
    imagens: dto.imagens ?? undefined,
    ativo: dto.ativo,
    disponivel: dto.disponivel,
    destaque: dto.destaque,
    ordem: dto.ordem,
    observacao: dto.observacao,
    unidade: dto.unidade,
    tempoPreparo: dto.tempoPreparo,
    variacoes: dto.variacoes?.map((variacao) => ({
      id: String(variacao.id),
      nome: variacao.nome,
      preco: variacao.preco,
      imagens: variacao.imagens ?? undefined,
    })),
  };
}

export function categoriaApiParaCategoria(dto: CategoriaApi): Categoria {
  return { id: String(dto.id), nome: dto.nome };
}

export function configuracaoApiParaConfiguracaoLoja(dto: ConfiguracaoLojaApi): ConfiguracaoLoja {
  return {
    nome: dto.nome,
    subtitulo: dto.subtitulo ?? '',
    frase: dto.frase ?? '',
    fraseCmpl: dto.fraseComplementar ?? '',
    cidade: dto.cidade ?? '',
    estado: dto.estado ?? '',
    instagram: dto.instagramHandle ?? '',
    telefoneWhatsApp: dto.telefoneWhatsapp ?? '',
    diasMinimosEncomenda: dto.diasMinimosEncomenda,
    formasPagamento: dto.formasPagamento ?? [],
    aceitaInstagram: dto.aceitaInstagram,
    aceitaWhatsapp: dto.aceitaWhatsapp,
  };
}
