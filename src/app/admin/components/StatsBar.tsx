interface StatsBarProps {
  total: number;
  paid: number;
  pending: number;
  unconfirmed: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  newCount: number;
}

export default function StatsBar({
  total,
  paid,
  pending,
  unconfirmed,
  confirmed,
  completed,
  cancelled,
  newCount,
}: StatsBarProps) {
  return (
    <div className="p-3 md:p-6 bg-gradient-to-r from-white/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-6">
          {/* Total Bookings */}
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
              {/* <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div> */}
            </div>
          </div>
          {/* Payment Pending */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Unpaid
                </p>
                <p className="text-xl md:text-3xl font-bold text-yellow-400 mt-1">
                  {pending}
                </p>
              </div>
              {/* <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div> */}
            </div>
          </div>
          {/* Paid */}
          {/* <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Paid
                </p>
                <p className="text-xl md:text-3xl font-bold text-emerald-400 mt-1">
                  {paid}
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
          </div> */}

          {/* Unconfirmed Bookings */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between truncate">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium truncate">
                  Unconfirmed
                </p>
                <p className="text-xl md:text-3xl font-bold text-yellow-400 mt-1">
                  {unconfirmed}
                </p>
              </div>
              {/* <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-pink-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                    d="M15 17h5l-5 5v-5zM7 7h11v3l4-4-4-4v3H7a2 2 0 00-2 2v7.586l3-3V7z"
                  />
                </svg>
              </div> */}
            </div>
          </div>
          {/* Confirmed Bookings */}
          {/* <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Confirmed
                </p>
                <p className="text-xl md:text-3xl font-bold text-green-400 mt-1">
                  {confirmed}
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
                    d="M15 17h5l-5 5v-5zM7 7h11v3l4-4-4-4v3H7a2 2 0 00-2 2v7.586l3-3V7z"
                  />
                </svg>
              </div>
            </div>
          </div> */}
          {/* Completed Bookings */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between truncate">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Completed
                </p>
                <p className="text-xl md:text-3xl font-bold text-green-400 mt-1">
                  {completed}
                </p>
              </div>
              {/* <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-pink-400 rounded-lg md:rounded-xl sm:flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                    d="M15 17h5l-5 5v-5zM7 7h11v3l4-4-4-4v3H7a2 2 0 00-2 2v7.586l3-3V7z"
                  />
                </svg>
              </div> */}
            </div>
          </div>
          {/* Cancelled Bookings */}
          {/* <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  Cancelled
                </p>
                <p className="text-xl md:text-3xl font-bold text-red-400 mt-1">
                  {cancelled}
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
                    d="M15 17h5l-5 5v-5zM7 7h11v3l4-4-4-4v3H7a2 2 0 00-2 2v7.586l3-3V7z"
                  />
                </svg>
              </div>
            </div>
          </div> */}
          {/* New Bookings */}
          {/* <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-white/15 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm font-medium">
                  New
                </p>
                <p className="text-xl md:text-3xl font-bold text-red-400 mt-1">
                  {newCount}
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
                    d="M15 17h5l-5 5v-5zM7 7h11v3l4-4-4-4v3H7a2 2 0 00-2 2v7.586l3-3V7z"
                  />
                </svg>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
