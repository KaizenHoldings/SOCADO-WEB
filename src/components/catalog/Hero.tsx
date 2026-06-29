import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/people.webm" type="video/webm" />
      </video>

      {/* Overlay oscuro para garantizar legibilidad del texto */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <Image
            src="/icons/logo_ivory.svg"
            alt="Socado Café"
            width={300}
            height={200}
            className="h-32 w-auto drop-shadow-lg sm:h-48 md:h-56"
            priority
          />
        </div>
        <h1 className="sr-only">Socado Café</h1>

        <p className="mt-8 max-w-2xl mx-auto text-lg text-ivory/75 font-outfit font-light leading-relaxed">
          Socado es más que un café. Somos un espacio de conexión, cultura y bienestar que ofrece una experiencia única alrededor del café.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://latrinidad.socadocafe.com/"
            target="_BLANK"
            className="group inline-flex items-center gap-2 rounded-full bg-azul-socado px-8 py-4 text-base font-bold text-ivory transition-all hover:bg-azul-socado/90 hover:gap-3 hover:shadow-xl hover:shadow-azul-socado/20 active:scale-95"
          >
            Ecommerce
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#nosotros"
            className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-8 py-4 text-base font-semibold text-ivory transition-all hover:bg-ivory/10 active:scale-95"
          >
            Nuestra historia
          </a>
        </div>
      </div>
    </section>
  );
}
