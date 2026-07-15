"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

type ProductGalleryProps = {
  image: string;
  name: string;
};

export function ProductGallery({
  image,
  name,
}: ProductGalleryProps) {
  const [hasImageError, setHasImageError] =
    useState(false);

  return (
    <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white to-slate-100 shadow-card">
      <div className="absolute inset-0 grid place-items-center text-slate-300">
        <Package
          aria-hidden="true"
          className="size-28"
          strokeWidth={1}
        />
      </div>

      {!hasImageError && (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          onError={() => setHasImageError(true)}
          className="object-contain p-10 sm:p-14"
        />
      )}
    </div>
  );
}