"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/catalog/Header";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductVariationsDrawer } from "@/components/catalog/ProductVariationsDrawer";
import { ProductGridSection } from "@/components/catalog/ProductGridSection";
import { BoxBuilder } from "@/components/catalog/BoxBuilder";
import { ViewModeToggle } from "@/components/catalog/ViewModeToggle";
import { HowItWorksCatering } from "@/components/catalog/HowItWorksCatering";
import { Footer } from "@/components/catalog/Footer";
import { Product } from "@/lib/types/catalog";
import { useCartStore } from "@/lib/store/cart.store";
import { CartDrawer } from "@/components/catalog/CartDrawer";
import { ButtonLightBack } from "@/components/catalog/ButtonLightBack";

export default function CateringPage() {
  const [macrocategories, setMacrocategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

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

  // Efecto para buscar todas las categorías directamente desde el backend de Payload
  useEffect(() => {
    async function fetchCategoriesAll() {
      setIsLoadingCategories(true);
      try {
        const endpoint = `/api/categories?limit=100`;
        
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
    fetchCategoriesAll();
  }, []); 

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
          query = `?limit=20&page=${page}&depth=1&where[category][equals]=${selectedCategory}`;
          if (selectedSubcategory) {
            query += `&where[subCategory][equals]=${selectedSubcategory}`;
          }
        } else {
          query = "?limit=200&depth=1"; // En modo BoxBuilder traemos todos para que puedan filtrarse localmente
        }
        const resProd = await fetch(`/api/products${encodeURI(query)}`);
        const dataProd = await resProd.json();
        
        if (!isMounted) return;

        // Mapeamos los datos crudos para que cumplan la interfaz de la UI
        const mappedProducts: Product[] = (dataProd.docs || []).map((p: any) => ({
          id: p.id,
          codigo: p.codigo || p.sku || "",
          name: p.name,
          description: p.description || "", 
          price: p.price,
          categoryId: p.category?.id || p.category,
          subcategoryId: p.subCategory?.id || p.subCategory,
          subCategory: p.subCategory && typeof p.subCategory === 'object' ? {
            id: p.subCategory.id,
            name: p.subCategory.name,
            minQuantity: typeof p.subCategory.minQuantity === 'number' ? p.subCategory.minQuantity : 5
          } : undefined,
          image: p.image?.url || p.image || "/images/isotipo.png",
          gallery: Array.isArray(p.gallery) ? p.gallery.map((media: any) => media?.url || media).filter(Boolean) : [],
          minPortions: p.minPortions || 5,
          tags: p.tags || ["Recomendado"],
          categoryCateringId: p.categoryCatering?.id || p.categoryCatering,
          variations: p.variations || [],
          details: p.details || undefined
        }));
        
        setProducts(mappedProducts);
        setHasNextPage(dataProd.hasNextPage || false);
        setHasPrevPage(dataProd.hasPrevPage || false);
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
  }, [selectedCategory, selectedSubcategory, viewMode, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedSubcategory, viewMode]);

  // Scroll to top when view mode is selected
  useEffect(() => {
    if (hasSelectedMode) {
      // Usar setTimeout para asegurar que el DOM se haya actualizado y el Hero haya desaparecido
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [viewMode, hasSelectedMode]);

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
          imageUrl: combo.image?.url || "/images/isotipo.png",
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
      <Header activePage="catering" heroIsDark={!hasSelectedMode} />

      <main className="flex-1 pt-24 ">
        {!hasSelectedMode ? (
          <>
            {/* Hero de Catering */}
            <section className="relative w-full h-screen -mt-24 overflow-hidden">
              <Image
                src="/images/catering.JPG"
                alt="Socado Catering"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-[#063547]/20" /> {/* Overlay Azul Socado sutil */}
              <div className="absolute inset-0 flex flex-col justify-end text-left p-10 lg:p-20 pb-20 lg:pb-32">
                <h1 className="font-raleway text-5xl md:text-7xl lg:text-[5rem] font-light tracking-tight text-white mb-6 drop-shadow-lg lowercase">
                  catering Socado
                </h1>
                <p className="font-outfit text-white/90 text-xl md:text-2xl max-w-2xl font-light drop-shadow-md lowercase">
                  llevamos la experiencia Socado a tus reuniones y eventos con opciones para compartir o individuales.
                </p>
              </div>
            </section>
            
            <HowItWorksCatering />
            
            <section className="min-h-screen flex flex-col">
              <div className="w-full text-center py-12 px-6">
                <h2 className="font-raleway text-3xl md:text-4xl font-bold lowercase tracking-wider text-[#063547] dark:text-[#f2eae6]">
                  selecciona tu tipo de catering
                </h2>
              </div>
              
              <div className="flex flex-col md:flex-row w-full flex-1">
              {/* Mitad 1: Individuales */}
            <div
              onClick={() => { setViewMode("box"); setHasSelectedMode(true); }}
              className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-0 cursor-pointer group overflow-hidden"
            >
              <Image
                src="/images/individuales.png"
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
                <p className="font-outfit text-white/60 text-sm mt-2 lowercase tracking-widest">
                  boxes por persona
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
                <p className="font-outfit text-white/60 text-sm mt-2 lowercase tracking-widest">
                  bandejas y opciones grupales
                </p>
              </div>
            </div>
              </div>
            </section>
          </>
        ) : (
          <>

            {/* Botón superior no sticky */}
            <div className="w-full bg-white dark:bg-[#042430]">
              <div className="mx-auto max-w-[1400px] px-6 py-4 w-full">
                <ButtonLightBack
                  onClick={() => { 
                    setHasSelectedMode(false); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                  className="!min-h-0 !py-2.5 !px-5 shadow-none hover:shadow-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border-none"
                >
                  <span className="lowercase">volver a selección</span>
                </ButtonLightBack>
              </div>
            </div>

            {/* Barra Sticky */}
            <div className="sticky top-[76px] z-40 w-full">
              {/* Fila 1: Toggle (Ancho completo) */}
              <div className="w-full">
                <ViewModeToggle 
                  viewMode={viewMode} 
                  onChange={setViewMode} 
                  selectedBoxName={viewMode === "box" ? selectedBoxName : undefined}
                />
              </div>
            </div>

        {viewMode === "libre" ? (
          <>
            {/* Filtros de Categoría (Edge-to-Edge Cards) */}
            <div className="w-full">
          {isLoadingCategories ? (
            <div className="flex justify-center py-20">
              <Image src="/images/socado-loader.svg" alt="Cargando categorías..." width={180} height={40} priority className="animate-pulse" />
            </div>
          ) : filteredCategories.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-black/5 flex items-center justify-center dark:bg-white/5">
                  <Image src="/images/isotipo.png" alt="Socado" width={32} height={32} className="opacity-50" />
                </div>
                <h3 className="font-raleway text-xl font-bold text-[#063547] dark:text-[#f2eae6] lowercase">
                  aún no hay categorías
                </h3>
                <p className="mt-2 text-[#6e7c7c] dark:text-[#b2b5a9] lowercase">
                  no hay categorías asignadas a esta sección por el momento.
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
          page={page}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={() => setPage((p) => p + 1)}
          onPrevPage={() => setPage((p) => p - 1)}
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

        {/* Botón inferior */}
        <div className="w-full py-16 flex justify-center mt-8">
          <ButtonLightBack
            onClick={() => { 
              setHasSelectedMode(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
          >
            <span className="lowercase">volver a selección</span>
          </ButtonLightBack>
        </div>
          </>
        )}
      </main>

      <Footer />

      <ProductVariationsDrawer
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CartDrawer />
    </div>
  );
}
