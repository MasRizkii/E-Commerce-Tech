import Link from "next/link";
import {
  Package,
  Percent,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";

type QuickMenuItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
};

const quickMenus: QuickMenuItem[] = [
  {
    label: "Best Seller",
    description: "Shop Now",
    href: "/shop?sort=best-selling",
    icon: Tag,
    iconClassName: "bg-orange-100 text-accent-dark",
  },
  {
    label: "New Arrival",
    description: "Shop Now",
    href: "/shop?sort=newest",
    icon: Package,
    iconClassName: "bg-blue-100 text-brand-600",
  },
  {
    label: "Top Rated",
    description: "Shop Now",
    href: "/shop?sort=rating",
    icon: Star,
    iconClassName: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Promo",
    description: "Shop Now",
    href: "/shop?promo=true",
    icon: Percent,
    iconClassName: "bg-orange-100 text-accent-dark",
  },
];

export function QuickMenu() {
  return (
    <section aria-label="Quick menu">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickMenus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group flex min-w-0 items-center gap-3 rounded-2xl bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full sm:size-12 ${item.iconClassName}`}
              >
                <Icon aria-hidden="true" className="size-5 sm:size-6" />
              </span>

              <span className="min-w-0">
                <span className="block truncate font-heading text-sm font-bold text-ink sm:text-base">
                  {item.label}
                </span>

                <span className="mt-0.5 block text-[10px] font-extrabold uppercase tracking-wide text-brand-500 transition group-hover:text-brand-700 sm:text-xs">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}