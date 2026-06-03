import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface Booking {
  id: string;
  order_id: string;
  customer_email: string;
  status: string;
  viewed_by_admin: boolean;
}

interface StatusActionsProps {
  booking: Booking;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

const STATUSES: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function StatusActions({
  booking,
  onUpdate,
  onDelete,
}: StatusActionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleViewedToggle = () => {
    onUpdate(booking.id, {
      action: booking.viewed_by_admin ? "mark_unviewed" : "mark_viewed",
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleViewedToggle}
        className="w-full py-3 px-6 border border-ink/25 text-ink rounded-xl hover:bg-ink hover:text-paper transition-all font-medium flex items-center justify-center gap-2 min-h-[48px]"
      >
        {booking.viewed_by_admin ? (
          <>
            <EyeSlashIcon className="w-5 h-5" />
            <span>Mark as new</span>
          </>
        ) : (
          <>
            <EyeIcon className="w-5 h-5" />
            <span>Mark as viewed</span>
          </>
        )}
      </button>

      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
          Set booking status
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((s) => {
            const active = booking.status === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onUpdate(booking.id, { status: s.value })}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all min-h-[44px] ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "text-ink-soft border-ink/20 hover:border-ink/50 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => copyToClipboard(booking.customer_email, "email")}
          className="py-2.5 px-3 border border-ink/20 text-ink rounded-xl hover:border-ink/50 font-medium text-sm transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          {copied === "email" ? (
            <CheckIcon className="w-4 h-4 text-sea" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
          <span>{copied === "email" ? "Copied" : "Email"}</span>
        </button>
        <button
          onClick={() => copyToClipboard(booking.order_id, "order")}
          className="py-2.5 px-3 border border-ink/20 text-ink rounded-xl hover:border-ink/50 font-medium text-sm transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          {copied === "order" ? (
            <CheckIcon className="w-4 h-4 text-sea" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
          <span>{copied === "order" ? "Copied" : "Order ID"}</span>
        </button>
      </div>

      <div className="pt-4 border-t border-ink/12">
        <button
          onClick={() => onDelete(booking.id)}
          className="w-full py-3 px-6 border border-signal/40 text-signal hover:bg-signal hover:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete booking</span>
        </button>
        <p className="text-ink-soft text-xs text-center mt-2">
          This cannot be undone
        </p>
      </div>
    </div>
  );
}
