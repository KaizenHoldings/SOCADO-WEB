# Socado Web — Development

> Operational development reference for Socado Web. Architecture rules are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. Requirements

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm `^9` or `^10`
- PostgreSQL access
- Vercel Blob credentials
- Required transactional provider credentials for enabled integrations

Verify:

```bash
node --version
pnpm --version
```

## 2. Installation

```bash
pnpm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Populate `.env` with safe local credentials.

Rules:

- `.env` must remain ignored.
- `.env.example` must contain placeholders only.
- Never place real secrets in documentation, tests, source files, or committed fixtures.

## 3. Local development

```bash
pnpm dev
```

Default URLs:

- Public website: `http://localhost:3000`
- Payload admin: `http://localhost:3000/admin`

## 4. Production

Build:

```bash
pnpm build
```

Start:

```bash
pnpm start
```

Combined:

```bash
pnpm build && pnpm start
```

## 5. Payload code generation

After changing any Payload collection:

```bash
pnpm generate:types
pnpm generate:importmap
```

Generated files include:

- `src/payload-types.ts`
- Payload administrative import maps

Do not edit generated files manually.

Fix the source collection or Payload configuration, then regenerate.

## 6. Architecture

All implementation must follow the layered architecture defined in [ARCHITECTURE.md](ARCHITECTURE.md).

Mandatory flow:

```text
Presentation → Transport → Service → Data → Database
```

## 7. Key subsystems

### Quote flow

```text
src/app/api/quotes/route.ts
  → quote service
  → data persistence
  → email service
  → commercial notification service
```

There is no payment gateway by design.

### Discounts, taxes, and promotions

Relevant areas may include:

```text
src/app/api/discounts/
src/app/api/shop-taxes/
src/lib/utils/discount.utils.ts
```

Payload entities include discount rules, taxes, and promotions.

### CSV catalog operations

```text
src/app/api/csv/[collection]/
```

Supported operations may include import, export, and template generation.

Administrative UI actions are surfaced through the relevant admin components.

### Cart

```text
src/lib/store/cart.store.ts
```

The Zustand store manages temporary client-side cart state.

Commercial values must be validated again on the server.

## 8. Testing

### Integration tests

```bash
pnpm test:int
```

Uses Vitest and the project integration configuration.

### End-to-end tests

```bash
pnpm test:e2e
```

Uses Playwright.

### Recommended validation

Run the checks relevant to the task:

```bash
pnpm build
pnpm test:int
pnpm test:e2e
```

Also run any available lint or type-check command listed in `package.json`.

Do not report a command as successful unless it was actually executed and completed successfully.

## 9. Git workflow

Before editing:

```bash
git status
```

Recommended feature branch:

```bash
git checkout -b feature/<feature-name>
```

Before committing:

```bash
git status
git diff --stat
git diff
```

Confirm:

- Only intended files changed.
- Unrelated user work remains intact.
- Generated files were not manually edited.
- No real secrets were added.
- Permanent decisions were documented in the correct source-of-truth file.

## 10. Docker status

The repository may still contain Docker configuration inherited from the original Payload template.

Important:

- The current project uses PostgreSQL, not MongoDB.
- Do not assume existing `docker-compose.yml` content is current.
- Review and update Docker configuration before relying on it for local development.
- Remove stale MongoDB references when the Docker workflow is formally updated.

## 11. Environment maintenance

When adding an environment variable:

1. Add a safe placeholder to `.env.example`.
2. Document its purpose without exposing secrets.
3. Validate it at application startup when appropriate.
4. Ensure server-only variables are not exposed to the client.
5. Update deployment configuration.

## 12. Dependency maintenance

Before adding a package:

- Verify that the existing stack does not already provide the capability.
- Check bundle, security, and maintenance impact.
- Prefer packages already used by the project.
- Avoid introducing a second system for state, animation, validation, or styling without approval.
- Keep lockfile changes limited to intentional dependency changes.

## 13. Frontend development

Global Tailwind v4 tokens are defined in:

```text
src/app/(frontend)/styles.css
```

There is no traditional Tailwind configuration file for the primary brand tokens.

Use:

- Named utilities.
- Raleway for headings.
- Outfit for body and functional copy.
- Existing responsive patterns.
- Existing Motion dependency for animation when adequate.

References:

- [BRAND.md](BRAND.md)
- [UI_UX.md](UI_UX.md)

## 14. Motion development

For motion-only tasks:

- Follow `.claude/skills/premium-motion/SKILL.md`.
- Perform a read-only audit first.
- Preserve layout, typography, text, images, and responsive behavior.
- Respect `prefers-reduced-motion`.
- Record approved decisions in `docs/motion/MOTION_MAP.md`.

## 15. Housekeeping

Regularly search for stale template references:

```bash
rg "Payload Blank Template|MONGODB_URL|MongoDB"
```

Do not remove a reference automatically if it belongs to an intentionally preserved migration or historical note. Evaluate its context first.