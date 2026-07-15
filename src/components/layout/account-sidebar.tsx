"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Eye,
  LogOut,
  Settings,
  ShoppingCart,
  Star,
  UserRound,
  PackageSearch,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/auth/actions";

type AccountSidebarProps = {
  name: string;
  email: string;
};

const primaryMenu = [
  {
    label: "Profil",
    href: "/account/profile",
    icon: UserRound,
    disabled: false,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: PackageSearch,
    disabled: false,
  },
  {
    label: "Reviews",
    href: "#",
    icon: Star,
    disabled: true,
  },
  {
    label: "Recently Viewed",
    href: "#",
    icon: Eye,
    disabled: true,
  },
  {
    label: "Cart Items",
    href: "/account/cart",
    icon: ShoppingCart,
    disabled: false,
  },
];

export function AccountSidebar({ name, email }: AccountSidebarProps) {
  const pathname = usePathname();

  const initial =
    name.trim().charAt(0).toUpperCase() ||
    email.trim().charAt(0).toUpperCase() ||
    "U";

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-300 text-base font-bold text-white">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            {name || "Pengguna Toko Mac"}
          </p>

          <p className="truncate text-xs text-slate-500">{email}</p>
        </div>

        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </div>

      <nav className="flex flex-col gap-1 px-3 py-3">
        {primaryMenu.map((item) => {
          const Icon = item.icon;
          const isActive = !item.disabled && pathname.startsWith(item.href);

          if (item.disabled) {
            return (
              <span
                key={item.label}
                title="Segera hadir"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400"
              >
                <Icon className="size-[18px]" />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/10 px-3 py-3">
        <span
          title="Segera hadir"
          className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400"
        >
          <Settings className="size-[18px]" />
          Settings
        </span>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="size-[18px]" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
