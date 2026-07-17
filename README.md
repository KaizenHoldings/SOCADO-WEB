# Socado Web

Digital platform for **Socado Café**, designed to present the brand experience and convert visitor interest into catering quote requests.

The application includes a public website, a catering catalog, an “Arma tu box” experience, a quote cart, transactional notifications, and a private administrative panel for catalog and pricing management.

There is no payment gateway. The customer journey ends with the submission of a quote request.

---

## Main features

### Public website

* Socado brand and store experience.
* Promotional and editorial sections.
* Store information.
* Catering presentation.
* Responsive mobile and desktop experiences.
* Accessible navigation and reduced-motion support.

### Catering

* Free product selection.
* “Arma tu box” configurations.
* Product categories and filtering.
* Cart management.
* Customer and event information form.
* Quote calculations.
* Discount and tax validation.
* Transactional email notifications.
* Commercial team notifications.

### Administrative panel

* Product management.
* Category management.
* Price updates.
* Media management.
* Discount rules.
* Promotions.
* Taxes.
* Quote records.
* CSV catalog import and export.

---

## Technology stack

| Area                     | Technology                             |
| ------------------------ | -------------------------------------- |
| Framework                | Next.js 16 with App Router             |
| UI                       | React 19                               |
| Language                 | TypeScript                             |
| CMS and embedded backend | Payload CMS 3.85                       |
| Database                 | PostgreSQL                             |
| Media storage            | Vercel Blob                            |
| Styling                  | Tailwind CSS v4                        |
| Client state             | Zustand                                |
| Animation                | Motion                                 |
| Icons                    | Lucide React                           |
| Modals and alerts        | SweetAlert2                            |
| Rich text                | Lexical                                |
| Fonts                    | Raleway and Outfit through `next/font` |
| Integration testing      | Vitest                                 |
| End-to-end testing       | Playwright                             |
| Package manager          | pnpm                                   |

---

## Requirements

Before starting, install:

* Node.js `^18.20.2` or `>=20.9.0`
* pnpm `^9` or `^10`
* Access to the project PostgreSQL database
* Access to the configured Vercel Blob storage

Confirm the installed versions:

```bash
node --version
pnpm --version
```

---

## Local setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create the local environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Complete `.env` with the required local credentials, including the PostgreSQL connection and Vercel Blob configuration.

Never commit real secrets.

The `.env.example` file must contain placeholders only.

### 4. Start the development server

```bash
pnpm dev
```

Open:

* Public website: `http://localhost:3000`
* Payload administration: `http://localhost:3000/admin`

---

## Production build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Or run both commands:

```bash
pnpm build && pnpm start
```

---

## Payload code generation

After modifying any Payload collection, run:

```bash
pnpm generate:types
pnpm generate:importmap
```

These commands regenerate:

* Payload TypeScript definitions.
* Payload administrative import maps.

Do not manually edit:

```text
src/payload-types.ts
```

Do not manually edit other files explicitly marked as generated.

Fix collection or configuration issues at their source and regenerate the affected files.

---

## Testing

### Integration tests

```bash
pnpm test:int
```

Integration tests use Vitest.

### End-to-end tests

```bash
pnpm test:e2e
```

End-to-end tests use Playwright.

### Recommended validation before merging

```bash
pnpm build
pnpm test:int
pnpm test:e2e
```

Also run any lint or type-check command available in `package.json`.

Do not assume a task is complete only because the development server starts successfully.

---

## Architecture

The project follows a strict layered architecture:

```text
Presentation → Transport → Service → Data → Database
```

### Presentation

Primary locations:

```text
src/app/(frontend)/
src/components/catalog/
```

Responsibilities:

* Render the interface.
* Handle user interactions.
* Manage visual state.
* Display loading, error, success, and empty states.

Components must not query the database or contain authoritative business logic.

### Transport

Primary location:

```text
src/app/api/
```

Responsibilities:

* Parse requests.
* Validate input.
* Resolve authorization.
* Delegate operations to services.
* Translate service results into responses.

Route handlers must not query the database directly or contain business rules.

### Services

Primary location:

```text
src/lib/services/
```

Responsibilities:

* Business rules.
* Quote calculations.
* Discount and tax validation.
* Catering rules.
* Email and notification orchestration.

Services must remain independent from React and native Next.js request objects whenever possible.

### Data

Primary location:

```text
src/lib/data/
```

Responsibilities:

* Payload and PostgreSQL access.
* Queries and persistence.
* Record transformation.
* Transactions.

Database access must not be performed directly from components or route handlers.

For complete architecture rules, read:

```text
docs/ARCHITECTURE.md
```

---

## Project structure

```text
src/
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx
│   │   ├── catering/
│   │   └── styles.css
│   │
│   ├── (payload)/
│   │   └── admin/
│   │
│   └── api/
│       ├── csv/
│       ├── discounts/
│       ├── quotes/
│       └── shop-taxes/
│
├── collections/
│   └── Payload CMS collections
│
├── components/
│   ├── catalog/
│   ├── admin/
│   └── payload/
│
├── lib/
│   ├── services/
│   ├── data/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── migrations/
└── payload-types.ts
```

---

## Key subsystems

### Quote flow

The quote flow follows the service architecture:

```text
Quote interface
  → quotes API
  → quote service
  → data persistence
  → email and commercial notifications
```

All prices, quantities, discounts, taxes, and product rules must be validated on the server.

### Discounts and taxes

Related areas include:

```text
src/app/api/discounts/
src/app/api/shop-taxes/
src/lib/utils/discount.utils.ts
```

Relevant Payload entities include:

* Discount rules.
* Taxes.
* Promotions.

### CSV catalog operations

Catalog import, export, and template operations are handled through:

```text
src/app/api/csv/[collection]/
```

Administrative CSV actions are surfaced through the corresponding admin components.

### Cart

Cart state is managed with Zustand:

```text
src/lib/store/cart.store.ts
```

The client-side cart is not the authoritative source for commercial values. All relevant values must be validated again during quote submission.

---

## Design system

The project uses Tailwind CSS v4.

Global design tokens are defined in:

```text
src/app/(frontend)/styles.css
```

The project does not use a traditional `tailwind.config` file for its primary brand tokens.

Use existing named utilities instead of introducing arbitrary hexadecimal values.

Primary typography:

* Raleway for headings.
* Outfit for body and functional text.

Complete brand rules:

```text
docs/BRAND.md
```

Practical frontend rules:

```text
docs/UI_UX.md
```

---

## Animation

The project currently uses Motion.

For animation-related tasks:

* Preserve the existing layout and responsive behavior.
* Prefer `transform` and `opacity`.
* Respect `prefers-reduced-motion`.
* Avoid animating layout properties.
* Avoid introducing additional animation libraries without approval.
* Follow the project’s premium motion workflow.

Motion skill:

```text
.claude/skills/premium-motion/SKILL.md
```

Approved animation decisions should be documented in:

```text
docs/motion/MOTION_MAP.md
```

---

## Documentation

| Document                    | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `CLAUDE.md`                 | Primary instructions for Claude Code                       |
| `AGENTS.md`                 | Entry point for other coding agents                        |
| `docs/PRODUCT.md`           | Product purpose, users, and scope                          |
| `docs/ARCHITECTURE.md`      | Stack, layers, dependencies, and technical rules           |
| `docs/DEVELOPMENT.md`       | Environment, commands, testing, and code generation        |
| `docs/BRAND.md`             | Brand identity, voice, typography, colors, and imagery     |
| `docs/UI_UX.md`             | Frontend tokens, components, and responsive implementation |
| `docs/features/CATERING.md` | Catering business and interface rules                      |
| `docs/motion/MOTION_MAP.md` | Approved animation system and section-level decisions      |

Update the corresponding source-of-truth document whenever a permanent project decision changes.

Avoid duplicating the same rule across several files.

---

## Environment and secrets

Never commit:

* `.env`
* Database credentials.
* Vercel Blob tokens.
* Email provider secrets.
* Slack credentials.
* Private API keys.
* Production URLs containing credentials.

The `.env.example` file should document required variables using safe placeholders.

Before committing, review:

```bash
git status
git diff
```

---

## Docker status

The repository may still contain Docker configuration inherited from the original Payload template.

Do not assume that any existing Docker configuration is current.

The project uses PostgreSQL, not MongoDB.

Review and update `docker-compose.yml` before relying on Docker for local development.

---

## Development workflow

A recommended workflow is:

```bash
git checkout -b feature/<feature-name>
pnpm install
pnpm dev
```

After implementing the change:

```bash
pnpm build
pnpm test:int
pnpm test:e2e
git status
git diff
```

Before committing:

* Confirm that only intended files changed.
* Preserve unrelated uncommitted work.
* Do not manually modify generated files.
* Do not include real secrets.
* Update documentation when a permanent decision changes.

---

## Accessibility

The intended accessibility target is WCAG 2.1 AA whenever reasonably achievable.

Frontend work should preserve:

* Semantic HTML.
* Keyboard navigation.
* Visible focus states.
* Legible color contrast.
* Appropriate touch targets.
* Meaningful alternative text.
* Reduced-motion behavior.
* Content visibility when JavaScript or animation fails.

Accessibility should be considered part of implementation quality, not a separate optional phase.

---

## Project principles

* Communicate clearly before decorating.
* Preserve Socado’s warm, sober, and connected personality.
* Keep business logic independent from the interface and transport layers.
* Validate commercial data on the server.
* Reuse existing components and project patterns.
* Avoid unnecessary dependencies.
* Prefer focused and reversible changes.
* Do not compromise maintainability for short-term speed.
