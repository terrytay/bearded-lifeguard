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
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-ink-soft" />
            <input
              type="text"
              placeholder="Search lifeguards…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 md:pl-11 pr-9 py-3 bg-white border border-ink/20 rounded-xl text-ink placeholder-ink-soft/60 text-sm focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-soft hover:text-ink"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onAddNew}
            className="px-3.5 bg-ink text-paper rounded-xl hover:bg-signal transition-all flex items-center justify-center gap-1.5 min-h-[44px] font-semibold text-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 border border-ink/20 text-ink rounded-xl hover:border-ink/50 disabled:opacity-50 transition-all flex items-center justify-center min-h-[44px] min-w-[44px]"
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
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all min-h-[40px] ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "text-ink-soft border-ink/20 hover:text-ink hover:border-ink/50"
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
