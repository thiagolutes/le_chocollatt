# le_chocollatt

Site da loja Le Chocollatt (Angular 21, standalone components, signals): vitrine pública de
produtos + área administrativa (login, CRUD de produtos, configurações da loja).

Os dados (produtos, categorias, configurações) vêm da API [`le-chocollatt-api`](../le-chocollatt-api)
— este projeto não tem mais catálogo hardcoded.

## Rodando localmente

Pré-requisito: a API (`le-chocollatt-api`) rodando em `http://localhost:8080` (ver o README dela).

```bash
npm install
npm start
```

Abre em `http://localhost:4200`.

- Vitrine pública: `/`
- Login do admin: `/admin/login`
- Admin de produtos: `/admin/produtos`
- Configurações da loja: `/admin/configuracoes`

## Build de produção

```bash
npm run build
```

Antes de buildar para produção, edite `src/environments/environment.prod.ts` com a URL pública
real da API.

## Estrutura

```
src/app/
  componentes/      componentes de UI reutilizáveis (vitrine)
  paginas/           páginas roteadas (pagina-inicial, admin/*)
  paginas/admin/     login, produtos (CRUD), configuracoes
  servicos/          lógica de carrinho, chamadas HTTP à API, auth
  interceptors/      injeta o JWT nas chamadas autenticadas
  guards/            protege as rotas /admin/**
  tipos/             modelos usados pela vitrine (produto, pedido, loja, auth, admin)
```

## Testes

```bash
npm test
```
