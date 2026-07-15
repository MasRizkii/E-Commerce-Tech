"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

type AdminShellProps = {
  name: string;
  email: string;
  children: React.ReactNode;
};

export function AdminShell({
  name,
  email,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar name={name} />
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-screen w-72 max-w-[80vw]">
            <AdminSidebar name={name} />
          </div>

          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/40"
          />
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Buka menu"
            className="grid size-12 shrink-0 place-items-center text-ink lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          <div className="flex-1">
            <AdminTopbar name={name} email={email} />
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
