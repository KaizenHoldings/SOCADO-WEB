"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/catalog";
import { X, Info, Thermometer, Utensils, Flame } from "lucide-react";
import { useCartStore } from "@/lib/store/cart.store";

interface ProductVariationsDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductVariationsDrawer({ product, isOpen, onClose }: ProductVariationsDrawerProps) {
  const { addItem, openDrawer } = useCartStore();
  
  // Estado para guardar la variación seleccionada (label)
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  
  // Estado para la cantidad a añadir
  const [quantity, setQuantity] = useState<number>(1);
  
  // Resetear el estado cuando cambie el producto
  useEffect(() => {
    if (product) {
      setSelectedVariation('');
      setQuantity(1);
    }
  }, [product]);

  // Prevenir scroll en el body cuando el drawer está abierto
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

  const handleVariationChange = (choiceLabel: string) => {
    setSelectedVariation(choiceLabel);
  };

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    let totalAdjustments = 0;
    
    if (product.variations && selectedVariation) {
      const choice = product.variations.find(v => v.label === selectedVariation);
      if (choice) {
        if (typeof choice.price === 'number') {
          price = choice.price;
        }
        if (typeof choice.priceAdjustment === 'number') {
          totalAdjustments += choice.priceAdjustment;
        }
      }
    }
    return price + totalAdjustments;
  }, [product, selectedVariation]);

  const activeContent = useMemo(() => {
    let activeImage = product?.image || "/images/placeholder.jpg";
    let activeDescription = product?.description || "";

    if (product && product.variations && selectedVariation) {
      const choice = product.variations.find(v => v.label === selectedVariation);
      if (choice) {
        if (choice.image) {
          activeImage = typeof choice.image === 'string' ? choice.image : choice.image.url || activeImage;
        }
        if (choice.description) {
          activeDescription = choice.description;
        }
      }
    }

    return { image: activeImage, description: activeDescription };
  }, [product, selectedVariation]);

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (product) {
      addItem(product, quantity, selectedVariation);
      onClose();
      openDrawer(); // Abre el carrito para mostrar que se añadió
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[110] flex w-full flex-col bg-white shadow-xl sm:max-w-md dark:bg-[#042430]">
        
        {/* Header con botón cerrar superpuesto a la imagen o arriba */}
        <div className="relative h-28 w-full flex-shrink-0 bg-[#f2eae6] dark:bg-black/20">
          <Image
            src={activeContent.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6]">
              {product.name}
            </h2>
            <div className="flex-shrink-0 pt-1">
              <span className="font-raleway text-2xl font-bold text-[#b45b38]">
                ${unitPrice.toFixed(2)}
              </span>
            </div>
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-[#b45b38] px-3 py-1 text-xs font-bold text-white shadow-sm"
                >
                  <Flame className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {activeContent.description && (
            <p className="mb-6 text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">
              {activeContent.description}
            </p>
          )}

          {/* Variaciones */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="mb-3 font-semibold text-[#063547] dark:text-[#f2eae6]">
                Opciones Disponibles
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedVariation}
                  onChange={(e) => handleVariationChange(e.target.value)}
                  className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#063547] focus:border-[#b45b38] focus:outline-none focus:ring-1 focus:ring-[#b45b38] dark:border-white/10 dark:bg-[#063547] dark:text-[#f2eae6]"
                >
                  <option value="">Esta versión (${product.price.toFixed(2)})</option>
                  {product.variations.map((choice, cIdx) => (
                    <option key={cIdx} value={choice.label}>
                      {choice.label}{' '}
                      {typeof choice.price === 'number' 
                        ? `($${choice.price.toFixed(2)})` 
                        : typeof choice.priceAdjustment === 'number' && choice.priceAdjustment !== 0 
                          ? `(${choice.priceAdjustment > 0 ? '+' : ''}$${choice.priceAdjustment.toFixed(2)})` 
                          : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Detalles específicos */}
          {product.details && (
            <div className="space-y-4 rounded-xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/5">

              {product.details?.servingTemp && (
                <div className="flex items-start gap-3 border-t border-black/5 pt-4 dark:border-white/5">
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#042430]">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-semibold text-[#063547] dark:text-[#f2eae6]">Cantidad</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-lg font-medium text-[#063547] hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-12 rounded-md border border-black/10 bg-transparent px-1 py-1 text-center text-sm font-bold text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:text-[#f2eae6]"
              />
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-lg font-medium text-[#063547] hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mb-4 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
            <span className="font-semibold text-[#063547] dark:text-[#f2eae6]">Total Calculado</span>
            <span className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="w-full rounded-full bg-[#b45b38] py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#a04b2b]"
          >
            Añadir a la cotización
          </button>
        </div>

      </div>
    </>
  );
}
