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

const getStatusColor = (status: string): string => {
  if (status === "confirmed")
    return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30";
  if (status === "pending")
    return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
  if (status === "completed")
    return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30";
  if (status === "cancelled")
    return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
  return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30";
};

const getStatusText = (status: string): string => {
  if (status === "completed") return "Completed";
  if (status === "confirmed") return "Confirmed";
  if (status === "cancelled") return "Cancelled";
  return "Unconfirmed";
};

const getPaymentStatusColor = (status: string): string => {
  if (status === "paid")
    return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30";
  if (status === "pending")
    return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
  return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30";
};

const getPaymentStatusText = (status: string): string => {
  if (status === "pending") return "Unpaid";
  return "Paid";
};

export default function BookingList({
  bookings,
  onMarkViewed,
  onDelete,
}: BookingListProps) {
  const router = useRouter();

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
            <CalendarDaysIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm md:text-base">
              Bookings Directory
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Table Header - Hidden on mobile */}
      <div className="hidden xl:block px-4 md:px-6 py-2 md:py-3 bg-white/5 border-b border-white/5">
        <div className="grid grid-cols-12 gap-4 text-xs md:text-sm font-medium text-white/70 uppercase tracking-wider">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Service</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-1 text-center">Duration</div>
          <div className="col-span-1 text-center">Lifeguards</div>
          <div className="col-span-1 text-center">Amount</div>
          <div className="col-span-1 text-center">Payment</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-white/5">
        {bookings.map((booking, index) => {
          const serviceName = serviceNames[booking.service_type] || booking.service_type;
          const fullService = booking.service_type === "others" && booking.custom_service
            ? `${serviceName}: ${booking.custom_service}`
            : serviceName;

          return (
            <div
              key={booking.id}
              className={`group hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                index % 2 === 0 ? "bg-white/2" : ""
              } ${!booking.viewed_by_admin ? "bg-red-500/5 border-l-2 border-red-400/50" : ""}`}
              onClick={() => router.push(`/admin/booking/${booking.id}`)}
            >
              {/* Desktop Layout */}
              <div className="hidden xl:grid grid-cols-12 gap-4 items-center px-4 md:px-6 py-3 md:py-4">
                {/* Status Indicators */}
                <div className="col-span-1 flex flex-col items-center space-y-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      booking.viewed_by_admin
                        ? "bg-gray-400 shadow-gray-400/30"
                        : "bg-red-400 shadow-red-400/30 animate-pulse"
                    } shadow-lg`}
                    title={booking.viewed_by_admin ? "Viewed" : "New"}
                  />
                  <div
                    className={`w-3 h-3 rounded-full ${
                      booking.payment_status === "paid"
                        ? "bg-emerald-400 shadow-emerald-400/30"
                        : "bg-yellow-400 shadow-yellow-400/30"
                    } shadow-lg`}
                    title={booking.payment_status === "paid" ? "Paid" : "Unpaid"}
                  />
                </div>

                {/* Customer */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                        booking.payment_status === "paid"
                          ? "bg-gradient-to-br from-emerald-500 to-green-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {booking.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {booking.customer_name}
                      </p>
                      <p className="text-white/60 text-xs font-mono truncate">
                        #{booking.order_id}
                      </p>
                      {!booking.viewed_by_admin && (
                        <span className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="col-span-2">
                  <p className="font-medium text-white text-sm truncate">
                    {fullService}
                  </p>
                  {booking.location && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPinIcon className="w-3 h-3 text-purple-400" />
                      <span className="text-white/60 text-xs truncate">
                        {booking.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div className="col-span-2">
                  <div className="text-white/80">
                    <p className="text-sm font-medium">
                      {SingaporeTime.format(booking.start_datetime, "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-white/60">
                      {SingaporeTime.format(booking.start_datetime, "HH:mm")} - {" "}
                      {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <ClockIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-bold text-sm">
                      {booking.hours}h
                    </span>
                  </div>
                </div>

                {/* Lifeguards */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <UserGroupIcon className={`w-4 h-4 ${
                      (booking.lifeguards_assigned?.length || 0) >= booking.lifeguards 
                        ? 'text-green-400' 
                        : 'text-yellow-400'
                    }`} />
                    <span className="text-white font-bold text-sm">
                      {booking.lifeguards_assigned?.length || 0}/{booking.lifeguards}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <CurrencyDollarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold text-sm">
                      {booking.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="col-span-1 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${getPaymentStatusColor(
                      booking.payment_status
                    )}`}
                  >
                    {getPaymentStatusText(booking.payment_status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkViewed(booking);
                    }}
                    className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                    title={booking.viewed_by_admin ? "Mark as new" : "Mark as viewed"}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(booking.id);
                    }}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                    title="Delete booking"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tablet/Mobile Layout */}
              <div className="xl:hidden px-4 py-4 space-y-3">
                {/* Header with Customer and Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                        booking.payment_status === "paid"
                          ? "bg-gradient-to-br from-emerald-500 to-green-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {booking.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        {booking.customer_name}
                      </h4>
                      <p className="text-white/60 text-xs font-mono">
                        #{booking.order_id}
                      </p>
                      {!booking.viewed_by_admin && (
                        <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded font-bold mt-1">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkViewed(booking);
                      }}
                      className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title={booking.viewed_by_admin ? "Mark new" : "Mark viewed"}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(booking.id);
                      }}
                      className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Service and Status Tags */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${getPaymentStatusColor(
                      booking.payment_status
                    )}`}
                  >
                    {getPaymentStatusText(booking.payment_status)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusText(booking.status)}
                  </span>
                </div>

                {/* Service Info */}
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                  <p className="font-semibold text-white text-sm">
                    {fullService}
                  </p>
                  
                  {booking.location && (
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-white/70 text-sm">
                        {booking.location}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-white/70">
                    <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">
                      {SingaporeTime.format(booking.start_datetime, "MMM dd, HH:mm")} - {" "}
                      {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <ClockIcon className="w-3 h-3 text-blue-400 mr-1" />
                      <span className="text-white font-bold text-xs">
                        {booking.hours}h
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">Duration</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <UserGroupIcon className={`w-3 h-3 mr-1 ${
                        (booking.lifeguards_assigned?.length || 0) >= booking.lifeguards 
                          ? 'text-green-400' 
                          : 'text-yellow-400'
                      }`} />
                      <span className="text-white font-bold text-xs">
                        {booking.lifeguards_assigned?.length || 0}/{booking.lifeguards}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">Assigned</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <CurrencyDollarIcon className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-white font-bold text-xs">
                        {booking.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">Amount</p>
                  </div>
                </div>

                {/* Contact Info - Collapsible on very small screens */}
                <details className="md:hidden">
                  <summary className="text-white/70 text-sm cursor-pointer hover:text-white transition-colors">
                    Contact Details
                  </summary>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-green-400" />
                      <span className="text-white/70 font-mono">
                        {booking.customer_phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70 truncate">
                        {booking.customer_email}
                      </span>
                    </div>
                  </div>
                </details>

                {/* Remarks if available */}
                {booking.remarks && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-yellow-200 text-xs font-medium mb-1">Remarks:</p>
                        <p className="text-yellow-100 text-xs">{booking.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 border-t border-white/10 text-center">
        <p className="text-white/50 text-xs md:text-sm">
          Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}