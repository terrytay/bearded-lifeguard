import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
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

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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
    <div className="px-3 md:px-6 pt-3 md:pt-6">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search lifeguards…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 md:pl-11 pr-9 py-3 bg-black/20 border border-white/15 rounded-xl text-white placeholder-white/40 text-sm focus:ring-2 focus:ring-[#FF6633]/40 focus:border-[#FF6633]/50 transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onAddNew}
            className="px-3.5 bg-[#FF6633] text-white rounded-xl hover:bg-[#e55a2b] transition-all flex items-center justify-center gap-1.5 min-h-[44px] shadow-lg shadow-[#FF6633]/20 font-semibold text-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 bg-white/[0.04] text-white/70 border border-white/15 rounded-xl hover:border-white/30 hover:text-white disabled:opacity-50 transition-all flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Refresh"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const active = filterStatus === f.value;
            return (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-150 min-h-[40px] ${
                  active
                    ? "bg-[#FF6633] text-white border-[#FF6633] shadow-lg shadow-[#FF6633]/20"
                    : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
