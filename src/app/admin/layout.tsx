import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/login?redirect=/admin/products");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="text-xl font-bold text-slate-900"
            >
              Toko Mac Admin
            </Link>

            <p className="text-sm text-slate-500">
              Halo, {profile.name || "Admin"}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <Link
              href="/admin/products"
              className="text-[#4778e6]"
            >
              Products
            </Link>

            <Link
              href="/account/orders"
              className="text-slate-600 hover:text-[#4778e6]"
            >
              Orders
            </Link>

            <Link
              href="/"
              className="text-slate-600 hover:text-[#4778e6]"
            >
              Lihat toko
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {children}
      </main>
    </div>
  );
}