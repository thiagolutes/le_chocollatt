import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { LoginPayload, UsuarioLogado } from '../tipos/auth';

const CHAVE_ARMAZENAMENTO = 'leChocolat.admin.usuario';

/** Login do admin: guarda o JWT (emitido pela API) em localStorage, igual ao carrinho já faz. */
@Injectable({ providedIn: 'root' })
export class AuthServico {
  private readonly http = inject(HttpClient);

  private readonly usuario = signal<UsuarioLogado | undefined>(lerUsuarioArmazenado());
  readonly estaAutenticado = computed(() => this.usuario() !== undefined);
  readonly nomeUsuario = computed(() => this.usuario()?.nome);

  obterToken(): string | undefined {
    return this.usuario()?.token;
  }

  async login(dados: LoginPayload): Promise<void> {
    const usuarioLogado = await firstValueFrom(
      this.http.post<UsuarioLogado>(`${environment.apiUrl}/public/auth/login`, dados),
    );
    this.usuario.set(usuarioLogado);
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(usuarioLogado));
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, {}));
    } finally {
      this.usuario.set(undefined);
      localStorage.removeItem(CHAVE_ARMAZENAMENTO);
    }
  }
}

function lerUsuarioArmazenado(): UsuarioLogado | undefined {
  try {
    const bruto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return bruto ? (JSON.parse(bruto) as UsuarioLogado) : undefined;
  } catch {
    return undefined;
  }
}
