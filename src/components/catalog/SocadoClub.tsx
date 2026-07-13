import Image from "next/image";
import { ButtonDark } from "@/components/catalog/ButtonDark";

// Inverted counterpart of LoyaltyCard: white text half on the left,
// illustration half (with the title stuck to the right) on the right.
export function SocadoClub() {
  return (
    <section id="socado-club" className="relative bg-white">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Left square — description + CTA on pure white */}
        <div className="flex w-full items-center bg-white px-6 py-16 lg:aspect-square lg:px-12 lg:py-0 2xl:px-20">
          <div className="max-w-xl">
            <p className="font-outfit text-base text-azul-socado/85 sm:text-lg">
              sé parte de nuestra comunidad
              <span className="block">y disfruta de los beneficios.</span>
            </p>
            <ButtonDark className="mt-8" type="button">
              regístrate
            </ButtonDark>
          </div>
        </div>

        {/* Right square — illustration with the title overlaid, right-aligned */}
        <div className="relative order-first aspect-square w-full overflow-hidden lg:order-none">
          <Image
            src="/images/socadoclub.png"
            alt="Ilustración del Socado Club"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-left"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-azul-socado/70 via-azul-socado/25 to-transparent" />

          <div className="absolute inset-0 z-10 flex items-center justify-end px-6 lg:px-12 2xl:px-20">
            <h2 className="text-right font-raleway text-4xl font-normal leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">
              conecta
              <span className="block">con Socado</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
