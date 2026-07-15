"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";

import type { RevenuePoint } from "@/features/dashboard/queries";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

type RevenueChartProps = {
  monthly: RevenuePoint[];
  quarterly: RevenuePoint[];
  yearly: RevenuePoint[];
};

type Period = "monthly" | "quarterly" | "yearly";

const tabs: { key: Period; label: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "quarterly", label: "Quarterly" },
  { key: "yearly", label: "Yearly" },
];

function formatCompact(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}Jt`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}Rb`;
  }

  return String(value);
}

export function RevenueChart({
  monthly,
  quarterly,
  yearly,
}: RevenueChartProps) {
  const [period, setPeriod] = useState<Period>("monthly");

  const dataByPeriod: Record<Period, RevenuePoint[]> = {
    monthly,
    quarterly,
    yearly,
  };

  const points = dataByPeriod[period];
  const maxValue = Math.max(1, ...points.map((point) => point.total));
  const totalRevenue = points.reduce(
    (sum, point) => sum + point.total,
    0,
  );

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-[18px] text-brand-500" />

          <h2 className="text-base font-bold text-ink">
            Pendapatan
          </h2>
        </div>

        <div className="inline-flex w-fit rounded-lg border border-border bg-surface p-1 text-sm font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPeriod(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 transition",
                period === tab.key
                  ? "bg-white text-brand-600 shadow-sm"
                  : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Total periode ini{" "}
        <span className="font-bold text-ink">
          {formatCurrency(totalRevenue)}
        </span>
      </p>

      <div className="mt-6 flex h-56 items-end gap-3 sm:gap-4">
        {points.map((point) => {
          const heightPercent =
            point.total > 0
              ? Math.max(4, (point.total / maxValue) * 100)
              : 2;

          return (
            <div
              key={point.label}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex h-44 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-brand-200 transition-all group-hover:bg-brand-300"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div
                    className="h-2 w-full rounded-t-md bg-brand-500"
                    aria-hidden="true"
                  />
                </div>

                <div className="pointer-events-none absolute -top-8 rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  {formatCompact(point.total)}
                </div>
              </div>

              <span className="text-xs font-semibold text-muted">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
