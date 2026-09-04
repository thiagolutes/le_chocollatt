import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Botao } from '../../../componentes/botao/botao';
import { CampoFormulario } from '../../../componentes/campo-formulario/campo-formulario';
import { AuthServico } from '../../../servicos/auth-servico';
import { ConfiguracaoLojaAdminServico } from '../../../servicos/configuracao-loja-admin-servico';
import { DadosLojaServico } from '../../../servicos/dados-loja-servico';
import type { ConfiguracaoLojaPayload } from '../../../tipos/admin';

@Component({
  selector: 'app-admin-configuracoes',
  imports: [ReactiveFormsModule, CampoFormulario, Botao, RouterLink],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class AdminConfiguracoes {
  private readonly fb = inject(FormBuilder);
  private readonly configuracaoLojaAdminServico = inject(ConfiguracaoLojaAdminServico);
  private readonly dadosLojaServico = inject(DadosLojaServico);
  protected readonly authServico = inject(AuthServico);
  private readonly router = inject(Router);

  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | undefined>(undefined);
  protected readonly sucesso = signal(false);

  private readonly configAtual = this.dadosLojaServico.configuracaoLoja();

  protected readonly formulario = this.fb.nonNullable.group({
    nome: [this.configAtual.nome, Validators.required],
    subtitulo: [this.configAtual.subtitulo],
    frase: [this.configAtual.frase],
    fraseComplementar: [this.configAtual.fraseCmpl],
    cidade: [this.configAtual.cidade],
    estado: [this.configAtual.estado],
    instagramHandle: [this.configAtual.instagram],
    telefoneWhatsapp: [this.configAtual.telefoneWhatsApp],
    diasMinimosEncomenda: [this.configAtual.diasMinimosEncomenda, [Validators.required, Validators.min(0)]],
    formasPagamento: [this.configAtual.formasPagamento.join('\n')],
    aceitaInstagram: [this.configAtual.aceitaInstagram],
    aceitaWhatsapp: [this.configAtual.aceitaWhatsapp],
  });

  protected async salvar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const payload: ConfiguracaoLojaPayload = {
      nome: valores.nome,
      subtitulo: valores.subtitulo || undefined,
      frase: valores.frase || undefined,
      fraseComplementar: valores.fraseComplementar || undefined,
      cidade: valores.cidade || undefined,
      estado: valores.estado || undefined,
      instagramHandle: valores.instagramHandle || undefined,
      telefoneWhatsapp: valores.telefoneWhatsapp || undefined,
      diasMinimosEncomenda: valores.diasMinimosEncomenda,
      formasPagamento: valores.formasPagamento
        .split('\n')
        .map((linha) => linha.trim())
        .filter(Boolean),
      aceitaInstagram: valores.aceitaInstagram,
      aceitaWhatsapp: valores.aceitaWhatsapp,
    };

    this.salvando.set(true);
    this.erro.set(undefined);
    this.sucesso.set(false);
    try {
      await this.configuracaoLojaAdminServico.atualizar(payload);
      await this.dadosLojaServico.recarregar();
      this.sucesso.set(true);
    } catch {
      this.erro.set('Não foi possível salvar as configurações.');
    } finally {
      this.salvando.set(false);
    }
  }

  protected async sair(): Promise<void> {
    await this.authServico.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
