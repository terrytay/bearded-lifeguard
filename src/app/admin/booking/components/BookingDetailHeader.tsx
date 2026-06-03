import StatusBadge from "../../components/StatusBadge";

interface Booking {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_datetime: string;
  end_datetime: string;
  hours: number;
  lifeguards: number;
  service_type: string;
  custom_service?: string;
  location?: string;
  remarks?: string;
  amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  viewed_by_admin: boolean;
}

interface BookingDetailHeaderProps {
  booking: Booking;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party Lifeguarding",
  "open-water": "Open Water Lifeguarding",
  others: "Custom Service",
};

export default function BookingDetailHeader({
  booking,
}: BookingDetailHeaderProps) {
  const serviceName =
    serviceNames[booking.service_type] || booking.service_type;
  const fullService =
    booking.service_type === "others" && booking.custom_service
      ? `${serviceName}: ${booking.custom_service}`
      : serviceName;

  const stats = [
    { label: "Hours", value: `${booking.hours}` },
    { label: "Guards", value: `${booking.lifeguards}` },
    {
      label: "Status",
      value: booking.status === "completed" ? "✓" : "○",
      tone: booking.status === "completed" ? "text-emerald-300" : "text-white/50",
    },
    {
      label: "Payment",
      value: booking.payment_status === "paid" ? "✓" : "○",
      tone:
        booking.payment_status === "paid"
          ? "text-emerald-300"
          : "text-amber-300",
    },
  ];

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-6 console-in">
      {!booking.viewed_by_admin && (
        <span className="inline-block mb-4 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          NEW BOOKING
        </span>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
              booking.payment_status === "paid"
                ? "bg-emerald-500/80"
                : "bg-[#FF6633]/80"
            }`}
          >
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">
              {booking.customer_name}
            </h1>
            <p className="text-white/45 text-sm tabular-nums">
              #{booking.order_id}
            </p>
            <p className="text-white/70 text-sm mt-0.5">{fullService}</p>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
          <div className="flex gap-2">
            <StatusBadge value={booking.payment_status} kind="payment" />
            <StatusBadge value={booking.status} kind="status" />
          </div>
          <div className="lg:text-right">
            <div className="text-2xl md:text-3xl font-bold text-[#FF6633] tabular-nums">
              ${booking.amount.toFixed(2)}
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.16em]">
              Total amount
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3 mt-4 pt-4 border-t border-white/10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-black/15 rounded-xl p-2.5 md:p-3 text-center"
          >
            <div
              className={`text-lg md:text-2xl font-bold tabular-nums ${
                s.tone || "text-white"
              }`}
            >
              {s.value}
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
