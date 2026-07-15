"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSort = searchParams.get("sort") ?? "recommended";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2">
      <ArrowUpDown
        aria-hidden="true"
        className="hidden size-4 text-muted sm:block"
      />

      <span className="sr-only">Urutkan produk</span>

      <select
        value={selectedSort}
        onChange={(event) =>
          handleSortChange(event.target.value)
        }
        className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
      >
        <option value="recommended">Recommended</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Lowest Price</option>
        <option value="price-desc">Highest Price</option>
      </select>
    </label>
  );
}