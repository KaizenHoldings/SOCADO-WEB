import type { MediaConfig } from "@/components/media/ImageOrVideo";

/**
 * Medium of the workclub promo block on the home page.
 *
 * It is the only thing to edit when the short video of the space arrives:
 *
 *   export const workclubPromoMedia: MediaConfig = {
 *     type: "video",
 *     src: "/videos/workclub/promo-workclub.mp4",
 *     poster: "/images/cowork/workclub-hero.webp",
 *     alt: "espacio de socado workclub",
 *   };
 *
 * The block then plays it only while it is on screen, and shows the poster
 * under reduced motion or on a metered connection.
 *
 * TODO: crop for narrow viewports (`mobileSrc`). The render available today is
 * landscape, so the strip keeps its wide ratio on the phone; with a vertical
 * crop it can go to `aspect-[4/5]` (see `MEDIA_ASPECT` in `WorkclubPromo`).
 */
export const workclubPromoMedia: MediaConfig = {
  type: "image",
  src: "/images/cowork/workclub-hero.webp",
  alt: "espacio de socado workclub",
};

/**
 * Which design of the block is on the page.
 *
 * - `a`, strips: a title band, the medium, and a band that is the link.
 * - `b`, overlay: the medium full bleed with the words and a pill on top.
 *
 * The overlay is the one chosen, and the switch is off: the block is that
 * option on its own, with no comparison control and nothing read from the URL
 * or from storage, so a visitor who tried `a` while it was open is not left
 * with it.
 *
 * Alone on the page it no longer borrows the strips' height — `PROMO_MIN_HEIGHT`
 * is what decides it, which is what that floor was there for.
 *
 * `WorkclubPromoBands.tsx` and the `WorkclubPromo.tsx` switch are now dead
 * weight; turning `showSwitch` back on is all it takes to compare them again,
 * so they are kept until the decision has been seen on the real page.
 */
export const workclubPromoConfig = {
  defaultVariant: "b" as "a" | "b",
  showSwitch: false,
  /** Only the overlay option shows it. Empty: the block has no subtitle. */
  subtitle: "",
};
