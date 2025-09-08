import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface LifeguardSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
  isLoading: boolean;
}

export default function LifeguardSearchBar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onRefresh,
  onAddNew,
  isLoading,
}: LifeguardSearchBarProps) {
  return (
    <div className="sticky top-0 z-[999] p-3 md:p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-white/50" />
          <input
            type="text"
            placeholder="Search lifeguards..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm text-sm md:text-base"
          />
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="relative flex-1">
            <FunnelIcon className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-white/50" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full pl-8 md:pl-10 pr-6 md:pr-8 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 appearance-none text-white backdrop-blur-sm text-xs md:text-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff50' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.2em 1.2em",
              }}
            >
              <option value="all" className="bg-slate-800 text-white">
                All Lifeguards
              </option>
              <option value="active" className="bg-slate-800 text-white">
                ✅ Active Only
              </option>
              <option value="inactive" className="bg-slate-800 text-white">
                ❌ Inactive Only
              </option>
            </select>
          </div>

          <button
            onClick={onAddNew}
            className="px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg md:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1 md:space-x-2 font-semibold text-xs md:text-sm"
          >
            <PlusIcon className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Add New</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1 md:space-x-2 font-semibold text-xs md:text-sm"
          >
            <ArrowPathIcon
              className={`h-3 w-3 md:h-4 md:w-4 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}