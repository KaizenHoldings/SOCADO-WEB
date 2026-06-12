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
            <h2 className="font-raleway font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest text-ivory mb-2">
              SERVICIO DE CATERING
            </h2>
            <h2 
              className="font-raleway font-black italic text-6xl sm:text-7xl md:text-[5.5rem] text-white mb-8 leading-none"
              style={{ letterSpacing: "-0.02em", transform: "rotate(-2deg)" }}
            >
              Tu Evento
            </h2>
            <p className="font-outfit text-lg md:text-xl text-ivory/90 mb-10 leading-relaxed font-light">
              Descubre nuestras nuevas opciones de Catering. Disfruta de la calidad y el sabor inconfundible de Socado Café en tus reuniones, celebraciones o eventos corporativos. ¿Buscas sorprender? Prueba nuestras bandejas especiales y delicias para compartir.
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

        {/* Right Side: Image with Pattern Background */}
        <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-full bg-verde-century flex items-center justify-center p-8 lg:p-16 overflow-hidden">
          {/* Abstract wavy background pattern (CSS based) */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f2eae6' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }} />
          
          {/* Main Image floating frame */}
          <div className="relative w-full h-full max-w-lg aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out z-10 border-8 border-white/50">
            <Image 
              src="/images/catering.JPG"
              alt="Socado Catering options"
              fill
              className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Decorative Elements mimicking the yellow sparks from the reference */}
          <div className="absolute top-1/4 right-[10%] md:right-[15%] w-24 h-24 pointer-events-none z-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
              <path d="M50 10 Q55 30 50 50 Q45 30 50 10 Z" transform="rotate(20 50 50)" />
              <path d="M50 10 Q55 30 50 50 Q45 30 50 10 Z" transform="rotate(60 50 50) translate(15, -10)" />
              <path d="M50 10 Q55 30 50 50 Q45 30 50 10 Z" transform="rotate(95 50 50) translate(25, -5)" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
