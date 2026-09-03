import { Component, input } from '@angular/core';

/** Ícone ilustrativo de linha fina por categoria, usado quando não há foto real do produto. */
@Component({
  selector: 'app-icone-categoria',
  imports: [],
  templateUrl: './icone-categoria.html',
  styleUrl: './icone-categoria.css',
})
export class IconeCategoria {
  readonly categoria = input.required<string>();
}
