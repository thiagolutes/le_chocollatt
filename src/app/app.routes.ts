import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { AdminConfiguracoes } from './paginas/admin/configuracoes/configuracoes';
import { AdminLogin } from './paginas/admin/login/login';
import { AdminProdutos } from './paginas/admin/produtos/produtos';
import { PaginaInicial } from './paginas/pagina-inicial/pagina-inicial';
import { PaginaNaoEncontrada } from './paginas/pagina-nao-encontrada/pagina-nao-encontrada';

export const rotas: Routes = [
  { path: '', component: PaginaInicial },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/produtos', component: AdminProdutos, canActivate: [authGuard] },
  { path: 'admin/configuracoes', component: AdminConfiguracoes, canActivate: [authGuard] },
  { path: '**', component: PaginaNaoEncontrada },
];
