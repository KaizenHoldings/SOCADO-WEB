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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Precio unitario o por porción
  categoryId: string; 
  subcategoryId: string;
  image: string;
  minPortions: number; // Mínimo de unidades o porciones para catering
  categoryCateringId?: string; // ID en payload CMS de la categoría para el armado de combos
  tags?: string[]; // Ej: "Vegano", "Sin Azúcar", "Recomendado"
  details?: {
    ingredients?: string[];
    allergens?: string[];
    servingTemp?: string; // Caliente, frío, temperatura ambiente
    presentation?: string; // Bandeja, vaso individual, caja kraft, etc.
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
