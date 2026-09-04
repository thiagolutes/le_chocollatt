import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { rotas } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';
import { DadosLojaServico } from './servicos/dados-loja-servico';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(rotas),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Carrega produtos/categorias/config da loja antes do app renderizar, pra vitrine
    // e telas de admin lerem os signals de DadosLojaServico já populados, sem tela de loading.
    provideAppInitializer(() => inject(DadosLojaServico).carregar()),
  ],
};
