"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { LoyaltyProgramCards } from "@/components/catalog/LoyaltyProgramCards";

export function LoyaltyCard() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <>
      <section id="loyalty-card" className="relative bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
          {/* Left square — brand-colored panel with copy and illustration */}
          <div className="relative flex aspect-square w-full flex-col overflow-hidden bg-[#053647] px-6 pt-16 sm:pt-24 lg:px-12 2xl:px-20">
            <div className="max-w-xl text-ivory">
              <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                pide, disfruta
                <span className="block">y suma</span>
              </h2>
              <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg">
                adquiere tu tarjeta en tienda
              </p>
            </div>

            {/* Illustration — reveals bottom-to-top when the section enters view */}
            <motion.div
              className="mt-8 flex min-h-0 flex-1 items-end justify-start"
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/loyalty-ilustracion.svg"
                alt="Ilustración de la tarjeta de fidelidad Socado"
                width={886}
                height={573}
                className="h-auto w-[1400px] shrink-0 -translate-x-16 translate-y-2 object-contain sm:w-[1680px] sm:-translate-x-24 sm:translate-y-4 lg:w-[1900px] lg:-translate-x-22 lg:translate-y-6"
              />
            </motion.div>
          </div>

          {/* Right square — program cards centered on pure white */}
          <div className="flex w-full items-center justify-center bg-white px-6 py-16 lg:aspect-square lg:px-12 lg:py-0 2xl:px-20">
            <LoyaltyProgramCards
              className="w-full"
              activeIndex={active}
              onActiveChange={setActive}
            />
          </div>
        </div>
      </section>
    </>
  );
}
