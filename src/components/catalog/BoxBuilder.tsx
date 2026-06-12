"use client";

import { useState } from "react";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/lib/types/catalog";
import { BoxDefinition, BoxRequirement } from "@/lib/types/boxes";
import { useCartStore } from "@/lib/store/cart.store";
import { CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

interface BoxBuilderProps {
  combos: BoxDefinition[];
  products: Product[];
  subcategories: any[];
  onBoxChange?: (boxName: string) => void;
}

export function BoxBuilder({ combos, products, subcategories, onBoxChange }: BoxBuilderProps) {
  const [selectedBoxId, setSelectedBoxId] = useState<string | number>(combos[0]?.id || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | number | null>(null);
  
  // selections[reqIndex] = array of { product, quantity }
  const [selections, setSelections] = useState<{ [reqIndex: number]: { product: Product, quantity: number }[] }>({});
  const [boxQuantity, setBoxQuantity] = useState<number>(1);

  const addItemToCart = useCartStore(state => state.addItem);

  const selectedBox = combos.find(b => b.id === selectedBoxId) || combos[0];

  if (!selectedBox) {
    return <div className="p-10 text-center">Cargando combos...</div>;
  }

  // Map box requirements to look like subcategories for the CategoryFilter
  const reqSubcategories = selectedBox.requirements.map((req, idx) => ({
    id: idx, // usamos el index como ID
    name: req.subcategoryName,
    parentCategory: selectedBox.id
  }));

  // Handle Box Category Change
  const handleSelectBox = (boxId: string | number) => {
    setSelectedBoxId(boxId);
    setSelectedSubcategory(null);
    setSelections({}); // Reset selections when changing box type
    setBoxQuantity(1);
    
    const box = combos.find(b => b.id === boxId);
    if (box && onBoxChange) {
      onBoxChange(box.name);
    }
  };

  // Productos filtrados según la subcategoría seleccionada (requirement)
  const filteredProducts = (() => {
    if (selectedSubcategory === null) return [];
    
    const reqIndex = Number(selectedSubcategory);
    const requirement = selectedBox.requirements[reqIndex];
    
    if (!requirement) return [];

    // Filtramos los productos reales por el ID de la categoría (categoryCateringId)
    const realProducts = products.filter(p => {
      const pCatId = p.categoryCateringId;
      return pCatId && String(pCatId) === String(requirement.categoryId);
    });
    
    return realProducts;
  })();

  // Manejar adición de producto a la caja en construcción
  const handleAddProduct = (product: Product, reqIndex: number) => {
    const requirement = selectedBox.requirements[reqIndex];
    const currentSelected = selections[reqIndex] || [];
    
    const currentTotalQty = currentSelected.reduce((sum, item) => sum + item.quantity, 0);

    if (currentTotalQty >= requirement.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: `Ya has alcanzado el límite de ${requirement.quantity} para ${requirement.subcategoryName}`,
        confirmButtonColor: '#b45b38',
        background: 'var(--tw-bg-opacity, #ffffff)', // Falls back but allows dark mode if configured
        color: '#063547',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-3xl border border-black/10 shadow-lg bg-white dark:bg-[#042430] dark:border-white/10',
          title: 'font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]',
          htmlContainer: 'text-[#6e7c7c] dark:text-[#b2b5a9] mt-2',
          confirmButton: 'rounded-full px-8 py-3 font-bold uppercase tracking-wider text-white bg-[#b45b38] hover:bg-[#b45b38]/90 transition-all shadow-md hover:shadow-lg mt-4'
        }
      });
      return;
    }

    const existingItemIndex = currentSelected.findIndex(item => item.product.id === product.id);
    let newSelected = [...currentSelected];

    if (existingItemIndex >= 0) {
      newSelected[existingItemIndex].quantity += 1;
    } else {
      newSelected.push({ product, quantity: 1 });
    }

    setSelections(prev => ({
      ...prev,
      [reqIndex]: newSelected
    }));
  };

  const handleRemoveProduct = (productId: string, reqIndex: number) => {
    const currentSelected = selections[reqIndex] || [];
    const newSelected = currentSelected.map(item => 
      item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);

    setSelections(prev => ({
      ...prev,
      [reqIndex]: newSelected
    }));
  };

  // Validar si la caja está completa
  const isBoxComplete = selectedBox.requirements.every((req, idx) => {
    const selected = selections[idx] || [];
    const total = selected.reduce((sum, item) => sum + item.quantity, 0);
    return total === req.quantity;
  });

  // Add the built box to the global cart
  const handleAddBoxToCart = () => {
    if (!isBoxComplete) return;

    // Crear descripcion de la caja
    let descLines: string[] = [];
    Object.values(selections).forEach(items => {
      items.forEach(item => {
        descLines.push(`${item.quantity}x ${item.product.name}`);
      });
    });

    const tens = Math.floor(boxQuantity / 10);
    const ones = boxQuantity % 10;

    if (tens > 0) {
      const boxProductTen: Product = {
        id: `box-${selectedBox.id}-ten-${Date.now()}`,
        name: `Box ${selectedBox.name} (Para 10 personas)`,
        description: descLines.join(" + "),
        price: selectedBox.priceTen,
        categoryId: "box",
        subcategoryId: String(selectedBox.id),
        image: selectedBox.imageUrl || "/images/placeholder.jpg",
        minPortions: 1,
        tags: ["Arma tu Box"]
      };
      addItemToCart(boxProductTen, tens);
    }

    if (ones > 0) {
      const boxProductInd: Product = {
        id: `box-${selectedBox.id}-ind-${Date.now()}`,
        name: `Box ${selectedBox.name} (Individual)`,
        description: descLines.join(" + "),
        price: selectedBox.priceIndividual,
        categoryId: "box",
        subcategoryId: String(selectedBox.id),
        image: selectedBox.imageUrl || "/images/placeholder.jpg",
        minPortions: 1,
        tags: ["Arma tu Box"]
      };
      addItemToCart(boxProductInd, ones);
    }
    
    // Reset after adding
    setSelections({});
    setSelectedSubcategory(null);
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: '¡Caja agregada al carrito exitosamente!',
      showConfirmButton: false,
      timer: 2000,
      background: 'var(--tw-bg-opacity, #ffffff)',
      color: '#063547',
      customClass: {
        popup: 'rounded-3xl border border-black/10 shadow-lg bg-white dark:bg-[#042430] dark:border-white/10',
        title: 'font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]',
        htmlContainer: 'text-[#6e7c7c] dark:text-[#b2b5a9] mt-2'
      }
    });
  };

  return (
    <div className="w-full">
      {/* 1. Selector de Cajas (usa la misma UI que Categories) */}
      <CategoryFilter
        categories={combos.map(b => ({ id: b.id, name: b.name, description: b.description, image: b.imageUrl }))}
        subcategories={reqSubcategories}
        selectedCategory={selectedBoxId}
        selectedSubcategory={selectedSubcategory}
        onSelectCategory={handleSelectBox}
        onSelectSubcategory={setSelectedSubcategory}
      />

      {/* Main Container for Grid and Sidebar */}
      <div className=" sticky top-100 mx-auto max-w-[1400px] px-6 lg:px-12 mt-6 flex flex-col lg:flex-row gap-8 items-start pb-20">
        
        {/* Left Side: Product Grid */}
        <section className="flex-1 w-full min-h-[40vh]">
        {selectedSubcategory === null ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-2xl dark:bg-white/5">
                📦
              </div>
              <h3 className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">
                Comienza a armar tu Box
              </h3>
              <p className="mt-2 max-w-md text-[#6e7c7c] dark:text-[#b2b5a9]">
                Selecciona una de las opciones arriba (ej. Bollería, Jugo) para ver los productos disponibles y agregarlos a tu caja.
              </p>
          </div>
        ) : (
          <div className="min-h-[40vh] ">
            <div className="mb-8 border-t border-black/10 pt-8 dark:border-white/10">
              <h2 className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6]">
                Elige tu {reqSubcategories.find(r => r.id === selectedSubcategory)?.name}
              </h2>
              <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9]">
                Selecciona {selectedBox.requirements[Number(selectedSubcategory)].quantity} opción(es).
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => {}} // Could open modal if needed
                    onAdd={(p) => handleAddProduct(p, Number(selectedSubcategory))}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[#6e7c7c] dark:text-[#b2b5a9]">No hay productos disponibles para esta categoría.</p>
            )}
          </div>
        )}
        </section>

        {/* Right Side: Sidebar */}
        <aside className="sticky top-[170px]  flex-shrink-0 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <h3 className="font-raleway text-xl font-bold text-[#063547] dark:text-[#f2eae6] border-b border-black/10 dark:border-white/10 pb-4">
             Resumen: {selectedBox.name}
          </h3>

          {/* Progress Indicators and Selected Items */}
          <div className="flex flex-col gap-4">
            {selectedBox.requirements.map((req, idx) => {
              const selectedItems = selections[idx] || [];
              const selectedQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
              const isMet = selectedQty === req.quantity;
              
              return (
                <div key={idx} className={`flex flex-col gap-2 rounded-2xl p-4 border transition-colors ${isMet ? 'border-[#6c7a67]/30 bg-[#6c7a67]/5' : 'border-black/10 bg-white dark:border-white/10 dark:bg-[#042430]'}`}>
                  
                  {/* Header del requerimiento */}
                  <div className={`flex items-center justify-between text-sm font-bold ${isMet ? 'text-[#6c7a67]' : 'text-[#6e7c7c] dark:text-[#b2b5a9]'}`}>
                    <div className="flex items-center gap-2">
                      {isMet ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <span>{req.subcategoryName}</span>
                    </div>
                    <span>{selectedQty} / {req.quantity}</span>
                  </div>

                  {/* Lista de productos seleccionados */}
                  {selectedItems.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {selectedItems.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between gap-2 text-xs bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg border border-transparent shadow-sm">
                          <span className="truncate flex-1 font-bold text-[#063547] dark:text-[#f2eae6]" title={item.product.name}>
                            {item.product.name}
                          </span>
                          <div className="flex items-center gap-2 bg-white dark:bg-[#042430] rounded-full px-1.5 py-1 shadow-sm">
                            <button 
                              onClick={() => handleRemoveProduct(item.product.id, idx)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#6e7c7c] text-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="font-bold w-5 text-center text-sm text-[#063547] dark:text-[#f2eae6]">{item.quantity}</span>
                            <button 
                              onClick={() => handleAddProduct(item.product, idx)}
                              disabled={selectedQty >= req.quantity}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#6e7c7c] text-lg font-bold transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Checkout Area */}
          <div className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/10 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e7c7c] dark:text-[#b2b5a9]">
                Cantidad de Personas / Cajas
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min={1} 
                  value={boxQuantity}
                  onChange={(e) => setBoxQuantity(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#063547] dark:border-white/10 dark:bg-[#042430] dark:text-[#f2eae6] shadow-sm"
                />
              </div>
       
            </div>

            <button
              onClick={handleAddBoxToCart}
              disabled={!isBoxComplete}
              className={`mt-4 w-full h-[50px] rounded-full px-8 font-bold uppercase tracking-wider text-white transition-all ${
                isBoxComplete 
                  ? 'bg-[#b45b38] hover:bg-[#b45b38]/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                  : 'bg-black/20 cursor-not-allowed dark:bg-white/20'
              }`}
            >
              Añadir Box al Carrito
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
