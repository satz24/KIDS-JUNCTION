import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface RecentlyViewedStore {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        });
      },

      clear: () => set({ items: [] }),
    }),
    { name: "kiddojoy-recently-viewed" }
  )
);
