/**
 * What both designs of the workclub promo block have in common.
 *
 * The two options are presented side by side to choose one, so the copy, the
 * timing and above all the height live here: if they drifted apart, switching
 * between them would move the page or show two different texts.
 *
 * When one of the options is dropped, this file can be folded into the one
 * that survives.
 */

/** The word that changes weight is a separate piece, not markup inside a string. */
export const PROMO_COPY = {
  titleLight: "la oficina a la que",
  titleStrong: "sí quieres ir",
  cta: "conoce socado workclub",
  href: "/workclub",
} as const;

/** Easing of the whole landing. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Same bands as `Reveal`, so every entrance of the block is one movement. */
export const IN_VIEW_MARGIN = { amount: 0.25, margin: "-8% 0px -8% 0px" } as const;

/**
 * Height of the medium in the strips option, which is the one that sets how
 * tall the block is.
 *
 * Height, not a ratio: edge to edge a 21:9 strip would be 750px tall on a wide
 * screen and the block would not fit on one. Tied to the viewport instead, with
 * a ceiling so it does not grow without end and a floor so it never becomes a
 * letterbox.
 */
export const MEDIA_HEIGHT =
  "h-[55vh] sm:h-[60vh] md:h-[70vh] max-h-[760px] min-h-[320px]";

/**
 * Floor for the overlay option, whose contents are absolutely positioned and
 * would otherwise measure nothing.
 *
 * While both options share a grid cell the taller one wins, which is the strips
 * option; this only decides the height if the overlay is ever left alone.
 */
export const PROMO_MIN_HEIGHT = "min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh]";

/**
 * Rail of the site, for the contents of each strip.
 *
 * The backgrounds go edge to edge; the text stays on the same rail as the rest
 * of the page so it is never flush against the screen on a phone.
 */
export const RAIL = "mx-auto w-full max-w-[1400px] px-6 lg:px-12 2xl:px-20";
