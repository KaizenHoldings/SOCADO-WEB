# Socado Web — Claude Code Instructions

@docs/PRODUCT.md
@docs/ARCHITECTURE.md
@docs/DEVELOPMENT.md
@docs/BRAND.md
@docs/UI_UX.md

## Documentation authority

Use the imported documents as the project's sources of truth:

* `docs/PRODUCT.md`: product purpose, users, scope and product principles.
* `docs/ARCHITECTURE.md`: stack, project structure, layering and technical boundaries.
* `docs/DEVELOPMENT.md`: installation, commands, code generation, testing and maintenance.
* `docs/BRAND.md`: brand identity, voice, typography, colors and logo rules.
* `docs/UI_UX.md`: practical frontend tokens, components and responsive behavior.

For catering-related work, read `docs/features/CATERING.md` before planning or editing.

Do not duplicate project rules across documents. Update the corresponding source-of-truth document when a permanent project decision changes.

## General working rules

Before editing:

1. Inspect the relevant existing implementation.
2. Identify the smallest set of files that needs modification.
3. Check for unrelated uncommitted changes.
4. Preserve existing behavior unless the task explicitly requires changing it.
5. Explain the intended implementation before making broad or structural changes.

Do not:

* Rewrite unrelated code.
* Replace working components unnecessarily.
* Introduce a dependency without explaining why it is needed.
* Modify generated files manually.
* Create a second implementation when an appropriate abstraction already exists.
* Mix business logic with transport or presentation code.

## Architecture

The mandatory dependency flow is:

`transport → service → data`

Rules:

* API routes and server transport handlers parse, validate and delegate.
* Business rules belong in `lib/services`.
* Persistence belongs in `lib/data`.
* Components must not query the database directly.
* Route handlers must not contain business logic.
* Services should remain framework-agnostic.
* Do not introduce Next.js request, cookie or header dependencies into domain services.

## Generated files

Do not manually edit:

* `src/payload-types.ts`
* Payload-generated import maps
* Other files explicitly marked as generated

After changing a Payload collection, run:

* `pnpm generate:types`
* `pnpm generate:importmap`

## Validation

Use the checks relevant to the task:

* `pnpm build`
* `pnpm test:int`
* `pnpm test:e2e`
* Available lint or type-check commands
* Review of the complete `git diff`

Do not claim a check passed unless it was actually executed successfully.

## Frontend and brand work

For visual changes:

* Use existing brand tokens from `src/app/(frontend)/styles.css`.
* Prefer named Tailwind utilities over raw hexadecimal colors.
* Preserve Raleway for headings and Outfit for body text.
* Respect the official logo restrictions.
* Maintain keyboard navigation, semantic structure and visible focus states.
* Respect `prefers-reduced-motion`.
* Avoid over-design and visual effects that distract from content.

## Motion-only tasks

When the task is specifically about animations, transitions, entrances, hovers or microinteractions:

1. Follow the `premium-motion` skill.
2. Audit before editing.
3. Create a Motion Map.
4. Do not implement until the proposed Motion Map is approved.
5. Preserve the approved design geometry.

Unless the task explicitly says otherwise, do not modify:

* Section or container dimensions.
* Margins, padding or gaps.
* Grid or flex layout.
* Element alignment or position.
* Responsive breakpoints.
* Typography.
* Text content or line breaks.
* Image dimensions, source, crop or aspect ratio.
* DOM order.
* Component hierarchy.

For motion work, prefer:

* `transform`
* `opacity`
* `clip-path`
* Animation-specific CSS variables
* Existing Motion utilities
* CSS transitions for simple microinteractions

Do not:

* Use `transition: all`.
* Animate layout properties.
* Introduce strong parallax.
* Introduce smooth scrolling without approval.
* Introduce horizontal scrolling.
* Pin sections without approval.
* Replace the cursor.
* Combine animation libraries without a justified need.
* Leave content hidden when JavaScript fails.
* Leave observers, timelines or animation instances without cleanup.

## Motion validation

After implementing motion:

1. Run the project checks.
2. Inspect desktop and mobile behavior.
3. Verify `prefers-reduced-motion`.
4. Check for console errors.
5. Review animation cleanup.
6. Review the complete `git diff`.
7. Confirm no unauthorized layout, typography, content or image changes occurred.

Store the approved motion system and section-by-section decisions in:

`docs/motion/MOTION_MAP.md`
