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

const getStatusColor = (status: string): string => {
  if (status === "confirmed")
    return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30";
  // if (status === "pending")
  //   return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
  if (status === "pending")
    return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
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
  // if (status === "pending")
  //   return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
  if (status === "pending")
    return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
  return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30";
};

const getPaymentStatusText = (status: string): string => {
  if (status === "pending") return "Unpaid";
  return "Paid";
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

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8">
      {/* New Badge */}
      {!booking.viewed_by_admin && (
        <div className="inline-block mb-4 md:mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-bold px-3 py-1 md:px-4 md:py-2 rounded-full shadow-lg animate-pulse">
          🔴 NEW BOOKING
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
        {/* Customer Info */}
        <div className="flex items-start space-x-3 md:space-x-6">
          <div
            className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-white font-bold text-lg md:text-2xl shadow-2xl ${
              booking.payment_status === "paid"
                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
          >
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1 md:mb-2 truncate">
              {booking.customer_name}
            </h1>
            <p className="text-white/60 font-mono text-sm md:text-lg mb-1">
              #{booking.order_id}
            </p>
            <p className="text-white/80 text-sm md:text-lg">{fullService}</p>
          </div>
        </div>

        {/* Status & Amount */}
        <div className="text-left lg:text-right space-y-3 md:space-y-4">
          <span
            className={`inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border shadow-lg ${getPaymentStatusColor(
              booking.payment_status
            )}`}
          >
            {getPaymentStatusText(booking.payment_status)}
          </span>
          <span
            className={`ml-2 inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border shadow-lg ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusText(booking.status)}
          </span>
          <div className="lg:text-right">
            <div className="text-xl md:text-3xl font-bold text-yellow-400 mb-1">
              ${booking.amount.toFixed(2)}
            </div>
            <p className="text-white/60 text-xs md:text-sm">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-1 md:gap-4 mt-3 md:mt-8 pt-3 md:pt-6 border-t border-white/10">
        <div className="bg-white/5 rounded-lg md:rounded-2xl p-2 md:p-4 text-center">
          <div className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-1">
            {booking.hours}
          </div>
          <div className="text-white/60 text-xs md:text-sm">Hours</div>
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-2xl p-2 md:p-4 text-center">
          <div className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-1">
            {booking.lifeguards}
          </div>
          <div className="text-white/60 text-xs md:text-sm">Guards</div>
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-2xl p-2 md:p-4 text-center">
          <div className="text-sm md:text-2xl font-bold text-blue-400 mb-0.5 md:mb-1">
            {booking.status === "completed" ? "✓" : "○"}
          </div>
          <div className="text-white/60 text-xs md:text-sm">Status</div>
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-2xl p-2 md:p-4 text-center">
          <div className="text-sm md:text-2xl font-bold text-emerald-400 mb-0.5 md:mb-1">
            {booking.payment_status === "paid" ? "✓" : "○"}
          </div>
          <div className="text-white/60 text-xs md:text-sm">Payment</div>
        </div>
      </div>
    </div>
  );
}
