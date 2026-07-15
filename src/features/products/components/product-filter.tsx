"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { productCategories } from "@/features/products/data";

const priceRanges = [
  {
    label: "Semua harga",
    value: "",
    min: "",
    max: "",
  },
  {
    label: "Di bawah Rp5 juta",
    value: "0-5000000",
    min: "0",
    max: "5000000",
  },
  {
    label: "Rp5–10 juta",
    value: "5000000-10000000",
    min: "5000000",
    max: "10000000",
  },
  {
    label: "Rp10–20 juta",
    value: "10000000-20000000",
    min: "10000000",
    max: "20000000",
  },
  {
    label: "Di atas Rp20 juta",
    value: "20000000-",
    min: "20000000",
    max: "",
  },
];

export function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "";
  const minimumPrice = searchParams.get("minPrice") ?? "";
  const maximumPrice = searchParams.get("maxPrice") ?? "";
  const selectedPrice = `${minimumPrice}-${maximumPrice}`;

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handlePriceChange(value: string) {
    const selectedRange = priceRanges.find(
      (range) => range.value === value,
    );

    updateParams({
      minPrice: selectedRange?.min ?? "",
      maxPrice: selectedRange?.max ?? "",
    });
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("collection");
    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const hasActiveFilter =
    selectedCategory ||
    minimumPrice ||
    maximumPrice ||
    searchParams.get("collection");

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
          <SlidersHorizontal
            aria-hidden="true"
            className="size-5 text-brand-500"
          />
          Filters
        </h2>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted transition hover:text-brand-600"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="category-filter"
          className="text-sm font-bold text-ink"
        >
          Category
        </label>

        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) =>
            updateParams({
              category: event.target.value,
            })
          }
          className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">All Categories</option>

          {productCategories.map((category) => (
            <option
              key={category}
              value={category.toLowerCase()}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="price-filter"
          className="text-sm font-bold text-ink"
        >
          Price Range
        </label>

        <select
          id="price-filter"
          value={
            priceRanges.some(
              (range) => range.value === selectedPrice,
            )
              ? selectedPrice
              : ""
          }
          onChange={(event) =>
            handlePriceChange(event.target.value)
          }
          className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {searchParams.get("collection") && (
        <div className="mt-5 rounded-xl bg-brand-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
            Active Collection
          </p>

          <p className="mt-1 text-sm font-semibold capitalize text-ink">
            {searchParams
              .get("collection")
              ?.replaceAll("-", " ")}
          </p>
        </div>
      )}
    </div>
  );
}