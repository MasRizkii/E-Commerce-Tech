"use client";

import { useEffect } from "react";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type { CartItem } from "@/features/cart/types";
import type { Product } from "@/features/products/types";

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          if (product.stock <= 0) {
            return state;
          }

          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stock,
                      ),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: Math.min(
                  Math.max(quantity, 1),
                  product.stock,
                ),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== productId,
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(quantity, item.stock),
                  ),
                }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      setHasHydrated: (value) => {
        set({
          hasHydrated: value,
        });
      },
    }),
    {
      name: "toko-mac-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useCartHydration() {
  const hasHydrated = useCartStore(
    (state) => state.hasHydrated,
  );

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}