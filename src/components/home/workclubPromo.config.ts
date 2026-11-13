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
 * While `showSwitch` is true both are rendered and a small control in the top
 * right corner swaps them, so they can be compared on the real page. Setting it
 * to false leaves `defaultVariant` alone, and then `WorkclubPromo.tsx` and the
 * option that was not chosen can be deleted.
 */
export const workclubPromoConfig = {
  defaultVariant: "a" as "a" | "b",
  showSwitch: true,
  /** Only the overlay option shows it. Empty: the block has no subtitle. */
  subtitle: "",
};
