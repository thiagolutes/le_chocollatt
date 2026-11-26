# Le Chocollatt — Storefront & Admin

Website for **Le Chocollatt**, a small chocolate shop: a public storefront where customers build their
order, plus an admin area where the owner manages products, categories and store settings.

**Live:** https://lechocollatt.vercel.app
**API:** [`le-chocollatt-api`](https://github.com/thiagolutes/le-chocollatt-api) (Java 21 + Spring Boot)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)

## How ordering works

There's no checkout or payment gateway on purpose — the shop sells through Instagram and WhatsApp.
The customer adds products to the cart, fills in the order form and the site **builds the order message**:

- **WhatsApp:** opens `wa.me` with the message already filled in
- **Instagram:** copies the message to the clipboard and opens the shop's DM, so the customer just pastes it

The contact channels come from the store settings in the API, so the owner can change them without a deploy.

## Highlights

- **Angular 21** with standalone components and **signals** for state
- **Cart that can't be tampered with** — only product IDs and quantities are kept in `localStorage`; prices are always re-read from the official catalog, and stored data is sanitized (max quantity per item, invalid items dropped) before use
- **Admin area** (`/admin/**`) protected by a route **guard**, with an HTTP **interceptor** that adds the JWT only to calls going to the API
- Product **variations**, image gallery, category navigation and search
- Custom design system with CSS variables (`estilos/variaveis.css`)

## Routes

| Path | What |
|---|---|
| `/` | Storefront |
| `/admin/login` | Admin login |
| `/admin/produtos` | Product and category management |
| `/admin/configuracoes` | Store settings (contact channels, etc.) |

## Running locally

Start the [API](https://github.com/thiagolutes/le-chocollatt-api) on `http://localhost:8080`, then:

```bash
npm install
npm start          # http://localhost:4200
```

For a production build, set the public API URL in `src/environments/environment.prod.ts` and run `npm run build`.

## Project structure

```
src/app
├── componentes/     # UI components (cart, product card, gallery, order form, ...)
├── paginas/         # routed pages: storefront, admin/*, 404
├── servicos/        # cart logic, API calls, auth, order message builder
├── interceptors/    # adds the JWT to API calls
├── guards/          # protects /admin/**
├── tipos/           # TypeScript models
└── utilitarios/     # small helpers
```
