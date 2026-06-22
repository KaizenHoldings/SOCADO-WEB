import { create } from 'zustand';
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
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchDiscountRules: () => Promise<void>;
  fetchTaxes: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  discountRules: [],
  taxes: [],
  isDrawerOpen: false,

  addItem: (product, quantity) => set((state) => {
    const qtyToAdd = quantity || product.minPortions || 1;
    const existing = state.items.find(item => item.product.id === product.id);
    
    if (existing) {
      return {
        items: state.items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        )
      };
    }
    
    return {
      items: [...state.items, { product, quantity: qtyToAdd }]
    };
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
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
}));
