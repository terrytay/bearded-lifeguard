import {
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LifeguardCardProps {
  lifeguard: Lifeguard;
  onEdit: () => void;
  onDelete: () => void;
}

export default function LifeguardCard({
  lifeguard,
  onEdit,
  onDelete,
}: LifeguardCardProps) {
  const active = lifeguard.is_active;

  return (
    <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200">
      {/* Status pill */}
      <span
        className={`absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
          active
            ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
            : "bg-rose-500/15 text-rose-200 border-rose-400/30"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            active ? "bg-emerald-400" : "bg-rose-400"
          }`}
        />
        {active ? "Active" : "Inactive"}
      </span>

      <div className="flex items-start gap-3 pr-20 mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${
            active ? "bg-emerald-500/80" : "bg-white/10"
          }`}
        >
          {lifeguard.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white truncate">
            {lifeguard.name}
          </h3>
          <div className="flex items-center gap-1.5 text-white/55 mt-0.5">
            <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs tabular-nums truncate">
              {lifeguard.contact_number}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-black/15 rounded-xl p-3 mb-4 flex items-center gap-2 text-white/55">
        <ClockIcon className="w-4 h-4 text-sky-300 flex-shrink-0" />
        <span className="text-xs">
          Added {SingaporeTime.format(lifeguard.created_at, "dd MMM yyyy")}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2.5 bg-white/[0.04] text-white/80 border border-white/10 rounded-xl hover:border-white/25 hover:text-white transition-all font-medium text-sm flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="px-3.5 py-2.5 bg-rose-500/10 text-rose-300 border border-rose-400/30 rounded-xl hover:bg-rose-500/20 transition-all min-h-[44px] flex items-center justify-center"
          aria-label="Delete lifeguard"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
