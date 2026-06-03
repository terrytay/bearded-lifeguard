import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  EyeIcon,
  TrashIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";

interface Booking {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_datetime: string;
  hours: number;
  lifeguards: number;
  service_type: string;
  custom_service?: string;
  amount: number;
  status: string;
  payment_status: string;
  viewed_by_admin: boolean;
  lifeguards_assigned?: string[];
}

interface BookingCardProps {
  booking: Booking;
  onMarkViewed: () => void;
  onDelete: () => void;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party",
  "open-water": "Open Water",
  others: "Custom Service",
};

export default function BookingCard({
  booking,
  onMarkViewed,
  onDelete,
}: BookingCardProps) {
  const router = useRouter();
  const serviceName =
    serviceNames[booking.service_type] || booking.service_type;
  const fullService =
    booking.service_type === "others" && booking.custom_service
      ? `${serviceName}: ${booking.custom_service}`
      : serviceName;

  const fullyStaffed =
    (booking.lifeguards_assigned?.length || 0) >= booking.lifeguards;

  return (
    <div
      className={`relative bg-white border rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_0_-4px_rgba(27,23,20,0.08)] ${
        !booking.viewed_by_admin ? "border-signal/40" : "border-ink/12 hover:border-ink/30"
      }`}
      onClick={() => router.push(`/admin/booking/${booking.id}`)}
    >
      {!booking.viewed_by_admin && (
        <div className="absolute -top-2 -right-2 bg-signal text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          New
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-paper font-bold flex-shrink-0 ${
              booking.payment_status === "paid" ? "bg-sea" : "bg-ink"
            }`}
          >
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-ink text-sm truncate">
              {booking.customer_name}
            </h3>
            <p className="text-ink-soft text-xs tabular-nums truncate">
              #{booking.order_id}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge value={booking.payment_status} kind="payment" />
          <StatusBadge value={booking.status} kind="status" />
        </div>
      </div>

      <div className="bg-sand/50 rounded-xl p-3 mb-3">
        <p className="font-medium text-ink text-sm truncate">{fullService}</p>
        <p className="text-ink-soft text-xs flex items-center gap-1.5 mt-1">
          <CalendarDaysIcon className="w-3.5 h-3.5 text-sea" />
          {SingaporeTime.format(booking.start_datetime, "dd MMM, HH:mm")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-sand/50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <ClockIcon className="w-3.5 h-3.5 text-sea" />
            <span className="font-display font-semibold text-ink text-base tabular-nums">
              {booking.hours}h
            </span>
          </div>
          <p className="text-ink-soft text-[10px] uppercase tracking-wider">
            Duration
          </p>
        </div>
        <div className="bg-sand/50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <UserGroupIcon
              className={`w-3.5 h-3.5 ${
                fullyStaffed ? "text-sea" : "text-ochre"
              }`}
            />
            <span className="font-display font-semibold text-ink text-base tabular-nums">
              {booking.lifeguards_assigned?.length || 0}/{booking.lifeguards}
            </span>
          </div>
          <p className="text-ink-soft text-[10px] uppercase tracking-wider">
            Guards
          </p>
        </div>
        <div className="bg-sand/50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <CurrencyDollarIcon className="w-3.5 h-3.5 text-signal" />
            <span className="font-display font-semibold text-ink text-base tabular-nums">
              {booking.amount.toFixed(0)}
            </span>
          </div>
          <p className="text-ink-soft text-[10px] uppercase tracking-wider">
            Amount
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkViewed();
          }}
          className="flex-1 py-2.5 px-3 border border-ink/25 text-ink rounded-xl hover:bg-ink hover:text-paper transition-all font-medium text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{booking.viewed_by_admin ? "Mark new" : "Mark viewed"}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="py-2.5 px-3.5 border border-signal/40 text-signal rounded-xl hover:bg-signal hover:text-white transition-all min-h-[44px] flex items-center justify-center"
          aria-label="Delete booking"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
