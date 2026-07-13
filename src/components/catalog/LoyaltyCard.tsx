import Image from "next/image";
import { LoyaltyProgramCards } from "@/components/catalog/LoyaltyProgramCards";

export function LoyaltyCard() {
  return (
    <section id="loyalty-card" className="relative bg-white">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Left square — illustration with copy overlaid */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src="/images/cardloyalty.png"
            alt="Ilustración de la tarjeta de fidelidad Socado"
            fill
            //sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-left"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-azul-socado/70 via-azul-socado/25 to-transparent" />

          <div className="absolute inset-0 z-10 flex items-center px-6 lg:px-12 2xl:px-20">
            <div className="max-w-xl text-ivory">
              <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                pide, disfruta
                <span className="block">y suma</span>
              </h2>
              <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg">
                adquiere tu tarjeta en tienda
              </p>
            </div>
          </div>
        </div>

        {/* Right square — program cards centered on pure white */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-16 lg:aspect-square lg:px-12 lg:py-0 2xl:px-20">
          <LoyaltyProgramCards className="w-full" />
        </div>
      </div>
    </section>
  );
}
