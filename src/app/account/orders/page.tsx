import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { formatCurrency } from "@/lib/format-currency";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  const { data: orders, error } = userId
    ? await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            status,
            total,
            created_at
          `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Riwayat Pesanan
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Daftar transaksi mock yang pernah kamu buat.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Riwayat pesanan gagal dimuat.
        </div>
      ) : null}

      {!orders?.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <PackageSearch className="mx-auto size-12 text-slate-400" />

          <h2 className="mt-4 text-xl font-bold">
            Belum ada pesanan
          </h2>

          <Link
            href="/shop"
            className="mt-5 inline-flex rounded-lg bg-[#4778e6] px-5 py-3 text-sm font-bold text-white"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-900">
                    {order.order_number}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold capitalize text-yellow-700">
                    {order.status}
                  </span>

                  <p className="mt-2 font-bold text-[#4778e6]">
                    {formatCurrency(Number(order.total))}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-sm font-bold text-[#4778e6]"
                >
                  Lihat detail pesanan →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}