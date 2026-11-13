"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ImageOrVideo } from "@/components/media/ImageOrVideo";
import { hero, heroMedia } from "../data";
import { ReservaButton } from "./ReservaButton";
import { useMounted } from "./useMounted";

/**
 * Full-viewport hero for /workclub.
 *
 * Follows the `/nosotros` pattern — full-bleed medium, gradient at the bottom,
 * copy anchored bottom-left. The medium itself is `ImageOrVideo`, shared with
 * the promo block on the home page, so replacing the render with a photograph
 * or with the experience video is an edit to `heroMedia` in `data.ts` only.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // The copy is in the server markup at full opacity; see `useMounted`.
  const mounted = useMounted();

  /** Entrance: fade in while a soft blur clears. Suppressed under reduced motion. */
  const reveal = (delay: number) =>
    prefersReducedMotion || !mounted
      ? // Visible with no animation: before hydration, and under reduced motion.
        {
          initial: false as const,
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.3, delay: 0 },
        }
      : {
          initial: { opacity: 0, y: 20, filter: "blur(12px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            duration: 0.9,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    /*
      Pinned: the hero holds the top of the viewport while the panel below
      scrolls up over it, like a curtain. Under reduced motion it goes back to
      being a normal section that simply scrolls away.
    */
    <section className="sticky top-0 z-0 h-dvh w-full overflow-hidden motion-reduce:static">
      {/* Medium: a still or the video, decided by `heroMedia` */}
      <ImageOrVideo
        media={heroMedia}
        sizes="100vw"
        priority
        playback="auto"
        preload="metadata"
      />

      {/* Neutral gradient: enough to read the copy, without tinting the photo */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
        aria-hidden="true"
      />

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-0 pb-16">
        <div className="section-shell flex flex-col items-start">
          <motion.p
            {...reveal(0)}
            className="mb-3 font-outfit text-[11px] tracking-[0.25em] text-white/60 lowercase"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...reveal(0.1)}
            className="font-raleway text-5xl font-light leading-none tracking-tight text-white lowercase md:text-7xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            {...reveal(0.2)}
            className="mt-4 max-w-xl font-raleway text-lg font-light text-white/80 lowercase md:text-xl"
          >
            {hero.tagline}
          </motion.p>

          <motion.div
            {...reveal(0.3)}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <ReservaButton variant="onDark">{hero.primaryCta}</ReservaButton>

            <a
              href="#paquetes"
              className="group inline-flex items-center gap-2 rounded-full px-1 py-1 font-raleway text-[15px] font-light text-white/80 lowercase transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {hero.secondaryCta}
              <ArrowDown
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
