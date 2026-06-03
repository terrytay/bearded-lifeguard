import { UserIcon, XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
}

interface AssignedLifeguardsProps {
  lifeguards: Lifeguard[];
  requiredCount: number;
  onUnassign?: (lifeguardId: string) => void;
  readOnly?: boolean;
}

export default function AssignedLifeguards({
  lifeguards,
  requiredCount,
  onUnassign,
  readOnly = false,
}: AssignedLifeguardsProps) {
  const assignedCount = lifeguards.length;
  const isComplete = assignedCount >= requiredCount;

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm md:text-base flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              isComplete
                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                : "bg-amber-500/15 border-amber-400/30 text-amber-300"
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
          </span>
          Assigned lifeguards
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border tabular-nums ${
            isComplete
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
              : "bg-amber-500/15 text-amber-200 border-amber-400/30"
          }`}
        >
          {assignedCount} / {requiredCount}
        </span>
      </div>

      {lifeguards.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-7 h-7 text-white/30" />
          </div>
          <p className="text-white/55 text-sm">No lifeguards assigned</p>
          <p className="text-white/35 text-xs mt-0.5 tabular-nums">
            {requiredCount} required
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {lifeguards.map((lifeguard) => (
            <div
              key={lifeguard.id}
              className="bg-black/15 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    lifeguard.is_active ? "bg-emerald-500/80" : "bg-white/10"
                  }`}
                >
                  {lifeguard.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {lifeguard.name}
                  </p>
                  <p className="text-white/50 text-xs tabular-nums truncate">
                    {lifeguard.contact_number}
                  </p>
                </div>
                {!lifeguard.is_active && (
                  <span className="px-2 py-0.5 bg-rose-500/15 text-rose-200 text-[11px] rounded-full border border-rose-400/30 flex-shrink-0">
                    Inactive
                  </span>
                )}
              </div>
              {!readOnly && onUnassign && (
                <button
                  onClick={() => onUnassign(lifeguard.id)}
                  className="p-2 text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {assignedCount < requiredCount && (
            <p className="text-amber-300 text-xs text-center pt-1 tabular-nums">
              {requiredCount - assignedCount} more needed
            </p>
          )}
        </div>
      )}
    </div>
  );
}
