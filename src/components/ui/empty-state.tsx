import Link from "next/link";
import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Produk tidak ditemukan",
  description = "Coba ubah kata pencarian atau hapus beberapa filter.",
}: EmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-500">
          <SearchX aria-hidden="true" className="size-7" />
        </span>

        <h2 className="mt-5 font-heading text-xl font-extrabold text-ink">
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {description}
        </p>

        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          Reset Semua Filter
        </Link>
      </div>
    </div>
  );
}