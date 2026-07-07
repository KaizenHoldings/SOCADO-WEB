# Development Notes — Socado Web

> Companion to [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) and [AGENTS.md](AGENTS.md).

## Run / build
```bash
pnpm install
cp .env.example .env        # add Postgres URL + Vercel Blob token
pnpm dev                    # http://localhost:3000  (public + /admin)
pnpm build && pnpm start    # production
```
Node `^18.20.2 || >=20.9.0`, pnpm `^9 || ^10`. Docker option via `docker-compose.yml` (note: README/compose still reference MongoDB — project actually uses **Postgres**; treat README as stale).

## Codegen — important
After changing any Payload collection:
```bash
pnpm generate:types        # regenerates src/payload-types.ts
pnpm generate:importmap    # regenerates admin import map
```
`src/payload-types.ts` is generated — **do not edit by hand** (it currently shows as modified in git from a codegen run).

## Layering contract (enforced — see AGENTS.md)
- `app/api/**/route.ts` = transport only: parse, validate, delegate.
- `lib/services/*` = business logic, framework-agnostic (no Next req/headers/cookies).
- `lib/data/*` = persistence access. No DB queries from components or routes.
Follow this when adding features (e.g. quotes, discounts, taxes already wired this way).

## Key subsystems
- **Quote flow:** `api/quotes/route.ts` → `quote.service.ts` → `email.service.ts` (+ `slack.service.ts` notify). No payment gateway by design.
- **Discounts/taxes:** `api/discounts`, `api/shop-taxes`, `lib/utils/discount.utils.ts`, collections `DiscountRules` / `Taxes` / `Promotions`.
- **CSV catalog ops:** `api/csv/[collection]/{import,export,template}` with `papaparse` + `components/admin/CsvActions.tsx`.
- **Cart:** Zustand store `lib/store/cart.store.ts`, surfaced via `CartDrawer`.

## Testing
- `pnpm test:int` — Vitest (`vitest.config.mts`, jsdom).
- `pnpm test:e2e` — Playwright (`playwright.config.ts`).

## Housekeeping observations (low-risk, not changed)
- Stale boilerplate: `README.md` (Payload blank template, MongoDB) and layout metadata don't match this project.
- Loose root notes: `catering.md`, `socadoTimeline.txt` — informal working notes; fine to keep or fold into docs later.
- `.env` is committed-adjacent; ensure secrets stay only in `.env` (gitignored), not `.env.example`.
