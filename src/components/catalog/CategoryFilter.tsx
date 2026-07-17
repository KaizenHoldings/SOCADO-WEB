import React, { useRef } from "react";
import Image from "next/image";

interface CategoryFilterProps {
  categories: any[];
  subcategories?: any[];
  selectedCategory: string | number;
  selectedSubcategory: string | number | null;
  onSelectCategory: (categoryId: string | number) => void;
  onSelectSubcategory: (subcategoryId: string | number | null) => void;
}

export function CategoryFilter({
  categories,
  subcategories = [],
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
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
  const activeSubcategories = subcategories.filter((sub) => {
    const parentId = sub.parentCategory?.id ?? sub.parentCategory;
    return String(parentId) === String(selectedCategory);
  }); 
  // Preseleccionar la primera subcategoría
  React.useEffect(() => {
    if (selectedSubcategory === null && activeSubcategories.length > 0) {
      onSelectSubcategory(activeSubcategories[0].id);
    }
  }, [selectedSubcategory, selectedCategory, activeSubcategories.length, onSelectSubcategory]);

  return (
    <div className="w-full">
      {/* Categories Horizontal Grid - Edge to Edge */}
      <div className="group/slider relative w-full">
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
                className={`group relative flex h-[350px] min-w-[280px] sm:min-w-[320px] flex-1 shrink-0 snap-start flex-col overflow-hidden transition-all sm:h-[400px] lg:h-[500px] ${
                  isActive ? "opacity-100" : "opacity-95 hover:opacity-100"
                }`}
              >
                {/* Category Image */}
                <div className="absolute inset-0 bg-[#f2eae6] dark:bg-black/20">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#063547]/90 via-[#063547]/30 to-transparent transition-opacity" />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left w-full">
                  <span
                    className={`font-outfit text-xl font-bold tracking-wide text-[#f2eae6] sm:text-xl lg:text-xl block w-full truncate lowercase`}
                  >
                    {cat.name}
                  </span>
                  {isActive && (
                    <div className="mt-4 h-1.5 w-12 bg-[#b45b38] rounded-full" />
                  )}
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

      {/* Subcategories (Pills) */}
      {activeSubcategories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 md:gap-3 px-6">

          {activeSubcategories.map((sub) => {
            const isSubActive = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubcategory(sub.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold lowercase tracking-wider transition-all md:text-sm ${
                  isSubActive
                    ? "bg-celeste-socado text-white shadow-md"
                    : "bg-black/5 text-[#6e7c7c] hover:bg-black/10 hover:text-[#063547] dark:bg-white/5 dark:text-[#b2b5a9] dark:hover:bg-white/10 dark:hover:text-[#f2eae6]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
