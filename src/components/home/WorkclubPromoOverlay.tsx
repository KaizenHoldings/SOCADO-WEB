"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ImageOrVideo } from "@/components/media/ImageOrVideo";
import { useMounted } from "@/components/motion/useMounted";
import { workclubPromoConfig, workclubPromoMedia } from "./workclubPromo.config";
import {
  EASE,
  IN_VIEW_MARGIN,
  PROMO_COPY,
  PROMO_MIN_HEIGHT,
} from "./workclubPromo.shared";

/**
 * Workclub promoted on the home page, option B: the space, with the words on it.
 *
 * Built like the closing block of /workclub: a full-bleed photograph, a neutral
 * gradient — dark, never tinted, so the space keeps its own colour — and the
 * invitation centred on top.
 *
 * The medium and the gradient are painted from the first frame; only the words
 * animate. An image that fades in leaves its own box empty while it does, and
 * at this size that reads as a page still loading.
 */

const TITLE_ID = "workclub-promo-overlay-title";

export function WorkclubPromoOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, IN_VIEW_MARGIN);

  /** Before hydration nothing is hidden, so the block survives without JS. */
  const settled = !mounted || inView;

  /**
   * Entrance of a line of copy: rises and fades, replayed on every re-entry.
   *
   * No `initial`, so the server markup carries no opacity and the words are
   * readable before hydration and if JavaScript never runs.
   */
  const rise = (delay: number) =>
    prefersReducedMotion
      ? {
          initial: false as const,
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: false as const,
          animate: settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: settled
            ? { duration: 0.7, delay, ease: EASE }
            : { duration: 0.4, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={TITLE_ID}
      className={`relative w-full overflow-hidden ${PROMO_MIN_HEIGHT}`}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={
          prefersReducedMotion || settled ? { scale: 1 } : { scale: 1.06 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : settled
              ? { duration: 0.9, ease: EASE }
              : { duration: 0.4, ease: EASE }
        }
      >
        <ImageOrVideo
          media={workclubPromoMedia}
          // Below the fold, and as wide as the viewport.
          sizes="100vw"
          playback="inView"
          preload="none"
        />
      </motion.div>

      {/* Neutral: enough to read the copy, without tinting the photograph */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/35 to-black/25"
        aria-hidden="true"
      />

      {/* Absolute, so the copy never adds to the height the block shares */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.h2
          {...rise(0)}
          id={TITLE_ID}
          className="max-w-4xl font-raleway text-4xl leading-tight tracking-tight text-white lowercase md:text-6xl"
        >
          <span className="font-light">{PROMO_COPY.titleLight}</span>{" "}
          <span className="font-semibold">{PROMO_COPY.titleStrong}</span>
        </motion.h2>

        {workclubPromoConfig.subtitle && (
          <motion.p
            {...rise(0.1)}
            className="mt-4 max-w-xl font-outfit text-base font-light leading-relaxed text-white/80 lowercase"
          >
            {workclubPromoConfig.subtitle}
          </motion.p>
        )}

        <motion.div {...rise(0.15)} className="mt-8">
          {/*
            Rectangular, with the corner taken off: `rounded-lg` is 8px on a
            48px button, enough to read as a rectangle without the hard edge.

            Filled white rather than the outline the other home ctas use —
            an outline in azul socado has nothing to sit against on a
            photograph. The size is theirs: the same `px-8 py-3`.
          */}
          <Link
            href={PROMO_COPY.href}
            className="group/cta inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-raleway text-base font-semibold text-wc-verde lowercase transition-colors duration-300 hover:bg-wc-verde-claro focus-visible:bg-wc-verde-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-lg"
          >
            {PROMO_COPY.cta}
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default WorkclubPromoOverlay;
