---

name: premium-motion
description: Audits and implements premium website animations while strictly preserving the approved layout, sizing, typography, imagery and content.
argument-hint: "[audit|apply|review] [optional scope]"
disable-model-invocation: true
------------------------------

# Premium Motion Specialist

Improve the website exclusively through animations, transitions, entrance effects, scroll-triggered effects, hover states and microinteractions.

The existing layout, dimensions, typography, content, responsive composition and image presentation are approved and immutable.

Read and follow all motion restrictions in the project's CLAUDE.md before doing any work.

## Determine the operating mode

Interpret `$ARGUMENTS`:

* `audit`: inspect the project and create an animation improvement plan. Do not edit files.
* `apply`: implement the previously approved animation plan.
* `review`: inspect the current animation implementation and report problems without editing.
* If no valid mode is provided, default to `audit`.

Any text after the mode identifies the requested page, route, section or component scope.

# AUDIT MODE

Do not edit any files.

## 1. Inspect the existing system

Identify:

* Framework and rendering architecture.
* Styling system.
* Existing animation libraries.
* Existing scroll libraries.
* Existing transitions and keyframes.
* Shared components.
* Route and component lifecycle.
* Current reduced-motion handling.
* Potential animation cleanup issues.
* Components where animation could alter layout or hydration.

Do not recommend replacing the current framework or styling system.

## 2. Classify opportunities

Review each visible section and classify possible improvements as:

* Page-load entrance.
* Scroll-triggered entrance.
* Scroll-linked movement.
* Text reveal.
* Image reveal.
* Button or link hover.
* Card hover.
* Navigation transition.
* Decorative ambient motion.
* Section transition.
* Reduced-motion alternative.

Only recommend effects that preserve the current geometry.

## 3. Produce a Motion Map

For every recommendation include:

* Page or route.
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
* Technical approach.
* Risk level.

Use a coordinated system rather than assigning unrelated effects to every element.

## 4. Recommend an implementation stack

Follow this decision order:

1. Reuse the animation system already installed.
2. Use CSS transitions for simple microinteractions.
3. Use the existing framework's animation solution for standard entrances.
4. Recommend GSAP and ScrollTrigger only when cinematic sequencing or precise scroll control is justified.
5. Do not install dependencies during audit mode.

End with:

* Proposed animation direction.
* Components to modify.
* Files likely to change.
* Dependencies, if any.
* Performance risks.
* Layout-preservation risks.
* Implementation order.

# APPLY MODE

Only implement a previously approved Motion Map.

## 1. Protect the baseline

Before editing:

* Check git status.
* Inspect the current implementation.
* Confirm the target files.
* Identify existing layout and typography declarations.
* Treat all existing geometry as immutable.
* Do not overwrite unrelated uncommitted work.

Do not proceed with a new dependency unless it was explicitly approved.

## 2. Create shared motion tokens

Reuse or create a small centralized motion configuration for:

* Fast duration.
* Standard duration.
* Slow duration.
* Standard easing.
* Emphasized easing.
* Small entrance distance.
* Standard entrance distance.
* Stagger interval.

Do not duplicate arbitrary duration and easing values across components.

## 3. Implement progressively

Apply changes in this order:

1. Global reduced-motion behavior.
2. Shared motion utilities.
3. Page-load sequence.
4. Section entrances.
5. Text and image reveals.
6. Hover and focus interactions.
7. Scroll-linked effects.
8. Decorative ambient motion.

Prefer:

* `transform`
* `opacity`
* `clip-path`
* animation-specific CSS variables

Avoid:

* `width`
* `height`
* `min-height`
* `max-height`
* `margin`
* `padding`
* `gap`
* `top`
* `right`
* `bottom`
* `left`
* `inset`
* grid or flex properties
* font properties
* image sizing properties
* DOM reordering

Do not use `transition: all`.

Do not introduce smooth scrolling, section pinning, horizontal scroll or cursor replacement unless separately approved.

## 4. Lifecycle and cleanup

Ensure that:

* ScrollTrigger instances are cleaned up.
* React effects return cleanup functions.
* Animations are not initialized twice.
* Route changes do not leave stale triggers.
* Resize behavior does not duplicate timelines.
* Mobile and desktop configurations cleanly revert.
* Hidden tabs or inactive routes do not waste resources.
* Elements remain visible when animations fail.

## 5. Accessibility

Implement a reduced-motion mode that:

* Removes parallax.
* Removes scroll-scrubbed movement.
* Removes large translations and scaling.
* Preserves necessary opacity transitions when appropriate.
* Never leaves content hidden.
* Maintains all interactions and focus states.

## 6. Validate

After implementation:

* Run the build.
* Run lint and type checks when available.
* Run relevant tests.
* Launch or verify the page when project tooling allows it.
* Test desktop and mobile breakpoints.
* Test reduced-motion behavior.
* Check the browser console.
* Inspect animation cleanup.
* Review the complete git diff.

Search the final diff for unauthorized changes to:

* Layout.
* Dimensions.
* Spacing.
* Typography.
* Text.
* Images.
* Responsive breakpoints.
* Component order.

If an unauthorized change is found, revert only that part while preserving the approved animation work.

## 7. Final report

Report:

* Files modified.
* Animation added to each component.
* Shared motion tokens created.
* Dependencies added.
* Build and test results.
* Performance considerations.
* Reduced-motion behavior.
* Confirmation that layout, sizes, typography, text and images were preserved.

# REVIEW MODE

Do not edit files.

Review:

* Visual consistency.
* Animation timing.
* Easing consistency.
* Excessive motion.
* Layout shifts.
* Main-thread work.
* Missing cleanup.
* Duplicate initialization.
* Mobile behavior.
* Reduced-motion behavior.
* Content visibility before hydration.
* Accessibility of hover and focus states.

Return findings ordered by severity and include exact file references.
