"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function createPageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  }

  const pages = Array.from(
    {
      length: totalPages,
    },
    (_, index) => index + 1,
  );

  return (
    <nav
      aria-label="Pagination produk"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageHref(currentPage - 1)}
          aria-label="Halaman sebelumnya"
          className="grid size-10 place-items-center rounded-lg border border-border bg-white text-ink transition hover:border-brand-500 hover:text-brand-600"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span className="grid size-10 place-items-center rounded-lg border border-border bg-white text-slate-300">
          <ChevronLeft aria-hidden="true" className="size-4" />
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "grid size-10 place-items-center rounded-lg border text-sm font-bold transition",
            page === currentPage
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-border bg-white text-ink hover:border-brand-500 hover:text-brand-600",
          )}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={createPageHref(currentPage + 1)}
          aria-label="Halaman selanjutnya"
          className="grid size-10 place-items-center rounded-lg border border-border bg-white text-ink transition hover:border-brand-500 hover:text-brand-600"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span className="grid size-10 place-items-center rounded-lg border border-border bg-white text-slate-300">
          <ChevronRight aria-hidden="true" className="size-4" />
        </span>
      )}
    </nav>
  );
}