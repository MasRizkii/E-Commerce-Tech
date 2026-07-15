import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Container } from "@/components/ui/container";
import { logoutAction } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";

type AccountLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login?redirect=/account/profile");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <Container className="flex min-h-20 items-center justify-between gap-6">
          <BrandLogo />

          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href="/account/profile"
              className="text-sm font-bold text-ink hover:text-brand-600"
            >
              Profile
            </Link>

            <Link
              href="/account/orders"
              className="text-sm font-bold text-ink hover:text-brand-600"
            >
              My Orders
            </Link>

            <Link
              href="/cart"
              className="text-sm font-bold text-ink hover:text-brand-600"
            >
              Cart
            </Link>
          </nav>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-red-500 transition hover:border-red-200 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </form>
        </Container>
      </header>

      {children}
    </div>
  );
}