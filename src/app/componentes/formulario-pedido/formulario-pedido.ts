import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { dadosClienteVazio } from '../../tipos/pedido';
import type { DadosCliente } from '../../tipos/pedido';
import { obterDataDeHojeIso } from '../../utilitarios/formatacaoData';
import { validarDadosCliente } from '../../utilitarios/validacaoFormulario';
import { CampoFormulario } from '../campo-formulario/campo-formulario';

/**
 * Validador único que reaproveita `validarDadosCliente` (mesma função usada
 * fora do Angular) e aplica cada mensagem no controle correspondente, para
 * que o erro apareça junto ao campo certo.
 */
function validadorPedido(grupo: AbstractControl): ValidationErrors | null {
  const dados = grupo.getRawValue() as DadosCliente;
  const erros = validarDadosCliente(dados);

  (Object.keys(dados) as (keyof DadosCliente)[]).forEach((chave) => {
    const mensagem = erros[chave];
    grupo.get(chave)?.setErrors(mensagem ? { negocio: mensagem } : null);
  });

  return Object.keys(erros).length > 0 ? { negocio: true } : null;
}

@Component({
  selector: 'app-formulario-pedido',
  imports: [ReactiveFormsModule, CampoFormulario],
  templateUrl: './formulario-pedido.html',
  styleUrl: './formulario-pedido.css',
})
export class FormularioPedido {
  private readonly fb = inject(FormBuilder);

  readonly valorInicial = input<DadosCliente>(dadosClienteVazio);
  readonly enviar = output<DadosCliente>();

  protected readonly idFormulario = 'formulario-pedido';
  protected readonly dataMinima = obterDataDeHojeIso();
  protected readonly tentouEnviar = signal(false);

  protected readonly formulario = this.fb.nonNullable.group(
    {
      nome: this.valorInicial().nome,
      modalidade: this.valorInicial().modalidade,
      endereco: this.valorInicial().endereco,
      dataDesejada: this.valorInicial().dataDesejada,
      observacoes: this.valorInicial().observacoes,
    },
    { validators: validadorPedido },
  );

  protected erroDoCampo(nome: keyof DadosCliente): string | undefined {
    const controle = this.formulario.get(nome);
    if (!controle || (!controle.touched && !this.tentouEnviar())) return undefined;
    return controle.errors?.['negocio'];
  }

  protected aoSubmeter(): void {
    this.tentouEnviar.set(true);
    this.formulario.updateValueAndValidity();

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviar.emit(this.formulario.getRawValue());
  }
}
