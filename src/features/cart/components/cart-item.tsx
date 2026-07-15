"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Package,
  Plus,
  Trash2,
} from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import type { CartItem as CartItemType } from "@/features/cart/types";
import { formatCurrency } from "@/lib/format-currency";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore(
    (state) => state.removeItem,
  );

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity,
  );

  return (
    <article className="grid gap-4 rounded-2xl bg-white p-4 shadow-card sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-center">
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
      >
        <div className="absolute inset-0 grid place-items-center text-slate-300">
          <Package
            aria-hidden="true"
            className="size-10"
          />
        </div>

        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="130px"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="z-[1] object-contain p-3"
        />
      </Link>

      <div className="min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-heading text-base font-extrabold text-ink transition hover:text-brand-600 sm:text-lg"
        >
          {item.name}
        </Link>

        <p className="mt-1 text-sm text-muted">
          {formatCurrency(item.price)} / item
        </p>

        <div className="mt-4 inline-flex h-10 items-center rounded-lg border border-border">
          <button
            type="button"
            aria-label={`Kurangi ${item.name}`}
            onClick={() =>
              updateQuantity(
                item.id,
                item.quantity - 1,
              )
            }
            disabled={item.quantity <= 1}
            className="grid size-9 place-items-center text-ink transition hover:text-brand-600 disabled:text-slate-300"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>

          <span className="min-w-9 text-center text-sm font-bold">
            {item.quantity}
          </span>

          <button
            type="button"
            aria-label={`Tambah ${item.name}`}
            onClick={() =>
              updateQuantity(
                item.id,
                item.quantity + 1,
              )
            }
            disabled={item.quantity >= item.stock}
            className="grid size-9 place-items-center text-ink transition hover:text-brand-600 disabled:text-slate-300"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="font-heading text-lg font-extrabold text-ink">
          {formatCurrency(item.price * item.quantity)}
        </p>

        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label={`Hapus ${item.name} dari cart`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 transition hover:text-red-700"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Remove
        </button>
      </div>
    </article>
  );
}