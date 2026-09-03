import type { Routes } from '@angular/router';
import { PaginaInicial } from './paginas/pagina-inicial/pagina-inicial';
import { PaginaNaoEncontrada } from './paginas/pagina-nao-encontrada/pagina-nao-encontrada';

export const rotas: Routes = [
  { path: '', component: PaginaInicial },
  { path: '**', component: PaginaNaoEncontrada },
];
