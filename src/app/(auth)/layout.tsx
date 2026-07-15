import { redirect } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { createClient } from "@/lib/supabase/server";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AuthLayout({
  children,
}: AuthLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/account/profile");
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-store-bg p-12 lg:flex lg:flex-col">
        <BrandLogo showNameOnMobile />

        <div className="my-auto max-w-lg">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Welcome to toko.mac
          </p>

          <h1 className="mt-4 font-heading text-5xl font-extrabold leading-tight text-ink">
            Your account for a better shopping experience.
          </h1>

          <div className="mt-10 space-y-5">
            <div className="flex gap-4">
              <ShoppingBag className="size-6 shrink-0 text-brand-500" />

              <div>
                <h2 className="font-bold text-ink">
                  Persistent Orders
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Simpan dan periksa riwayat pesanan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <ShieldCheck className="size-6 shrink-0 text-brand-500" />

              <div>
                <h2 className="font-bold text-ink">
                  Secure Authentication
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Session dikelola menggunakan Supabase Auth.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Sparkles className="size-6 shrink-0 text-brand-500" />

              <div>
                <h2 className="font-bold text-ink">
                  Simple Experience
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Alur belanja yang cepat dan jelas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <BrandLogo showNameOnMobile />
          </div>

          {children}
        </div>
      </section>
    </div>
  );
}