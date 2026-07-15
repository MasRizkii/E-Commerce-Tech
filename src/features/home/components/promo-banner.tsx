import Link from "next/link";
import { Percent, ShoppingBag } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] bg-[#1db4d1] px-6 py-8 text-white sm:px-10">
      <div className="absolute -right-14 -top-20 size-64 rounded-full bg-white/10" />
      <div className="absolute bottom-[-100px] right-28 size-52 rounded-full bg-yellow-300/30" />

      <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80">
            Limited Tech Deals
          </p>

          <h2 className="mt-2 max-w-xl font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
            Mau transaksi lebih hemat?
          </h2>

          <p className="mt-2 text-sm text-white/85 sm:text-base">
            Temukan promo menarik untuk produk teknologi pilihan.
          </p>

          <Link
            href="/shop?promo=true"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-white/60 px-5 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-[#148ba2]"
          >
            Cek Sekarang
          </Link>
        </div>

        <div className="relative hidden min-h-32 items-center justify-center md:flex">
          <ShoppingBag
            aria-hidden="true"
            className="size-28 text-white/95"
            strokeWidth={1.2}
          />

          <span className="absolute right-1/4 top-0 grid size-14 place-items-center rounded-full bg-yellow-300 text-[#148ba2] shadow-lg">
            <Percent aria-hidden="true" className="size-7" />
          </span>
        </div>
      </div>
    </section>
  );
}