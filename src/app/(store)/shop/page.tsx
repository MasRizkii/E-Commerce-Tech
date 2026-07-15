import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ProductFilter } from "@/features/products/components/product-filter";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSearch } from "@/features/products/components/product-search";
import { ProductSort } from "@/features/products/components/product-sort";
import {
  getFilteredProducts,
  type ShopFilters,
} from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Temukan laptop, smartphone, desktop, dan aksesori teknologi pilihan.",
};

type RawSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

type ShopPageProps = {
  searchParams: RawSearchParams;
};

const PRODUCTS_PER_PAGE = 8;

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value?: string) {
  const page = Number.parseInt(value ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const rawParams = await searchParams;

  const filters: ShopFilters = {
    q: getSingleValue(rawParams.q),
    category: getSingleValue(rawParams.category),
    minPrice: getSingleValue(rawParams.minPrice),
    maxPrice: getSingleValue(rawParams.maxPrice),
    sort: getSingleValue(rawParams.sort),
    collection: getSingleValue(rawParams.collection),
  };

  const filteredProducts =
  await getFilteredProducts(filters);
  const requestedPage = parsePage(
    getSingleValue(rawParams.page),
  );

  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
  );

  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex =
    (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + PRODUCTS_PER_PAGE,
    totalProducts,
  );

  const displayedProducts = filteredProducts.slice(
    startIndex,
    endIndex,
  );

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-14">
      <Container>
        <header className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Explore Our Collection
          </p>

          <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink sm:text-5xl">
            Shop
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            Temukan perangkat teknologi yang sesuai dengan
            kebutuhan, anggaran, dan gaya kerja lu.
          </p>
        </header>

        <div className="mt-8">
          <ProductSearch
            key={filters.q ?? ""}
            initialValue={filters.q}
          />
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24">
            <ProductFilter />
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {totalProducts > 0 ? (
                  <>
                    Showing{" "}
                    <strong className="text-ink">
                      {startIndex + 1}–{endIndex}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-ink">
                      {totalProducts}
                    </strong>{" "}
                    products
                  </>
                ) : (
                  "No products found"
                )}
              </p>

              <ProductSort />
            </div>

            {displayedProducts.length > 0 ? (
              <>
                <ProductGrid products={displayedProducts} />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}