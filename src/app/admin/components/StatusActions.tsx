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
      {/* View toggle */}
      <button
        onClick={handleViewedToggle}
        className="w-full py-3 px-6 bg-white/[0.04] text-white/80 border border-white/15 rounded-xl hover:border-white/30 hover:text-white transition-all font-medium flex items-center justify-center gap-2 min-h-[48px]"
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

      {/* Status chips */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">
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
                    ? "bg-[#FF6633] text-white border-[#FF6633] shadow-lg shadow-[#FF6633]/20"
                    : "bg-white/[0.04] text-white/70 border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Copy actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => copyToClipboard(booking.customer_email, "email")}
          className="py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/15 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          {copied === "email" ? (
            <CheckIcon className="w-4 h-4 text-emerald-300" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
          <span>{copied === "email" ? "Copied" : "Email"}</span>
        </button>
        <button
          onClick={() => copyToClipboard(booking.order_id, "order")}
          className="py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/15 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          {copied === "order" ? (
            <CheckIcon className="w-4 h-4 text-emerald-300" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
          <span>{copied === "order" ? "Copied" : "Order ID"}</span>
        </button>
      </div>

      {/* Danger zone */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => onDelete(booking.id)}
          className="w-full py-3 px-6 bg-rose-500/10 text-rose-300 border border-rose-400/30 hover:bg-rose-500/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete booking</span>
        </button>
        <p className="text-white/35 text-xs text-center mt-2">
          This cannot be undone
        </p>
      </div>
    </div>
  );
}
