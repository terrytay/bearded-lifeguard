import type { ReactNode } from "react";

// Shared status / payment pill for the admin console. One semantic colour per
// value; labels adapt to context (a booking that is "pending" reads
// "Unconfirmed"; a payment that is "pending" reads "Unpaid").

export type BadgeKind = "status" | "payment";

const COLORS: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  pending: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  confirmed: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  completed: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  refunded: "bg-rose-500/15 text-rose-200 border-rose-400/30",
};

const DOT_COLORS: Record<string, string> = {
  paid: "bg-emerald-400",
  pending: "bg-amber-400",
  confirmed: "bg-sky-400",
  completed: "bg-violet-400",
  cancelled: "bg-rose-400",
  refunded: "bg-rose-400",
};

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function statusLabel(value: string, kind: BadgeKind = "status") {
  if (kind === "payment") return value === "pending" ? "Unpaid" : cap(value);
  return value === "pending" ? "Unconfirmed" : cap(value);
}

export function statusColor(value: string) {
  return COLORS[value] || "bg-white/10 text-white/70 border-white/15";
}

export function statusDot(value: string) {
  return DOT_COLORS[value] || "bg-white/40";
}

export default function StatusBadge({
  value,
  kind = "status",
  icon,
  className = "",
}: {
  value: string;
  kind?: BadgeKind;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap ${statusColor(
        value
      )} ${className}`}
    >
      {icon}
      {statusLabel(value, kind)}
    </span>
  );
}
