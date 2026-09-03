import { Component, input } from '@angular/core';

@Component({
  selector: 'app-botao',
  imports: [],
  templateUrl: './botao.html',
  styleUrl: './botao.css',
})
export class Botao {
  readonly variante = input<'primario' | 'secundario' | 'texto'>('primario');
  readonly larguraTotal = input(false);
  readonly tipo = input<'button' | 'submit'>('button');
  readonly desabilitado = input(false);
  /** Permite associar a um &lt;form&gt; fora deste componente (atributo HTML `form`). */
  readonly formulario = input<string | undefined>(undefined);
}
