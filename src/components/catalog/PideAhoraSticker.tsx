"use client";

import { useEffect, useState } from "react";
import { StickerBolsa } from "@/components/sticker/StickerBolsa";

/**
 * The floating "pide aquí" sticker on the home page.
 *
 * This file is only the placement: the corner it sits in, its size and the
 * moment it arrives. The sticker itself is `<sticker-bolsa>` (Bolsa v2 · B),
 * exported from Claude Design with its tweaks baked in as its own defaults —
 * cromo at 0.75 with glare, tilt 16, float, attention every 6.5 s, entrance,
 * shadow 0.4 and no background — so nothing is passed here but the size.
 */

interface PideAhoraStickerProps {
  onClick: () => void;
  /**
   * The same `revealDelay` the header applies to its own entry, in seconds.
   * The sticker offsets from it so it always lands after the header settles.
   */
  revealDelay?: number;
}

/**
 * How long the header's entry runs once it starts.
 *
 * The header animates with a spring (stiffness 300 / damping 22) plus a
 * separate 0.4s opacity tween. That spring settles in roughly 0.17s, so the
 * opacity tween is what actually gates completion — hence 0.4s. Keep this in
 * sync with the `transition` block in Header.tsx.
 */
const HEADER_ENTRY_DURATION = 0.4;

/**
 * Size of the sticker in the corner: 1 = 300 × 328 px, so 0.34 = 102 × 112 px.
 *
 * Not the 1.4 saved in the design. On the canvas the sticker is the only thing
 * on the artboard and 1.4 just means "big enough to look at"; here it has to
 * share a corner with the page, and at 1.4 it covers 420 × 459 px of it.
 *
 * The number is the one that lands on the footprint the sticker it replaces
 * had, which is what the home page was laid out around: measured off a
 * screenshot of each, the old one drew 123 × 142 px and this one at 0.4 drew
 * 148 × 163, so 0.4 × (123/148) ≈ 0.34. The box is smaller than what is drawn
 * because the artwork is `contain`ed in it and the tilt and shadow reach
 * outside — so set this by what you see, not by the box.
 *
 * Everything else — the foil, the tilt, the timing — is the design's.
 */
const STICKER_SCALE = 0.34;

export function PideAhoraSticker({ onClick, revealDelay = 0 }: PideAhoraStickerProps) {
  const [landed, setLanded] = useState(false);

  /*
    Mounted late rather than hidden and revealed: the element plays its own
    entrance the first time it is seen on screen, so the wait has to happen
    before it exists, not while it sits there invisible.
  */
  useEffect(() => {
    const timer = window.setTimeout(
      () => setLanded(true),
      (revealDelay + HEADER_ENTRY_DURATION) * 1000,
    );

    return () => window.clearTimeout(timer);
  }, [revealDelay]);

  if (!landed) return null;

  return (
    /*
      No padding and no overflow of its own: tilted, and with the shadow, the
      sticker reaches outside its box, and anything clipping here would cut it.
      Below the mobile menu (z-100) and above the page.
    */
    <div className="fixed bottom-6 right-6 z-[90]">
      <StickerBolsa onClick={onClick} scale={STICKER_SCALE} />
    </div>
  );
}

export default PideAhoraSticker;
