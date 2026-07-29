"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    id: 1,
    title: "Ensaladas",
    image: "/api/media/file/all-day-breakfast.jpg",
    description: "Una variedad de bowls y ensaladas que combinan proteínas, vegetales, granos y aderezos llenos de sabor. Opciones completas, coloridas y equilibradas, pensadas para disfrutar una comida diferente sin dejar de lado el gusto.",
    subcategories: ["Bowls de proteína", "Ensaladas frescas", "Granos y aderezos"]
  },
  {
    id: 2,
    title: "Sándwiches y Wraps",
    image: "/images/menu/wraps.jpg",
    description: "Una selección de preparaciones prácticas y completas, elaboradas con panes, tortillas, proteínas, vegetales y diferentes salsas. Desde combinaciones clásicas hasta opciones más ligeras y variadas, ideales para disfrutar en cualquier momento del día.",
    subcategories: ["Sándwiches clásicos", "Wraps ligeros", "Opciones variadas"]
  },
  {
    id: 3,
    title: "All Day Brunch",
    image: "/images/menu/allday.jpg",
    description: "Una propuesta pensada para disfrutar el brunch a cualquier hora del día, con alternativas dulces y saladas. Bagels, tostadas, muffins y panquecas que combinan ingredientes variados para crear opciones completas y llenas de sabor.",
    subcategories: ["Bagels y tostadas", "Muffins", "Panquecas"]
  },
  {
    id: 4,
    title: "Bollería",
    image: "/api/media/file/de-nuestro-horno.jpg",
    description: "Una selección de productos horneados que combina opciones clásicas y variadas para cualquier momento del día. Cachitos, croissants, empanadas y quiches con diferentes rellenos, ideales para desayunar, merendar o acompañar tu café.",
    subcategories: ["Cachitos y croissants", "Empanadas", "Quiches"]
  },
  {
    id: 5,
    title: "Café y Cacao",
    image: "/images/menu/cafe.jpg",
    description: "Una selección de bebidas calientes y frías preparadas a base de café y cacao. Desde espressos y americanos hasta opciones con leche, sabores y distintas texturas, pensadas para acompañarte en cualquier momento del día.",
    subcategories: ["Espresso y americano", "Bebidas con leche", "Café frío"]
  },
  {
    id: 6,
    title: "Refreshers & Tea",
    image: "/images/menu/tea.jpg",
    description: "Una selección de bebidas refrescantes e infusiones para disfrutar frías o calientes. Limonadas frutales, matcha, hojicha, chai y diferentes variedades de té se combinan con sabores y preparaciones para cada preferencia.",
    subcategories: ["Limonadas frutales", "Matcha y hojicha", "Chai y tés"]
  },
  {
    id: 7,
    title: "Snacks",
    image: "/images/menu/snacks.jpg",
    description: "Una selección ligera y variada para complementar cualquier momento del día. Avena, chía, frutas, yogures y granola se combinan en opciones prácticas, con distintas texturas y sabores para disfrutar entre comidas.",
    subcategories: ["Avena y chía", "Frutas y yogures", "Granola"]
  },
  {
    id: 8,
    title: "Postres",
    image: "/images/menu/postre.JPG",
    description: "Una variedad de cookies, muffins, tortas y brownies para acompañar el café o disfrutar algo dulce. Incluye recetas clásicas y una selección de postres Zero, con alternativas sin azúcar añadida y opciones libres de gluten.",
    subcategories: ["Cookies y brownies", "Tortas y muffins", "Postres Zero"]
  },
];

// Altura de una fila de cards (h-[380px]) + gap entre filas (gap-6 = 24px)
const COLLAPSED_HEIGHT = 380;

export function MenuCategories() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="menu-categorias" className="bg-white py-24 px-6 lg:px-12 2xl:px-20 border-t border-black/5">
      <div className="w-full">
        <div className="mb-12 text-left">
          <h2 className="font-raleway text-4xl font-normal tracking-tight text-azul-socado sm:text-5xl lg:text-6xl lowercase">
            descubre nuestros productos
          </h2>
        </div>

        {/* Contenedor animado en altura */}
        <motion.div
          animate={{ height: expanded ? "auto" : COLLAPSED_HEIGHT }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => {
              const isExtra = index >= 4;
              return (
                <motion.div
                  key={cat.id}
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
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Panel blanco que sube al hacer hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-white border-t-2 border-[#063547] translate-y-[calc(100%-60px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                    <div className="h-[60px] flex items-center px-6">
                      <h3 className="font-raleway text-base font-semibold text-[#063547] lowercase leading-tight line-clamp-2">
                        {cat.title}
                      </h3>
                    </div>
                    <div className="px-6 pb-6 pt-1">
                      <p className="font-outfit text-sm text-[#6e7c7c] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-14 flex justify-center">
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
        </div>
      </div>
    </section>
  );
}
