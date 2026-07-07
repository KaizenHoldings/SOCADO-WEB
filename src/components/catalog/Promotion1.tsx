"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export function Promotion1() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Drive the text/button (not the image) with scroll so the content rises
  // as the next section covers the pinned image. Image keeps its sticky/overlay.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, reduce ? 1 : 0.1]);

  return (
    // Parent is taller than the viewport (desktop/tablet) to create scroll
    // time for the sticky child. No overflow/transform here so sticky works.
    <section ref={ref} id="promotion1" className="relative h-[82vh] md:h-[200vh]">
      {/* Sticky child: static on mobile, pinned 100vh on tablet/desktop */}
      <div className="relative h-full overflow-hidden md:sticky md:top-0 md:h-screen md:z-0">
        {/* Layer 1 — background image (no parallax / no fixed-attachment) */}
        <Image
          src="/images/loyaltyimage.png"
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover object-right"
        />
        {/* Left legibility gradient */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-azul-socado/85 via-azul-socado/45 to-transparent" />

        {/* Layer 2 — text + button; rises with scroll while the image stays pinned */}
        <div className="section-shell relative z-10 flex h-full items-center">
          <motion.div style={{ y, opacity }} className="max-w-xl text-ivory">
            <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              mantente cerca
              <span className="block">de socado</span>
            </h2>
            <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg">
              Recibe beneficios exclusivos, sólo para miembros.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center rounded-full bg-ivory px-7 py-3 font-outfit text-sm font-semibold text-azul-socado transition-colors duration-300 hover:bg-terra hover:text-white"
            >
              regístrate
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
