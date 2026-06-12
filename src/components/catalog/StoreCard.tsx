"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export interface StoreData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  image: string;
}

export function StoreCard({ store }: { store: StoreData }) {
  return (
    <motion.div 
      layoutId={`card-${store.id}`}
      className="relative h-[400px] sm:h-[450px] min-w-[85%] md:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333333%-1rem)] shrink-0 group flex flex-col  overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-700 border border-black/5 dark:border-white/5"
    >
      {/* Image Background */}
      <motion.div layoutId={`image-${store.id}`} className="absolute inset-0">
        <Image 
          src={store.image} 
          alt={`Socado ${store.title}`}
          fill
          draggable={false}
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 pointer-events-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#042430]/90 via-[#042430]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Content (Positioned at bottom) */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
        {/* Title (Always visible) */}
        <motion.h3 
          layoutId={`title-${store.id}`}
          className="font-outfit text-3xl md:text-4xl font-light text-white transition-transform duration-500 ease-out group-hover:-translate-y-1 relative z-10"
        >
          {/* Formateamos el título para que coincida con la imagen (Capitalized) */}
          {store.title.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
        </motion.h3>
        
        {/* Expandable Info (Visible on hover) */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10">
          <div className="overflow-hidden">
            <div className="pt-4 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <p className="font-outfit text-white/80 whitespace-pre-line text-sm leading-relaxed">
                {store.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
