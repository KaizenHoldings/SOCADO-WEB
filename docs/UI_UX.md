# UI/UX Notes — Socado Web

> Brand voice, full color palette and typography rules are in [AGENTS.md](AGENTS.md) (§ APARTADO VISUAL). This file is the practical front-end working reference.

## Design direction
"Simplemente Elegante · Cálidamente Conectado · Únicamente Sobrio" — minimal, warm, authentic, no over-design. Texts left-aligned by default; uppercase reserved for Hero-level impact.

**Visual references:** honestgreens.com · doe.co.nz · sweetgreen (ezcater).

## Design tokens (source of truth)
All tokens live in [`src/app/(frontend)/styles.css`](src/app/(frontend)/styles.css) under `@theme` (Tailwind v4 — **no `tailwind.config`**). Use the named utilities, not raw hex.

| Token (utility) | Hex | Use |
| --- | --- | --- |
| `azul-socado` | `#063547` | Primary / text on light |
| `celeste-socado` | `#5c8ea0` | Accent, scrollbar |
| `terra` | `#b45b38` | Warm accent / CTA highlight |
| `ivory` | `#f2eae6` | Background |
| `gris-metropolis` `verde-salvia` `amarillo-tostado` `verde-century` | — | Secondary (15%) |

Fonts: `font-raleway` (headings), `font-outfit` (body, default). Animations: `animate-fade-in`, `animate-zoom-in`.

## Component inventory (`src/components/catalog/`)
- **Layout/chrome:** `Header`, `Footer`
- **Home:** `HeroLeft`, `Hero`, `Promotion`, `OurStory`, `AboutUs`, `StoresCards` / `StoreCard` / `StoresCarousel`, `Timeline` (mobile) / `RadialTimeline` (desktop), `CateringPromo`, `HowItWorksCatering`
- **Catalog/catering:** `CategoryFilter`, `ProductGridSection`, `ProductCard`, `ProductDetailModal`, `BoxBuilder`, `ViewModeToggle`, `EcommerceModal`
- **Cart:** `CartDrawer` (state in `lib/store/cart.store.ts`)

## Responsive note
Home swaps timeline by breakpoint: `Timeline` on `<lg`, `RadialTimeline` on `lg+` (see `page.tsx`).

## Known low-risk UI/UX opportunities (audit findings — not yet done)
1. **Metadata is still boilerplate** — `(frontend)/layout.tsx` title/description say "Payload Blank Template". Should reflect Socado + proper SEO/OpenGraph. (Low risk, high value.)
2. **Dark-mode token override** — `styles.css` defines a `prefers-color-scheme: dark` block that flips background/foreground, but the brand is light-first (ivory). Confirm dark mode is intended or scope it; it can silently invert sections.
3. **Accessibility pass** — verify color contrast (terra/celeste on ivory), focus states, and `alt` text on `next/image` usage across catalog cards.
4. **Consistency** — centralize spacing/radius/shadow as tokens if repeated ad-hoc in components.

## Where to make UI/UX changes
- Global tokens/animations → `styles.css` `@theme`.
- Per-section look → matching component in `components/catalog/`.
- Page composition/order → `(frontend)/page.tsx` and `(frontend)/catering/page.tsx`.
