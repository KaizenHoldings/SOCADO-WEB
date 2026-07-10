import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/lib/types/catalog';
import { DiscountRule } from '@/lib/utils/discount.utils';

export interface Tax {
  id: string | number;
  name: string;
  description?: string;
  value: number;
  isActive: boolean;
}

interface CartState {
  items: CartItem[];
  discountRules: DiscountRule[];
  taxes: Tax[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number, selectedVariation?: string) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchDiscountRules: () => Promise<void>;
  fetchTaxes: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
  discountRules: [],
  taxes: [],
  isDrawerOpen: false,

  addItem: (product, quantity, selectedVariation) => set((state) => {
    const qtyToAdd = quantity || product.minPortions || 1;
    
    // Generar un ID único para el item en el carrito basado en el producto y su variación
    const variationsKey = selectedVariation || '';
    const cartItemId = `${product.id}${variationsKey ? '-' + btoa(variationsKey) : ''}`;

    const existing = state.items.find(item => item.id === cartItemId);
    
    if (existing) {
      return {
        items: state.items.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        )
      };
    }
    
    return {
      items: [...state.items, { id: cartItemId, product, quantity: qtyToAdd, selectedVariation }]
    };
  }),

  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter(item => item.id !== cartItemId && item.product.id !== cartItemId) // Fallback for old items
  })),

  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map(item =>
      (item.id === cartItemId || item.product.id === cartItemId) ? { ...item, quantity } : item
    )
  })),

  clearCart: () => set({ items: [] }),
  
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  
  fetchDiscountRules: async () => {
    try {
      const res = await fetch('/api/discounts');
      const data = await res.json();
      if (data.success && data.rules) {
        set({ discountRules: data.rules });
      }
    } catch (error) {
      console.error('Error fetching discount rules:', error);
    }
  },

  fetchTaxes: async () => {
    try {
      const res = await fetch('/api/shop-taxes');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ taxes: data });
      }
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  }
    }),
    {
      name: 'socado-cart',
      partialize: (state) => ({ items: state.items }), // Solo guardar los items para no guardar estados UI como el cajón abierto
    }
  )
);
