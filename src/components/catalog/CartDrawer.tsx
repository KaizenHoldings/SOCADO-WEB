"use client";

import { useCartStore } from "@/lib/store/cart.store";
import { X, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();

  if (!isDrawerOpen) return null;

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Vista destacada de los últimos 3 productos agregados
  const recentItems = [...items].reverse().slice(0, 3);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/catering/checkout");
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />
      
      <div className="fixed inset-y-0 right-0 z-[110] flex w-full flex-col bg-white shadow-xl sm:max-w-md dark:bg-[#042430]">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
          <h2 className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">
            Tu Cotización
          </h2>
          <button 
            onClick={closeDrawer}
            className="p-2 text-[#6e7c7c] hover:text-[#063547] dark:text-[#b2b5a9] dark:hover:text-[#f2eae6]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-2xl dark:bg-white/5">
                🛒
              </div>
              <p className="font-bold text-[#063547] dark:text-[#f2eae6]">Tu carrito está vacío</p>
              <p className="mt-2 text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">
                Explora nuestro catálogo y agrega deliciosos productos.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Vista de últimos 3 productos (Requisito) */}
              <div className="rounded-xl bg-black/5 p-4 dark:bg-white/5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#b45b38]">
                  Agregados Recientemente
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recentItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-[#063547]">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#063547] line-clamp-1 dark:text-[#f2eae6]">{item.product.name}</p>
                        <p className="text-[#6e7c7c] dark:text-[#b2b5a9]">Cant: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista completa */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-[#063547] dark:text-[#f2eae6]">{item.product.name}</h4>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#6e7c7c] hover:text-[#b45b38] dark:text-[#b2b5a9]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[#b45b38]">
                        ${item.product.price.toFixed(2)} c/u
                      </p>
                      
                      <div className="mt-auto flex items-center gap-3 pt-2">
                        <label className="text-xs font-bold text-[#6e7c7c] dark:text-[#b2b5a9]">
                          Porciones:
                        </label>
                        <input 
                          type="number" 
                          min={item.product.minPortions || 1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-16 rounded-md border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10 dark:text-[#f2eae6]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/5 bg-black/5 p-6 dark:border-white/5 dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-[#6e7c7c] dark:text-[#b2b5a9]">Subtotal Estimado</span>
              <span className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">
                ${total.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b45b38] py-4 font-bold text-white transition-opacity hover:opacity-90"
            >
              Crear cotización <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
