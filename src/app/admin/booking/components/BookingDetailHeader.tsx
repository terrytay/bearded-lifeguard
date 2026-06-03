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
    { label: "Hours", value: `${booking.hours}`, tone: "text-ink" },
    { label: "Guards", value: `${booking.lifeguards}`, tone: "text-ink" },
    {
      label: "Status",
      value: booking.status === "completed" ? "✓" : "○",
      tone: booking.status === "completed" ? "text-sea" : "text-ink-soft",
    },
    {
      label: "Payment",
      value: booking.payment_status === "paid" ? "✓" : "○",
      tone: booking.payment_status === "paid" ? "text-sea" : "text-ochre",
    },
  ];

  return (
    <div className="bg-white border border-ink/12 rounded-2xl p-4 md:p-6 console-in">
      {!booking.viewed_by_admin && (
        <span className="inline-block mb-4 bg-signal text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          New booking
        </span>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-paper font-bold text-xl flex-shrink-0 ${
              booking.payment_status === "paid" ? "bg-sea" : "bg-ink"
            }`}
          >
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink leading-none truncate">
              {booking.customer_name}
            </h1>
            <p className="text-ink-soft text-sm tabular-nums mt-1">
              #{booking.order_id}
            </p>
            <p className="text-ink-soft text-sm mt-0.5">{fullService}</p>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
          <div className="flex gap-2">
            <StatusBadge value={booking.payment_status} kind="payment" />
            <StatusBadge value={booking.status} kind="status" />
          </div>
          <div className="lg:text-right">
            <div className="font-display text-3xl md:text-4xl font-semibold text-signal tabular-nums leading-none">
              ${booking.amount.toFixed(2)}
            </div>
            <p className="text-ink-soft text-[10px] uppercase tracking-[0.16em] mt-1">
              Total amount
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3 mt-5 pt-4 border-t border-ink/12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-sand/50 rounded-xl p-2.5 md:p-3 text-center"
          >
            <div
              className={`font-display text-xl md:text-2xl font-semibold tabular-nums ${s.tone}`}
            >
              {s.value}
            </div>
            <div className="text-ink-soft text-[10px] uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
