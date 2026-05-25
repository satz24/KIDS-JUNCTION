import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

function itemKey(productId: string, size?: string, color?: string) {
  return `${productId}-${size ?? ""}-${color ?? ""}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size, color) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, selectedSize: size, selectedColor: color }],
          };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    { name: "kiddojoy-cart" }
  )
);

export { itemKey };
