import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { AuthServico } from '../servicos/auth-servico';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthServico).estaAutenticado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/admin/login']);
};
