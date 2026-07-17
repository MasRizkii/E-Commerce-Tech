"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { storeNavigation } from "@/config/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Buka menu navigasi"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-ink transition hover:border-brand-500 hover:text-brand-600 md:hidden"
      >
        <span className="sr-only">Buka menu</span>

        <span className="flex w-5 flex-col gap-1.5">
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 isolate z-[999] md:hidden"
          style={{ height: "100dvh" }}
        >
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 z-0 bg-black/50 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigasi mobile"
            style={{
              height: "100dvh",
              backgroundColor: "#ffffff",
            }}
            className="relative z-10 ml-auto flex w-[85%] max-w-[340px] flex-col overflow-y-auto bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-5">
              <BrandLogo showNameOnMobile />

              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setIsOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-full text-ink transition hover:bg-slate-100"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <nav
              aria-label="Navigasi mobile"
              className="flex flex-col gap-2 py-6"
            >
              {storeNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 font-heading text-base font-semibold text-ink transition hover:bg-brand-50 hover:text-brand-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl bg-store-bg p-4">
              <p className="font-heading font-bold text-ink">
                Find your next tech.
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                Temukan perangkat teknologi yang sesuai dengan kebutuhanmu.
              </p>

              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Shop Now
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
