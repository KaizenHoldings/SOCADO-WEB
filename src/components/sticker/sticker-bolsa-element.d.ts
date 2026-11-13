import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * Types for `<sticker-bolsa>`, the custom element defined in
 * `sticker-bolsa.js` (the file exported from Claude Design, kept verbatim).
 *
 * Separate from `sticker-bolsa.d.ts`, which is paired with the .js and says
 * only that it is a module: what is declared here is the element the script
 * registers, not the script.
 */

/** The eight foils the component ships with. */
export type StickerBolsaHolo =
  | "aurora"
  | "arcoiris"
  | "prisma"
  | "disco"
  | "destellos"
  | "nacar"
  | "cromo"
  | "oro";

export interface StickerBolsaElement extends HTMLElement {
  /** Fires the click sheen from code. */
  flash(): void;
}

/**
 * Every attribute is optional: left out, the element uses the values saved in
 * the design (cromo, 0.75, tilt 16, 6.5 s, shadow 0.4, scale 1.4).
 *
 * Numbers and booleans are typed as strings as well because React writes a
 * primitive prop to a custom element as an attribute, and the element parses
 * every attribute as text.
 */
interface StickerBolsaAttributes
  extends DetailedHTMLProps<
    HTMLAttributes<StickerBolsaElement>,
    StickerBolsaElement
  > {
  holo?: StickerBolsaHolo;
  intensity?: number | string;
  glare?: boolean | string;
  tilt?: number | string;
  float?: boolean | string;
  attention?: boolean | string;
  "attention-interval"?: number | string;
  entrance?: boolean | string;
  "shadow-opacity"?: number | string;
  scale?: number | string;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sticker-bolsa": StickerBolsaAttributes;
    }
  }
}
