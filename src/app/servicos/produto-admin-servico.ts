import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ProdutoBuscaApi, ProdutoCompletoApi, ProdutoPayload } from '../tipos/admin';

/** CRUD de produtos para o admin — fala direto com os DTOs da API (ids numéricos). */
@Injectable({ providedIn: 'root' })
export class ProdutoAdminServico {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/produtos`;

  listar(): Promise<ProdutoBuscaApi[]> {
    return firstValueFrom(this.http.get<ProdutoBuscaApi[]>(this.base));
  }

  buscarPorId(id: number): Promise<ProdutoCompletoApi> {
    return firstValueFrom(this.http.get<ProdutoCompletoApi>(`${this.base}/${id}`));
  }

  criar(payload: ProdutoPayload): Promise<ProdutoCompletoApi> {
    return firstValueFrom(this.http.post<ProdutoCompletoApi>(this.base, payload));
  }

  atualizar(id: number, payload: ProdutoPayload): Promise<ProdutoCompletoApi> {
    return firstValueFrom(this.http.patch<ProdutoCompletoApi>(`${this.base}/${id}`, payload));
  }

  excluir(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }
}
