"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export function HeroLeft() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[120vh] bg-black">
      <div className="sticky top-0 flex h-screen w-full items-end pb-24 overflow-hidden">
        {/* Video Background */}
        <motion.div 
          style={{ scale, filter: blur, opacity }}
          className="absolute inset-0 h-full w-full origin-center"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/inicioHero.mp4" type="video/webm" />
          </video>
        </motion.div>

        {/* Overlay asimétrico (gradiente) desde la esquina inferior izquierda */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/30 to-transparent pointer-events-none" />

        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="max-w-2xl text-left">
            <h1 className="font-raleway text-5xl font-bold tracking-tighter text-ivory sm:text-7xl md:text-6xl leading-none drop-shadow-lg">
              Social Café<div className=""> Conectados.</div>
            </h1>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
