import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/features/products/components/product-grid";
import type { Product } from "@/features/products/types";

type ProductSectionProps = {
  title: string;
  products: Product[];
  viewAllHref?: string;
};

export function ProductSection({
  title,
  products,
  viewAllHref = "/shop",
}: ProductSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-heading text-xl font-extrabold text-ink sm:text-2xl">
          {title}
        </h2>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-600 transition hover:text-brand-700 sm:text-sm"
        >
          View All
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}