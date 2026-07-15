"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Laptop,
} from "lucide-react";

import { cn } from "@/lib/utils";

const slides = [
  {
    id: "laptop-deals",
    eyebrow: "Special Tech Deals",
    title: "Hot Laptop Deals",
    highlight: "Up to 15% Off",
    description:
      "Performa lebih cepat untuk bekerja, belajar, dan membuat karya terbaikmu.",
    image: "/images/banners/hero-macbook.png",
    href: "/shop?category=laptop",
    background:
      "from-[#dcefee] via-[#e7f5f4] to-[#cbe6e5]",
  },
  {
    id: "iphone-deals",
    eyebrow: "Latest Smartphone",
    title: "Upgrade Your iPhone",
    highlight: "Find Your Perfect Match",
    description:
      "Temukan iPhone pilihan dengan kondisi dan harga yang sesuai kebutuhanmu.",
    image: "/images/banners/hero-iphone.png",
    href: "/shop?category=smartphone",
    background:
      "from-[#e8efff] via-[#f3f6ff] to-[#dce7ff]",
  },
  {
    id: "desktop-deals",
    eyebrow: "Powerful Compact Setup",
    title: "Build a Better Desk",
    highlight: "With Mac mini",
    description:
      "Performa desktop dalam desain ringkas untuk ruang kerja yang lebih bersih.",
    image: "/images/banners/hero-mac-mini.png",
    href: "/shop?category=desktop",
    background:
      "from-[#f6ece4] via-[#fff7ef] to-[#f3dfd0]",
  },
] as const;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  function showPreviousSlide() {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  }

  function showNextSlide() {
    setActiveIndex((current) =>
      current === slides.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section
      aria-label="Featured promotions"
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br",
        activeSlide.background,
      )}
    >
      <div
        aria-live="polite"
        className="grid min-h-[430px] items-center gap-8 px-6 py-12 sm:px-12 lg:grid-cols-2 lg:px-20"
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            {activeSlide.eyebrow}
          </p>

          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-[56px]">
            {activeSlide.title}

            <span className="mt-1 block text-brand-500">
              {activeSlide.highlight}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-muted sm:text-base">
            {activeSlide.description}
          </p>

          <Link
            href={activeSlide.href}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-500 px-6 font-heading text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600"
          >
            Shop Now
          </Link>
        </div>

        <div className="relative min-h-[220px] lg:min-h-[330px]">
          <div className="absolute inset-0 grid place-items-center text-brand-300/60">
            <Laptop
              aria-hidden="true"
              className="size-36 sm:size-44"
              strokeWidth={0.8}
            />
          </div>

          <Image
            key={activeSlide.image}
            src={activeSlide.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <button
        type="button"
        aria-label="Promo sebelumnya"
        onClick={showPreviousSlide}
        className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Promo berikutnya"
        onClick={showNextSlide}
        className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Tampilkan promo ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex
                ? "w-7 bg-brand-500"
                : "w-2 bg-white/90 hover:bg-brand-300",
            )}
          />
        ))}
      </div>
    </section>
  );
}