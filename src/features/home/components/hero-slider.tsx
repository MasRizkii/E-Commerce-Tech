"use client";

import { useRef, useState } from "react";
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
    background: "from-[#dcefee] via-[#e7f5f4] to-[#cbe6e5]",
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
    background: "from-[#e8efff] via-[#f3f6ff] to-[#dce7ff]",
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
    background: "from-[#f6ece4] via-[#fff7ef] to-[#f3dfd0]",
  },
] as const;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

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

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current =
      event.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    const SWIPE_THRESHOLD = 40;

    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      showPreviousSlide();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      showNextSlide();
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  return (
    <section
      aria-label="Featured promotions"
      className="relative h-[600px] overflow-hidden rounded-[1.75rem] border border-white/50 bg-white/25 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.25)] backdrop-blur-2xl lg:h-[430px]"
    >
      <div
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex h-full touch-pan-y transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${
            activeIndex * (100 / slides.length)
          }%)`,
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative flex h-full shrink-0 flex-col items-center justify-center overflow-hidden px-6 py-10 sm:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:px-20 lg:py-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-gradient-to-br opacity-60",
                slide.background,
              )}
            />

            <div className="absolute inset-0 -z-10 bg-white/10" />

            <div className="relative z-10 flex min-h-0 max-w-xl flex-col justify-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
                {slide.eyebrow}
              </p>

              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-[56px]">
                {slide.title}

                <span className="mt-1 block text-brand-500">
                  {slide.highlight}
                </span>
              </h1>

              <p className="mt-5 line-clamp-3 max-w-md text-sm leading-6 text-muted sm:text-base">
                {slide.description}
              </p>

              <Link
                href={slide.href}
                className="mt-7 inline-flex min-h-12 w-fit items-center justify-center rounded-lg bg-brand-500 px-6 font-heading text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600"
              >
                Shop Now
              </Link>
            </div>

            <div className="relative mt-8 h-[200px] w-full shrink-0 sm:h-[240px] lg:mt-0 lg:h-[320px]">
              <div className="absolute inset-0 grid place-items-center text-brand-300/60">
                <Laptop
                  aria-hidden="true"
                  className="size-36 sm:size-44"
                  strokeWidth={0.8}
                />
              </div>

              <Image
                src={slide.image}
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
        ))}
      </div>

      <button
        type="button"
        aria-label="Promo sebelumnya"
        onClick={showPreviousSlide}
        className="absolute left-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/40 text-ink shadow-sm backdrop-blur-md transition hover:-translate-x-0.5 hover:bg-white/70 lg:grid"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Promo berikutnya"
        onClick={showNextSlide}
        className="absolute right-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white/40 text-ink shadow-sm backdrop-blur-md transition hover:translate-x-0.5 hover:bg-white/70 lg:grid"
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
              "h-2 rounded-full transition-all duration-500",
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
