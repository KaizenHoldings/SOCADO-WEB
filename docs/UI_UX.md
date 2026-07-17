# Socado Web — UI/UX

> Practical frontend implementation reference for Socado Web. Brand identity, voice, typography, colors, imagery, and logo rules are documented in [BRAND.md](BRAND.md).

## 1. Design direction

The interface should express:

- “Simplemente Elegante”
- “Cálidamente Conectado”
- “Únicamente Sobrio”

The experience should feel minimal, warm, authentic, editorial, contemporary, and clear.

Default text alignment is left. Uppercase is reserved for selected Hero-level or editorial impact.

Visual references include Honest Greens, Doe, and Sweetgreen on EZCater. Use them as directional references only; do not copy their layouts, identity, content, or exact animation systems.

## 2. Source of truth for tokens

Global frontend tokens live in:

```text
src/app/(frontend)/styles.css
```

The project uses Tailwind CSS v4 with `@theme`.

Do not create a second token system in a traditional `tailwind.config` unless the project architecture intentionally changes.

Prefer named utilities over raw hexadecimal values.

## 3. Brand color tokens

| Utility | Hex | Primary use |
|---|---|---|
| `azul-socado` | `#063547` | Primary identity, dark backgrounds, text on light |
| `celeste-socado` | `#5c8ea0` | Supporting accents |
| `terra` | `#b45b38` | Warm accent and selected emphasis |
| `ivory` | `#f2eae6` | Main light background |
| `gris-metropolis` | `#6e7c7c` | Secondary information |
| `verde-salvia` | `#6c7a67` | Natural supporting accent |
| `amarillo-tostado` | `#cf8a00` | Controlled warm emphasis |
| `verde-century` | `#b2b5a9` | Soft supporting surfaces |

Use approved combinations that preserve contrast.

## 4. Typography

- `font-raleway`: headings, high hierarchy, editorial messages.
- `font-outfit`: body, functional text, descriptions, labels, numbers.

Do not introduce additional typefaces without explicit brand approval.

Do not alter approved typography during motion-only tasks.

## 5. Existing animation utilities

Existing project utilities may include:

- `animate-fade-in`
- `animate-zoom-in`

Before creating a new utility:

1. Inspect whether an existing utility or Motion pattern covers the need.
2. Reuse shared duration and easing tokens.
3. Avoid duplicate effects with slightly different values.
4. Respect reduced motion.

Approved motion decisions belong in `docs/motion/MOTION_MAP.md`.

## 6. Component inventory

Primary public components under `src/components/catalog/` may include:

### Layout and chrome

- `Header`
- `Footer`

### Home

- `HeroLeft`
- `Hero`
- `Promotion`
- `OurStory`
- `AboutUs`
- `StoresCards`
- `StoreCard`
- `StoresCarousel`
- `Timeline`
- `RadialTimeline`
- `CateringPromo`
- `HowItWorksCatering`

### Catalog and catering

- `CategoryFilter`
- `ProductGridSection`
- `ProductCard`
- `ProductDetailModal`
- `BoxBuilder`
- `ViewModeToggle`
- `EcommerceModal`

### Cart

- `CartDrawer`

The actual repository remains authoritative. Update this inventory when components are added, removed, or renamed.

## 7. Responsive behavior

The home page uses different timeline experiences by breakpoint:

- `< lg`: `Timeline`
- `lg+`: `RadialTimeline`

Do not assume both components share identical dimensions, animation behavior, or content structure.

When modifying responsive UI:

- Preserve established breakpoints unless the task explicitly changes them.
- Test mobile and desktop implementations independently.
- Avoid desktop-only hover assumptions.
- Preserve appropriate touch targets.
- Ensure content order remains understandable.

## 8. Frontend implementation locations

### Global tokens, animations, and base styles

```text
src/app/(frontend)/styles.css
```

### Per-section implementation

```text
src/components/catalog/
```

### Page composition

```text
src/app/(frontend)/page.tsx
src/app/(frontend)/catering/page.tsx
```

Page composition and order should only change when explicitly requested.

## 9. Interaction rules

Interactive elements should provide clear states:

- Default.
- Hover where supported.
- `focus-visible`.
- Active or pressed.
- Disabled.
- Loading.
- Error.
- Success when relevant.

Do not use hover as the only way to communicate important information.

Avoid `transition: all`.

Prefer subtle changes in transform, opacity, color, background, border, or icon position that do not cause layout shift.

## 10. Accessibility

Frontend work must preserve:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Sufficient contrast.
- Meaningful `alt` text.
- Labeled form controls.
- Clear validation messages.
- Proper modal focus management.
- Appropriate touch targets.
- Reduced-motion behavior.
- Content visibility if JavaScript fails.

Verify contrast particularly for Terra and Celeste over Ivory and for text placed over photography.

## 11. Images

Use `next/image` where appropriate.

Preserve:

- Meaningful `alt` text.
- Intended crop and focal point.
- Aspect ratio.
- Responsive behavior.
- Performance.
- Content priority.

Do not modify image dimensions, source, crop, `object-fit`, or aspect ratio during motion-only tasks unless explicitly requested.

## 12. Motion implementation

For motion-only tasks:

- Follow `.claude/skills/premium-motion/SKILL.md`.
- Audit before implementation.
- Use Motion when the existing dependency is sufficient.
- Use CSS transitions for simple interactions.
- Prefer `transform` and `opacity`.
- Avoid layout-property animation.
- Respect `prefers-reduced-motion`.
- Preserve approved layout, typography, copy, images, and breakpoints.
- Prevent duplicate initialization and stale effects.
- Keep meaningful content visible without animation.

Do not introduce GSAP, ScrollTrigger, Lenis, smooth scrolling, pinning, horizontal scroll, or cursor replacement without explicit approval.

## 13. Known UI/UX observations

### Metadata

Verify that `(frontend)/layout.tsx` uses Socado-specific metadata rather than template copy.

### Dark color-scheme behavior

Review any `prefers-color-scheme: dark` override in `styles.css`.

The brand is light-first with Ivory surfaces. Dark mode should only exist if intentionally designed and tested.

### Accessibility pass

Verify:

- Terra and Celeste contrast.
- Focus states.
- `alt` text.
- Form labels.
- Modal focus.
- Cart and checkout errors.
- Reduced motion.

### Consistency

Repeated spacing, radius, shadow, duration, and easing values should use shared tokens where appropriate.

Do not perform a broad token refactor during an unrelated task.

## 14. Validation checklist

For frontend changes:

- Review desktop.
- Review mobile.
- Review relevant intermediate breakpoints.
- Test keyboard navigation.
- Test focus states.
- Check console errors.
- Check loading, empty, success, and error states.
- Verify no unintended layout shift.
- Verify reduced motion.
- Review the complete `git diff`.
- Confirm only intended components changed.

## 15. Documentation maintenance

Update this document when:

- A frontend token changes.
- A public component is added, removed, or renamed.
- A responsive implementation changes permanently.
- A shared interaction pattern is approved.
- A new frontend accessibility rule is adopted.

Brand decisions belong in `BRAND.md`. Architecture decisions belong in `ARCHITECTURE.md`. Approved motion specifications belong in `motion/MOTION_MAP.md`.