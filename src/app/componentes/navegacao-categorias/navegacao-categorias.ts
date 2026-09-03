import { Component, input, model } from '@angular/core';
import type { Categoria } from '../../tipos/produto';

@Component({
  selector: 'app-navegacao-categorias',
  imports: [],
  templateUrl: './navegacao-categorias.html',
  styleUrl: './navegacao-categorias.css',
})
export class NavegacaoCategorias {
  readonly categorias = input.required<Categoria[]>();
  /** String vazia representa a opção "Todos". */
  readonly categoriaSelecionada = model('');
}
