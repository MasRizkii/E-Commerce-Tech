import Link from "next/link";
import { Laptop } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  showNameOnMobile?: boolean;
  className?: string;
};

export function BrandLogo({
  showNameOnMobile = false,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke halaman utama toko.mac"
      className={cn(
        "inline-flex shrink-0 items-center gap-2.5 rounded-md",
        className,
      )}
    >
      <span className="relative grid size-12 place-items-center rounded-full bg-black text-white shadow-sm">
        <Laptop aria-hidden="true" className="size-5" strokeWidth={1.8} />

        <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-black" />
      </span>

      <span
        className={cn(
          "font-heading text-xl font-extrabold tracking-tight text-ink",
          !showNameOnMobile && "hidden sm:block",
        )}
      >
        toko<span className="text-accent">.mac</span>
      </span>
    </Link>
  );
}