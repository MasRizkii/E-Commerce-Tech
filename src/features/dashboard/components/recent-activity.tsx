import { AlertTriangle, Clock, PackagePlus, ShoppingBag } from "lucide-react";

import type { ActivityItem } from "@/features/dashboard/queries";

type RecentActivityProps = {
  items: ActivityItem[];
};

const iconByType = {
  order: ShoppingBag,
  "low-stock": AlertTriangle,
  product: PackagePlus,
};

const badgeStyleByType: Record<ActivityItem["type"], string> = {
  order: "bg-brand-50 text-brand-600",
  "low-stock": "bg-red-50 text-red-600",
  product: "bg-amber-50 text-amber-600",
};

const iconStyleByType: Record<ActivityItem["type"], string> = {
  order: "bg-brand-50 text-brand-600",
  "low-stock": "bg-red-50 text-red-500",
  product: "bg-amber-50 text-amber-600",
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Clock className="size-[18px] text-brand-500" />
        <h2 className="text-base font-bold text-ink">Recent Activity</h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            Belum ada aktivitas.
          </p>
        ) : null}

        {items.map((item) => {
          const Icon = iconByType[item.type];

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div
                className={`grid size-9 shrink-0 place-items-center rounded-full ${iconStyleByType[item.type]}`}
              >
                <Icon className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted">
                  {item.subtitle}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyleByType[item.type]}`}
              >
                {item.badge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
