import { Trophy } from "lucide-react";

import type { CategoryBreakdownItem } from "@/features/dashboard/queries";
import { formatCurrency } from "@/lib/format-currency";

type CategoryDonutProps = {
  items: CategoryBreakdownItem[];
};

const PALETTE = ["#4778e6", "#ff8b3d", "#1db4d1", "#92b6ff", "#cbd5e1"];

export function CategoryDonut({ items }: CategoryDonutProps) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  let cumulative = 0;

  const stops = items.map((item, index) => {
    const share = total > 0 ? (item.total / total) * 100 : 0;
    const start = cumulative;
    cumulative += share;

    return `${PALETTE[index % PALETTE.length]} ${start}% ${cumulative}%`;
  });

  const gradient =
    stops.length > 0
      ? `conic-gradient(${stops.join(", ")})`
      : "conic-gradient(#e4e8eb 0% 100%)";

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Trophy className="size-[18px] text-brand-500" />
        <h2 className="text-base font-bold text-ink">Top Categories</h2>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className="relative grid size-44 place-items-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="grid size-28 place-items-center rounded-full bg-white text-center">
            <div>
              <p className="text-xs text-muted">Total Pendapatan</p>
              <p className="text-base font-bold text-ink">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {items.length === 0 ? (
          <li className="text-center text-sm text-muted">
            Belum ada data penjualan.
          </li>
        ) : null}

        {items.map((item, index) => (
          <li
            key={item.category}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 font-semibold text-ink">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: PALETTE[index % PALETTE.length],
                }}
              />
              {item.category}
            </span>

            <span className="text-muted">
              {formatCurrency(item.total)}
            </span>

            <span className="w-10 shrink-0 text-right font-bold text-ink">
              {item.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
