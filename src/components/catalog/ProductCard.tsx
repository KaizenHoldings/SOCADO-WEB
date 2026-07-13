"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/catalog";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onAdd }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div 
      className="group flex cursor-pointer flex-col"
      onClick={() => onAdd(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen Portrait Edge-to-Edge */}
      <div 
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#f2eae6] dark:bg-[#042430] rounded-2xl"
      >
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`${product.name} - ${idx}`}
            fill
            className={`transition-all duration-700 ease-out group-hover:scale-105 ${
              img.includes('isotipo.png') 
                ? 'object-contain p-8 opacity-30 dark:opacity-50' 
                : 'object-cover'
            } ${
              idx === currentImageIndex 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0'
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ))}
      </div>

      {/* Contenido Minimalista */}
      <div className="flex flex-col pt-3 pb-2">
        <div className="flex items-center justify-between border-b border-[#063547]/10 pb-2 dark:border-white/10">
          <h3 className="font-raleway text-sm font-bold text-[#063547] dark:text-[#f2eae6]">
            {product.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="text-[#063547] transition-colors hover:text-[#b45b38] dark:text-[#f2eae6] dark:hover:text-[#b45b38]"
            aria-label="Agregar a cotización"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        {product.description && (
          <div className="pt-2">
            <p className="line-clamp-2 text-xs font-light text-[#6e7c7c] dark:text-[#b2b5a9]">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
