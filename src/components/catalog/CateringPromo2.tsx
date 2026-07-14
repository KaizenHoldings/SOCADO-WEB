import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ButtonLight } from "@/components/catalog/ButtonLight";

export function CateringPromo2() {
  return (
    <section id="catering-pedido" className="relative w-full overflow-hidden bg-terra">
      <div className="flex min-h-screen w-full flex-col-reverse md:flex-row">
        {/* Left Side: Text Content */}
        <div className="z-10 flex w-full items-center bg-terra md:w-1/2">
          <div className="section-shell max-w-none py-16 text-left text-ivory md:py-20">
            <div className="max-w-xl">
              <p className="mb-2 font-raleway text-xl font-light lowercase tracking-widest text-ivory">
                servicio de catering
              </p>
              <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl lowercase">
                Socado en tu evento
              </h2>
              <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg lowercase">
                descubre nuestras opciones de catering. disfruta de la experiencia Socado en tus
                reuniones, celebraciones o eventos corporativos.
              </p>
              <ButtonLight
                href="/catering"
                className="mt-8"
              >
                hacer un pedido
              </ButtonLight>
            </div>
          </div>
        </div>

        {/* Right Side: Full Image */}
        <div className="relative min-h-[400px] w-full md:min-h-full md:w-1/2">
          <Image
            src="/images/servicio.jpg"
            alt="Socado Catering options"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
