"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const stores = [
  {
    id: "las-mercedes",
    title: "LAS MERCEDES",
    subtitle: "UBICACIÓN",
    description: "Av. Veracruz, Torre Aba, Las Mercedes.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://lasmercedes.socadocafe.com",
    image: "/images/socadolasMercedes.jpg",
    theme: {
      bg: "bg-white",
      subtitle: "text-terra",
      title: "text-azul-socado",
      desc: "text-gris-metropolis",
      btn: "bg-terra text-white hover:bg-azul-socado hover:text-white",
      navBtn: "bg-azul-socado/10 text-azul-socado hover:bg-azul-socado hover:text-white",
      navDots: "bg-azul-socado",
      navDotsInactive: "bg-azul-socado/20 hover:bg-azul-socado/40"
    }
  },
  {
    id: "la-trinidad",
    title: "LA TRINIDAD",
    subtitle: "UBICACIÓN",
    description: "Calle Altagracia, Edificio Caracas Campus, La Trinidad.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://latrinidad.socadocafe.com",
    image: "/images/socadoTrinidad.jpg",
    theme: {
      bg: "bg-white",
      subtitle: "text-terra",
      title: "text-azul-socado",
      desc: "text-gris-metropolis",
      btn: "bg-terra text-white hover:bg-azul-socado hover:text-white",
      navBtn: "bg-azul-socado/10 text-azul-socado hover:bg-azul-socado hover:text-white",
      navDots: "bg-azul-socado",
      navDotsInactive: "bg-azul-socado/20 hover:bg-azul-socado/40"
    }
  },
  {
    id: "el-rosal",
    title: "EL ROSAL",
    subtitle: "UBICACIÓN",
    description: "Av. Tamanaco, El Rosal.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://elrosal.socadocafe.com",
    image: "/images/socadoRosal.jpg",
    theme: {
      bg: "bg-white",
      subtitle: "text-terra",
      title: "text-azul-socado",
      desc: "text-gris-metropolis",
      btn: "bg-terra text-white hover:bg-azul-socado hover:text-white",
      navBtn: "bg-azul-socado/10 text-azul-socado hover:bg-azul-socado hover:text-white",
      navDots: "bg-azul-socado",
      navDotsInactive: "bg-azul-socado/20 hover:bg-azul-socado/40"
    }
  }
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
    };
  },
  center: {
    x: 0,
    zIndex: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? "100%" : "-100%",
      zIndex: 0,
    };
  }
};

export function StoresCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = ((page % stores.length) + stores.length) % stores.length;
  const store = stores[imageIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <section id="tiendas" className="relative w-full bg-white overflow-hidden">
      {/* Invisible placeholder to establish height correctly across all breakpoints */}
      <div className="grid w-full invisible pointer-events-none opacity-0">
        {stores.map((s, i) => (
          <div key={i} className="col-start-1 row-start-1 w-full flex flex-col md:flex-row">
            <div className={`w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 lg:p-32 ${s.theme.bg}`}>
              <span className={`font-outfit text-sm md:text-base font-bold tracking-widest uppercase mb-6 ${s.theme.subtitle}`}>
                {s.subtitle}
              </span>
              <h2 className={`font-raleway text-6xl md:text-7xl lg:text-[100px] font-black uppercase leading-[0.9] mb-10 tracking-tighter ${s.theme.title}`}>
                {s.title}
              </h2>
              <p className={`font-outfit text-lg md:text-xl mb-12 whitespace-pre-line max-w-md ${s.theme.desc}`}>
                {s.description}
              </p>
              <div>
                <span className={`inline-flex items-center gap-3 font-outfit font-bold rounded-full px-8 py-4 ${s.theme.btn}`}>
                  Comprar aquí
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px]" />
          </div>
        ))}
      </div>

      {/* Animated slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
        >
          {/* TEXT SIDE */}
          <div className={`w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 lg:p-32 ${store.theme.bg}`}>
            <span className={`font-outfit text-sm md:text-base font-bold tracking-widest uppercase mb-6 ${store.theme.subtitle}`}>
              {store.subtitle}
            </span>
            
            <h2 className={`font-raleway text-6xl md:text-7xl lg:text-[100px] font-black uppercase leading-[0.9] mb-10 tracking-tighter ${store.theme.title}`}>
              {store.title}
            </h2>
            
            <p className={`font-outfit text-lg md:text-xl mb-12 whitespace-pre-line max-w-md ${store.theme.desc}`}>
              {store.description}
            </p>
            
            <div>
              <a 
                href={store.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 font-outfit font-bold rounded-full px-8 py-4 transition-colors group ${store.theme.btn}`}
              >
                Comprar aquí
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* IMAGE SIDE */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full">
            <Image 
              src={store.image} 
              alt={`Socado ${store.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-12 md:left-24 lg:left-32 flex items-center gap-4 z-20">
        <button 
          onClick={() => paginate(-1)}
          className={`w-12 h-12 rounded-full backdrop-blur flex items-center justify-center transition-colors ${store.theme.navBtn}`}
          aria-label="Previous store"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          {stores.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newDirection = idx > imageIndex ? 1 : -1;
                if (idx !== imageIndex) {
                  setPage([page + (idx - imageIndex), newDirection]);
                }
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                imageIndex === idx 
                  ? `${store.theme.navDots} scale-105 w-8` 
                  : store.theme.navDotsInactive
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={() => paginate(1)}
          className={`w-12 h-12 rounded-full backdrop-blur flex items-center justify-center transition-colors ${store.theme.navBtn}`}
          aria-label="Next store"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
