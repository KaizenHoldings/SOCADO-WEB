import { create } from 'zustand';
import { Product, CartItem } from '@/lib/types/catalog';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
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
}));
