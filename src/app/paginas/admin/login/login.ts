import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Botao } from '../../../componentes/botao/botao';
import { CampoFormulario } from '../../../componentes/campo-formulario/campo-formulario';
import { Marca } from '../../../componentes/marca/marca';
import { AuthServico } from '../../../servicos/auth-servico';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, CampoFormulario, Botao, Marca],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  private readonly fb = inject(FormBuilder);
  private readonly authServico = inject(AuthServico);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | undefined>(undefined);

  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  protected async aoSubmeter(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.erro.set(undefined);
    this.enviando.set(true);
    try {
      await this.authServico.login(this.formulario.getRawValue());
      await this.router.navigateByUrl('/admin/produtos');
    } catch {
      this.erro.set('Email ou senha inválidos.');
    } finally {
      this.enviando.set(false);
    }
  }
}
