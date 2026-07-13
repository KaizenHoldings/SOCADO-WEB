"use client";

import { useCartStore } from "@/lib/store/cart.store";
import { X, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { calculateDiscounts, getItemUnitPrice } from "@/lib/utils/discount.utils";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQuantity, discountRules, fetchDiscountRules, taxes, fetchTaxes } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (isDrawerOpen) {
      fetchDiscountRules();
      fetchTaxes();
    }
  }, [isDrawerOpen, fetchDiscountRules, fetchTaxes]);

  if (!isDrawerOpen) return null;

  const { totalOriginal, totalDiscount, totalTax, totalFinal, appliedRules, appliedTaxes } = calculateDiscounts(items, discountRules, taxes);

  // Vista destacada de los últimos 3 productos agregados
  const recentItems = [...items].reverse().slice(0, 3);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/catering/checkout");
  };

  // Validación de mínimos por subcategoría
  const subcategoryTotals: Record<string, { name: string, total: number, minRequired: number }> = {};
  
  items.forEach(item => {
    const subCat = item.product.subCategory;
    if (subCat && typeof subCat === 'object' && subCat.id) {
      const id = String(subCat.id);
      if (!subcategoryTotals[id]) {
        subcategoryTotals[id] = {
          name: subCat.name || 'Categoría',
          total: 0,
          minRequired: subCat.minQuantity || 5 // default 5
        };
      }
      subcategoryTotals[id].total += item.quantity;
    }
  });

  const unmetSubcategories = Object.values(subcategoryTotals).filter(sub => sub.total < sub.minRequired);

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
                    <div key={item.id || item.product.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-[#063547]">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          fill 
                          className={item.product.image.includes('isotipo.png') ? 'object-contain p-2 opacity-30 dark:opacity-50' : 'object-cover'} 
                        />
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
                  <div key={item.id || item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name} 
                        fill 
                        className={item.product.image.includes('isotipo.png') ? 'object-contain p-4 opacity-30 dark:opacity-50' : 'object-cover'} 
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-[#063547] dark:text-[#f2eae6]">{item.product.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id || item.product.id)}
                          className="text-[#6e7c7c] hover:text-[#b45b38] dark:text-[#b2b5a9]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {item.selectedVariation && (
                        <div className="mt-1 flex flex-col gap-0.5 text-xs text-[#6e7c7c] dark:text-[#b2b5a9]">
                          <span>Versión: <span className="font-medium text-[#063547] dark:text-[#f2eae6]">{item.selectedVariation}</span></span>
                        </div>
                      )}

                      <p className="mt-1 text-sm font-bold text-[#b45b38]">
                        ${getItemUnitPrice(item).toFixed(2)} c/u
                      </p>
                      
                      <div className="mt-auto flex items-center gap-3 pt-2">
                        <label className="text-xs font-bold text-[#6e7c7c] dark:text-[#b2b5a9]">
                          Porciones:
                        </label>
                        <input 
                          type="number" 
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id || item.product.id, parseInt(e.target.value) || 1)}
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
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[#6e7c7c] dark:text-[#b2b5a9]">Subtotal</span>
              <span className="font-bold text-[#063547] dark:text-[#f2eae6]">
                ${totalOriginal.toFixed(2)}
              </span>
            </div>
            
            {appliedRules.length > 0 && appliedRules.map((rule, idx) => (
              <div key={idx} className="mb-2 flex items-center justify-between text-sm text-[#b45b38]">
                <span className="font-bold">{rule.ruleName} ({rule.percentage}%)</span>
                <span className="font-bold">
                  -${rule.discountAmount.toFixed(2)}
                </span>
              </div>
            ))}

            {appliedTaxes && appliedTaxes.length > 0 && appliedTaxes.map((tax, idx) => (
              <div key={`tax-${idx}`} className="mb-2 flex items-center justify-between text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">
                <span className="font-bold">{tax.taxName} ({tax.percentage}%)</span>
                <span className="font-bold">
                  +${tax.taxAmount.toFixed(2)}
                </span>
              </div>
            ))}

            <div className="mb-4 mt-2 border-t border-black/5 pt-2 flex items-center justify-between">
              <span className="font-bold text-[#6e7c7c] dark:text-[#b2b5a9]">Total Estimado</span>
              <span className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">
                ${totalFinal.toFixed(2)}
              </span>
            </div>

            {unmetSubcategories.length > 0 && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <p className="font-bold mb-1">Mínimo por categoría no alcanzado:</p>
                <ul className="list-disc pl-4">
                  {unmetSubcategories.map(sub => (
                    <li key={sub.name}>
                      {sub.name}: Llevas {sub.total}, por subcategoría debes elegir al menos {sub.minRequired}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={unmetSubcategories.length > 0}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white transition-opacity ${unmetSubcategories.length > 0 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#b45b38] hover:opacity-90'}`}
            >
              Crear cotización <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
