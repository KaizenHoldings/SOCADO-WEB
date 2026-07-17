"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/lib/types/catalog";
import Image from "next/image";

interface ProductGridSectionProps {
  filteredCategories: any[];
  selectedCategory: string | number;
  isLoadingProducts: boolean;
  filteredProducts: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  page?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export function ProductGridSection({
  filteredCategories,
  selectedCategory,
  isLoadingProducts,
  filteredProducts,
  onViewDetails,
  onAddToCart,
  page = 1,
  hasNextPage = false,
  hasPrevPage = false,
  onNextPage,
  onPrevPage,
}: ProductGridSectionProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-12">
      {/* Título de la categoría activa y Grid de Productos */}
      <div className="mt-6 min-h-[calc(100vh-200px)]">
        <div className="mb-8 border-t border-black/10 pt-8 dark:border-white/10">
          <h2 className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6] lowercase">
            {filteredCategories.find((c) => c.id === selectedCategory)?.name || "Categoría"}
          </h2>
          <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9] lowercase">
            {filteredCategories.find((c) => c.id === selectedCategory)?.description}
          </p>
        </div>

        {isLoadingProducts ? (
          <div className="flex justify-center py-20">
            <Image src="/images/socado-loader.svg" alt="Cargando productos..." width={180} height={40} priority className="animate-pulse" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewDetails}
                  onAdd={onViewDetails}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {(hasPrevPage || hasNextPage) && (
              <div className="mt-12 flex items-center justify-center space-x-4 pb-8">
                <button
                  onClick={onPrevPage}
                  disabled={!hasPrevPage}
                  className="rounded-full border border-[#063547]/20 px-6 py-2 font-outfit text-sm font-semibold lowercase tracking-wider text-[#063547] transition-all hover:bg-[#063547] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:text-[#f2eae6] dark:hover:bg-white dark:hover:text-[#042430]"
                >
                  Anterior
                </button>
                <span className="font-outfit text-sm font-semibold text-[#6e7c7c] dark:text-[#b2b5a9]">
                  Página {page}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={!hasNextPage}
                  className="rounded-full border border-[#063547]/20 px-6 py-2 font-outfit text-sm font-semibold lowercase tracking-wider text-[#063547] transition-all hover:bg-[#063547] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:text-[#f2eae6] dark:hover:bg-white dark:hover:text-[#042430]"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-black/5 flex items-center justify-center dark:bg-white/5">
              <Image src="/icons/isotipo.svg" alt="Socado Isotipo" width={28} height={28} className="opacity-80 dark:invert" />
            </div>
            <h3 className="font-raleway text-xl font-bold text-[#063547] dark:text-[#f2eae6] lowercase">
              Explorando nuevos sabores
            </h3>
            <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9] lowercase">
              No hay productos en esta categoría por el momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
