import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CateringPromo() {
  return (
    <section id="catering" className="relative w-full bg-terra overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[70vh]">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20 lg:p-32 z-10 bg-terra">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="font-raleway font-light text-xl uppercase tracking-widest text-ivory mb-2">
              SERVICIO DE CATERING
            </h2>
            <h2 
              className="font-raleway font-black text-7xl text-white mb-8"
              style={{ letterSpacing: "-0.02em" }}
            >
              Socado en tu evento
            </h2>
            <p className="font-outfit text-lg md:text-xl text-ivory/90 mb-10 leading-relaxed font-light">
              Descubre nuestras opciones de catering. Disfruta de la experiencia Socado en tus reuniones, celebraciones o eventos corporativos.
            </p>
            <Link 
              href="/catering" 
              className="group inline-flex items-center gap-3 bg-white text-terra font-outfit font-bold uppercase tracking-widest rounded-full px-10 py-5 hover:bg-ivory transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Hacer un Pedido
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Side: Full Image */}
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full">
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
