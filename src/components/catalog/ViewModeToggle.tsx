"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

interface ViewModeToggleProps {
  viewMode: "libre" | "box";
  onChange: (mode: "libre" | "box") => void;
  selectedBoxName?: string;
  /**
   * True while the sticky category bar is showing. The toggle gives back ~20%
   * of its height so the docked stack does not eat the viewport.
   */
  compact?: boolean;
}

/** Resting heights, matching the `h-24 md:h-28` classes kept as SSR fallback. */
const HEIGHT_FULL = { base: 96, md: 112 };
/** 20% shorter: 96→76.8 and 112→89.6, rounded to whole pixels. */
const HEIGHT_COMPACT = { base: 77, md: 90 };

const MD_BREAKPOINT = "(min-width: 768px)";

/** Tracks the `md` breakpoint so the animated height can follow it. */
function useIsMdUp(): boolean {
  const [isMdUp, setIsMdUp] = useState(false);

  // Layout effect so the first painted frame already has the right height.
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia(MD_BREAKPOINT);
    setIsMdUp(query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMdUp(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isMdUp;
}

export function ViewModeToggle({ viewMode, onChange, selectedBoxName, compact = false }: ViewModeToggleProps) {
  const isMdUp = useIsMdUp();
  const prefersReducedMotion = useReducedMotion();

  const heights = compact ? HEIGHT_COMPACT : HEIGHT_FULL;
  const targetHeight = isMdUp ? heights.md : heights.base;

  return (
    <motion.div
      // `initial={false}` keeps the first render at the resting height instead
      // of animating in from nothing on mount.
      initial={false}
      animate={{ height: targetHeight }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="relative w-full h-24 md:h-28 overflow-hidden bg-white flex"
    >
      {/* Left side: Individuales (Image Background) */}
      <div 
        onClick={() => onChange("box")}
        className={`relative w-1/2 h-full flex flex-col justify-center items-start pl-6 md:pl-10 z-10 transition-all duration-300 ease-in-out cursor-pointer`}
      >
        <Image
          src="/images/individuales.png"
          fill
          className="object-cover"
          alt="Individuales"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-left pr-2">
        <h3 className={`font-outfit text-xl sm:text-2xl md:text-4xl lowercase tracking-wide flex items-center gap-2 transition-all duration-300 ease-in-out ${
          viewMode === 'box' ? 'text-white font-medium' : 'text-white/75 font-light'
        }`}>
          individuales
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
          <p className={`font-outfit text-[10px] sm:text-xs lowercase tracking-widest leading-tight transition-all duration-300 ease-in-out ${
            viewMode === 'box' ? 'text-white/90' : 'text-white/70'
          }`}>
            Boxes por persona
          </p>
          {selectedBoxName && (
            <span className="font-outfit text-white text-[9px] md:text-xs lowercase font-bold tracking-widest bg-black/10 px-1.5 md:px-2 py-0.5 rounded-sm w-fit truncate max-w-full">
              Armando: {selectedBoxName}
            </span>
          )}
        </div>
        </div>
      </div>

      {/* Right side: Para compartir (Image Background) */}
      <div 
        onClick={() => onChange("libre")}
        className={`absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-end md:items-start md:pl-10 pr-4 md:pr-10 z-0 transition-all duration-300 ease-in-out cursor-pointer`}
      >
        <Image
          src="/images/servicio.jpg"
          fill
          className="object-cover"
          alt="Para compartir"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-right md:text-left flex flex-col pl-2">
          <h3 className={`font-outfit text-xl sm:text-2xl md:text-4xl lowercase tracking-wide transition-all duration-300 ease-in-out ${
            viewMode === 'libre' ? 'text-white font-medium' : 'text-white/75 font-light'
          }`}>
            para compartir
          </h3>
          <p className={`font-outfit text-[10px] sm:text-xs mt-1 lowercase tracking-widest leading-tight transition-all duration-300 ease-in-out ${
            viewMode === 'libre' ? 'text-white/90' : 'text-white/70'
          }`}>
            Bandejas y opciones grupales
          </p>
        </div>
      </div>
    </motion.div>
  );
}
