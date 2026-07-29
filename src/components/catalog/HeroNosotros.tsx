import Image from "next/image";

export function HeroNosotros() {
  return (
    <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
      <Image
        src="/images/hero_nosotros.jpg"
        alt="Socado Café — Nosotros"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradiente oscuro en la parte inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Texto */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 lg:px-12 2xl:px-20 max-w-[1400px] mx-auto left-0 right-0">
        <p className="font-outfit text-[11px] uppercase tracking-[0.25em] text-white/60 mb-3">
          Socado Café
        </p>
        <h1 className="font-raleway text-5xl md:text-7xl font-normal tracking-tight text-white lowercase leading-none">
          nosotros
        </h1>
      </div>
    </section>
  );
}
