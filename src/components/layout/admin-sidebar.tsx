"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Moon } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import {
  adminMainNavigation,
  adminSettingsNavigation,
  type AdminNavItem,
} from "@/config/admin-navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/auth/actions";

function isRouteActive(pathname: string, href: string) {
  if (href === "#") return false;

  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

function NavRow({
  item,
  isActive,
}: {
  item: AdminNavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <span
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
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
        isActive
          ? "bg-brand-50 text-brand-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Icon className="size-[18px]" />
      {item.label}
    </Link>
  );
}

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

type AdminSidebarProps = {
  name: string;
};

export function AdminSidebar({ name }: AdminSidebarProps) {
  const pathname = usePathname();
  const [ordersOpen, setOrdersOpen] = useState(true);

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-white">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-5">
        <BrandLogo showNameOnMobile />

        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-600">
          Admin
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavGroupLabel>Main</NavGroupLabel>

        <nav className="flex flex-col gap-1">
          {adminMainNavigation.map((item) => {
            if (item.children) {
              const isActive = isRouteActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setOrdersOpen((open) => !open)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-brand-50 text-brand-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Icon className="size-[18px]" />

                    <span className="flex-1 text-left">
                      {item.label}
                    </span>

                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        ordersOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {ordersOpen ? (
                    <div className="ml-[26px] mt-1 flex flex-col gap-1 border-l border-border pl-4">
                      {item.children.map((child) => {
                        if (child.disabled) {
                          return (
                            <span
                              key={child.label}
                              title="Segera hadir"
                              className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
                            >
                              {child.label}
                            </span>
                          );
                        }

                        const childActive =
                          pathname === child.href;

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm font-medium transition",
                              childActive
                                ? "text-brand-600"
                                : "text-slate-500 hover:text-slate-900",
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <NavRow
                key={item.label}
                item={item}
                isActive={isRouteActive(pathname, item.href)}
              />
            );
          })}
        </nav>

        <NavGroupLabel>Settings</NavGroupLabel>

        <nav className="flex flex-col gap-1">
          {adminSettingsNavigation.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              isActive={isRouteActive(pathname, item.href)}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-border px-3 py-3">
        <span
          title="Segera hadir"
          className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400"
        >
          <span className="flex items-center gap-3">
            <Moon className="size-[18px]" />
            Dark Mode
          </span>

          <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-slate-200">
            <span className="ml-0.5 size-4 rounded-full bg-white shadow-sm" />
          </span>
        </span>

        <div className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {(name.trim().charAt(0) || "A").toUpperCase()}
          </div>

          <p className="flex-1 truncate text-sm font-semibold text-slate-700">
            {name || "Admin"}
          </p>
        </div>

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
