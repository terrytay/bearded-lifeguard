import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  readOnly = false 
}: AssignedLifeguardsProps) {
  const assignedCount = lifeguards.length;
  const isComplete = assignedCount >= requiredCount;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-sm md:text-base flex items-center">
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3 ${
            isComplete 
              ? "bg-emerald-500/20" 
              : "bg-yellow-500/20"
          }`}>
            <UserIcon className={`w-4 h-4 md:w-5 md:h-5 ${
              isComplete 
                ? "text-emerald-400" 
                : "text-yellow-400"
            }`} />
          </div>
          Assigned Lifeguards
        </h3>
        
        <div className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-semibold ${
          isComplete 
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}>
          {assignedCount} / {requiredCount}
        </div>
      </div>

      {lifeguards.length === 0 ? (
        <div className="text-center py-6 md:py-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-sm md:text-base">No lifeguards assigned</p>
          <p className="text-white/40 text-xs md:text-sm mt-1">
            {requiredCount} lifeguard{requiredCount !== 1 ? 's' : ''} required
          </p>
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {lifeguards.map((lifeguard) => (
            <div
              key={lifeguard.id}
              className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${
                  lifeguard.is_active 
                    ? "bg-emerald-500/20" 
                    : "bg-red-500/20"
                }`}>
                  <UserIcon className={`w-4 h-4 md:w-5 md:h-5 ${
                    lifeguard.is_active 
                      ? "text-emerald-400" 
                      : "text-red-400"
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm md:text-base truncate">
                    {lifeguard.name}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm font-mono">
                    {lifeguard.contact_number}
                  </p>
                  {!lifeguard.is_active && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-md border border-red-500/30">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              
              {!readOnly && onUnassign && (
                <button
                  onClick={() => onUnassign(lifeguard.id)}
                  className="p-1 md:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove lifeguard"
                >
                  <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}
            </div>
          ))}
          
          {assignedCount < requiredCount && (
            <div className="text-center py-2 md:py-3">
              <p className="text-yellow-400 text-xs md:text-sm font-medium">
                ⚠️ {requiredCount - assignedCount} more lifeguard{requiredCount - assignedCount !== 1 ? 's' : ''} needed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}