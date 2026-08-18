"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { EcommerceModal } from "@/components/catalog/EcommerceModal";
import type { HomeMenuSectionItem } from "@/lib/services/home-menu-sections.service";

// Collapsed height equals one row of cards (h-[380px]).
const COLLAPSED_HEIGHT = 380;

interface MenuCategoriesProps {
  categories: HomeMenuSectionItem[];
}

export function MenuCategories({ categories }: MenuCategoriesProps) {
  const [expanded, setExpanded] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  return (
    <section id="menu-categorias" className="bg-white py-24 px-6 lg:px-12 2xl:px-20 border-t border-black/5">
      <div className="w-full">
        {/* Section title with scroll entrance animation */}
        <motion.div
          className="mb-12 text-left"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-raleway text-4xl font-normal tracking-tight text-azul-socado sm:text-5xl lg:text-6xl lowercase">
            descubre nuestros productos
          </h2>
        </motion.div>

        {/* Height-animated container for expand / collapse */}
        <motion.div
          animate={{ height: expanded ? "auto" : COLLAPSED_HEIGHT }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => {
              const isExtra = index >= 4;
              return (
                /* Outer wrapper: scroll-triggered entrance animation */
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 4) * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Inner wrapper: expand / collapse opacity + y animation */}
                  <motion.div
                    animate={{
                      opacity: expanded || !isExtra ? 1 : 0,
                      y: expanded || !isExtra ? 0 : 16,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: expanded && isExtra ? (index - 4) * 0.07 : 0,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="group relative h-[380px] overflow-hidden cursor-pointer"
                    onClick={() => setStoreModalOpen(true)}
                  >
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}

                    {/* White panel that slides up on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-white border-t-2 border-[#063547] translate-y-[calc(100%-60px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                      <div className="h-[60px] flex items-center px-6">
                        <h3 className="font-raleway text-base font-semibold text-[#063547] lowercase leading-tight line-clamp-2">
                          {cat.title}
                        </h3>
                      </div>
                      {cat.description && (
                        <div className="px-6 pb-6 pt-1">
                          <p className="font-outfit text-sm text-[#6e7c7c] leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Expand / collapse toggle — only shown when there are more than 4 items */}
        {categories.length > 4 && (
          <motion.div
            className="mt-14 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="group flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#063547] text-[#063547] font-raleway hover:bg-[#063547] hover:text-white transition-colors duration-300"
            >
              {expanded ? "ver menos" : "ver más"}
              {expanded ? (
                <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
              ) : (
                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
              )}
            </button>
          </motion.div>
        )}
      </div>

      <EcommerceModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
      />
    </section>
  );
}
