"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";

import type { Product } from "@/features/products/types";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isBrandNew = product.condition === "Brand New";

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-card bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span
        className={cn(
          "absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold text-white",
          isBrandNew ? "bg-accent" : "bg-brand-500",
        )}
      >
        {product.condition}
      </span>

      <Link
        href={`/products/${product.slug}`}
        aria-label={`Lihat detail ${product.name}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <div className="absolute inset-0 grid place-items-center text-slate-300">
          <Package aria-hidden="true" className="size-14" strokeWidth={1.2} />
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="z-[1] object-contain p-5 transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-muted">{product.category}</p>

        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-5 text-ink transition hover:text-brand-600 sm:text-base"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-sm font-bold text-ink sm:text-base">
            {formatCurrency(product.price)}
          </p>

          <Link
            href={`/products/${product.slug}`}
            aria-label={`Buka ${product.name}`}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted transition hover:border-brand-500 hover:bg-brand-500 hover:text-white"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}