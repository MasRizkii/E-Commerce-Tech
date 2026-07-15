import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Laptop,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

type PromoCard = {
  title: string;
  price: string;
  href: string;
  icon: LucideIcon;
  background: string;
};

const promoCards: PromoCard[] = [
  {
    title: "iPhone",
    price: "Mulai Rp7.499.000",
    href: "/shop?category=smartphone",
    icon: Smartphone,
    background: "from-[#fff2ec] to-[#ffe1d2]",
  },
  {
    title: "MacBook",
    price: "Mulai Rp13.999.000",
    href: "/shop?category=laptop",
    icon: Laptop,
    background: "from-[#edf3ff] to-[#dce7ff]",
  },
  {
    title: "Mac mini",
    price: "Mulai Rp10.499.000",
    href: "/shop?category=desktop",
    icon: Cpu,
    background: "from-[#f0f1f2] to-[#dfe2e5]",
  },
];

export function PromoCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {promoCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className={`group relative min-h-40 overflow-hidden rounded-2xl bg-gradient-to-br p-6 ${card.background}`}
          >
            <div className="relative z-10 max-w-[65%]">
              <h2 className="font-heading text-2xl font-extrabold text-ink">
                {card.title}
              </h2>

              <p className="mt-1 text-sm font-semibold text-muted">
                {card.price}
              </p>

              <Link
                href={card.href}
                className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-brand-600 transition group-hover:gap-3"
              >
                Shop Now
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <Icon
              aria-hidden="true"
              className="absolute -bottom-4 -right-2 size-32 rotate-[-8deg] text-ink/15 transition duration-500 group-hover:scale-110 group-hover:rotate-0"
              strokeWidth={1.2}
            />
          </article>
        );
      })}
    </section>
  );
}