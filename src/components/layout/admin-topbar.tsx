import Link from "next/link";
import { Bell, Search } from "lucide-react";

type AdminTopbarProps = {
  name: string;
  email: string;
};

export function AdminTopbar({ name, email }: AdminTopbarProps) {
  const initial =
    name.trim().charAt(0).toUpperCase() ||
    email.trim().charAt(0).toUpperCase() ||
    "A";

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
      <label
        title="Pencarian segera hadir"
        className="relative hidden max-w-xs flex-1 sm:flex sm:items-center"
      >
        <Search className="pointer-events-none absolute left-3 size-4 text-slate-400" />

        <input
          type="text"
          disabled
          placeholder="Search anything"
          className="w-full cursor-not-allowed rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-slate-500 placeholder:text-slate-400"
        />
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span
          title="Notifikasi segera hadir"
          className="grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-full text-slate-400 transition hover:bg-surface"
        >
          <Bell className="size-[18px]" />
        </span>

        <Link
          href="/account/profile"
          className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3 transition hover:bg-surface"
        >
          <span className="grid size-8 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {initial}
          </span>

          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink">
              {name || "Admin"}
            </span>

            <span className="block text-xs leading-tight text-muted">
              {email}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
