export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ProductVariationChoice {
  id?: string;
  label: string;
  price?: number;
  description?: string;
  image?: any;
  priceAdjustment?: number;
}

export interface Product {
  id: string;
  codigo?: string;
  /**
   * Estado editorial definido en el CMS. Opcional porque la UI tambien
   * construye productos sinteticos (por ejemplo los boxes armados) que no
   * provienen de la coleccion de productos.
   */
  status?: 'active' | 'inactive' | 'draft';
  name: string;
  description: string;
  price: number; // Precio unitario o por porción
  categoryId: string; 
  subcategoryId: string;
  subCategory?: {
    id: string;
    name: string;
    minQuantity?: number;
  };
  image: string;
  gallery?: string[];
  minPortions: number; // Mínimo de unidades o porciones para catering
  categoryCateringId?: string; // ID en payload CMS de la categoría para el armado de combos
  tags?: string[]; // Ej: "Vegano", "Sin Azúcar", "Recomendado"
  variations?: ProductVariationChoice[]; // Versiones opcionales
  details?: {
    ingredients?: string[];
    allergens?: string[];
    servingTemp?: string; // Caliente, frío, temperatura ambiente
    presentation?: string; // Bandeja, vaso individual, caja kraft, etc.
  };
}

export interface CartItem {
  id?: string; // Added to uniquely identify items with different variations
  product: Product;
  quantity: number;
  selectedVariation?: string; // label de la versión seleccionada
}
