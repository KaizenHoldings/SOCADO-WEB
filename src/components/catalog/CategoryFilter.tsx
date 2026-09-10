import React, { useRef } from "react";
import Image from "next/image";
import { SubcategoryBar, getActiveSubcategories } from "@/components/catalog/SubcategoryBar";

interface CategoryFilterProps {
  categories: any[];
  subcategories?: any[];
  selectedCategory: string | number;
  selectedSubcategory: string | number | null;
  onSelectCategory: (categoryId: string | number) => void;
  onSelectSubcategory: (subcategoryId: string | number | null) => void;
  /**
   * Attached to the category card grid only — deliberately excluding the
   * subcategory pills below it. StickyCategoryBar observes this element, so
   * its bottom edge is what decides when the docked bar appears.
   */
  gridRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * Set false when the parent renders the subcategory bar itself. Sticky is
   * constrained by the parent box, so on the catering page the bar must live
   * higher up the tree to have any scroll travel. BoxBuilder keeps the
   * default and is unaffected.
   */
  renderSubcategories?: boolean;
}

export function CategoryFilter({
  categories,
  subcategories = [],
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  gridRef,
  renderSubcategories = true,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  // Obtenemos las subcategorías de la categoría actual
  const activeSubcategories = getActiveSubcategories(subcategories, selectedCategory);
  // Preseleccionar la primera subcategoría
  React.useEffect(() => {
    // Solo cuando este componente es dueno de las pildoras. En catering las
    // renderiza la pagina, que tiene su propio efecto; sin esta guarda ambos
    // dispararian la misma seleccion.
    if (!renderSubcategories) return;
    if (selectedSubcategory === null && activeSubcategories.length > 0) {
      onSelectSubcategory(activeSubcategories[0].id);
    }
  }, [renderSubcategories, selectedSubcategory, selectedCategory, activeSubcategories.length, onSelectSubcategory]);

  return (
    <div className="w-full">
      {/* Categories Horizontal Grid - Edge to Edge */}
      <div ref={gridRef} className="group/slider relative w-full">
        {/* Botón Izquierda */}
        {categories.length > 2 && (
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover/slider:opacity-100 dark:bg-black/80 dark:hover:bg-black"
            aria-label="Deslizar a la izquierda"
          >
            <Image src="/icons/arrowLeft.svg" alt="Anterior" width={24} height={24} className="h-6 w-6 opacity-80" />
          </button>
        )}

        <div 
          ref={scrollRef} 
          className="flex w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const imageUrl = cat.image?.url || cat.image; // Payload media objects usually have .url
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  onSelectCategory(cat.id);
                  onSelectSubcategory(null);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`group relative flex h-[350px] min-w-[280px] sm:min-w-[320px] flex-1 shrink-0 snap-start flex-col overflow-hidden transition-all duration-300 ease-in-out sm:h-[400px] lg:h-[500px]`}
              >
                {/* Category Image */}
                <div className="absolute inset-0 bg-azul-socado ">
                  {imageUrl ? (
                    <Image
                      src={typeof imageUrl === 'string' ? imageUrl : ""}
                      alt={cat.name}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isActive ? "scale-105" : "group-hover:scale-105"
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center opacity-60">
                      <Image src="/icons/logo_oscuro.svg" alt="Socado" width={120} height={40} className="dark:invert" />
                    </div>
                  )}
                </div>
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-azul-socado/90 via-azul-socado/30 to-transparent transition-opacity" />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left w-full">
                  <span
                    className={`font-outfit text-xl tracking-wide sm:text-xl lg:text-xl block w-full truncate lowercase transition-all duration-300 ease-in-out ${
                      isActive ? "text-[#f2eae6] font-bold" : "text-white/75 font-normal"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón Derecha */}
        {categories.length > 2 && (
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover/slider:opacity-100 dark:bg-black/80 dark:hover:bg-black"
            aria-label="Deslizar a la derecha"
          >
            <Image src="/icons/arrowRight.svg" alt="Siguiente" width={24} height={24} className="h-6 w-6 opacity-80" />
          </button>
        )}
      </div>

      {/*
        Subcategories (Pills). On the catering page the parent renders these
        itself (renderSubcategories={false}) so that sticky has a tall enough
        containing block; BoxBuilder still renders them here.
      */}
      {renderSubcategories && (
        <SubcategoryBar
          subcategories={activeSubcategories}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={onSelectSubcategory}
        />
      )}
    </div>
  );
}
