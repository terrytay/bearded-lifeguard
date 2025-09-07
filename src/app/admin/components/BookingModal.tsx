import {
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";
import PaymentActions from "./PaymentActions";
import StatusActions from "./StatusActions";

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

interface BookingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party Lifeguarding",
  "open-water": "Open Water Lifeguarding",
  others: "Custom Service",
};

const getStatusColor = (status: string, paymentStatus: string): string => {
  if (paymentStatus === "paid") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  if (status === "pending") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const getStatusText = (status: string, paymentStatus: string): string => {
  if (paymentStatus === "paid") {
    if (status === "completed") return "Service Completed";
    return "Paid & Confirmed";
  }
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending Review";
  return "Awaiting Payment";
};

export default function BookingModal({
  booking,
  onClose,
  onUpdate,
  onDelete,
}: BookingModalProps) {
  const serviceName =
    serviceNames[booking.service_type] || booking.service_type;
  const fullService =
    booking.service_type === "others" && booking.custom_service
      ? `${serviceName}: ${booking.custom_service}`
      : serviceName;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 md:items-center">
      <div className="[scrollbar-width:thin] [scrollbar-color:#888 #f1f1f1] bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-indigo-900/95 backdrop-blur-xl w-full max-w-2xl h-[90vh] rounded-t-3xl rounded-b-3xl md:rounded-3xl md:h-auto md:max-h-[90vh] overflow-y-scroll shadow-2xl border border-white/20">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl ${
                  booking.payment_status === "paid"
                    ? "bg-gradient-to-br from-emerald-500 to-green-600"
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}
              >
                {booking.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {booking.customer_name}
                </h2>
                <p className="text-white/60 text-sm font-mono">
                  #{booking.order_id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4">
            <span
              className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold border shadow-lg ${getStatusColor(
                booking.status,
                booking.payment_status
              )}`}
            >
              {getStatusText(booking.status, booking.payment_status)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3">
                <UserIcon className="w-5 h-5 text-blue-400" />
              </div>
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-white/70">Email:</span>
                <a
                  href={`mailto:${booking.customer_email}`}
                  className="text-blue-300 hover:text-blue-200 font-medium"
                >
                  {booking.customer_email}
                </a>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-white/70">Phone:</span>
                <span className="text-white font-mono">
                  {booking.customer_phone}
                </span>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center mr-3">
                <CalendarIcon className="w-5 h-5 text-green-400" />
              </div>
              Service Details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/70 text-sm">Service Type:</span>
                <p className="text-white font-semibold mt-1">{fullService}</p>
              </div>
              <div>
                <span className="text-white/70 text-sm">Location:</span>
                <p className="text-white font-semibold mt-1">
                  {booking.location || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-white/70 text-sm">Schedule:</span>
                <div className="mt-1">
                  <p className="text-white font-semibold">
                    {SingaporeTime.toLocaleString(booking.start_datetime)}
                  </p>
                  <p className="text-white/70 text-sm">
                    to {SingaporeTime.toLocaleString(booking.end_datetime)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {booking.hours}h
                  </div>
                  <div className="text-white/60 text-xs">Duration</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {booking.lifeguards}
                  </div>
                  <div className="text-white/60 text-xs">Guards</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    ${booking.amount.toFixed(2)}
                  </div>
                  <div className="text-white/60 text-xs">Amount</div>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {booking.remarks && (
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-3">Customer Notes</h3>
              <p className="text-white/90 italic leading-relaxed">
                "{booking.remarks}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center mr-3">
                <CogIcon className="w-5 h-5 text-purple-400" />
              </div>
              Actions
            </h3>

            <div className="space-y-4">
              <PaymentActions booking={booking} onUpdate={onUpdate} />

              <StatusActions
                booking={booking}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
