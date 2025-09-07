import { ReactNode } from "react";
import {
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: ReactNode;
  newBookingsCount: number;
  onSignOut: () => void;
  processing?: boolean;
}

export default function DashboardLayout({
  children,
  newBookingsCount,
  onSignOut,
  processing = false,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <span className="text-white font-medium">Processing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="px-3 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <Bars3Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div> */}
              <div>
                <h1 className="text-sm md:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-white/60 text-xs md:text-sm">
                  Bearded Lifeguard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Global Search */}
              {/* <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-white/60 mr-2" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent text-white placeholder-white/50 text-sm outline-none w-32"
                />
              </div> */}

              {/* Notifications */}
              {newBookingsCount > 0 && (
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-1 md:space-x-2 shadow-lg">
                    <BellIcon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-semibold">
                      {newBookingsCount}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              )}

              {/* Profile & Logout */}
              <div className="flex items-center space-x-1 md:space-x-2">
                {/* <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm font-bold">
                    A
                  </span>
                </div> */}
                <button
                  onClick={onSignOut}
                  className="p-1 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg md:rounded-xl transition-all duration-200"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
