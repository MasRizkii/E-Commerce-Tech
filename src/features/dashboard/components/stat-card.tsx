import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  comingSoon?: boolean;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-brand-50 text-brand-600",
  comingSoon = false,
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div
        className={`grid size-12 shrink-0 place-items-center rounded-full ${iconClassName}`}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>

        <p className="mt-1 truncate text-2xl font-bold text-ink">
          {value}
        </p>

        {comingSoon ? (
          <span className="mt-1 inline-block text-xs font-semibold text-slate-400">
            Segera hadir
          </span>
        ) : null}
      </div>
    </div>
  );
}
