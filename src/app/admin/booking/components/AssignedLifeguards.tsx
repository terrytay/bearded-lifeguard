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
    <div className="bg-white border border-ink/12 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base md:text-lg font-semibold text-ink flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              isComplete
                ? "bg-sea/10 border-sea/30 text-sea"
                : "bg-ochre/10 border-ochre/30 text-ochre"
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
          </span>
          Assigned lifeguards
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border tabular-nums ${
            isComplete
              ? "text-sea border-sea/40 bg-sea/10"
              : "text-ochre border-ochre/40 bg-ochre/10"
          }`}
        >
          {assignedCount} / {requiredCount}
        </span>
      </div>

      {lifeguards.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-sand border border-ink/12 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-7 h-7 text-ink-soft/50" />
          </div>
          <p className="text-ink-soft text-sm">No lifeguards assigned</p>
          <p className="text-ink-soft/70 text-xs mt-0.5 tabular-nums">
            {requiredCount} required
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {lifeguards.map((lifeguard) => (
            <div
              key={lifeguard.id}
              className="bg-sand/50 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                    lifeguard.is_active ? "bg-sea" : "bg-ink/40"
                  }`}
                >
                  {lifeguard.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-ink font-semibold text-sm truncate">
                    {lifeguard.name}
                  </p>
                  <p className="text-ink-soft text-xs tabular-nums truncate">
                    {lifeguard.contact_number}
                  </p>
                </div>
                {!lifeguard.is_active && (
                  <span className="px-2 py-0.5 bg-signal/10 text-signal text-[10px] uppercase tracking-wider rounded-md border border-signal/30 flex-shrink-0">
                    Inactive
                  </span>
                )}
              </div>
              {!readOnly && onUnassign && (
                <button
                  onClick={() => onUnassign(lifeguard.id)}
                  className="p-2 text-signal hover:bg-signal/10 rounded-lg transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {assignedCount < requiredCount && (
            <p className="text-ochre text-xs text-center pt-1 tabular-nums">
              {requiredCount - assignedCount} more needed
            </p>
          )}
        </div>
      )}
    </div>
  );
}
