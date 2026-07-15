import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatCurrency } from "@/lib/format-currency";

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  onClearCart: () => void;
};

export function CartSummary({
  itemCount,
  subtotal,
  onClearCart,
}: CartSummaryProps) {
  return (
    <aside className="rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
      <h2 className="font-heading text-xl font-extrabold text-ink">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted">
            Items ({itemCount})
          </span>

          <span className="font-semibold text-ink">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted">Shipping</span>

          <span className="font-semibold text-emerald-600">
            Free
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      <div className="flex items-end justify-between gap-4">
        <span className="font-heading font-bold text-ink">
          Total
        </span>

        <span className="font-heading text-2xl font-extrabold text-brand-600">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 font-heading text-sm font-bold text-white transition hover:bg-brand-600"
      >
        Continue to Checkout
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>

      <button
        type="button"
        onClick={onClearCart}
        className="mt-3 min-h-10 w-full text-sm font-bold text-red-500 transition hover:text-red-700"
      >
        Clear Cart
      </button>
    </aside>
  );
}