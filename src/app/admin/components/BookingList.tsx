"use client";

import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  EyeIcon,
  TrashIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftEllipsisIcon,
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
  end_datetime: string;
  hours: number;
  lifeguards: number;
  service_type: string;
  custom_service?: string;
  location?: string;
  remarks?: string;
  amount: number;
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  viewed_by_admin: boolean;
  lifeguards_assigned?: string[];
}

interface BookingListProps {
  bookings: Booking[];
  onMarkViewed: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party",
  "open-water": "Open Water",
  others: "Custom Service",
};

export default function BookingList({
  bookings,
  onMarkViewed,
  onDelete,
}: BookingListProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-ink/12 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3.5 border-b border-ink/12 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Directory
          </div>
          <h3 className="font-display text-lg font-semibold text-ink leading-none mt-0.5">
            Bookings
          </h3>
        </div>
        <span className="text-ink-soft text-xs tabular-nums">
          {bookings.length} record{bookings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop column header */}
      <div className="hidden xl:block px-6 py-2.5 bg-sand/50 border-b border-ink/15">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-semibold text-ink-soft uppercase tracking-[0.14em]">
          <div className="col-span-1 text-center">State</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Service</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-1 text-center">Hrs</div>
          <div className="col-span-1 text-center">Guards</div>
          <div className="col-span-1 text-center">Amount</div>
          <div className="col-span-1 text-center">Pay</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-ink/10">
        {bookings.map((booking) => {
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
              key={booking.id}
              className={`group hover:bg-sand/40 transition-colors cursor-pointer ${
                !booking.viewed_by_admin
                  ? "bg-signal/[0.05] border-l-2 border-signal"
                  : ""
              }`}
              onClick={() => router.push(`/admin/booking/${booking.id}`)}
            >
              {/* Desktop row */}
              <div className="hidden xl:grid grid-cols-12 gap-4 items-center px-6 py-3.5">
                <div className="col-span-1 flex flex-col items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      booking.viewed_by_admin ? "bg-ink/25" : "bg-signal"
                    }`}
                    title={booking.viewed_by_admin ? "Viewed" : "New"}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      booking.payment_status === "paid" ? "bg-sea" : "bg-ochre"
                    }`}
                    title={booking.payment_status === "paid" ? "Paid" : "Unpaid"}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                      booking.payment_status === "paid" ? "bg-sea" : "bg-ink"
                    }`}
                  >
                    {booking.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">
                      {booking.customer_name}
                    </p>
                    <p className="text-ink-soft text-xs tabular-nums truncate">
                      #{booking.order_id}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 min-w-0">
                  <p className="font-medium text-ink text-sm truncate">
                    {fullService}
                  </p>
                  {booking.location && (
                    <span className="flex items-center gap-1 mt-0.5 text-ink-soft text-xs truncate">
                      <MapPinIcon className="w-3 h-3 text-signal" />
                      {booking.location}
                    </span>
                  )}
                </div>

                <div className="col-span-2">
                  <p className="text-ink text-sm">
                    {SingaporeTime.format(booking.start_datetime, "dd MMM yyyy")}
                  </p>
                  <p className="text-ink-soft text-xs tabular-nums">
                    {SingaporeTime.format(booking.start_datetime, "HH:mm")} –{" "}
                    {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                  </p>
                </div>

                <div className="col-span-1 text-center">
                  <span className="font-semibold text-ink text-sm tabular-nums">
                    {booking.hours}h
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <span
                    className={`font-semibold text-sm tabular-nums ${
                      fullyStaffed ? "text-sea" : "text-ochre"
                    }`}
                  >
                    {booking.lifeguards_assigned?.length || 0}/
                    {booking.lifeguards}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <span className="font-semibold text-ink text-sm tabular-nums">
                    ${booking.amount.toFixed(0)}
                  </span>
                </div>

                <div className="col-span-1 flex justify-center">
                  <StatusBadge value={booking.payment_status} kind="payment" />
                </div>

                <div className="col-span-1 flex justify-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkViewed(booking);
                    }}
                    className="p-2 text-ink-soft hover:text-sea hover:bg-sea/10 rounded-lg transition-all"
                    title={booking.viewed_by_admin ? "Mark new" : "Mark viewed"}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(booking.id);
                    }}
                    className="p-2 text-ink-soft hover:text-signal hover:bg-signal/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile / tablet row */}
              <div className="xl:hidden p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                        booking.payment_status === "paid" ? "bg-sea" : "bg-ink"
                      }`}
                    >
                      {booking.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-ink text-sm truncate">
                        {booking.customer_name}
                      </h4>
                      <p className="text-ink-soft text-xs tabular-nums">
                        #{booking.order_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkViewed(booking);
                      }}
                      className="p-2 text-ink-soft hover:text-sea hover:bg-sea/10 rounded-lg transition-all"
                      title={booking.viewed_by_admin ? "Mark new" : "Mark viewed"}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(booking.id);
                      }}
                      className="p-2 text-ink-soft hover:text-signal hover:bg-signal/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {!booking.viewed_by_admin && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-signal text-white">
                      New
                    </span>
                  )}
                  <StatusBadge value={booking.payment_status} kind="payment" />
                  <StatusBadge value={booking.status} kind="status" />
                </div>

                <div className="bg-sand/50 rounded-xl p-3 space-y-2">
                  <p className="font-medium text-ink text-sm">{fullService}</p>
                  {booking.location && (
                    <div className="flex items-center gap-2 text-ink-soft text-sm">
                      <MapPinIcon className="w-4 h-4 text-signal flex-shrink-0" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-ink-soft text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-sea flex-shrink-0" />
                    <span className="tabular-nums">
                      {SingaporeTime.format(
                        booking.start_datetime,
                        "dd MMM, HH:mm"
                      )}{" "}
                      – {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
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
                        {booking.lifeguards_assigned?.length || 0}/
                        {booking.lifeguards}
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

                <details className="md:hidden">
                  <summary className="text-ink-soft text-sm cursor-pointer hover:text-ink transition-colors list-none flex items-center gap-1.5">
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                    Contact details
                  </summary>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-sea flex-shrink-0" />
                      <span className="text-ink tabular-nums">
                        {booking.customer_phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-sea flex-shrink-0" />
                      <span className="text-ink truncate">
                        {booking.customer_email}
                      </span>
                    </div>
                  </div>
                </details>

                {booking.remarks && (
                  <div className="bg-ochre/10 border border-ochre/25 rounded-xl p-2.5">
                    <p className="text-ochre text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                      Remarks
                    </p>
                    <p className="text-ink text-xs">{booking.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
