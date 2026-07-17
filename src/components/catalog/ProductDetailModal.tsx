import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/catalog";
import { X, Info, Thermometer, Utensils } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product, quantity?: number) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAdd }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#063547]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#f2eae6] shadow-2xl dark:bg-[#063547] sm:flex-row animate-in fade-in zoom-in duration-200">
        
        {/* Botón Cerrar (Móvil) */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#063547] backdrop-blur-md sm:hidden dark:bg-black/50 dark:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Imagen */}
        <div className="relative h-64 w-full sm:h-auto sm:w-1/2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-10">
          <div className="mb-6 flex items-start justify-between">
            <div>
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="rounded-full bg-[#b45b38]/10 px-3 py-1 text-xs font-bold text-[#b45b38] dark:bg-[#b45b38]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h2 className="font-raleway text-2xl font-bold text-[#063547] sm:text-3xl dark:text-[#f2eae6]">
                {product.name}
              </h2>
              <p className="mt-2 text-lg text-[#6e7c7c] dark:text-[#b2b5a9]">
                {product.description}
              </p>
            </div>
            
            {/* Botón Cerrar (Desktop) */}
            <button 
              onClick={onClose}
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#063547] hover:bg-black/10 sm:flex dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Detalles específicos */}
          {(product.details) && (
            <div className="mb-8 space-y-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-[#1a1f24]">
              {product.details?.servingTemp && (
                <div className="flex items-start gap-3">
                  <Thermometer className="mt-0.5 h-5 w-5 shrink-0 text-[#b45b38]" />
                  <div>
                    <h4 className="font-semibold text-[#063547] dark:text-[#f2eae6]">Temperatura de Servicio</h4>
                    <p className="text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">{product.details.servingTemp}</p>
                  </div>
                </div>
              )}

              {product.details?.presentation && (
                <div className="flex items-start gap-3 border-t border-black/5 pt-4 dark:border-white/5">
                  <Utensils className="mt-0.5 h-5 w-5 shrink-0 text-[#b45b38]" />
                  <div>
                    <h4 className="font-semibold text-[#063547] dark:text-[#f2eae6]">Presentación</h4>
                    <p className="text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">{product.details.presentation}</p>
                  </div>
                </div>
              )}

              {product.details?.allergens && product.details.allergens.length > 0 && (
                <div className="border-t border-black/5 pt-4 dark:border-white/5">
                  <h4 className="mb-2 font-semibold text-[#063547] dark:text-[#f2eae6]">Alérgenos</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.details.allergens.map((allergen, idx) => (
                      <span key={idx} className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Modal */}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between border-t border-black/10 pt-6 dark:border-white/10 gap-4">
            <div className="flex items-center gap-4">
              <input 
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded-lg border border-gray-300 p-2 text-center dark:bg-transparent dark:border-white/20"
              />
              <div className="text-center sm:text-left">
                <span className="block text-sm font-medium text-[#6e7c7c] dark:text-[#b2b5a9]">Total estimado</span>
                <span className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6]">
                  REF {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onAdd(product, quantity);
                onClose();
              }}
              className="w-full sm:w-auto rounded-full bg-[#b45b38] px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#a04b2b]"
            >
              Agregar a Cotización
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
