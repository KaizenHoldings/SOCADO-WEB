"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/types/catalog";

interface BoxSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Human-readable category name, e.g. "Bollería" */
  slotName: string;
  /** How many units this slot requires */
  requiredQty: number;
  /** Products currently selected for this slot */
  items: { product: Product; quantity: number }[];
  /** Remove ALL units of a product from this slot */
  onRemoveAll: (productId: string) => void;
}

export function BoxSlotModal({
  isOpen,
  onClose,
  slotName,
  requiredQty,
  items,
  onRemoveAll,
}: BoxSlotModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open; restore on close/unmount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Move focus to the close button for keyboard users
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Dismiss on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="slot-modal-title"
      className="fixed inset-0 z-[110] flex items-end justify-center"
    >
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-azul-socado/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Bottom-sheet panel ── */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-ivory shadow-2xl animate-in fade-in">

        {/* Drag handle hint */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="h-1 w-10 rounded-full bg-azul-socado/15" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-azul-socado/10 px-6 pb-4 pt-3">
          <div>
            <p className="font-raleway text-[10px] font-bold uppercase tracking-[0.18em] text-gris-metropolis">
              productos seleccionados
            </p>
            <h2
              id="slot-modal-title"
              className="mt-0.5 font-raleway text-xl font-bold lowercase text-azul-socado"
            >
              {slotName}
            </h2>
            <p className="mt-0.5 font-outfit text-xs text-gris-metropolis">
              {selectedQty}&nbsp;de&nbsp;{requiredQty}&nbsp;
              {requiredQty === 1 ? "seleccionado" : "seleccionados"}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-azul-socado/10 text-azul-socado transition-colors hover:bg-azul-socado/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-socado/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product list */}
        <div className="px-6 py-5">
          {items.length === 0 ? (
            <p className="py-8 text-center font-outfit text-sm text-gris-metropolis">
              Aún no has elegido productos en esta categoría.
            </p>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-azul-socado/10 bg-white px-4 py-3 shadow-sm"
                >
                  {/* Name + quantity */}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-outfit text-sm font-bold text-azul-socado">
                      {item.product.name}
                    </p>
                    <p className="font-outfit text-xs text-gris-metropolis">
                      {item.quantity}&nbsp;
                      {item.quantity === 1 ? "unidad" : "unidades"}
                    </p>
                  </div>

                  {/* Remove-all action */}
                  <button
                    onClick={() => onRemoveAll(item.product.id)}
                    aria-label={`Eliminar ${item.product.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-terra transition-colors hover:bg-terra/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra/40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — close affordance */}
        <div className="px-6 pb-8">
          <button
            onClick={onClose}
            className="w-full rounded-full border border-azul-socado/20 bg-white py-3 font-outfit text-sm font-bold lowercase tracking-wider text-azul-socado transition-colors hover:bg-azul-socado/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-socado/40"
          >
            cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
