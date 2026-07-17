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
    <section id="nosotros" className="relative bg-white lg:py-24 overflow-hidden ">
      <div className="mx-auto max-w-[1400px] px-0 lg:px-12">
        
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center">
          
          {/* Tarjeta de Texto (Fondo) */}
          <div className="w-full lg:w-[45%] z-0 relative lg:-mr-12 lg:mt-0">
            <div className="bg-[#063547] text-[#f2eae6] p-10 py-16 md:p-16 lg:pr-24 rounded-none lg:rounded-[2.5rem] lg:shadow-xl">
              <h2 className="font-raleway text-3xl mb-8 tracking-tight md:text-4xl lowercase">
                nuestra historia
              </h2>

              <div className="font-outfit text-base md:text-sm leading-relaxed font-light mb-12 opacity-95 space-y-4 lowercase">
                <p>
                  Todo comenzó con una idea simple: crear un lugar al que siempre quieras volver. Un espacio que se sienta como una segunda casa, donde el café abre conversaciones y cada detalle invita a quedarse.
                </p>
                <p>
                  Así nació Socado: para conectar personas y compartir cultura. Evolucionamos día a día sin perder nuestra esencia: hacer que cada visita sea especial.
                </p>
                <p>
                  Nuestra historia vive en cada encuentro dentro de nuestras tiendas. Y esto apenas comienza.
                </p>
              </div>

              {/* Firma */}
              <div className="flex flex-col mt-4">
                <span className="font-raleway font-light text-xl text-white mb-2 lowercase">
                  ignacio weill
                </span>
                <span className="font-outfit text-xs font-bold  tracking-widest opacity-60">
                  fundador
                </span>
              </div>
            </div>
          </div>

          {/* Multimedia (Video, Superpuesto) */}
          <motion.div 
            ref={ref}
            style={{ clipPath }}
            className="w-full lg:w-[45%] relative h-[400px] lg:h-[450px] z-10"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-none lg:rounded-[3rem] lg:shadow-xl"
            >
              <source src="/videos/history.mp4" type="video/mp4" />
            </video>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
