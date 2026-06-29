"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function OurStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "center 65%"]
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <section id="nosotros" className="relative bg-white py-24 overflow-hidden ">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center">
          
          {/* Tarjeta de Texto (Fondo) */}
          <div className="w-full lg:w-[45%] z-0 relative lg:-mr-12 mt-[-3rem] lg:mt-0">
            <div className="bg-[#063547] text-[#f2eae6] p-10 md:p-16 lg:pr-24 rounded-[2.5rem] shadow-xl">
              <h2 className="font-raleway text-3xl font-bold mb-8 tracking-tight md:text-4xl">
                Nuestra Historia
              </h2>

              <div className="font-outfit text-base md:text-lg leading-relaxed font-light mb-12 opacity-95 space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>

              {/* Firma */}
              <div className="flex flex-col mt-4">
                <span className="font-raleway font-light text-xl text-white mb-2">
                  Ignacio Weill
                </span>
                <span className="font-outfit text-xs font-bold uppercase tracking-widest opacity-60">
                  fundador
                </span>
              </div>
            </div>
          </div>

          {/* Multimedia (Video, Superpuesto) */}
          <motion.div 
            ref={ref}
            style={{ clipPath }}
            className="w-full lg:w-[45%] relative h-[350px] lg:h-[450px] z-10"
          >
            <video
              src="/videos/people.webm"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-xl"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
