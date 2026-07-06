"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";

export function HeroLeft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll-driven cinematic parallax (kept from original behavior)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Refined staggered intro for the headline lines.
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: reduce ? 0 : 0.55,
      },
    },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 44 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="inicio" ref={containerRef} className="relative h-[120vh] bg-black">
      <div className="sticky top-0 flex h-dvh w-full items-end overflow-hidden">
        {/* Video — scroll-driven parallax wrapper */}
        <motion.div
          style={{ scale, filter: blur, opacity }}
          className="absolute inset-0 h-full w-full origin-center"
        >
          {/* Intro "settle" wrapper (separate element so it doesn't fight the scroll transforms) */}
          <motion.div
            initial={{ scale: reduce ? 1 : 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0.4 : 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/videos/people.webm" type="video/webm" />
            </video>
          </motion.div>
        </motion.div>

        {/* Editorial overlays for legibility & cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

        {/* Headline — anchored bottom-left, left-aligned (existing copy only) */}
        <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-10 w-full">
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="section-shell hero-title pb-12 text-ivory drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)] sm:pb-16 lg:pb-20"
          >
            <motion.span variants={line} className="block">
              Social. Café.
            </motion.span>
            <motion.span variants={line} className="block">
              Conectado.
            </motion.span>
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
