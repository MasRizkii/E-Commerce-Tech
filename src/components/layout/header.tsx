"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, UserRound } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Container } from "@/components/ui/container";
import { storeNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import {
  useCartHydration,
  useCartStore,
} from "@/features/cart/cart-store";

export function Header() {
  const pathname = usePathname();
  const hasCartHydrated = useCartHydration();

  const cartQuantity = useCartStore((state) =>
  state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  ),
);

  function isActiveRoute(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6">
        <BrandLogo />

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 md:flex"
        >
          {storeNavigation.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative py-2 font-heading text-[15px] font-bold transition",
                  isActive
                    ? "text-brand-600"
                    : "text-ink hover:text-brand-600",
                )}
              >
                {item.label}

                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 mx-auto h-0.5 rounded-full bg-brand-500 transition-all",
                    isActive ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/shop"
            aria-label="Cari produk"
            title="Cari produk"
            className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-brand-50 hover:text-brand-600"
          >
            <Search aria-hidden="true" className="size-[22px]" />
          </Link>

          <Link
            href="/cart"
            aria-label="Buka keranjang belanja"
            title="Keranjang"
            className="relative grid size-10 place-items-center rounded-full text-ink transition hover:bg-brand-50 hover:text-brand-600"
          >
            <ShoppingCart aria-hidden="true" className="size-[22px]" />

            <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
              {hasCartHydrated ? cartQuantity : 0}
            </span>
          </Link>

          <Link
            href="/account/profile"
            aria-label="Masuk ke akun"
            title="Akun"
            className="hidden size-10 place-items-center rounded-full text-ink transition hover:bg-brand-50 hover:text-brand-600 sm:grid"
          >
            <UserRound aria-hidden="true" className="size-[22px]" />
          </Link>

          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}