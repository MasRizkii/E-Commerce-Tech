import { Package } from "lucide-react";

import type { TopProductRow } from "@/features/dashboard/queries";
import { formatCurrency } from "@/lib/format-currency";

type TopProductsTableProps = {
  products: TopProductRow[];
};

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package className="size-[18px] text-brand-500" />
          <h2 className="text-base font-bold text-ink">Top Products</h2>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2 pr-4 font-semibold">Product</th>
              <th className="py-2 pr-4 font-semibold">Stock</th>
              <th className="py-2 pr-4 font-semibold">Price</th>
              <th className="py-2 pr-4 font-semibold">Sales</th>
              <th className="py-2 font-semibold">Earnings</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600">
                      {product.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 pr-4 text-ink">{product.stock}</td>

                <td className="py-3 pr-4 text-ink">
                  {formatCurrency(product.price)}
                </td>

                <td className="py-3 pr-4 text-ink">{product.sold}</td>

                <td className="py-3 font-semibold text-ink">
                  {formatCurrency(product.earnings)}
                </td>
              </tr>
            ))}

            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-muted"
                >
                  Belum ada data penjualan produk.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
