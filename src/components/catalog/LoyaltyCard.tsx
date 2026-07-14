"use client";
import { useState } from "react";
import Image from "next/image";
import { LoyaltyProgramCards } from "@/components/catalog/LoyaltyProgramCards";

const PROMOTIONS = [
  {
    title1: "pide, disfruta",
    title2: "y suma",
    subtitle: "órdenes mayores a ref.10 con café, matcha o infusión, reciben un sello.",
    image: "/images/loyalty.jpg",
  },
  {
    title1: "pide, disfruta",
    title2: "y suma",
    subtitle: "al completar 9 sellos, te regalamos una bebida de barismo: café, matcha o infusión.",
    image: "/images/loyalty.jpg",
  },
  {
    title1: "pide, disfruta",
    title2: "y suma",
    subtitle: "déjanos tu correo y recibe beneficios exclusivos.",
    image: "/images/loyalty.jpg",
  },
];

export function LoyaltyCard() {
  const [active, setActive] = useState(0);
  const promo = PROMOTIONS[active];

  return (
    <>
      <section id="loyalty-card" className="relative bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
          {/* Left square — illustration with copy overlaid */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              key={promo.image + active} // Forces re-render if image changes later
              src={promo.image}
              alt="Ilustración de la tarjeta de fidelidad Socado"
              fill
              className="object-cover object-left"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-azul-socado/70 via-azul-socado/25 to-transparent" />

            <div className="absolute inset-0 z-10 flex items-start pt-16 sm:pt-24 px-6 lg:px-12 2xl:px-20">
              <div className="max-w-xl text-ivory">
                <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {promo.title1}
                  <span className="block">{promo.title2}</span>
                </h2>
                <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg">
                  {promo.subtitle}
                </p>
              </div>
            </div>
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
