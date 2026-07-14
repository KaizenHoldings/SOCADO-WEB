"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ButtonPlus } from "./ButtonPlus";
import type { StoreAmenities } from "./PopupStores";

export interface StoreData {
  id: string;
  title: string;
  titleLine1?: string; // nombre en dos líneas (opcional)
  titleLine2?: string;
  subtitle?: string;
  location: string; // ubicación (zona)
  address?: string; // dirección
  schedule?: string; // conservado por compatibilidad de datos
  link: string;
  images: string[];
  order?: number;
  amenities?: StoreAmenities; // comodidades — toggles per store (admin later)
}

const HOVER_CYCLE_MS = 3300;

export function StoreCard({
  store,
  onMore,
}: {
  store: StoreData;
  onMore?: (store: StoreData) => void;
}) {
  const images =
    store.images && store.images.length > 0 ? store.images : ["/images/placeholder.jpg"];
  const [idx, setIdx] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Cycle through the store's own images only while it is hovered.
  useEffect(() => {
    if (!hovering || images.length <= 1) {
      setIdx(0);
      return;
    }
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), HOVER_CYCLE_MS);
    return () => clearInterval(t);
  }, [hovering, images.length]);

  return (
    <motion.div
      layoutId={`card-${store.id}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group relative flex aspect-square min-w-[78%] shrink-0 flex-col overflow-hidden border border-black/5 shadow-sm transition-shadow duration-700 hover:shadow-2xl md:min-w-[calc(44%-0.5rem)] lg:min-w-[calc(30%-0.6rem)]"
    >
      {/* Image crossfade */}
      <div className="absolute inset-0 bg-black/10">
        {images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Socado ${store.title} ${i + 1}`}
            fill
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`pointer-events-none object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#042430]/90 via-[#042430]/40 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-6 md:p-8">
        <motion.h3
          layoutId={`title-${store.id}`}
          className="relative z-10 font-outfit text-2xl font-light leading-tight text-white transition-transform duration-500 ease-out group-hover:-translate-y-1 md:text-3xl"
        >
          {store.titleLine1 ? (
            <>
              <span className="block">{store.titleLine1.toLowerCase().replace(/socado/gi, "Socado").replace(/socadito/gi, "Socadito")}</span>
              {store.titleLine2 && (
                <span className="block">{store.titleLine2.toLowerCase().replace(/socado/gi, "Socado").replace(/socadito/gi, "Socadito")}</span>
              )}
            </>
          ) : (
            store.title.toLowerCase().replace(/socado/gi, "Socado").replace(/socadito/gi, "Socadito")
          )}
        </motion.h3>

        {/* Expandable info (on hover) */}
        <div className="relative z-10 grid grid-rows-[0fr] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden -mr-2 pr-2 -mt-2 pt-2">
            <div className="flex items-end justify-between gap-4 pt-4 opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
              <div className="flex min-w-0 flex-col gap-4">
                <p className="whitespace-pre-line font-outfit text-sm leading-relaxed text-white/80">
                  <span className="mb-1 block font-raleway text-xs font-semibold tracking-wide text-white">
                    ubicación
                  </span>
                  {store.location}
                </p>
                {store.address && (
                  <p className="whitespace-pre-line font-outfit text-sm leading-relaxed text-white/80">
                    <span className="mb-1 block font-raleway text-xs font-semibold tracking-wide text-white">
                      dirección
                    </span>
                    {store.address}
                  </p>
                )}
              </div>
              {onMore && (
                <ButtonPlus
                  variant="dark"
                  className="shrink-0 !min-h-0 !py-1 !text-sm"
                  aria-label={`ver más de ${store.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMore(store);
                  }}
                >
                  más
                </ButtonPlus>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
