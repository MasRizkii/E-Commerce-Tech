import { Package, Wallet, Receipt } from "lucide-react";

import { CategoryDonut } from "@/features/dashboard/components/category-donut";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { TopProductsTable } from "@/features/dashboard/components/top-products-table";
import {
  getCategoryBreakdown,
  getDashboardStats,
  getRecentActivity,
  getRevenueSeries,
  getTopProducts,
} from "@/features/dashboard/queries";
import { formatCurrency } from "@/lib/format-currency";

export default async function AdminDashboardPage() {
  const [
    stats,
    revenue,
    categories,
    activity,
    topProducts,
  ] = await Promise.all([
    getDashboardStats(),
    getRevenueSeries(),
    getCategoryBreakdown(),
    getRecentActivity(),
    getTopProducts(5),
  ]);

  return (
    <div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold text-ink">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-muted">
          Ringkasan performa toko.mac.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Products"
          value={stats.totalProducts.toLocaleString("id-ID")}
          icon={Package}
          iconClassName="bg-brand-50 text-brand-600"
        />

        <StatCard
          label="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={Wallet}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="Total Expenses"
          value="—"
          icon={Receipt}
          iconClassName="bg-orange-50 text-accent"
          comingSoon
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart
            monthly={revenue.monthly}
            quarterly={revenue.quarterly}
            yearly={revenue.yearly}
          />
        </div>

        <CategoryDonut items={categories} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentActivity items={activity} />
        <TopProductsTable products={topProducts} />
      </div>
    </div>
  );
}
