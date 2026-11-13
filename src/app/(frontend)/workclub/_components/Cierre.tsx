"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cierre, heroMedia } from "../data";
import { Reveal } from "./Reveal";
import { ReservaButton } from "./ReservaButton";

/**
 * Closing CTA: a photograph that starts inset inside the rail and grows to the
 * full width of the viewport as the section scrolls into place, with the final
 * booking prompt on top.
 *
 * The growth is a `clip-path` interpolation, so nothing about the element's box
 * changes — no layout is animated and the copy on top never reflows.
 *
 * TODO: give this block its own photograph; it currently reuses the hero still
 * because it is the only workclub asset available.
 */

const CLIP_INSET = "inset(0% 6% round 24px)";
const CLIP_FULL = "inset(0% 0% round 0px)";

export function Cierre() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [CLIP_INSET, CLIP_FULL],
  );

  const still = heroMedia.type === "image" ? heroMedia.src : heroMedia.poster;

  return (
    <section
      ref={sectionRef}
      className="relative z-20 bg-white  pt-20"
    >
      <motion.div
        // Reduced motion: no scroll-driven growth, just the full-bleed frame.
        style={prefersReducedMotion ? undefined : { clipPath }}
        className="relative h-[70vh] min-h-[420px] w-full overflow-hidden"
      >
        <Image
          src={still}
          alt={heroMedia.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10"
          aria-hidden="true"
        />

        <Reveal className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="max-w-2xl font-raleway text-3xl font-light leading-tight tracking-tight text-white lowercase md:text-5xl">
            {cierre.title}
          </h2>
          <p className="max-w-xl font-outfit text-base font-light leading-relaxed text-white/75 lowercase">
            {cierre.description}
          </p>
          <ReservaButton variant="onDark">{cierre.cta}</ReservaButton>
        </Reveal>
      </motion.div>
    </section>
  );
}

export default Cierre;
