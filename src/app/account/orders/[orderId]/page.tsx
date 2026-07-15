import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";

import { formatCurrency } from "@/lib/format-currency";
import { createClient } from "@/lib/supabase/server";

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

type OrderItemRow = {
  id: string;
  product_name: string;
  product_slug: string;
  product_image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        customer_name,
        customer_email,
        phone,
        shipping_address,
        notes,
        subtotal,
        shipping_cost,
        total,
        created_at,
        order_items (
          id,
          product_name,
          product_slug,
          product_image,
          price,
          quantity,
          subtotal
        )
      `,
    )
    .eq("id", orderId)
    .eq("user_id", userId ?? "")
    .maybeSingle();

  if (error || !order) {
    notFound();
  }

  const items =
    order.order_items as OrderItemRow[];

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm font-bold text-[#4778e6]"
      >
        <ChevronLeft className="size-4" />
        Kembali ke riwayat
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Nomor pesanan
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {order.order_number}
          </h1>
        </div>

        <span className="inline-flex w-fit rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold capitalize text-yellow-700">
          {order.status}
        </span>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Produk
          </h2>

          <div className="mt-5 divide-y divide-slate-200">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div
                  className="size-20 shrink-0 rounded-lg bg-slate-100 bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("${item.product_image}")`,
                  }}
                />

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.product_slug}`}
                    className="font-bold text-slate-900 hover:text-[#4778e6]"
                  >
                    {item.product_name}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.quantity} ×{" "}
                    {formatCurrency(Number(item.price))}
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(Number(item.subtotal))}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Ringkasan
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Subtotal
                </span>

                <span>
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Ongkir
                </span>

                <span>
                  {Number(order.shipping_cost) === 0
                    ? "Gratis"
                    : formatCurrency(
                        Number(order.shipping_cost),
                      )}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold">
                <span>Total</span>

                <span className="text-[#4778e6]">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="size-5 text-[#4778e6]" />
              Pengiriman
            </h2>

            <div className="mt-4 space-y-1 text-sm leading-6 text-slate-600">
              <p className="font-bold text-slate-900">
                {order.customer_name}
              </p>

              <p>{order.customer_email}</p>
              <p>{order.phone}</p>
              <p>{order.shipping_address}</p>

              {order.notes ? (
                <p className="mt-3 border-t border-slate-200 pt-3">
                  Catatan: {order.notes}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}