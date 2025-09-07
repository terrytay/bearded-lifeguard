import { ClockIcon, UserGroupIcon, CurrencyDollarIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";
import { useRouter } from "next/navigation";

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

const getStatusColor = (status: string, paymentStatus: string): string => {
  if (paymentStatus === "paid") return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30";
  if (status === "cancelled") return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
  if (status === "pending") return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
  return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30";
};

const getStatusText = (status: string, paymentStatus: string): string => {
  if (paymentStatus === "paid") return "Paid";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  return "Awaiting Payment";
};

export default function BookingCard({ booking, onMarkViewed, onDelete }: BookingCardProps) {
  const router = useRouter();
  const serviceName = serviceNames[booking.service_type] || booking.service_type;
  const fullService = booking.service_type === "others" && booking.custom_service 
    ? `${serviceName}: ${booking.custom_service}`
    : serviceName;

  return (
    <div 
      className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 md:p-6 cursor-pointer hover:bg-white/15 transition-all duration-300 group hover:scale-[1.02] hover:shadow-2xl ${
        !booking.viewed_by_admin ? 'ring-2 ring-red-400/50 shadow-red-500/20' : ''
      }`}
      onClick={() => router.push(`/admin/booking/${booking.id}`)}
    >
      {/* New Badge */}
      {!booking.viewed_by_admin && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          NEW
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-lg ${
            booking.payment_status === "paid" 
              ? "bg-gradient-to-br from-emerald-500 to-green-600" 
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}>
            {booking.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm md:text-lg truncate">
              {booking.customer_name}
            </h3>
            <p className="text-white/60 text-xs md:text-sm font-mono">#{booking.order_id}</p>
          </div>
        </div>
        
        <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-semibold border shadow-lg ${getStatusColor(booking.status, booking.payment_status)}`}>
          {getStatusText(booking.status, booking.payment_status)}
        </span>
      </div>
      
      {/* Service Info */}
      <div className="space-y-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 md:p-3">
          <p className="font-semibold text-white mb-1 text-sm md:text-base">{fullService}</p>
          <p className="text-white/70 text-xs md:text-sm flex items-center">
            📅 {SingaporeTime.format(booking.start_datetime, "MMM dd, HH:mm")}
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3">
        <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <ClockIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-400 mr-1" />
            <span className="text-white font-bold text-xs md:text-sm">{booking.hours}h</span>
          </div>
          <p className="text-white/60 text-xs">Duration</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <UserGroupIcon className="w-3 h-3 md:w-4 md:h-4 text-green-400 mr-1" />
            <span className="text-white font-bold text-xs md:text-sm">{booking.lifeguards}</span>
          </div>
          <p className="text-white/60 text-xs">Guards</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <CurrencyDollarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-1" />
            <span className="text-white font-bold text-xs md:text-sm">{booking.amount.toFixed(0)}</span>
          </div>
          <p className="text-white/60 text-xs">Amount</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 md:space-x-3 opacity-70 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkViewed();
          }}
          className="flex-1 py-2 px-2 md:py-2.5 md:px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-lg md:rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all font-medium text-xs md:text-sm flex items-center justify-center space-x-1 md:space-x-2 hover:scale-105"
        >
          <EyeIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">{booking.viewed_by_admin ? "Mark New" : "Mark Viewed"}</span>
          <span className="sm:hidden">{booking.viewed_by_admin ? "New" : "View"}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="py-2 px-2 md:py-2.5 md:px-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30 rounded-lg md:rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-all font-medium text-xs md:text-sm hover:scale-105"
        >
          <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}