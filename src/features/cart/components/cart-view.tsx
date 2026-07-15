"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Container } from "@/components/ui/container";
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
      <div className="min-h-screen bg-surface py-12">
        <Container>
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-14">
      <Container>
        <header>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Your Shopping Cart
          </p>

          <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink sm:text-5xl">
            Cart
          </h1>

          <p className="mt-3 text-sm text-muted">
            {itemCount} item di dalam keranjang.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-8 grid min-h-96 place-items-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <div>
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-500">
                <ShoppingBag
                  aria-hidden="true"
                  className="size-9"
                />
              </span>

              <h2 className="mt-6 font-heading text-2xl font-extrabold text-ink">
                Cart masih kosong
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Pilih produk terlebih dahulu sebelum melanjutkan
                ke checkout.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <CartList items={items} />

            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              onClearCart={clearCart}
            />
          </div>
        )}
      </Container>
    </div>
  );
}