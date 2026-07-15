"use client";

import { useState } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/features/products/types";

type AddToCartProps = {
  product: Product;
};

export function AddToCart({
  product,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [hasBeenAdded, setHasBeenAdded] =
    useState(false);

  const addItem = useCartStore(
    (state) => state.addItem,
  );

  const hasHydrated = useCartStore(
    (state) => state.hasHydrated,
  );

  const isOutOfStock = product.stock <= 0;

  function decreaseQuantity() {
    setHasBeenAdded(false);

    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    );
  }

  function increaseQuantity() {
    setHasBeenAdded(false);

    setQuantity((currentQuantity) =>
      Math.min(product.stock, currentQuantity + 1),
    );
  }

  function handleAddToCart() {
    addItem(product, quantity);
    setHasBeenAdded(true);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex h-12 items-center rounded-lg border border-border bg-white">
          <button
            type="button"
            aria-label="Kurangi jumlah produk"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="grid size-11 place-items-center text-ink transition hover:text-brand-600 disabled:text-slate-300"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>

          <span
            aria-live="polite"
            className="min-w-10 text-center text-sm font-bold text-ink"
          >
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Tambah jumlah produk"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="grid size-11 place-items-center text-ink transition hover:text-brand-600 disabled:text-slate-300"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!hasHydrated || isOutOfStock}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 font-heading text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:translate-y-0 disabled:shadow-none sm:flex-none"
        >
          {hasBeenAdded ? (
            <>
              <Check aria-hidden="true" className="size-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart
                aria-hidden="true"
                className="size-5"
              />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        {isOutOfStock
          ? "Produk sedang tidak tersedia."
          : `${product.stock} produk tersedia.`}
      </p>
    </div>
  );
}