"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export function AboutUs() {
  return (
    <section id="quienes-somos" className="relative w-full bg-azul-socado py-32 md:py-48 overflow-hidden flex items-center justify-center border-y-8 border-terra">
      {/* Background Isotipo Watermark */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] opacity-[0.08] pointer-events-none"
      >
        <Image 
          src="/icons/isotipo-celeste.svg" 
          alt="Socado Isotipo Watermark" 
          fill 
          className="object-contain"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.4, delay:0.2 }}
          className="mb-12 relative w-56 h-20 md:w-72 md:h-24"
        >
          <Image 
            src="/icons/logo_ivory.svg" 
            alt="Socado Logo" 
            fill 
            className="object-contain"
          />
        </motion.div>
        
        {/* Main Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-raleway font-bold text-4xl md:text-5xl lg:text-6xl text-ivory mb-10 tracking-tight"
        >
          Socado es más que un café.
        </motion.h2>

        {/* Decorative Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-24 h-1.5 bg-terra mb-12 mx-auto rounded-full"
        />

        {/* Text */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-outfit text-2xl md:text-3xl lg:text-4xl font-light text-ivory/90 leading-relaxed md:leading-relaxed max-w-3xl mx-auto"
        >
          Somos un espacio de conexión, cultura y bienestar que ofrece una experiencia única alrededor del café.
        </motion.p>
      </div>
    </section>
  );
}
