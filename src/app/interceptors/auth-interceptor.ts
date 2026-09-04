import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthServico } from '../servicos/auth-servico';

/** Anexa o JWT nas chamadas à própria API — nunca em requisições para outros domínios. */
export const authInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const token = inject(AuthServico).obterToken();

  if (!token || !requisicao.url.startsWith(environment.apiUrl)) {
    return proximo(requisicao);
  }

  return proximo(requisicao.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
