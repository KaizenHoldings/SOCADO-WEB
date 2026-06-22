"use client";

import React, { useRef, useEffect, useState } from "react";
import { StoreCard, StoreData } from "./StoreCard";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";

const DEFAULT_STORES: StoreData[] = [
  {
    id: "las-mercedes",
    title: "LAS MERCEDES",
    subtitle: "UBICACIÓN",
    location: "Av. Veracruz, Torre Aba, Las Mercedes.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://lasmercedes.socadocafe.com",
    images: ["/images/socadolasMercedes.jpg", "/images/socadoTrinidad.jpg"],
    order: 1,
  },
  {
    id: "la-trinidad",
    title: "LA TRINIDAD",
    subtitle: "UBICACIÓN",
    location: "Calle Altagracia, Edificio Caracas Campus, La Trinidad.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://latrinidad.socadocafe.com",
    images: ["/images/socadoTrinidad.jpg", "/images/socadoRosal.jpg"],
    order: 2,
  },
  {
    id: "el-rosal",
    title: "EL ROSAL",
    subtitle: "UBICACIÓN",
    location: "Av. Tamanaco, El Rosal.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://elrosal.socadocafe.com",
    images: ["/images/socadoRosal.jpg", "/images/socadolasMercedes.jpg"],
    order: 3,
  }
];

export function StoresCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const [activeStores, setActiveStores] = useState<StoreData[]>(DEFAULT_STORES);
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
  }, [activeStores]);

  useEffect(() => {
    // 1. Cargar desde localStorage inicialmente si existe para evitar carga vacía
    try {
      const cachedStores = localStorage.getItem("socado_stores");
      if (cachedStores) {
        const parsed = JSON.parse(cachedStores);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveStores(parsed);
        }
      }
    } catch (e) {
      console.error("Error leyendo stores desde localStorage", e);
    }

    // 2. Fetch desde la API (Payload CMS) para actualizar
    const fetchStores = async () => {
      try {
        const res = await fetch("/api/stores?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data && data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
            const mappedStores: StoreData[] = data.docs.map((doc: any) => ({
              id: doc.storeId || doc.id,
              title: doc.title,
              subtitle: doc.subtitle || "UBICACIÓN",
              location: doc.location,
              schedule: doc.schedule,
              link: doc.link,
              images: doc.images && Array.isArray(doc.images) 
                ? doc.images.map((imgObj: any) => typeof imgObj.image === 'string' ? imgObj.image : imgObj.image?.url || '')
                : [],
              order: typeof doc.order === 'number' ? doc.order : undefined,
            }));
            
            // Comparar para no actualizar el estado si no hay cambios reales
            const currentStringified = localStorage.getItem("socado_stores");
            const newStringified = JSON.stringify(mappedStores);
            
            if (currentStringified !== newStringified) {
              localStorage.setItem("socado_stores", newStringified);
              setActiveStores(mappedStores);
            }
          }
        }
      } catch (error) {
        console.error("Error obteniendo stores desde la API", error);
      }
    };

    fetchStores();
  }, []);




  return (
    <section ref={sectionRef} id="tiendas" className="w-full bg-white py-24 px-6 lg:px-12 relative overflow-hidden">
      <motion.div style={{ filter, scale, opacity }} className="mx-auto max-w-[1400px]">
        <div className="text-left mb-16">
          <h2 className="font-raleway text-4xl md:text-5xl font-black uppercase text-azul-socado dark:text-ivory">
            Nuestras Tiendas
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
            {[...activeStores]
              .sort((a, b) => {
                const orderA = typeof a.order === 'number' ? a.order : Infinity;
                const orderB = typeof b.order === 'number' ? b.order : Infinity;
                return orderA - orderB;
              })
              .map((store, index) => {
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
