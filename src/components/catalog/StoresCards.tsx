"use client";

import React, { useRef, useEffect, useState } from "react";
import { StoreCard, StoreData } from "./StoreCard";
import { PopupStores } from "./PopupStores";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";

const SCHEDULE =
  "tienda: lun – vie • 7:00 a.m. - 9:00 p.m.\nsáb - dom • 8:00 a.m. - 9:00 p.m.\ndelivery/pickup: lun - vie • 8:00 a.m. - 7:00 p.m.\nsáb • 9:00 a.m. - 5:00 p.m.";

const DEFAULT_STORES: StoreData[] = [
  {
    id: "las-mercedes",
    title: "las mercedes",
    location: "las mercedes",
    address: "av. veracruz, torre aba, las mercedes.",
    schedule: SCHEDULE,
    link: "https://lasmercedes.socadocafe.com",
    images: ["/images/mercedes1.jpg", "/images/mercedes2.jpg", "/images/mercedes3.jpg"],
    order: 1,
    amenities: { kidsCorner: true, parking: true, petFriendly: true, freeWifi: true },
  },
  {
    id: "la-trinidad",
    title: "la trinidad",
    location: "la trinidad",
    address: "calle altagracia, edificio caracas campus, la trinidad.",
    schedule: SCHEDULE,
    link: "https://latrinidad.socadocafe.com",
    images: ["/images/socadoTrinidad.jpg", "/images/trinidad2.jpg", "/images/trinidad3.jpg"],
    order: 2,
    amenities: { kidsCorner: true, parking: true, petFriendly: true, freeWifi: true },
  },
  {
    id: "el-rosal",
    title: "el rosal",
    location: "el rosal",
    address: "av. tamanaco, el rosal.",
    schedule: SCHEDULE,
    link: "https://elrosal.socadocafe.com",
    images: ["/images/rosal1.jpg", "/images/rosal2.jpg", "/images/rosal3.jpg"],
    order: 3,
    amenities: { kidsCorner: true, parking: true, petFriendly: true, freeWifi: true },
  },
  {
    id: "socadito-pcv",
    title: "Socadito parque cerro verde",
    titleLine1: "Socadito",
    titleLine2: "parque cerro verde",
    location: "parque cerro verde",
    address: "subida de los naranjos, av. raimundo reinoso,\ncc pcv, piso 1.",
    link: "",
    images: ["/images/pcv1.JPG", "/images/pcv2.JPG", "/images/pcv3.jpg"],
    order: 4,
    amenities: { kidsCorner: true, parking: true, petFriendly: false, freeWifi: true },
  },
  {
    id: "socadito-la-castellana",
    title: "Socadito la castellana",
    titleLine1: "Socadito",
    titleLine2: "la castellana",
    location: "la castellana",
    address: "avenida san felipe, cruce, con c. el bosque, locatel.",
    link: "",
    images: ["/images/locatel1.png", "/images/locatel2.JPG", "/images/locatel3.JPG"],
    order: 5,
    amenities: { kidsCorner: false, parking: true, petFriendly: false, freeWifi: true },
  },
];

const STORES_CACHE_KEY = "socado_stores_v2";

// Hand icon for the drag hint (color inherits from text).
function HandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M20.964 4h-3.992m3.992 0c0 .56-1.491 1.607-1.996 2m1.996-2c0-.56-1.491-1.607-1.996-2M3 4h3.99M3 4c0-.56 1.492-1.607 1.996-2M3 4c0 .56 1.492 1.607 1.996 2m4.819 16v-.94a3 3 0 0 0-.598-1.798l-3.823-5.109c-.317-.424-.554-.939-.408-1.449c.36-1.259 1.782-2.378 3.373-.407l1.6 1.708V3.594c.098-1.83 3.174-2.407 3.491 0v5.933c1.483-.19 8.466.851 7.45 5.265l-.144.636c-.207.918-.815 2.552-1.486 3.508c-.7.995-.373 2.6-.453 3.066"
      />
    </svg>
  );
}

export function StoresCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [activeStores, setActiveStores] = useState<StoreData[]>(DEFAULT_STORES);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [showHint, setShowHint] = useState(true);
  const [popupStore, setPopupStore] = useState<StoreData | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const x = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const filter = useTransform(scrollYProgress, [0, 0.5], ["blur(10px)", "blur(0px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  useEffect(() => {
    const measure = () => {
      if (carouselRef.current && innerRef.current) {
        setDragConstraints({
          right: 0,
          left: carouselRef.current.offsetWidth - innerRef.current.scrollWidth,
        });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    const timeout = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timeout);
    };
  }, [activeStores]);

  useEffect(() => {
    // 1. Cache local (evita carga vacía). Clave versionada para ignorar caché antigua.
    try {
      const cached = localStorage.getItem(STORES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
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
        const res = await fetch("/api/stores?limit=100&depth=1");
        if (res.ok) {
          const data = await res.json();
          if (data && data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
            const mappedStores: StoreData[] = data.docs.map((doc: any) => ({
              id: doc.storeId || doc.id,
              title: doc.title,
              titleLine1: doc.titleLine1,
              titleLine2: doc.titleLine2,
              subtitle: doc.subtitle,
              location: doc.location,
              address: doc.address || doc.location,
              schedule: doc.schedule,
              link: doc.link,
              images:
                doc.images && Array.isArray(doc.images)
                  ? doc.images.map((imgObj: any) =>
                      typeof imgObj.image === "string" ? imgObj.image : imgObj.image?.url || "",
                    )
                  : [],
              order: typeof doc.order === "number" ? doc.order : undefined,
              // Amenity toggles — passed through when the admin panel provides them.
              amenities:
                doc.amenities && typeof doc.amenities === "object" ? doc.amenities : undefined,
            }));

            const currentStringified = localStorage.getItem(STORES_CACHE_KEY);
            const newStringified = JSON.stringify(mappedStores);

            if (currentStringified !== newStringified) {
              localStorage.setItem(STORES_CACHE_KEY, newStringified);
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
    <section
      ref={sectionRef}
      id="tiendas"
      className="relative w-full overflow-hidden bg-white px-6 py-24 lg:px-12 2xl:px-20"
    >
      <motion.div style={{ filter, scale, opacity }} className="w-full">
        {/* Título + categoría (mismo borde izquierdo que Promotion1) */}
        <div className="mb-12 text-left">
          <h2 className="font-raleway text-4xl font-normal tracking-tight text-azul-socado sm:text-5xl lg:text-6xl">
            nuestras tiendas
          </h2>
          <div className="mt-5 flex gap-6">
            <span className="border-b-2 border-azul-socado pb-1 font-raleway text-sm font-medium tracking-wide text-azul-socado">
              caracas
            </span>
          </div>
        </div>

        <div
          className="relative -mx-6 overflow-hidden px-6 md:mx-0 md:px-0"
          ref={carouselRef}
        >
          <motion.div
            ref={innerRef}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            style={{ x }}
            onPointerDown={() => setShowHint(false)}
            className="flex w-full cursor-grab gap-6 pb-8 active:cursor-grabbing md:pb-0"
          >
            {[...activeStores]
              .sort((a, b) => {
                const orderA = typeof a.order === "number" ? a.order : Infinity;
                const orderB = typeof b.order === "number" ? b.order : Infinity;
                return orderA - orderB;
              })
              .map((store, index) => {
                const uniqueStore = { ...store, id: `${store.id}-${index}` };
                return (
                  <StoreCard
                    key={uniqueStore.id}
                    store={uniqueStore}
                    onMore={(s) => {
                      setPopupStore(s);
                      setPopupOpen(true);
                    }}
                  />
                );
              })}
          </motion.div>
        </div>

        {/* Hint "agarra y mueve" — se oculta tras la primera interacción */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-6 flex justify-end"
            >
              <div className="flex items-center gap-2 font-raleway text-sm text-azul-socado/70">
                <span>agarra y mueve</span>
                <motion.span
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex text-lg text-azul-socado"
                >
                  <HandIcon />
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Store detail popup — content bound to the selected card */}
      <PopupStores
        store={
          popupStore
            ? {
                name: popupStore.title.toLowerCase().replace(/socado/gi, "Socado").replace(/socadito/gi, "Socadito"),
                location: popupStore.location,
                schedule: popupStore.schedule ?? SCHEDULE,
                address: popupStore.address,
                image: popupStore.images?.[0],
                amenities: popupStore.amenities,
              }
            : null
        }
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </section>
  );
}
