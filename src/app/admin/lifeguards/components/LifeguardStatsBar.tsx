interface LifeguardStatsBarProps {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
}

export default function LifeguardStatsBar({
  total,
  active,
  inactive,
  assigned,
}: LifeguardStatsBarProps) {
  return (
    <div className="p-3 md:p-6 bg-gradient-to-r from-white/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {/* Total Lifeguards */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Total
                </p>
                <p className="text-xl md:text-3xl font-bold text-white mt-1">
                  {total}
                </p>
              </div>
              <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Active
                </p>
                <p className="text-xl md:text-3xl font-bold text-emerald-400 mt-1">
                  {active}
                </p>
              </div>
              <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Inactive
                </p>
                <p className="text-xl md:text-3xl font-bold text-red-400 mt-1">
                  {inactive}
                </p>
              </div>
              <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-pink-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Assigned */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Assigned
                </p>
                <p className="text-xl md:text-3xl font-bold text-yellow-400 mt-1">
                  {assigned}
                </p>
              </div>
              <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}