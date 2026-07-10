import React from "react";
import Image from "next/image";
import { Product } from "@/lib/types/catalog";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onAdd }: ProductCardProps) {
  return (
    <div 
      className="group flex flex-col transition-all cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Imagen Edge-to-Edge */}
      <div 
        className="relative aspect-[3/3] w-full overflow-hidden rounded-2xl bg-[#f2eae6] dark:bg-black/20"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Contenido Limpio */}
      <div className="flex flex-1 flex-col pt-4 pb-4 px-2">
        <div className="flex-1">
          <h3 className="font-raleway text-lg font-bold leading-tight text-[#063547] dark:text-[#f2eae6] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-sm font-light text-[#6e7c7c] dark:text-[#b2b5a9]">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#b45b38]">
              Min {product.minPortions}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="group/btn flex h-10 w-10 items-center justify-center rounded-full border border-[#063547]/20 text-[#063547] transition-all hover:border-[#b45b38] hover:bg-[#b45b38] hover:text-white dark:border-white/20 dark:text-[#f2eae6] dark:hover:border-[#b45b38]"
            aria-label="Agregar a cotización"
          >
            <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
