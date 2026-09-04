import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { CategoriaApi, CategoriaPayload } from '../tipos/admin';

@Injectable({ providedIn: 'root' })
export class CategoriaAdminServico {
  private readonly http = inject(HttpClient);

  /** Listagem é a mesma do endpoint público — categorias não têm dado sensível/admin-only. */
  listar(): Promise<CategoriaApi[]> {
    return firstValueFrom(this.http.get<CategoriaApi[]>(`${environment.apiUrl}/public/categorias`));
  }

  criar(payload: CategoriaPayload): Promise<CategoriaApi> {
    return firstValueFrom(this.http.post<CategoriaApi>(`${environment.apiUrl}/categorias`, payload));
  }

  atualizar(id: number, payload: CategoriaPayload): Promise<CategoriaApi> {
    return firstValueFrom(this.http.patch<CategoriaApi>(`${environment.apiUrl}/categorias/${id}`, payload));
  }

  excluir(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/categorias/${id}`));
  }
}
