"use client";

import React, { useRef, useEffect, useState } from "react";
import { StoreCard, StoreData } from "./StoreCard";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";

const stores: StoreData[] = [
  {
    id: "las-mercedes",
    title: "LAS MERCEDES",
    subtitle: "UBICACIÓN",
    description: "Av. Veracruz, Torre Aba, Las Mercedes.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://lasmercedes.socadocafe.com",
    image: "/images/socadolasMercedes.jpg",
  },
  
  {
    id: "la-trinidad",
    title: "LA TRINIDAD",
    subtitle: "UBICACIÓN",
    description: "Calle Altagracia, Edificio Caracas Campus, La Trinidad.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://latrinidad.socadocafe.com",
    image: "/images/socadoTrinidad.jpg",
  },
  {
    id: "el-rosal",
    title: "EL ROSAL",
    subtitle: "UBICACIÓN",
    description: "Av. Tamanaco, El Rosal.\n\nLunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://elrosal.socadocafe.com",
    image: "/images/socadoRosal.jpg",
  }
];

export function StoresCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const filter = useTransform(scrollYProgress, [0, 0.5], ["blur(10px)", "blur(0px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  useEffect(() => {
    const measure = () => {
      if (carouselRef.current && innerRef.current) {
        setDragConstraints({
          right: 0,
          left: carouselRef.current.offsetWidth - innerRef.current.scrollWidth
        });
      }
    };
    
    measure();
    window.addEventListener("resize", measure);
    // Agregamos un timeout para asegurar que las fuentes/imágenes cargaron antes de medir
    const timeout = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timeout);
    };
  }, []);


  return (
    <section ref={sectionRef} id="tiendas" className="w-full bg-azul-socado dark:bg-[#042430] py-24 px-6 lg:px-12 relative overflow-hidden">
      <motion.div style={{ filter, scale, opacity }} className="mx-auto max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="font-outfit text-sm font-bold tracking-widest uppercase text-celeste-socado mb-4 block">
            Nuestras Tiendas
          </span>
          <h2 className="font-raleway text-4xl md:text-5xl font-black uppercase text-white dark:text-ivory">
            Visítanos
          </h2>
        </div>

        <div className="relative overflow-hidden -mx-6 px-6 md:mx-0 md:px-0" ref={carouselRef}>
          <motion.div 
            ref={innerRef}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            style={{ x }}
            className="flex gap-6 pb-8 md:pb-0 cursor-grab active:cursor-grabbing w-full"
          >
            {stores.map((store, index) => {
              const uniqueStore = { ...store, id: `${store.id}-${index}` };
              return (
                <StoreCard key={uniqueStore.id} store={uniqueStore} />
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
