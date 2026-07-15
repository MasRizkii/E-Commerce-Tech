import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { AddToCart } from "@/features/cart/components/add-to-cart";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { allProducts } from "@/features/products/data";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/queries";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: `${product.name} kondisi ${product.condition} dengan harga ${formatCurrency(product.price)}.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="min-h-screen bg-surface py-8 sm:py-12">
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted"
        >
          <Link
            href="/"
            className="transition hover:text-brand-600"
          >
            Home
          </Link>

          <ChevronRight
            aria-hidden="true"
            className="size-4"
          />

          <Link
            href="/shop"
            className="transition hover:text-brand-600"
          >
            Shop
          </Link>

          <ChevronRight
            aria-hidden="true"
            className="size-4"
          />

          <span
            className="max-w-48 truncate font-semibold text-ink sm:max-w-md"
            aria-current="page"
          >
            {product.name}
          </span>
        </nav>

        <section className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            image={product.image}
            name={product.name}
          />

          <div className="lg:py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-bold text-white",
                  product.condition === "Brand New"
                    ? "bg-accent"
                    : "bg-brand-500",
                )}
              >
                {product.condition}
              </span>

              <span className="text-sm font-semibold text-muted">
                {product.category}
              </span>
            </div>

            <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 font-bold text-ink">
                <Star
                  aria-hidden="true"
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
                {product.rating}
              </span>

              <span className="text-muted">
                {product.sold} sold
              </span>

              <span className="inline-flex items-center gap-1.5 text-emerald-600">
                <PackageCheck
                  aria-hidden="true"
                  className="size-4"
                />
                In Stock
              </span>
            </div>

            <p className="mt-6 font-heading text-3xl font-extrabold text-brand-600">
              {formatCurrency(product.price)}
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted sm:text-base">
              {product.name} merupakan produk pilihan untuk
              mendukung aktivitas kerja, belajar, dan hiburan.
              Produk tersedia dalam kondisi{" "}
              {product.condition.toLowerCase()} dan telah melalui
              pemeriksaan sebelum ditampilkan.
            </p>

            <div className="my-8 border-t border-border" />

            <AddToCart product={product} />

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <Truck
                  aria-hidden="true"
                  className="size-5 text-brand-500"
                />

                <p className="mt-3 text-sm font-bold text-ink">
                  Free Shipping
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Untuk transaksi portofolio.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-4">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-5 text-brand-500"
                />

                <p className="mt-3 text-sm font-bold text-ink">
                  Secure Checkout
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Validasi dilakukan di server.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-4">
                <RotateCcw
                  aria-hidden="true"
                  className="size-5 text-brand-500"
                />

                <p className="mt-3 text-sm font-bold text-ink">
                  7-Day Return
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Simulasi kebijakan retur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
                  You May Also Like
                </p>

                <h2 className="mt-2 font-heading text-2xl font-extrabold text-ink sm:text-3xl">
                  Related Products
                </h2>
              </div>

              <Link
                href={`/shop?category=${product.category.toLowerCase()}`}
                className="text-sm font-bold text-brand-600 transition hover:text-brand-700"
              >
                View All
              </Link>
            </div>

            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </Container>
    </div>
  );
}