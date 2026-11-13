"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ImageOrVideo } from "@/components/media/ImageOrVideo";
import { Reveal } from "@/components/motion/Reveal";
import { useMounted } from "@/components/motion/useMounted";
import { workclubPromoMedia } from "./workclubPromo.config";
import {
  EASE,
  IN_VIEW_MARGIN,
  MEDIA_HEIGHT,
  PROMO_COPY,
  RAIL,
} from "./workclubPromo.shared";

/**
 * Workclub promoted on the home page, option A: three strips.
 *
 * A title band, the space, and a door — with no seam between them, so the
 * block reads as one object. The whole lower strip is the link, which is why it
 * is as tall as the title and not a button inside it.
 *
 * This is the only part of the home page in the workclub palette. The rest of
 * the page keeps azul socado, and that contrast is the point: the block should
 * read as another place.
 */

const TITLE_ID = "workclub-promo-title";

export function WorkclubPromoBands() {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  /*
    The entrance of the medium is its own: `Reveal` moves and fades, and here
    the image has to settle out of a slight zoom. Its timing, easing and exit
    are the ones `Reveal` uses, so both entrances read as one movement.
  */
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInView = useInView(mediaRef, IN_VIEW_MARGIN);

  /** Before hydration nothing is hidden, so the block survives without JS. */
  const settled = !mounted || mediaInView;

  return (
    /*
      Full bleed, and with no padding of its own on any side: the title strip
      meets the hero and the cta strip meets the next section, with no white
      band between them. `main` on the home page sets no width or inset, so
      `w-full` is all it takes — no `w-screen` and no negative margin, which
      would risk a horizontal scrollbar.
    */
    <section aria-labelledby={TITLE_ID} className="w-full">
      {/* `group/promo`: hovering or focusing anywhere in the block lifts the medium */}
      <div className="group/promo">
          {/*
            The band is painted from the first frame and never moves. An
            animated strip slides or fades off its own place and the page shows
            through where it should be, which reads as a block still loading —
            so what animates is the heading, and the band clips it while it
            travels. At rest nothing is cropped.
          */}
          <div className="overflow-hidden bg-wc-verde py-5 md:py-7">
            <Reveal distance={14}>
              <h2
                id={TITLE_ID}
                className={`${RAIL} text-center font-raleway text-2xl text-white lowercase md:text-4xl`}
              >
                <span className="font-light">{PROMO_COPY.titleLight}</span>{" "}
                <span className="font-semibold">{PROMO_COPY.titleStrong}</span>
              </h2>
            </Reveal>
          </div>

          {/*
            Three layers on purpose: the strip clips, the inner layer carries
            the entrance and the next one the hover. Two transforms on the same
            element would fight — the inline one Motion writes always wins.
          */}
          <div
            ref={mediaRef}
            className={`relative overflow-hidden ${MEDIA_HEIGHT}`}
          >
            <motion.div
              className="absolute inset-0"
              // No `initial`, and no opacity in play: the medium is painted
              // from the first frame, so its box is never an empty rectangle.
              // The entrance is the zoom settling, nothing else.
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
              <div className="absolute inset-0 transition-transform duration-[400ms] ease-out motion-safe:group-hover/promo:scale-[1.03] motion-safe:group-focus-within/promo:scale-[1.03]">
                <ImageOrVideo
                  media={workclubPromoMedia}
                  // The block is below the fold, so no `priority`.
                  // Edge to edge: the medium is as wide as the viewport.
                  sizes="100vw"
                  playback="inView"
                  preload="none"
                />
              </div>
            </motion.div>
          </div>

          {/*
            The strip is the link: a whole band is an easier target than a
            button, and the label says where it goes on its own.

            No entrance animation, on purpose: it is the way out of the block
            and it stays put, so it is never mid-fade when someone goes to
            click it. Hover and focus still answer.
          */}
          <Link
            href={PROMO_COPY.href}
            className="group/cta block bg-wc-verde py-5 transition-colors duration-300 hover:bg-wc-verde-medio focus-visible:bg-wc-verde-medio focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white md:py-7"
          >
            {/* The band is the target; its contents keep the site's rail. */}
            <span className={`${RAIL} flex items-center justify-center gap-3`}>
              <span className="font-raleway text-xl font-semibold text-white lowercase md:text-3xl">
                {PROMO_COPY.cta}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-white transition-transform duration-300 group-hover/cta:translate-x-[6px] group-focus-visible/cta:translate-x-[6px] motion-reduce:transition-none md:h-8 md:w-8"
              />
            </span>
          </Link>
      </div>
    </section>
  );
}

export default WorkclubPromoBands;
