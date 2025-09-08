import { 
  UserIcon, 
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
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

export default function LifeguardCard({ lifeguard, onEdit, onDelete }: LifeguardCardProps) {
  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30"
      : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300 group hover:scale-[1.02] hover:shadow-2xl">
      {/* Status Badge */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4">
        <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-semibold border ${getStatusColor(lifeguard.is_active)}`}>
          {lifeguard.is_active ? (
            <>
              <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Active
            </>
          ) : (
            <>
              <XCircleIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Inactive
            </>
          )}
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-3 md:space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-3 md:space-x-4 pr-16 md:pr-20">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg ${
            lifeguard.is_active 
              ? "bg-gradient-to-br from-emerald-500 to-green-600" 
              : "bg-gradient-to-br from-gray-500 to-gray-600"
          }`}>
            <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 truncate">
              {lifeguard.name}
            </h3>
            <div className="flex items-center space-x-2 text-white/70">
              <PhoneIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm font-mono truncate">{lifeguard.contact_number}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            <div>
              <label className="text-white/60 text-xs md:text-sm font-medium">Created</label>
              <p className="text-white text-xs md:text-sm">
                {SingaporeTime.toLocaleString(lifeguard.created_at + "Z")}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 md:space-x-3 pt-2 md:pt-3 border-t border-white/10">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-semibold text-xs md:text-sm flex items-center justify-center space-x-1 md:space-x-2 shadow-lg hover:shadow-xl"
          >
            <PencilIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg md:rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-semibold text-xs md:text-sm flex items-center justify-center space-x-1 md:space-x-2 shadow-lg hover:shadow-xl"
          >
            <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}