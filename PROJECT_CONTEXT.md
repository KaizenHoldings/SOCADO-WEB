# Project Context — Socado Web

> Brand, business rules and layered-architecture mandate live in [AGENTS.md](AGENTS.md). This file is the quick technical map. Keep it short.

## What it is
Web platform for **Socado Café** (retail chain) focused on **lead capture via a catering quote module**. There is **no payment gateway** — the flow ends in a form that fires transactional emails to the sales team and customer. A private admin panel manages the product catalog and prices.

## Stack (detected)
- **Framework:** Next.js 16 (App Router) + React 19, full TypeScript
- **CMS / backend:** Payload CMS 3.85 (headless), embedded in the same Next app
- **Database:** PostgreSQL via `@payloadcms/db-postgres`
- **Media storage:** Vercel Blob (`@payloadcms/storage-vercel-blob`)
- **Styling:** Tailwind CSS **v4** (config-less, `@theme` in `styles.css`)
- **State:** Zustand (cart)
- **Animation:** `motion` (Framer Motion) · **Icons:** `lucide-react` · **Modals/alerts:** `sweetalert2`
- **Rich text:** Lexical · **Fonts:** Raleway (headings) + Outfit (body) via `next/font`
- **Testing:** Playwright (e2e) + Vitest (integration)
- **Package manager:** pnpm

## Layout map
```
src/
  app/
    (frontend)/            Public site
      page.tsx             Home (Hero, Promotion, Stores, OurStory, Timeline, CateringPromo)
      catering/            Catalog + BoxBuilder + CartDrawer + checkout
      styles.css           Tailwind v4 entry + @theme tokens (brand colors/fonts)
    (payload)/admin/       Payload admin panel
    api/                   csv (import/export/template), discounts, quotes, shop-taxes
  collections/             14 Payload collections (Products, Categories, Quotes, Taxes, Stores...)
  components/
    catalog/               All public UI components (see UI_UX_NOTES.md)
    admin/ payload/        Admin/CMS-specific components
  lib/
    services/              Business logic (email, quote, slack) — framework-agnostic
    data/                  catalog-data.ts (data layer)
    store/                 cart.store.ts (Zustand)
    types/ utils/          Shared types + discount utils
  migrations/              Payload DB migrations
```

## Architecture rule (from AGENTS.md, non-negotiable)
Strict layering: **API route (transport) → service (business logic) → data (persistence)**. No business logic or direct DB queries in components or route handlers. Services must stay framework-agnostic (no Next request/cookie/header dependencies) to allow a future backend migration.

## Entry points & scripts
- `pnpm dev` — dev server (`localhost:3000`)
- `pnpm build` / `pnpm start` — production
- `pnpm generate:types` / `pnpm generate:importmap` — Payload codegen
- `pnpm test` (`test:int` Vitest, `test:e2e` Playwright)
- Env: copy `.env.example` → `.env` (needs Postgres URL + Blob token)
