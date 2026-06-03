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
    <div className="relative bg-white border border-ink/12 rounded-2xl p-4 md:p-5 hover:border-ink/30 transition-all duration-200">
      <span
        className={`absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
          active
            ? "text-sea border-sea/40 bg-sea/10"
            : "text-signal border-signal/40 bg-signal/10"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            active ? "bg-sea" : "bg-signal"
          }`}
        />
        {active ? "Active" : "Inactive"}
      </span>

      <div className="flex items-start gap-3 pr-20 mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-paper font-bold flex-shrink-0 ${
            active ? "bg-sea" : "bg-ink/40"
          }`}
        >
          {lifeguard.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-ink truncate">
            {lifeguard.name}
          </h3>
          <div className="flex items-center gap-1.5 text-ink-soft mt-0.5">
            <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs tabular-nums truncate">
              {lifeguard.contact_number}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-sand/50 rounded-xl p-3 mb-4 flex items-center gap-2 text-ink-soft">
        <ClockIcon className="w-4 h-4 text-sea flex-shrink-0" />
        <span className="text-xs">
          Added {SingaporeTime.format(lifeguard.created_at, "dd MMM yyyy")}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2.5 border border-ink/25 text-ink rounded-xl hover:bg-ink hover:text-paper transition-all font-medium text-sm flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="px-3.5 py-2.5 border border-signal/40 text-signal rounded-xl hover:bg-signal hover:text-white transition-all min-h-[44px] flex items-center justify-center"
          aria-label="Delete lifeguard"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
