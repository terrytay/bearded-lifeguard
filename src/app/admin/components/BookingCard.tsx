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
      className={`relative bg-white/[0.04] border rounded-2xl p-4 cursor-pointer hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 group ${
        !booking.viewed_by_admin
          ? "ring-1 ring-rose-400/40 border-rose-400/20"
          : "border-white/10"
      }`}
      onClick={() => router.push(`/admin/booking/${booking.id}`)}
    >
      {!booking.viewed_by_admin && (
        <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
          NEW
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
              booking.payment_status === "paid"
                ? "bg-emerald-500/80"
                : "bg-[#FF6633]/80"
            }`}
          >
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm truncate group-hover:text-[#FF6633] transition-colors">
              {booking.customer_name}
            </h3>
            <p className="text-white/45 text-xs tabular-nums truncate">
              #{booking.order_id}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge value={booking.payment_status} kind="payment" />
          <StatusBadge value={booking.status} kind="status" />
        </div>
      </div>

      {/* Service */}
      <div className="bg-black/15 rounded-xl p-3 mb-3">
        <p className="font-semibold text-white text-sm truncate">
          {fullService}
        </p>
        <p className="text-white/50 text-xs flex items-center gap-1.5 mt-1">
          <CalendarDaysIcon className="w-3.5 h-3.5 text-sky-300" />
          {SingaporeTime.format(booking.start_datetime, "dd MMM, HH:mm")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-black/15 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <ClockIcon className="w-3.5 h-3.5 text-sky-300" />
            <span className="text-white font-bold text-sm tabular-nums">
              {booking.hours}h
            </span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">
            Duration
          </p>
        </div>
        <div className="bg-black/15 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <UserGroupIcon
              className={`w-3.5 h-3.5 ${
                fullyStaffed ? "text-emerald-300" : "text-amber-300"
              }`}
            />
            <span className="text-white font-bold text-sm tabular-nums">
              {booking.lifeguards_assigned?.length || 0}/{booking.lifeguards}
            </span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">
            Guards
          </p>
        </div>
        <div className="bg-black/15 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <CurrencyDollarIcon className="w-3.5 h-3.5 text-[#FF6633]" />
            <span className="text-white font-bold text-sm tabular-nums">
              {booking.amount.toFixed(0)}
            </span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">
            Amount
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkViewed();
          }}
          className="flex-1 py-2.5 px-3 bg-white/[0.04] text-white/70 border border-white/10 rounded-xl hover:border-white/25 hover:text-white transition-all font-medium text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{booking.viewed_by_admin ? "Mark new" : "Mark viewed"}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="py-2.5 px-3.5 bg-rose-500/10 text-rose-300 border border-rose-400/30 rounded-xl hover:bg-rose-500/20 transition-all min-h-[44px] flex items-center justify-center"
          aria-label="Delete booking"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
