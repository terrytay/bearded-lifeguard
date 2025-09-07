import { 
  UserIcon, 
  CalendarDaysIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon 
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";

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

interface BookingDetailInfoProps {
  booking: Booking;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party Lifeguarding",
  "open-water": "Open Water Lifeguarding",
  others: "Custom Service",
};

export default function BookingDetailInfo({ booking }: BookingDetailInfoProps) {
  const serviceName = serviceNames[booking.service_type] || booking.service_type;
  const fullService = booking.service_type === "others" && booking.custom_service 
    ? `${serviceName}: ${booking.custom_service}`
    : serviceName;

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center text-xl">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
            <UserIcon className="w-6 h-6 text-blue-400" />
          </div>
          Customer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm font-medium">Full Name</label>
              <p className="text-white font-semibold text-lg mt-1">{booking.customer_name}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium">Email Address</label>
              <a
                href={`mailto:${booking.customer_email}`}
                className="text-blue-300 hover:text-blue-200 font-semibold text-lg mt-1 block transition-colors"
              >
                {booking.customer_email}
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm font-medium">Phone Number</label>
              <p className="text-white font-mono text-lg mt-1">{booking.customer_phone}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium">Booking Created</label>
              <p className="text-white font-semibold text-lg mt-1">
                {SingaporeTime.toLocaleString(booking.created_at + "Z")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center text-xl">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
            <CalendarDaysIcon className="w-6 h-6 text-green-400" />
          </div>
          Service Details
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-white/70 text-sm font-medium">Service Type</label>
            <p className="text-white font-bold text-xl mt-1">{fullService}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/70 text-sm font-medium flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                Location
              </label>
              <p className="text-white font-semibold text-lg mt-1">
                {booking.location || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium">Number of Lifeguards</label>
              <p className="text-white font-semibold text-lg mt-1">{booking.lifeguards} lifeguards</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white/5 rounded-xl p-4">
            <label className="text-white/70 text-sm font-medium flex items-center mb-3">
              <ClockIcon className="w-4 h-4 mr-1" />
              Schedule & Duration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Start Time</p>
                <p className="text-white font-bold">
                  {SingaporeTime.format(booking.start_datetime, "MMM dd, yyyy")}
                </p>
                <p className="text-white font-bold text-lg">
                  {SingaporeTime.format(booking.start_datetime, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1">End Time</p>
                <p className="text-white font-bold">
                  {SingaporeTime.format(booking.end_datetime, "MMM dd, yyyy")}
                </p>
                <p className="text-white font-bold text-lg">
                  {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Duration</p>
                <p className="text-yellow-400 font-bold text-2xl">{booking.hours}h</p>
                <p className="text-white/60 text-sm">{booking.hours === 1 ? "hour" : "hours"} total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Remarks */}
      {booking.remarks && (
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center text-xl">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mr-4">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-400" />
            </div>
            Customer Notes
          </h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/90 italic text-lg leading-relaxed">
              "{booking.remarks}"
            </p>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center text-xl">
          <div className="w-10 h-10 bg-gray-500/20 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Technical Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-white/70 text-sm font-medium">Booking ID</label>
            <p className="text-white font-mono text-sm mt-1 bg-white/5 p-2 rounded break-all">
              {booking.id}
            </p>
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium">Order ID</label>
            <p className="text-white font-mono text-lg mt-1">#{booking.order_id}</p>
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium">Current Status</label>
            <p className="text-white font-semibold text-lg mt-1 capitalize">{booking.status}</p>
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium">Payment Status</label>
            <p className="text-white font-semibold text-lg mt-1 capitalize">{booking.payment_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}