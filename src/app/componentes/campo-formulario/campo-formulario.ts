import { Component, input } from '@angular/core';

/**
 * Envolve um input/select/textarea (projetado via ng-content) com rótulo,
 * dica e mensagem de erro. O componente pai é responsável por ligar o
 * `id`/`formControlName` do campo real ao mesmo `idCampo` passado aqui.
 */
@Component({
  selector: 'app-campo-formulario',
  imports: [],
  templateUrl: './campo-formulario.html',
  styleUrl: './campo-formulario.css',
})
export class CampoFormulario {
  readonly idCampo = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly obrigatorio = input(false);
  readonly erro = input<string | undefined>(undefined);
  readonly dica = input<string | undefined>(undefined);
}
