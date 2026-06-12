"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export function Promotion() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const filter = useTransform(scrollYProgress, [0.8, 0.7], ["blur(0px)", "blur(10px)"]);
  const scale = useTransform(scrollYProgress, [1, 0.5], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [1, 0.5], [1, 0.5]);

  return (
    <section id="promociones" ref={ref} className="w-full bg-azul-socado dark:bg-[#042430] py-16 lg:py-0 relative overflow-hidden flex items-center min-h-[600px] lg:min-h-[700px]">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-celeste-socado/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-terra/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full flex flex-col lg:flex-row items-center relative z-10">
        
        {/* Text Content (Left Half, aligned with 1400px grid) */}
        <div className="w-full lg:w-1/2 flex justify-end px-6 lg:px-0 lg:pr-12">
          <div className="w-full max-w-[700px] lg:pl-12 flex flex-col justify-center text-center lg:text-left py-12 lg:py-24">
         
            <h2 className="font-raleway text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
              Aprovecha nuestra <br className="hidden lg:block" />
              <span className="font-bold text-terra">oferta exclusiva</span>
            </h2>
            
            <p className="font-outfit text-ivory/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <button 
                className="inline-flex items-center justify-center gap-4 font-outfit font-bold rounded-full px-8 py-4 transition-all bg-terra text-white hover:bg-[#a04e2e] shadow-lg hover:shadow-terra/30 hover:-translate-y-1"
              >
                Descubrir Más
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Content (Right Half, full bleed) */}
        <div className="w-full lg:w-1/2 flex justify-end">
          <motion.div 
            style={{ filter, scale, opacity }}
            className="relative w-full aspect-square lg:aspect-[4/3] xl:aspect-square"
          >
            <Image 
              src="/images/promotion2.png"
              alt="Socado Promoción"
              fill
              className="object-contain object-bottom lg:object-right"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
