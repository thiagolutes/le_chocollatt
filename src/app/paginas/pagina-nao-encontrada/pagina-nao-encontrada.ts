import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Marca } from '../../componentes/marca/marca';

const ATRASO_REDIRECIONAMENTO_MS = 6000;

/**
 * Página exibida para qualquer rota desconhecida. Como o site é um catálogo
 * de página única, não existem outras rotas de verdade: depois de um tempo,
 * o cliente é levado de volta ao início automaticamente.
 */
@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [RouterLink, Marca],
  templateUrl: './pagina-nao-encontrada.html',
  styleUrl: './pagina-nao-encontrada.css',
})
export class PaginaNaoEncontrada {
  private readonly router = inject(Router);

  constructor() {
    const temporizador = setTimeout(() => {
      this.router.navigateByUrl('/');
    }, ATRASO_REDIRECIONAMENTO_MS);

    inject(DestroyRef).onDestroy(() => clearTimeout(temporizador));
  }
}
