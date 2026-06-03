import type { ReactNode } from "react";

// Editorial status / payment tag for the admin console. One semantic colour
// per value; labels adapt to context (a booking that is "pending" reads
// "Unconfirmed"; a payment that is "pending" reads "Unpaid").

export type BadgeKind = "status" | "payment";

const COLORS: Record<string, string> = {
  paid: "text-sea border-sea/40 bg-sea/10",
  pending: "text-ochre border-ochre/40 bg-ochre/10",
  confirmed: "text-sea border-sea/40 bg-sea/10",
  completed: "text-paper bg-ink border-ink",
  cancelled: "text-signal border-signal/40 bg-signal/10",
  refunded: "text-signal border-signal/40 bg-signal/10",
};

const DOT_COLORS: Record<string, string> = {
  paid: "bg-sea",
  pending: "bg-ochre",
  confirmed: "bg-sea",
  completed: "bg-ink",
  cancelled: "bg-signal",
  refunded: "bg-signal",
};

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function statusLabel(value: string, kind: BadgeKind = "status") {
  if (kind === "payment") return value === "pending" ? "Unpaid" : cap(value);
  return value === "pending" ? "Unconfirmed" : cap(value);
}

export function statusColor(value: string) {
  return COLORS[value] || "text-ink-soft border-ink/20 bg-ink/5";
}

export function statusDot(value: string) {
  return DOT_COLORS[value] || "bg-ink-soft";
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
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${statusColor(
        value
      )} ${className}`}
    >
      {icon}
      {statusLabel(value, kind)}
    </span>
  );
}
