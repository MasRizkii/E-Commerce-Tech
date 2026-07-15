import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { formatCurrency } from "@/lib/format-currency";
import { createClient } from "@/lib/supabase/server";

type OrderSuccessPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, total, created_at",
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="size-10" />
          </span>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-green-600">
            Order Created
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Pesanan berhasil dibuat
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Ini adalah transaksi mock. Tidak ada pembayaran
            sungguhan.
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Nomor pesanan
              </span>

              <strong>{order.order_number}</strong>
            </div>

            <div className="mt-3 flex justify-between gap-4">
              <span className="text-slate-500">Status</span>

              <strong className="capitalize">
                {order.status}
              </strong>
            </div>

            <div className="mt-3 flex justify-between gap-4">
              <span className="text-slate-500">Total</span>

              <strong className="text-[#4778e6]">
                {formatCurrency(Number(order.total))}
              </strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/account/orders/${order.id}`}
              className="rounded-lg bg-[#4778e6] px-5 py-3 text-sm font-bold text-white"
            >
              Lihat Detail
            </Link>

            <Link
              href="/shop"
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}