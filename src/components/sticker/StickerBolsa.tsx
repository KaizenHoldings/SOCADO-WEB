"use client";

import { useEffect, useRef, useState } from "react";
import type { StickerBolsaElement, StickerBolsaHolo } from "./sticker-bolsa-element";

/**
 * React wrapper for `<sticker-bolsa>`, the holographic "pide aquí" sticker
 * exported from Claude Design.
 *
 * `sticker-bolsa.js` is the design's own build, kept byte for byte: it is a
 * self-contained custom element with the artwork embedded, and the values it
 * falls back to are the tweaks chosen on the canvas — cromo at 0.75 with
 * glare, tilt 16, float and attention every 6.5 s, entrance on, shadow 0.4,
 * scale 1.4 and no background of its own.
 *
 * So every prop here is optional and nothing is written unless it is passed:
 * with no props the sticker is exactly the one in the design.
 *
 * The element is loaded on demand and only mounted once it is defined. It is
 * 52 KB of embedded artwork for a decorative call to action, which has no
 * business in the page's first bundle, and a custom element that reaches the
 * DOM before it is defined is an empty box until it upgrades.
 */

export interface StickerBolsaProps {
  /** Click of the sticker. Leave it out when `href` is set. */
  onClick?: () => void;
  /** Turns the sticker into a link instead of a button. */
  href?: string;
  target?: string;
  rel?: string;
  /** Accessible name. The design's is "Pide aquí". */
  label?: string;
  /** 1 = 300 × 328 px. The design's is 1.4 (420 × 459 px). */
  scale?: number;
  holo?: StickerBolsaHolo;
  /** 0 – 1.5 */
  intensity?: number;
  glare?: boolean;
  /** 0 – 24 degrees */
  tilt?: number;
  float?: boolean;
  attention?: boolean;
  /** 3 – 60 seconds */
  attentionInterval?: number;
  entrance?: boolean;
  /** 0 – 1 */
  shadowOpacity?: number;
}

/** An attribute is only written when a value was passed for it. */
function attr(value: number | boolean | string | undefined) {
  return value === undefined ? undefined : String(value);
}

export function StickerBolsa({
  onClick,
  href,
  target,
  rel,
  label,
  scale,
  holo,
  intensity,
  glare,
  tilt,
  float,
  attention,
  attentionInterval,
  entrance,
  shadowOpacity,
}: StickerBolsaProps) {
  const ref = useRef<StickerBolsaElement>(null);
  const [defined, setDefined] = useState(false);

  useEffect(() => {
    let live = true;

    // Registers itself, once per page, and does nothing on the server.
    import("./sticker-bolsa.js")
      .then(() => {
        if (live) setDefined(true);
      })
      .catch(() => {
        // The sticker simply does not appear; the header's own links remain.
      });

    return () => {
      live = false;
    };
  }, []);

  /*
    The click is wired to the element itself rather than through React. The
    button lives inside a shadow root, so what reaches this host is a retargeted
    composed event — listening here is what the element documents, and it does
    not depend on how React delegates events for custom elements.
  */
  useEffect(() => {
    const element = ref.current;
    if (!element || !onClick) return;

    const handle = () => onClick();
    element.addEventListener("click", handle);

    return () => element.removeEventListener("click", handle);
  }, [defined, onClick]);

  if (!defined) return null;

  return (
    <sticker-bolsa
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      label={label}
      scale={attr(scale)}
      holo={holo}
      intensity={attr(intensity)}
      glare={attr(glare)}
      tilt={attr(tilt)}
      float={attr(float)}
      attention={attr(attention)}
      attention-interval={attr(attentionInterval)}
      entrance={attr(entrance)}
      shadow-opacity={attr(shadowOpacity)}
    />
  );
}

export default StickerBolsa;
