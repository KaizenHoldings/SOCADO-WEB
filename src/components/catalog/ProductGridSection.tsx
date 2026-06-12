"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/lib/types/catalog";

interface ProductGridSectionProps {
  filteredCategories: any[];
  selectedCategory: string | number;
  isLoadingProducts: boolean;
  filteredProducts: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGridSection({
  filteredCategories,
  selectedCategory,
  isLoadingProducts,
  filteredProducts,
  onViewDetails,
  onAddToCart,
}: ProductGridSectionProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-12">
      {/* Título de la categoría activa y Grid de Productos */}
      <div className="mt-6 min-h-[50vh]">
        <div className="mb-8 border-t border-black/10 pt-8 dark:border-white/10">
          <h2 className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6]">
            {filteredCategories.find((c) => c.id === selectedCategory)?.name || "Categoría"}
          </h2>
          <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9]">
            {filteredCategories.find((c) => c.id === selectedCategory)?.description}
          </p>
        </div>

        {isLoadingProducts ? (
          <div className="flex justify-center py-20 text-xl font-bold text-[#6e7c7c]">
            Cargando productos...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-black/5 flex items-center justify-center dark:bg-white/5">
              <span className="text-2xl">🍃</span>
            </div>
            <h3 className="font-raleway text-xl font-bold text-[#063547] dark:text-[#f2eae6]">
              Explorando nuevos sabores
            </h3>
            <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9]">
              No hay productos en esta categoría por el momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
