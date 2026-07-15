"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  LoaderCircle,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import {
  createOrderAction,
  type CheckoutActionState,
} from "@/features/checkout/actions";
import {
  useCartHydration,
  useCartStore,
} from "@/features/cart/cart-store";
import { formatCurrency } from "@/lib/format-currency";

type CheckoutFormProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

const initialState: CheckoutActionState = {
  status: "idle",
  message: "",
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-600">
      {errors[0]}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4778e6] px-5 text-sm font-bold text-white transition hover:bg-[#3868d5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Membuat pesanan...
        </>
      ) : (
        <>
          <LockKeyhole className="size-4" />
          Buat Pesanan Mock
        </>
      )}
    </button>
  );
}

export function CheckoutForm({
  profile,
}: CheckoutFormProps) {
  const router = useRouter();
  const hasHydrated = useCartHydration();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const [state, formAction] = useActionState(
    createOrderAction,
    initialState,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

  const serializedItems = JSON.stringify(
    items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  );

  useEffect(() => {
    if (
      state.status === "success" &&
      state.orderId
    ) {
      clearCart();

      router.replace(
        `/checkout/success/${state.orderId}`,
      );
    }
  }, [
    state.status,
    state.orderId,
    clearCart,
    router,
  ]);

  if (!hasHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div>
          <ShoppingBag className="mx-auto size-12 text-slate-400" />

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Cart masih kosong
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Tambahkan produk sebelum melakukan checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-lg bg-[#4778e6] px-6 py-3 text-sm font-bold text-white"
          >
            Kembali ke Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <input
        type="hidden"
        name="items"
        value={serializedItems}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Informasi Pengiriman
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Pesanan ini hanya simulasi untuk project
          portofolio.
        </p>

        {state.status === "error" ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="customerName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama penerima
            </label>

            <input
              id="customerName"
              name="customerName"
              defaultValue={profile.name}
              className={inputClassName}
            />

            <FieldError
              errors={state.errors?.customerName}
            />
          </div>

          <div>
            <label
              htmlFor="customerEmail"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              defaultValue={profile.email}
              className={inputClassName}
            />

            <FieldError
              errors={state.errors?.customerEmail}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nomor telepon
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone}
              className={inputClassName}
            />

            <FieldError errors={state.errors?.phone} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="shippingAddress"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Alamat pengiriman
            </label>

            <textarea
              id="shippingAddress"
              name="shippingAddress"
              rows={4}
              defaultValue={profile.address}
              className={`${inputClassName} resize-none`}
            />

            <FieldError
              errors={state.errors?.shippingAddress}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Catatan
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Opsional, maksimal 300 karakter"
              className={`${inputClassName} resize-none`}
            />

            <FieldError errors={state.errors?.notes} />
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-slate-900">
          Ringkasan Pesanan
        </h2>

        <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {item.name}
                </p>

                <p className="text-slate-500">
                  {item.quantity} ×{" "}
                  {formatCurrency(item.price)}
                </p>
              </div>

              <p className="font-semibold text-slate-900">
                {formatCurrency(
                  item.price * item.quantity,
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-slate-200" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Ongkir</span>
            <span className="font-semibold text-green-600">
              Gratis
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold">
            <span>Total</span>
            <span className="text-[#4778e6]">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <SubmitButton />
        </div>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Tidak ada pembayaran sungguhan yang diproses.
        </p>
      </aside>
    </form>
  );
}