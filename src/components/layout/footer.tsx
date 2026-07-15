import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa6";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Container } from "@/components/ui/container";
import { storeNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.8fr]">
        <div>
          <BrandLogo showNameOnMobile />

          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Marketplace perangkat teknologi untuk menemukan laptop,
            smartphone, dan aksesori pilihan dengan pengalaman belanja yang
            sederhana.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram toko.mac"
              className="grid size-10 place-items-center rounded-full border border-border text-ink transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              <FaInstagram aria-hidden="true" className="size-5" />
            </a>

            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub developer"
              className="grid size-10 place-items-center rounded-full border border-border text-ink transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              <FaGithub aria-hidden="true" className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-ink">
            Navigation
          </h2>

          <ul className="mt-4 space-y-3">
            {storeNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition hover:text-brand-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-ink">
            About toko.mac
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted">
            toko.mac merupakan proyek e-commerce teknologi yang dikembangkan
            sebagai portfolio full-stack menggunakan Next.js.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-ink">
            Contact
          </h2>

          <ul className="mt-4 space-y-4">
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-3 text-sm text-muted transition hover:text-brand-600"
              >
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />

                <span>{siteConfig.contact.phone}</span>
              </a>
            </li>

            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-start gap-3 text-sm text-muted transition hover:text-brand-600"
              >
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />

                <span className="break-all">
                  {siteConfig.contact.email}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-center text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} toko.mac. All rights reserved.
          </p>

          <p>Portfolio demo — no real transactions.</p>
        </Container>
      </div>
    </footer>
  );
}