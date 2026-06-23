"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/catalog/Header";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { ProductGridSection } from "@/components/catalog/ProductGridSection";
import { BoxBuilder } from "@/components/catalog/BoxBuilder";
import { ViewModeToggle } from "@/components/catalog/ViewModeToggle";
import { HowItWorksCatering } from "@/components/catalog/HowItWorksCatering";
import { Footer } from "@/components/catalog/Footer";
import { Product } from "@/lib/types/catalog";
import { useCartStore } from "@/lib/store/cart.store";
import { CartDrawer } from "@/components/catalog/CartDrawer";

export default function CateringPage() {
  const [macrocategories, setMacrocategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [selectedMacrocategory, setSelectedMacrocategory] = useState<string | number>("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | number | null>(null);

  const [viewMode, setViewMode] = useState<"libre" | "box">("libre");
  const [selectedBoxName, setSelectedBoxName] = useState<string>("Desayuno");
  const [hasSelectedMode, setHasSelectedMode] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [showCategoryContext, setShowCategoryContext] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // El título mide aprox 150px-200px de alto con paddings.
      setShowCategoryContext(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // check inicial
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchMacrocategories() {
      try {
        const resMacro = await fetch('/api/macrocategories');
        const dataMacro = await resMacro.json();
        const mDocs = dataMacro.docs || [];
        
        setMacrocategories(mDocs);
        if (mDocs.length > 0) {
          setSelectedMacrocategory(mDocs[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch macrocategories:", error);
        setIsLoadingCategories(false);
      }
    }
    fetchMacrocategories();
  }, []);

  // Efecto para buscar categorías filtradas directamente desde el backend de Payload
  useEffect(() => {
    async function fetchCategoriesFiltered() {
      if (!selectedMacrocategory) return;
      setIsLoadingCategories(true);
      try {
        const query = `?where[macroCategory][equals]=${selectedMacrocategory}`;
        const endpoint = `/api/categories${encodeURI(query)}`;
        
        const resCat = await fetch(endpoint);
        const dataCat = await resCat.json();
        const cDocs = dataCat.docs || [];
        
        setCategories(cDocs);

        if (cDocs.length > 0) {
          const isCurrentValid = cDocs.some((c: any) => String(c.id) === String(selectedCategory));
          if (!isCurrentValid) {
            setSelectedCategory(cDocs[0].id);
            setSelectedSubcategory(null);
          }
        } else {
          setSelectedCategory("");
          setSelectedSubcategory(null);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategoriesFiltered();
  }, [selectedMacrocategory]); 

  // Efecto para buscar subcategorías
  useEffect(() => {
    let isMounted = true;
    async function fetchSubcategories() {
      if (viewMode === "libre" && !selectedCategory) {
        setSubcategories([]);
        return;
      }
      try {
        const query = viewMode === "libre" ? `?where[parentCategory][equals]=${selectedCategory}` : `?limit=100`;
        const resSub = await fetch(`/api/subcategories${encodeURI(query)}`);
        const dataSub = await resSub.json();
        if (!isMounted) return;
        setSubcategories(dataSub.docs || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    }
    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, viewMode]);

  // Efecto para buscar productos directamente desde Payload
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      if (viewMode === "libre" && !selectedCategory) {
        setProducts([]);
        return;
      }
      setIsLoadingProducts(true);
      try {
        let query = "";
        if (viewMode === "libre") {
          query = `?where[category][equals]=${selectedCategory}`;
          if (selectedSubcategory) {
            query += `&where[subCategory][equals]=${selectedSubcategory}`;
          }
        } else {
          query = "?limit=200"; // En modo BoxBuilder traemos todos para que puedan filtrarse localmente
        }
        const resProd = await fetch(`/api/products${encodeURI(query)}`);
        const dataProd = await resProd.json();
        
        if (!isMounted) return;

        // Mapeamos los datos crudos para que cumplan la interfaz de la UI
        const mappedProducts = (dataProd.docs || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || "Delicioso producto con la calidad Socado.", 
          price: p.price,
          categoryId: p.category?.id || p.category,
          subcategoryId: p.subCategory?.id || p.subCategory,
          image: p.image?.url || p.image || "/images/placeholder.jpg",
          minPortions: p.minPortions || 5,
          tags: p.tags || ["Recomendado"],
          categoryCateringId: p.categoryCatering?.id || p.categoryCatering
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSubcategory, viewMode]);

  // Efecto para buscar combos (Boxes)
  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch("/api/cat-combos?depth=1");
        const data = await res.json();
        const mappedCombos = (data.docs || []).map((combo: any) => ({
          id: combo.id,
          name: combo.name,
          description: combo.description || "Deliciosa opción de catering.",
          priceIndividual: combo.pricePerPerson,
          priceTen: combo.priceTenPeople || (combo.pricePerPerson * 10),
          imageUrl: combo.image?.url || "/images/placeholder.jpg",
          requirements: (combo.rules || []).map((rule: any) => ({
            categoryId: rule.category?.id || rule.category,
            subcategoryName: rule.category?.name || "Categoría",
            quantity: rule.allowedQuantity,
            allowedProductIds: (rule.allowedProducts || []).map((p: any) =>
              typeof p === 'object' ? String(p.id) : String(p)
            )
          }))
        }));
        setCombos(mappedCombos);
        if (mappedCombos.length > 0 && selectedBoxName === "Desayuno") {
          setSelectedBoxName(mappedCombos[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch combos:", error);
      }
    }
    fetchCombos();
  }, []);

  const filteredCategories = categories; 
  const filteredProducts = products; 

  const handleAddToCart = (product: Product) => {
    addItem(product, product.minPortions);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#042430] selection:bg-[#b45b38] selection:text-white">
      <Header activePage="catering" />

      <main className="flex-1 pt-24 ">
        {/* Sección de Cómo Funciona */}
        
        {/* Header de Catering */}
        <section className="mx-auto max-w-[1400px] px-6 lg:px-12 ">
          <div className="">
            <h1 className="font-raleway text-4xl font-bold tracking-tight text-azul-socado md:text-5xl mb-2">
              Catering Socado
            </h1>
          </div>
        </section>

        {!hasSelectedMode ? (
          <>
            <HowItWorksCatering />
          <div className="flex flex-col md:flex-row w-full" style={{ minHeight: "70vh" }}>
            {/* Mitad 1: Individuales */}
            <div
              onClick={() => { setViewMode("box"); setHasSelectedMode(true); }}
              className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-0 cursor-pointer group overflow-hidden"
            >
              <Image
                src="/images/promotion2.png"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Individuales"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
                <h3 className="font-outfit text-4xl lg:text-5xl font-light text-white lowercase tracking-wide transition-transform duration-300 group-hover:translate-y-[-4px]">
                  individuales
                </h3>
                <p className="font-outfit text-white/60 text-sm mt-2 uppercase tracking-widest">
                  Boxes por persona
                </p>
              </div>
            </div>

            {/* Mitad 2: Para compartir */}
            <div
              onClick={() => { setViewMode("libre"); setHasSelectedMode(true); }}
              className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-0 cursor-pointer group overflow-hidden"
            >
              <Image
                src="/images/servicio.jpg"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Para compartir"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
                <h3 className="font-outfit text-4xl lg:text-5xl font-light text-white lowercase tracking-wide transition-transform duration-300 group-hover:translate-y-[-4px]">
                  para compartir
                </h3>
                <p className="font-outfit text-white/60 text-sm mt-2 uppercase tracking-widest">
                  Bandejas y opciones grupales
                </p>
              </div>
            </div>
          </div>
          </>
        ) : (
          <>

            {/* Barra Sticky */}
            <div className="sticky top-[76px] z-40 w-full border-b border-black/5 dark:border-white/5 bg-white/95 backdrop-blur-md dark:bg-[#042430]/95">
              <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col">
                {/* Fila 1: Toggle */}
                <div className="flex items-center py-3">
                  <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
                {/* Fila 2: Macrocategorías — sin gap entre filas */}
                <div className="flex flex-wrap gap-2 md:gap-3 items-center pb-3">
                  {viewMode === "libre" ? (
                    <>
                      {(!isLoadingCategories && macrocategories.length > 0) && macrocategories.map((macro) => (
                        <button
                          key={macro.id}
                          onClick={() => setSelectedMacrocategory(macro.id)}
                          className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                            selectedMacrocategory === macro.id
                              ? "bg-[#b45b38] text-white shadow-md"
                              : "bg-black/5 text-[#6e7c7c] hover:bg-black/10 hover:text-[#063547] dark:bg-white/5 dark:text-[#b2b5a9] dark:hover:bg-white/10 dark:hover:text-[#f2eae6]"
                          }`}
                        >
                          {macro.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#063547] dark:text-[#f2eae6]">
                      <span className="opacity-50">Armando:</span>
                      <span className="text-[#b45b38]">{selectedBoxName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

        {viewMode === "libre" ? (
          <>
            {/* Filtros de Categoría (Edge-to-Edge Cards) */}
            <div className="w-full">
          {isLoadingCategories ? (
            <div className="flex justify-center py-20 text-xl font-bold text-gray-500">
              Cargando categorías...
            </div>
          ) : filteredCategories.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-black/5 flex items-center justify-center dark:bg-white/5">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-raleway text-xl font-bold text-[#063547] dark:text-[#f2eae6]">
                  Aún no hay categorías
                </h3>
                <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9]">
                  No hay categorías asignadas a esta sección por el momento.
                </p>
              </div>
          ) : (
            <CategoryFilter
              categories={filteredCategories}
              subcategories={subcategories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSelectCategory={setSelectedCategory}
              onSelectSubcategory={setSelectedSubcategory}
            />
          )}
        </div>

        {/* Contenedor Principal de Productos */}
        <ProductGridSection
          filteredCategories={filteredCategories}
          selectedCategory={selectedCategory}
          isLoadingProducts={isLoadingProducts}
          filteredProducts={filteredProducts}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
        />
        </>
        ) : (
          <BoxBuilder 
            combos={combos}
            products={products} 
            subcategories={subcategories} 
            onBoxChange={setSelectedBoxName}
          />
        )}
          </>
        )}
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddToCart}
      />
      <CartDrawer />
    </div>
  );
}
