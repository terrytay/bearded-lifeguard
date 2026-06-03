import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";
import AssignedLifeguards from "./AssignedLifeguards";
import LifeguardAssignment from "./LifeguardAssignment";

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
  venue_type?: "swimming-pool" | "open-water" | null;
  location?: string;
  remarks?: string;
  amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  viewed_by_admin: boolean;
  lifeguards_assigned?: string[];
  assigned_lifeguards?: Array<{
    id: string;
    name: string;
    contact_number: string;
    is_active: boolean;
  }>;
}

interface BookingDetailInfoProps {
  booking: Booking;
  onRefresh?: () => void;
}

const serviceNames: Record<string, string> = {
  pools: "Pool Lifeguarding",
  events: "Event Lifeguarding",
  "pool-parties": "Pool Party Lifeguarding",
  "open-water": "Open Water Lifeguarding",
  others: "Custom Service",
};

const cardClass =
  "bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-6";
const labelClass =
  "text-[10px] uppercase tracking-[0.16em] text-white/40";

function SectionHeader({
  icon: Icon,
  tint,
  children,
}: {
  icon: typeof UserIcon;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className="font-semibold text-white mb-4 flex items-center gap-2.5 text-sm md:text-base">
      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${tint}`}
      >
        <Icon className="w-4 h-4" />
      </span>
      {children}
    </h3>
  );
}

export default function BookingDetailInfo({
  booking,
  onRefresh,
}: BookingDetailInfoProps) {
  const serviceName =
    serviceNames[booking.service_type] || booking.service_type;
  const fullService =
    booking.service_type === "others" && booking.custom_service
      ? `${serviceName}: ${booking.custom_service}`
      : serviceName;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Customer */}
      <div className={cardClass}>
        <SectionHeader
          icon={UserIcon}
          tint="bg-sky-500/15 border border-sky-400/30 text-sky-300"
        >
          Customer information
        </SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className={labelClass}>Full name</div>
            <p className="text-white font-semibold mt-1">
              {booking.customer_name}
            </p>
          </div>
          <div>
            <div className={labelClass}>Email</div>
            <a
              href={`mailto:${booking.customer_email}`}
              className="text-sky-300 hover:text-sky-200 font-medium mt-1 block break-all transition-colors"
            >
              {booking.customer_email}
            </a>
          </div>
          <div>
            <div className={labelClass}>Phone</div>
            <p className="text-white font-medium tabular-nums mt-1">
              {booking.customer_phone}
            </p>
          </div>
          <div>
            <div className={labelClass}>Booking created</div>
            <p className="text-white font-medium mt-1">
              {SingaporeTime.toLocaleString(booking.created_at + "Z")}
            </p>
          </div>
        </div>
      </div>

      {/* Service */}
      <div className={cardClass}>
        <SectionHeader
          icon={CalendarDaysIcon}
          tint="bg-emerald-500/15 border border-emerald-400/30 text-emerald-300"
        >
          Service details
        </SectionHeader>
        <div className="space-y-4">
          <div>
            <div className={labelClass}>Service type</div>
            <p className="text-white font-bold text-base md:text-lg mt-1">
              {fullService}
            </p>
            {booking.venue_type && (
              <p className="text-white/50 text-xs mt-0.5">
                Rate category:{" "}
                {booking.venue_type === "swimming-pool"
                  ? "Swimming pool"
                  : "Open water / beach"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className={`${labelClass} flex items-center gap-1`}>
                <MapPinIcon className="w-3 h-3" />
                Location
              </div>
              <p className="text-white font-medium mt-1">
                {booking.location || "Not specified"}
              </p>
            </div>
            <div>
              <div className={labelClass}>Lifeguards required</div>
              <p className="text-white font-medium tabular-nums mt-1">
                {booking.lifeguards}
              </p>
            </div>
          </div>

          <div className="bg-black/15 rounded-xl p-4">
            <div className={`${labelClass} flex items-center gap-1 mb-3`}>
              <ClockIcon className="w-3 h-3" />
              Schedule &amp; duration
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                  Start
                </p>
                <p className="text-white font-semibold text-sm">
                  {SingaporeTime.format(booking.start_datetime, "dd MMM")}
                </p>
                <p className="text-white font-bold tabular-nums">
                  {SingaporeTime.format(booking.start_datetime, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                  End
                </p>
                <p className="text-white font-semibold text-sm">
                  {SingaporeTime.format(booking.end_datetime, "dd MMM")}
                </p>
                <p className="text-white font-bold tabular-nums">
                  {SingaporeTime.format(booking.end_datetime, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                  Duration
                </p>
                <p className="text-[#FF6633] font-bold text-xl md:text-2xl tabular-nums">
                  {booking.hours}h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {booking.remarks && (
        <div className="bg-amber-500/[0.07] border border-amber-400/20 rounded-2xl p-4 md:p-6">
          <SectionHeader
            icon={ChatBubbleLeftRightIcon}
            tint="bg-amber-500/15 border border-amber-400/30 text-amber-300"
          >
            Customer notes
          </SectionHeader>
          <p className="text-white/85 italic leading-relaxed">
            “{booking.remarks}”
          </p>
        </div>
      )}

      {/* Lifeguard assignment */}
      <div className="space-y-3 md:space-y-4">
        <LifeguardAssignment
          bookingId={booking.id}
          requiredCount={booking.lifeguards}
          currentAssignments={booking.assigned_lifeguards || []}
          onAssignmentUpdate={() => onRefresh?.()}
        />
        <AssignedLifeguards
          lifeguards={booking.assigned_lifeguards || []}
          requiredCount={booking.lifeguards}
        />
      </div>

      {/* Technical */}
      <div className={cardClass}>
        <SectionHeader
          icon={DocumentTextIcon}
          tint="bg-white/10 border border-white/15 text-white/60"
        >
          Technical information
        </SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className={labelClass}>Booking ID</div>
            <p className="text-white/80 text-xs mt-1 bg-black/20 px-2 py-1.5 rounded-lg break-all">
              {booking.id}
            </p>
          </div>
          <div>
            <div className={labelClass}>Order ID</div>
            <p className="text-white font-medium tabular-nums mt-1">
              #{booking.order_id}
            </p>
          </div>
          <div>
            <div className={labelClass}>Current status</div>
            <p className="text-white font-medium capitalize mt-1">
              {booking.status}
            </p>
          </div>
          <div>
            <div className={labelClass}>Payment status</div>
            <p className="text-white font-medium capitalize mt-1">
              {booking.payment_status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
