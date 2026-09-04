import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ConfiguracaoLojaApi, ConfiguracaoLojaPayload } from '../tipos/admin';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoLojaAdminServico {
  private readonly http = inject(HttpClient);

  atualizar(payload: ConfiguracaoLojaPayload): Promise<ConfiguracaoLojaApi> {
    return firstValueFrom(
      this.http.patch<ConfiguracaoLojaApi>(`${environment.apiUrl}/configuracao-loja`, payload),
    );
  }
}
