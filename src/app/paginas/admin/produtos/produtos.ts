import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Botao } from '../../../componentes/botao/botao';
import { CampoFormulario } from '../../../componentes/campo-formulario/campo-formulario';
import { AuthServico } from '../../../servicos/auth-servico';
import { CategoriaAdminServico } from '../../../servicos/categoria-admin-servico';
import { DadosLojaServico } from '../../../servicos/dados-loja-servico';
import { ProdutoAdminServico } from '../../../servicos/produto-admin-servico';
import type { CategoriaApi, ProdutoBuscaApi, ProdutoPayload, VariacaoProdutoApi } from '../../../tipos/admin';

function criarLinhaVariacao(fb: FormBuilder, variacao?: VariacaoProdutoApi) {
  return fb.nonNullable.group({
    id: fb.control<number | null>(variacao?.id ?? null),
    nome: [variacao?.nome ?? '', Validators.required],
    preco: [variacao?.preco ?? 0, [Validators.required, Validators.min(0)]],
    imagens: [(variacao?.imagens ?? []).join('\n')],
  });
}

function linhasParaLista(texto: string): string[] | undefined {
  const linhas = texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean);
  return linhas.length > 0 ? linhas : undefined;
}

@Component({
  selector: 'app-admin-produtos',
  imports: [ReactiveFormsModule, CampoFormulario, Botao, RouterLink],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class AdminProdutos {
  private readonly fb = inject(FormBuilder);
  private readonly produtoAdminServico = inject(ProdutoAdminServico);
  private readonly categoriaAdminServico = inject(CategoriaAdminServico);
  private readonly dadosLojaServico = inject(DadosLojaServico);
  protected readonly authServico = inject(AuthServico);
  private readonly router = inject(Router);

  protected readonly produtos = signal<ProdutoBuscaApi[]>([]);
  protected readonly categorias = signal<CategoriaApi[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | undefined>(undefined);
  protected readonly formularioAberto = signal(false);
  protected readonly idEmEdicao = signal<number | undefined>(undefined);

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    slug: [''],
    descricao: [''],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
    preco: [0, [Validators.required, Validators.min(0)]],
    imagemCapa: [''],
    imagens: [''],
    ativo: [true],
    disponivel: [true],
    destaque: [false],
    ordem: [0],
    observacao: [''],
    unidade: [''],
    tempoPreparo: [''],
    variacoes: this.fb.array<ReturnType<typeof criarLinhaVariacao>>([]),
  });

  constructor() {
    this.carregar();
  }

  protected get variacoes() {
    return this.formulario.controls.variacoes;
  }

  protected adicionarVariacao(): void {
    this.variacoes.push(criarLinhaVariacao(this.fb));
  }

  protected removerVariacao(indice: number): void {
    this.variacoes.removeAt(indice);
  }

  private async carregar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(undefined);
    try {
      const [produtos, categorias] = await Promise.all([
        this.produtoAdminServico.listar(),
        this.categoriaAdminServico.listar(),
      ]);
      this.produtos.set(produtos);
      this.categorias.set(categorias);
    } catch {
      this.erro.set('Não foi possível carregar os produtos.');
    } finally {
      this.carregando.set(false);
    }
  }

  protected nomeCategoria(categoriaId: number): string {
    return this.categorias().find((categoria) => categoria.id === categoriaId)?.nome ?? '—';
  }

  protected abrirNovoProduto(): void {
    this.idEmEdicao.set(undefined);
    this.formulario.reset({
      nome: '',
      slug: '',
      descricao: '',
      categoriaId: this.categorias()[0]?.id ?? 0,
      preco: 0,
      imagemCapa: '',
      imagens: '',
      ativo: true,
      disponivel: true,
      destaque: false,
      ordem: 0,
      observacao: '',
      unidade: '',
      tempoPreparo: '',
    });
    this.variacoes.clear();
    this.formularioAberto.set(true);
  }

  protected async abrirEdicaoProduto(id: number): Promise<void> {
    this.erro.set(undefined);
    try {
      const produto = await this.produtoAdminServico.buscarPorId(id);
      this.idEmEdicao.set(id);
      this.formulario.reset({
        nome: produto.nome,
        slug: produto.slug,
        descricao: produto.descricao ?? '',
        categoriaId: produto.categoriaId,
        preco: produto.preco,
        imagemCapa: produto.imagemCapa ?? '',
        imagens: (produto.imagens ?? []).join('\n'),
        ativo: produto.ativo,
        disponivel: produto.disponivel,
        destaque: produto.destaque,
        ordem: produto.ordem,
        observacao: produto.observacao ?? '',
        unidade: produto.unidade ?? '',
        tempoPreparo: produto.tempoPreparo ?? '',
      });
      this.variacoes.clear();
      for (const variacao of produto.variacoes ?? []) {
        this.variacoes.push(criarLinhaVariacao(this.fb, variacao));
      }
      this.formularioAberto.set(true);
    } catch {
      this.erro.set('Não foi possível carregar este produto.');
    }
  }

  protected fecharFormulario(): void {
    this.formularioAberto.set(false);
  }

  protected async salvar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const payload: ProdutoPayload = {
      nome: valores.nome,
      slug: valores.slug || undefined,
      descricao: valores.descricao || undefined,
      categoriaId: valores.categoriaId,
      preco: valores.preco,
      imagemCapa: valores.imagemCapa || undefined,
      imagens: linhasParaLista(valores.imagens),
      ativo: valores.ativo,
      disponivel: valores.disponivel,
      destaque: valores.destaque,
      ordem: valores.ordem,
      observacao: valores.observacao || undefined,
      unidade: valores.unidade || undefined,
      tempoPreparo: valores.tempoPreparo || undefined,
      variacoes: valores.variacoes.map((variacao) => ({
        id: variacao.id ?? undefined,
        nome: variacao.nome,
        preco: variacao.preco,
        imagens: linhasParaLista(variacao.imagens),
      })) as VariacaoProdutoApi[],
    };

    this.salvando.set(true);
    this.erro.set(undefined);
    try {
      const id = this.idEmEdicao();
      if (id) {
        await this.produtoAdminServico.atualizar(id, payload);
      } else {
        await this.produtoAdminServico.criar(payload);
      }
      await this.carregar();
      await this.dadosLojaServico.recarregar();
      this.formularioAberto.set(false);
    } catch {
      this.erro.set('Não foi possível salvar o produto. Confira os dados e tente novamente.');
    } finally {
      this.salvando.set(false);
    }
  }

  protected async excluir(produto: ProdutoBuscaApi): Promise<void> {
    if (!confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) {
      return;
    }

    this.erro.set(undefined);
    try {
      await this.produtoAdminServico.excluir(produto.id);
      await this.carregar();
      await this.dadosLojaServico.recarregar();
    } catch {
      this.erro.set('Não foi possível excluir este produto (verifique se não há dependências).');
    }
  }

  protected async sair(): Promise<void> {
    await this.authServico.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
