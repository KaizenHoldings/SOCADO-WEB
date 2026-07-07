import Image from "next/image";

// Editorial section using the same text system as Promotion1 (left-aligned
// title/description over a full background image). Placeholder copy for now.
export function CateringPromo1() {
  return (
    <section id="catering" className="relative h-[70vh] md:h-[82vh]">
      <div className="relative h-full overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero-catering.png"
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover object-center"
        />
        {/* Left legibility gradient */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-azul-socado/85 via-azul-socado/45 to-transparent" />

        {/* Content — same layout/scale as Promotion1 */}
        <div className="section-shell relative z-10 flex h-full items-center">
          <div className="max-w-xl text-ivory">
            <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              título de catering
              <span className="block">línea secundaria</span>
            </h2>
            <p className="mt-5 max-w-md font-outfit text-base text-ivory/85 sm:text-lg">
              Texto de descripción provisional para presentar la experiencia de catering de Socado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
