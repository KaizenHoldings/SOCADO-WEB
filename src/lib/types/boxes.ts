export type BoxType = 'Desayuno' | 'Lunch' | 'Coffee Break';

export interface BoxRequirement {
  categoryId: string; // ID en payload CMS (relación a cat-categories)
  subcategoryName: string; // Nombre de la categoría (ej. "Bollería")
  quantity: number;
}

export interface BoxDefinition {
  id: string;
  name: string;
  description: string;
  priceIndividual: number;
  priceTen: number;
  imageUrl?: string;
  requirements: BoxRequirement[];
}

// Exportamos arrays vacíos temporalmente para no romper importaciones antes de migrar
export const BOXES: BoxDefinition[] = [];
export const MOCK_BOX_PRODUCTS: any[] = [];
