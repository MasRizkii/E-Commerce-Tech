"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { CartList } from "@/features/cart/components/cart-list";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCartStore } from "@/features/cart/cart-store";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore(
    (state) => state.hasHydrated,
  );
  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

  if (!hasHydrated) {
    return (
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-6 py-5">
        <h1 className="text-xl font-bold text-slate-900">Cart Items</h1>

        <p className="mt-1 text-sm text-slate-500">
          {itemCount} item di dalam keranjang.
        </p>
      </div>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-blue-50 text-[#4778e6]">
                <ShoppingBag aria-hidden="true" className="size-7" />
              </span>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Cart masih kosong
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Pilih produk terlebih dahulu sebelum melanjutkan
                ke checkout.
              </p>

              <Link
                href="/shop"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#4778e6] px-6 text-sm font-bold text-white transition hover:bg-[#3868d5]"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <CartList items={items} />

            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              onClearCart={clearCart}
            />
          </div>
        )}
      </div>
    </div>
  );
}
