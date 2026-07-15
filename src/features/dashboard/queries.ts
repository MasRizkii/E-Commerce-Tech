import "server-only";

import { createClient } from "@/lib/supabase/server";

export type RevenuePoint = {
  label: string;
  total: number;
};

export type CategoryBreakdownItem = {
  category: string;
  total: number;
  percentage: number;
};

export type ActivityItem = {
  id: string;
  type: "order" | "low-stock" | "product";
  title: string;
  subtitle: string;
  badge: string;
  timestamp: string;
};

export type TopProductRow = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  sold: number;
  earnings: number;
};

export type DashboardStats = {
  totalProducts: number;
  totalIncome: number;
  totalOrders: number;
};

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  created_at: string;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const categoryLabels: Record<string, string> = {
  smartphone: "Smartphone",
  laptop: "Laptop",
  desktop: "Desktop",
  tablet: "Tablet",
  accessories: "Accessories",
};

async function getOrders(): Promise<OrderRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get dashboard orders error:", error);
    return [];
  }

  return data as OrderRow[];
}

async function getProducts(): Promise<ProductRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, category, price, stock, sold, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get dashboard products error:", error);
    return [];
  }

  return data as ProductRow[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [orders, products] = await Promise.all([
    getOrders(),
    getProducts(),
  ]);

  const totalIncome = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return {
    totalProducts: products.length,
    totalIncome,
    totalOrders: orders.length,
  };
}

export async function getRevenueSeries(): Promise<{
  monthly: RevenuePoint[];
  quarterly: RevenuePoint[];
  yearly: RevenuePoint[];
}> {
  const orders = await getOrders();

  const now = new Date();

  // Monthly: 8 bulan terakhir (mengikuti panjang chart pada desain).
  const monthlyBuckets: RevenuePoint[] = [];

  for (let i = 7; i >= 0; i -= 1) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
    );

    monthlyBuckets.push({
      label: MONTH_LABELS[date.getMonth()],
      total: 0,
    });
  }

  const monthlyKeyToIndex = new Map<string, number>();

  for (let i = 7; i >= 0; i -= 1) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
    );

    monthlyKeyToIndex.set(
      `${date.getFullYear()}-${date.getMonth()}`,
      7 - i,
    );
  }

  // Quarterly: 4 kuartal terakhir.
  const quarterlyBuckets: RevenuePoint[] = [];
  const quarterlyKeyToIndex = new Map<string, number>();

  for (let i = 3; i >= 0; i -= 1) {
    const quarterOffset = now.getMonth() - i * 3;
    const date = new Date(
      now.getFullYear(),
      quarterOffset,
      1,
    );

    const quarter = Math.floor(date.getMonth() / 3) + 1;

    quarterlyBuckets.push({
      label: `Q${quarter} ${date.getFullYear()}`,
      total: 0,
    });

    quarterlyKeyToIndex.set(
      `${date.getFullYear()}-${quarter}`,
      3 - i,
    );
  }

  // Yearly: 4 tahun terakhir.
  const yearlyBuckets: RevenuePoint[] = [];
  const yearlyKeyToIndex = new Map<string, number>();

  for (let i = 3; i >= 0; i -= 1) {
    const year = now.getFullYear() - i;

    yearlyBuckets.push({
      label: String(year),
      total: 0,
    });

    yearlyKeyToIndex.set(String(year), 3 - i);
  }

  for (const order of orders) {
    const date = new Date(order.created_at);
    const total = Number(order.total);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthIndex = monthlyKeyToIndex.get(monthKey);

    if (monthIndex !== undefined) {
      monthlyBuckets[monthIndex].total += total;
    }

    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const quarterKey = `${date.getFullYear()}-${quarter}`;
    const quarterIndex = quarterlyKeyToIndex.get(quarterKey);

    if (quarterIndex !== undefined) {
      quarterlyBuckets[quarterIndex].total += total;
    }

    const yearIndex = yearlyKeyToIndex.get(
      String(date.getFullYear()),
    );

    if (yearIndex !== undefined) {
      yearlyBuckets[yearIndex].total += total;
    }
  }

  return {
    monthly: monthlyBuckets,
    quarterly: quarterlyBuckets,
    yearly: yearlyBuckets,
  };
}

export async function getCategoryBreakdown(): Promise<
  CategoryBreakdownItem[]
> {
  const products = await getProducts();

  const totalsByCategory = new Map<string, number>();

  for (const product of products) {
    const revenue = Number(product.price) * Number(product.sold);

    totalsByCategory.set(
      product.category,
      (totalsByCategory.get(product.category) ?? 0) + revenue,
    );
  }

  const grandTotal = Array.from(
    totalsByCategory.values(),
  ).reduce((sum, value) => sum + value, 0);

  return Array.from(totalsByCategory.entries())
    .map(([category, total]) => ({
      category: categoryLabels[category] ?? category,
      total,
      percentage:
        grandTotal > 0
          ? Math.round((total / grandTotal) * 100)
          : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function getTopProducts(
  limit = 5,
): Promise<TopProductRow[]> {
  const products = await getProducts();

  return [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: categoryLabels[product.category] ?? product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      sold: Number(product.sold),
      earnings: Number(product.price) * Number(product.sold),
    }));
}

function formatRelativeDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  }).format(new Date(value));
}

export async function getRecentActivity(): Promise<
  ActivityItem[]
> {
  const [orders, products] = await Promise.all([
    getOrders(),
    getProducts(),
  ]);

  const recentOrders: ActivityItem[] = orders
    .slice(0, 3)
    .map((order) => ({
      id: order.id,
      type: "order",
      title: `Order ${order.order_number}`,
      subtitle: formatRelativeDate(order.created_at),
      badge: "New Order",
      timestamp: order.created_at,
    }));

  const lowStockProducts = [...products]
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 2)
    .map((product) => ({
      id: product.id,
      type: "low-stock" as const,
      title: "Low Stock Alert",
      subtitle: `${product.name} • sisa ${product.stock}`,
      badge: "Low Stock",
      timestamp: product.created_at,
    }));

  const newestProduct = [...products]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )
    .slice(0, 1)
    .map((product) => ({
      id: product.id,
      type: "product" as const,
      title: "Produk Baru",
      subtitle: `${product.name} • ${formatRelativeDate(product.created_at)}`,
      badge: "Product",
      timestamp: product.created_at,
    }));

  return [...recentOrders, ...lowStockProducts, ...newestProduct]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )
    .slice(0, 4);
}
