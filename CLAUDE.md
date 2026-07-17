# Socado Web — Claude Code Instructions

## Documentation map

Project documentation is organized by responsibility:

- `docs/PRODUCT.md`: product purpose, users, scope, and product principles.
- `docs/ARCHITECTURE.md`: stack, project structure, layers, and dependency rules.
- `docs/DEVELOPMENT.md`: commands, environment, testing, and code generation.
- `docs/BRAND.md`: brand identity, voice, colors, typography, imagery, and motion direction.
- `docs/UI_UX.md`: frontend tokens, component inventory, responsive behavior, and implementation notes.
- `docs/features/CATERING.md`: catering-specific business and interface rules.
- `docs/motion/MOTION_MAP.md`: approved motion specifications.

Before planning or editing, read only the documents relevant to the current task.

For animation-only tasks, read:

- `docs/BRAND.md`
- `docs/UI_UX.md`
- `.claude/skills/premium-motion/SKILL.md`

For catering tasks, also read:

- `docs/features/CATERING.md`

For backend, API, Payload, database, or business-logic tasks, read:

- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`

## 1. Purpose

These instructions define how Claude Code must analyze, plan, modify, and validate this repository.

The imported documents are the project’s sources of truth.

Do not duplicate permanent rules across multiple documentation files.

When a permanent product, architecture, development, brand, or frontend decision changes, update the corresponding source-of-truth document.

---

## 2. Documentation authority

Use the imported documents according to the following responsibilities:

* `docs/PRODUCT.md`: product purpose, users, scope, product principles, and accessibility objectives.
* `docs/ARCHITECTURE.md`: technology stack, project structure, layer boundaries, dependency rules, security, and maintainability.
* `docs/DEVELOPMENT.md`: installation, commands, code generation, testing, environment, and operational notes.
* `docs/BRAND.md`: brand identity, voice, typography, colors, imagery, logo rules, and visual direction.
* `docs/UI_UX.md`: practical frontend tokens, component inventory, responsive behavior, and implementation notes.

For catering-related work, also read:

```text
docs/features/CATERING.md
```

For approved motion decisions, also read:

```text
docs/motion/MOTION_MAP.md
```

Only read feature-specific documentation when the task relates to that feature.

---

## 3. Language conventions

* Write technical documentation in English.
* Write architecture rules and implementation plans in English.
* Write skills and agent instructions in English.
* Write code comments in English when comments are necessary.
* Use English for identifiers, variables, functions, types, and component names.
* Preserve official Socado expressions in their original language.
* Preserve official product, service, category, campaign, and feature names.
* Write user-facing website content in Spanish unless the task explicitly requests another language.
* Do not translate approved interface copy unless explicitly requested.
* Avoid mixing English and Spanish inside the same technical instruction.

Official expressions that must remain in their original form include:

* “Simplemente Elegante”
* “Cálidamente Conectado”
* “Únicamente Sobrio”
* “Arma tu box”

---

## 4. General working rules

Before editing:

1. Read the documentation relevant to the task.
2. Inspect the existing implementation.
3. Inspect `package.json` when dependencies or commands are relevant.
4. Identify the smallest set of files that requires modification.
5. Check `git status`.
6. Identify unrelated uncommitted changes.
7. Preserve existing behavior unless the task explicitly requires changing it.
8. Explain the proposed implementation before broad or structural changes.
9. Reuse existing components, utilities, tokens, services, and patterns when appropriate.

Do not:

* Rewrite unrelated code.
* Reformat unrelated files.
* Replace working components unnecessarily.
* Create duplicate implementations.
* Introduce a dependency without explaining the need.
* Modify generated files manually.
* Change architecture while performing an unrelated visual task.
* Change approved copy without explicit authorization.
* Claim that a validation passed unless it was actually executed successfully.
* Remove existing functionality to simplify an implementation.
* Overwrite unrelated uncommitted user work.

Prefer focused, reversible changes.

---

## 5. Architecture requirements

The mandatory dependency direction is:

```text
Presentation → Transport → Service → Data → Database
```

Rules:

* API routes and server-side transports must parse, validate, authorize, and delegate.
* Business logic belongs in `src/lib/services`.
* Persistence access belongs in `src/lib/data`.
* Components must not query the database directly.
* Route handlers must not query the database directly.
* Route handlers must not contain business logic.
* Services should remain framework-agnostic.
* Services must not depend on React components or hooks.
* Services should not depend on native Next.js request, response, cookie, or header objects.
* Data functions must not contain presentation logic.
* Zustand stores must not become authoritative sources for commercial calculations.
* Prices, discounts, taxes, quantities, and quote rules must be validated on the server.

Do not introduce circular dependencies between layers.

---

## 6. Payload CMS and generated files

Payload CMS is the embedded CMS and administrative backend.

Do not manually edit generated files, including:

```text
src/payload-types.ts
```

Do not manually edit Payload-generated import maps.

After changing a Payload collection, run:

```bash
pnpm generate:types
pnpm generate:importmap
```

Do not modify a generated file to fix an error that should be fixed in its source collection or configuration.

---

## 7. Dependency policy

Before adding a dependency:

1. Verify whether the existing stack already supports the requirement.
2. Explain why the current implementation is insufficient.
3. Explain the maintenance and bundle impact.
4. Prefer a dependency already used by the project.
5. Request explicit approval when the dependency introduces a new major system.

Do not add:

* A second state-management library.
* A second animation system without a justified need.
* A smooth-scroll library without explicit approval.
* A duplicate utility library for functionality already available.
* A large dependency for a small isolated requirement.

---

## 8. Frontend and brand rules

For frontend changes:

* Use the existing tokens in `src/app/(frontend)/styles.css`.
* Prefer named Tailwind utilities over raw hexadecimal colors.
* Preserve Raleway for headings.
* Preserve Outfit for body and functional text.
* Preserve official logo assets.
* Preserve logo proportions and clear space.
* Maintain semantic HTML.
* Maintain keyboard navigation.
* Maintain visible focus states.
* Maintain adequate contrast.
* Respect `prefers-reduced-motion`.
* Reuse existing responsive patterns.
* Avoid arbitrary visual values when an existing token is available.
* Avoid over-design.
* Avoid effects that compete with content.
* Avoid changing approved text, images, layout, or responsive behavior unless requested.

For detailed visual direction, follow:

```text
docs/BRAND.md
docs/UI_UX.md
```

---

## 9. Scope control

Only modify files directly required by the current task.

Before editing a file, be able to explain why it is required.

Do not perform opportunistic refactors during:

* Animation tasks.
* Copy changes.
* Bug fixes.
* Small UI adjustments.
* Feature-specific modifications.

When an unrelated issue is discovered:

* Report it separately.
* Do not fix it unless it blocks the requested task or the user explicitly approves it.

---

## 10. Motion-only tasks

When a task is specifically limited to animations, transitions, entrances, hovers, scroll behavior, or microinteractions:

1. Follow `.claude/skills/premium-motion/SKILL.md`.
2. Perform a read-only audit before implementation.
3. Create a section-by-section Motion Map.
4. Store approved motion decisions in `docs/motion/MOTION_MAP.md`.
5. Do not implement until the Motion Map has been explicitly approved.
6. Preserve the approved design geometry.
7. Use the existing Motion dependency whenever it adequately supports the requirement.
8. Use CSS transitions for simple microinteractions.
9. Request approval before introducing GSAP, ScrollTrigger, Lenis, or another motion dependency.

During a motion-only task, do not modify:

* Section width.
* Section height.
* Section `min-height` or `max-height`.
* Container width or `max-width`.
* Margins.
* Padding.
* Gaps.
* Grid configuration.
* Flex layout.
* Alignment.
* Element position.
* Responsive breakpoints.
* Font family.
* Font size.
* Font weight.
* Line height.
* Letter spacing.
* Text content.
* Text hierarchy.
* Approved line breaks.
* Image dimensions.
* Image source.
* Image crop.
* Image aspect ratio.
* `object-fit`.
* DOM order.
* Component hierarchy.
* Navigation structure.
* Existing sticky behavior.
* Existing scroll behavior unless explicitly approved.

Do not redesign, resize, restructure, rewrite, or reposition components during a motion-only task.

---

## 11. Permitted motion changes

Motion-only changes may be limited to:

* `transform`.
* `opacity`.
* `clip-path`.
* Masks that do not affect layout.
* `transform-origin`.
* Transition timing.
* Animation timing.
* Hover states.
* `focus-visible` states.
* Active states.
* Scroll-triggered visual effects.
* Animation-specific CSS variables.
* Motion utilities.
* Animation hooks.
* Timelines.
* Observers.
* Reduced-motion alternatives.
* Minimal overflow handling required for a reveal, provided it does not crop approved content.

Prefer `transform` and `opacity`.

Do not use:

```css
transition: all;
```

Do not animate layout properties.

Do not use animation as a reason to change layout geometry.

---

## 12. Motion direction

Motion must feel:

* Premium.
* Contemporary.
* Elegant.
* Smooth.
* Controlled.
* Editorial.
* Warm.
* Cohesive.
* Subtle rather than exaggerated.

Do not apply the same generic fade-in to every element.

Create hierarchy through controlled variation in:

* Timing.
* Direction.
* Distance.
* Stagger.
* Intensity.
* Trigger.
* Easing.

The complete experience must still feel like one motion system.

Avoid:

* Strong parallax.
* Excessive blur.
* Large scale changes.
* Repeated character-by-character animation.
* Aggressive bouncing.
* Unnecessary rotation.
* Cursor replacement.
* Horizontal scrolling.
* Section pinning without approval.
* Smooth scrolling without approval.
* Long delays before content becomes readable.
* Animations that block interaction.
* Animations that leave content hidden when JavaScript fails.

---

## 13. Animation lifecycle

When using React, Motion, observers, or animation libraries:

* Provide effect cleanup.
* Disconnect observers.
* Cancel animation frames when necessary.
* Remove event listeners.
* Revert timelines.
* Destroy or clean ScrollTrigger instances if introduced.
* Prevent duplicate initialization.
* Account for React Strict Mode.
* Prevent route changes from leaving stale animation instances.
* Prevent resize handlers from creating duplicate timelines.
* Ensure mobile and desktop configurations cleanly replace one another.
* Ensure inactive routes or hidden content do not continue unnecessary animation work.

---

## 14. Reduced motion

Always respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

* Remove parallax.
* Remove scroll-scrubbed movement.
* Remove large translations.
* Remove unnecessary scaling.
* Remove decorative looping animations.
* Keep all meaningful content visible.
* Preserve navigation and interaction.
* Preserve focus states.
* Do not leave elements at `opacity: 0`.
* Do not require animation to understand the interface.

---

## 15. Motion audit requirements

A motion audit must not edit, create, delete, rename, or format project files.

The audit should identify:

* Existing animation dependencies.
* Existing transitions and keyframes.
* Existing motion utilities.
* Page-load animation opportunities.
* Scroll-triggered entrance opportunities.
* Heading and paragraph reveal opportunities.
* Image reveal opportunities.
* Button and link microinteractions.
* Card hover opportunities.
* Navigation transitions.
* Section transitions.
* Decorative ambient motion.
* Mobile motion behavior.
* Reduced-motion behavior.
* Lifecycle and cleanup risks.
* Performance risks.
* Layout-preservation risks.

For each recommendation, provide:

* Route or page.
* Component or section.
* Target element.
* Proposed effect.
* Trigger.
* Initial visual state.
* Final visual state.
* Duration.
* Delay or stagger.
* Easing.
* Desktop behavior.
* Mobile behavior.
* Reduced-motion behavior.
* Technical implementation.
* Risk level.
* Expected modified files.

Stop after presenting the audit unless implementation was explicitly authorized.

---

## 16. Feature-specific documentation

For catering-related tasks, read:

```text
docs/features/CATERING.md
```

Feature documentation may define:

* Business rules.
* User flows.
* Selection constraints.
* Acceptance criteria.
* Special UI states.
* Terminology.

Feature documentation does not override architecture, security, accessibility, or brand rules unless an exception is explicitly documented.

---

## 17. Validation

Use the checks relevant to the task.

Available checks may include:

```bash
pnpm build
pnpm test:int
pnpm test:e2e
```

Also run any available:

* Lint command.
* Type-check command.
* Targeted test command.
* Development build verification.

After implementation:

1. Review `git status`.
2. Review the complete `git diff`.
3. Confirm that only intended files changed.
4. Confirm that unrelated user changes were preserved.
5. Confirm that no generated file was manually edited.
6. Confirm that the project builds when the task affects buildable code.
7. Confirm that errors are not hidden or ignored.

For frontend changes, also verify:

* Desktop behavior.
* Mobile behavior.
* Keyboard navigation.
* Focus states.
* Console errors.
* Responsive breakpoints.
* Reduced-motion behavior.

For motion-only changes, explicitly confirm that no unauthorized changes were made to:

* Layout.
* Dimensions.
* Spacing.
* Typography.
* Text.
* Images.
* Breakpoints.
* DOM order.
* Component hierarchy.

---

## 18. Testing expectations

Add or update tests when the task changes:

* Business rules.
* Quote calculations.
* Discounts.
* Taxes.
* Box validation.
* API input validation.
* Persistence behavior.
* Authentication or authorization.
* Critical customer flows.

Do not add meaningless tests only to increase test count.

Prefer tests that verify observable behavior and domain rules.

---

## 19. Security expectations

Always:

* Validate external input.
* Validate commercial data on the server.
* Protect administrative operations.
* Keep secrets outside client code.
* Avoid logging credentials or tokens.
* Sanitize editable content when required.
* Validate imported files.
* Avoid exposing internal stack traces.
* Avoid returning database or provider details to public clients.
* Preserve `.env` as a local, ignored file.

Do not place real secrets in:

```text
.env.example
source files
documentation
tests
committed fixtures
```

---

## 20. Documentation maintenance

When a permanent decision changes, update the relevant source of truth:

* Product decision → `docs/PRODUCT.md`
* Architecture decision → `docs/ARCHITECTURE.md`
* Development command or environment change → `docs/DEVELOPMENT.md`
* Brand decision → `docs/BRAND.md`
* Frontend implementation rule → `docs/UI_UX.md`
* Catering rule → `docs/features/CATERING.md`
* Approved motion decision → `docs/motion/MOTION_MAP.md`

Do not copy the same rule into multiple documents unless a brief reference is necessary.

Prefer links and references over duplicated paragraphs.

---

## 21. Final response requirements

After completing a code task, report:

* What was changed.
* Why it was changed.
* Files modified.
* Dependencies added or removed.
* Validation commands executed.
* Validation results.
* Known limitations.
* Any relevant risk or follow-up item.

Be explicit when a command was not executed or a verification could not be completed.

Do not claim success without evidence.
