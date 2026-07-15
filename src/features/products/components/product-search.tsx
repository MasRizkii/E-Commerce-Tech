"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type ProductSearchProps = {
  initialValue?: string;
};

export function ProductSearch({
  initialValue = "",
}: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) {
      params.set("q", keyword);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
      />

      <input
        type="search"
        name="q"
        defaultValue={initialValue}
        placeholder="Search MacBook, iPhone, accessories..."
        aria-label="Cari produk"
        className="h-13 w-full rounded-xl border border-border bg-white pl-12 pr-28 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
      />

      <button
        type="submit"
        className="absolute right-1.5 top-1/2 min-h-10 -translate-y-1/2 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white transition hover:bg-brand-600"
      >
        Search
      </button>
    </form>
  );
}