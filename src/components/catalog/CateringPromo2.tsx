"use client";

import Image from 'next/image';
import { motion } from 'motion/react';
import { ButtonLight } from "@/components/catalog/ButtonLight";

export function CateringPromo2() {
  return (
    <section id="catering-pedido" className="relative w-full overflow-hidden bg-terra">
      <div className="flex min-h-screen w-full flex-col-reverse md:flex-row">

        {/* Left Side: Text Content */}
        <div className="z-10 flex w-full items-center bg-terra md:w-1/2">
          <div className="section-shell max-w-none py-16 text-left text-ivory md:py-20 lg:px-12 lg:py-0 2xl:px-20">
            <div className="max-w-xl">

              <motion.p
                className="mb-2 font-raleway text-xl font-light lowercase tracking-widest text-ivory"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                servicio de catering
              </motion.p>

              <motion.h2
                className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl lowercase"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Socado en tu evento
              </motion.h2>

              <motion.p
                className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg lowercase"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                descubre nuestras opciones de catering. disfruta de la experiencia Socado en tus
                reuniones, celebraciones o eventos corporativos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ButtonLight href="/catering" className="mt-8">
                  hacer un pedido
                </ButtonLight>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Right Side: Full Image */}
        <motion.div
          className="relative min-h-[400px] w-full md:min-h-full md:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src="/images/servicio.jpg"
            alt="Socado Catering options"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

      </div>
    </section>
  );
}
