# Socado Web — Motion Map

This document is the source of truth for the approved motion system and section-level animation decisions for the Socado public website.

Use it together with:

- `CLAUDE.md`
- `docs/BRAND.md`
- `docs/UI_UX.md`
- `.claude/skills/premium-motion/SKILL.md`

Do not record an animation as approved until it has been reviewed and accepted.

---

## 1. Status

- **Current status:** Audit 001 complete — recommendations Proposed, awaiting approval
- **Implementation status:** Not started (no code changes made)
- **Last reviewed:** 2026-07-14
- **Approved by:** Pending user approval

Audit 001 (read-only) has been completed and its recommendations are recorded below as **Proposed**. No animation has been implemented yet. Each entry must be individually approved before implementation. Provisional tokens are now proposed as confirmed values (Section 10).

---

## 2. Objective

Improve perceived quality through:

- Refined entrances
- Clear visual hierarchy
- Smooth transitions
- Subtle hover feedback
- Controlled scroll-triggered effects
- Cohesive section continuity
- Accessible reduced-motion alternatives

Motion must enhance the approved design without redesigning or restructuring it.

---

## 3. Motion direction

Motion should feel:

- Premium
- Contemporary
- Elegant
- Warm
- Controlled
- Editorial
- Natural
- Cohesive
- Subtle rather than exaggerated

Motion should not feel aggressive, childish, distracting, over-designed, inconsistent, or technically impressive at the expense of usability.

---

## 4. Immutable design constraints

Motion implementation must not modify:

- Section or container dimensions
- Margins, padding, or gaps
- Grid or flex configuration
- Alignment or position
- Responsive breakpoints
- Typography
- Text content or approved line breaks
- Image dimensions, source, crop, aspect ratio, or `object-fit`
- DOM order or component hierarchy
- Navigation structure
- Existing sticky or scroll behavior unless separately approved

Do not redesign, resize, restructure, rewrite, or reposition components during motion-only work.

---

## 5. Permitted motion properties

Prefer:

- `transform`
- `opacity`
- `clip-path`
- Masks that do not affect layout
- `transform-origin`
- Transition and animation timing
- Hover, `focus-visible`, and active states
- Animation-specific CSS variables
- Motion values and viewport triggers
- Minimal overflow handling required for approved reveals

Do not animate layout properties such as width, height, margin, padding, gap, position offsets, grid, flex, font, or image sizing properties.

Never use:

```css
transition: all;
```

---

## 6. Technology policy

The project currently uses Motion.

Implementation priority:

1. CSS transitions for simple hover, focus, and active states
2. Existing Motion utilities for entrances and viewport triggers
3. Shared local utilities before adding dependencies
4. A new animation library only when the approved effect cannot be implemented safely with the existing stack

Do not introduce without explicit approval:

- GSAP
- ScrollTrigger
- Lenis
- Another general animation library
- Smooth scrolling
- Cursor replacement
- Horizontal scrolling
- Section pinning

---

## 7. Prohibited patterns

Avoid:

- Strong parallax
- Large scale changes
- Aggressive bouncing
- Excessive blur
- Repeated character-by-character animation
- Unnecessary rotation
- Long delays before content becomes readable
- Motion that blocks interaction
- Motion that hides essential content before JavaScript initializes
- Continuous decorative motion without purpose
- Different motion languages for each section
- Logo animation that distorts official brand elements

---

## 8. Reduced motion

Always respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

- Remove parallax
- Remove scroll-scrubbed movement
- Remove large translations
- Remove unnecessary scaling
- Remove decorative loops
- Keep all meaningful content visible
- Preserve navigation, interaction, and focus states
- Never leave content at `opacity: 0`

---

## 9. Lifecycle and performance

All motion implementation must:

- Avoid duplicate initialization
- Support React Strict Mode
- Clean up effects and observers
- Cancel animation frames when necessary
- Remove event listeners
- Prevent stale instances after route changes
- Prevent resize events from duplicating effects
- Avoid continuous work for hidden elements
- Avoid unnecessary layout measurement
- Avoid layout shift
- Keep content visible before hydration
- Preserve acceptable mobile performance

---

## 10. Provisional shared tokens

Audit 001 confirms these values (they already match existing usage, e.g. the Hero's `[0.22, 1, 0.36, 1]` ease and `0.12s` stagger). Status is **Proposed** — implement only after approval, exposed as both CSS custom properties in `styles.css` and a shared TS constant module (`src/lib/motion/tokens.ts`).

### Durations

| Token | Value | Use | Status |
|---|---:|---|---|
| `motion-duration-fast` | `180ms` | Hover and active feedback | Proposed |
| `motion-duration-standard` | `450ms` | Standard transitions | Proposed |
| `motion-duration-entrance` | `700ms` | Content entrances | Proposed |
| `motion-duration-emphasis` | `900ms` | Selected editorial moments | Proposed |

### Easings

| Token | Value | Use | Status |
|---|---|---|---|
| `motion-ease-standard` | `[0.22, 1, 0.36, 1]` | Premium entrance | Proposed |
| `motion-ease-soft` | `[0.25, 0.1, 0.25, 1]` | Subtle transitions | Proposed |
| `motion-ease-exit` | `[0.4, 0, 1, 1]` | Controlled exits | Proposed |

### Distances

| Token | Value | Use | Status |
|---|---:|---|---|
| `motion-distance-small` | `12px` | Labels and compact UI | Proposed |
| `motion-distance-standard` | `24px` | Standard entrances | Proposed |
| `motion-distance-emphasis` | `36px` | Selected editorial entrances | Proposed |

### Staggers

| Token | Value | Use | Status |
|---|---:|---|---|
| `motion-stagger-tight` | `0.05s` | Compact groups | Proposed |
| `motion-stagger-standard` | `0.08s` | Text and cards | Proposed |
| `motion-stagger-editorial` | `0.12s` | High-hierarchy sequences | Proposed |

Do not implement these values until each consuming entry is approved.

---

## 11. Global motion decisions

| Area | Decision | Implementation | Desktop | Mobile | Reduced motion | Status |
|---|---|---|---|---|---|---|
| Initial page load | Keep existing hero sequence (Header spring reveal + headline stagger); align raw values to tokens | `HeroLeft` + `Header` (existing) | Full | Full | Honored (already) | Proposed (G4) |
| Header and navigation | Keep spring reveal; standardize nav/footer link underline system + `focus-visible` | CSS + existing Motion | Full | Full | Underline without sweep | Proposed (HF4) |
| Section entrances | Shared `Reveal` primitive: `translateY` + opacity, `whileInView once` | new `Reveal.tsx` | Full, distance `standard` | Distance `small`, −20% duration | Opacity-only / instant | Proposed (G3) |
| Text reveals | Heading emphasis (`0.9s`) → copy standard (`0.7s`), stagger `standard` | `Reveal` variants | Full | Reduced distance | Opacity only | Proposed (G3, H1–H4, C1–C7) |
| Image reveals | `scale(1.06→1)` or `clip-path` inset, wrapper transform only | Motion / CSS | Full | Drop scale, opacity+translate | Opacity only | Proposed (H1–H3, C3) |
| Button interactions | Narrow `transition-all` → explicit props; add `focus-visible` parity | `ButtonDark/Light` | Full | Full | Drop lift/scale, keep color/underline | Proposed (HF1) |
| Link interactions | Origin-left `scaleX` underline; `focus-visible` underline | CSS | Full | Full | No sweep | Proposed (HF4) |
| Card interactions | Keep hover scale + image cycle; narrow transitions; grid stagger entrance | `ProductCard`, `StoreCard`, grid | Full | Cap stagger | No scale, no auto-cycle | Proposed (C5, HF2, R1) |
| Decorative motion | Keep timelines/hint loops; gate under reduced motion | existing | Full | Full | Disabled | Proposed (R1) |
| Route transitions | None proposed (native navigation retained) | n/a | n/a | n/a | n/a | Out of scope |

---

## 12. Motion entry template

Copy this block for every recommendation.

### Motion ID

`MOTION-000`

### Route

`/`

### Component

`ComponentName`

### File

`src/path/to/ComponentName.tsx`

### Target

Describe the exact element.

### Purpose

Explain whether the motion improves hierarchy, orientation, feedback, continuity, emphasis, or comprehension.

### Trigger

Examples:

- Page load
- Viewport entry
- Hover
- Keyboard focus
- Press
- State change
- Modal or drawer open/close

### Initial state

```text
opacity: 0
transform: translateY(24px)
```

### Final state

```text
opacity: 1
transform: translateY(0)
```

### Timing

- Duration:
- Delay:
- Stagger:
- Easing:

### Desktop behavior

Describe the approved effect.

### Mobile behavior

Describe whether the effect is preserved, simplified, or disabled.

### Reduced-motion behavior

Describe the accessible alternative.

### Technical implementation

Specify CSS transition, Motion variant, `whileInView`, `useInView`, `useScroll`, shared utility, or another approved mechanism.

### Cleanup and lifecycle

Document cleanup and duplication safeguards.

### Performance notes

Document likely impact and mitigation.

### Layout-preservation notes

Explain why geometry is unchanged.

### Expected modified files

List exact files.

### Risk level

- Low
- Medium
- High

### Approval status

- Proposed
- Approved
- Implemented
- Verified
- Rejected
- Superseded

### Validation evidence

- Build:
- Tests:
- Desktop:
- Mobile:
- Reduced motion:
- Console:
- Git diff:

---

## 13. Page inventory

| Route | Page | Main components | Audit status | Implementation status |
|---|---|---|---|---|
| `/` | Home | `Header`, `HeroLeft`, `LoyaltyCard`/`LoyaltyProgramCards`, `SocadoClub`, `StoresCards`/`StoreCard`, `OurStory`, `Timeline` (`<lg`), `RadialTimeline` (`lg+`), `CateringPromo2`, `Footer` | Audited (001) | Not started |
| `/catering` | Catering | `Header`, catering hero, `HowItWorksCatering`, mode-selection, `ViewModeToggle`, `CategoryFilter`, `ProductGridSection`/`ProductCard`, `BoxBuilder`, `ProductVariationsDrawer`, `CartDrawer`, `Footer` | Audited (001) | Not started |
| `/catering/checkout` | Checkout | `Header`, quote form, `LocationPicker`, summary, success/empty/error states, `CartDrawer`, `Footer` | Audited (001) | Not started |
| `/sticker-demo` | Demo (not in nav) | `InteractiveStickerCard` | Excluded | Not started |

Payload administrative routes are excluded unless explicitly requested.

Already-animated components (keep, token-align only): `HeroLeft`, `Header`, `StoresCards`, `OurStory`, `Timeline`, `RadialTimeline`, `StoreCard`, `ProductCard`, `ButtonPlus`, `EcommerceModal`, `PopupStores`.

---

## 14. Home page scope

No effects are approved yet.

Audit at minimum:

- Header
- Hero
- Promotions
- Story or About sections
- Store cards or carousel
- Mobile timeline
- Desktop radial timeline
- Catering promotion
- Footer

---

## 15. Catering scope

No effects are approved yet.

Audit at minimum:

- Catering introduction
- Mode selection
- Category filters
- Product grid
- Product cards
- Product detail modal
- “Arma tu box”
- Cart drawer
- Quote form
- Loading, success, and error states

Motion must not interfere with selection, validation, quantities, or submission.

---

## 16. Hover and focus system

No interaction system is approved yet.

The audit should define a consistent pattern for:

- Primary and secondary buttons
- Text and navigation links
- Product and store cards
- Icon buttons
- Quantity controls
- Modal and drawer controls

Hover behavior must have a compatible `focus-visible` treatment.

Do not rely on hover for essential information.

---

## 17. Validation checklist

Before marking a motion entry as verified, confirm:

### Scope

- Only approved files changed
- No unrelated refactor occurred
- No dependency was added without approval

### Layout preservation

- Dimensions and spacing are unchanged
- Grid and flex behavior are unchanged
- Typography and text are unchanged
- Images and crops are unchanged
- Breakpoints are unchanged
- DOM order and hierarchy are unchanged

### Behavior

- Desktop and mobile behavior are correct
- Keyboard interaction is correct
- Focus states remain visible
- Reduced motion is correct
- Content remains visible before and after hydration
- No interaction is blocked

### Technical quality

- Effects are cleaned up
- No duplicate initialization occurs
- No new console errors appear
- No relevant performance regression is observed
- Build and relevant tests succeed
- The complete `git diff` was reviewed

---

## 18. Audit record

### Audit 001

- **Date:** Pending
- **Scope:** Entire public website
- **Executed by:** Pending
- **Skill:** `.claude/skills/premium-motion/SKILL.md`
- **Result:** Pending
- **Approved recommendations:** None
- **Rejected recommendations:** None
- **Dependencies proposed:** None
- **Dependencies approved:** None
- **Notes:** Run the read-only audit before adding section-level decisions.

---

## 19. Change log

| Date | Change | Author | Approval |
|---|---|---|---|
| Pending | Initial motion governance template created | Pending | Pending |

---

## 20. Maintenance rule

Update this document when:

- A motion recommendation is approved or rejected
- A token is approved or changed
- A section animation is implemented
- Validation is completed
- A decision is superseded
- A new public route enters the motion scope

Do not record speculative effects as approved.

The implementation and this document must remain synchronized.
