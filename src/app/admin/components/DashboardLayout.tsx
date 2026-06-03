import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BellIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
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
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Bookings',
      href: '/admin',
      icon: CalendarDaysIcon,
      current: pathname === '/admin',
    },
    {
      name: 'Lifeguards',
      href: '/admin/lifeguards',
      icon: UserGroupIcon,
      current: pathname.startsWith('/admin/lifeguards'),
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: ChartBarIcon,
      current: pathname.startsWith('/admin/reports'),
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 font-mono">
      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/[0.06] backdrop-blur-lg border border-white/15 rounded-2xl p-6 flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-[#FF6633]/30 border-t-[#FF6633] rounded-full animate-spin"></div>
            <span className="text-white font-medium text-sm">Processing…</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="px-3 py-3 md:px-6 md:py-3.5">
          <div className="flex items-center justify-between gap-3">
            {/* Brand + desktop nav */}
            <div className="flex items-center gap-3 md:gap-6 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#FF6633] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF6633]/20">
                  <span className="text-white font-bold text-xs md:text-sm tracking-tight">
                    BL
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm md:text-base font-bold text-white tracking-tight leading-tight">
                    Admin
                  </h1>
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.18em] leading-tight">
                    Bearded Lifeguard
                  </p>
                </div>
              </div>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/10">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      aria-current={item.current ? "page" : undefined}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        item.current
                          ? "bg-[#FF6633] text-white shadow-lg shadow-[#FF6633]/20"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.name === "Bookings" && newBookingsCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full tabular-nums">
                          {newBookingsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: notifications + sign out */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {newBookingsCount > 0 && (
                <div className="relative">
                  <div className="bg-rose-500/90 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <BellIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-semibold tabular-nums">
                      {newBookingsCount}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
                </div>
              )}

              <button
                onClick={onSignOut}
                className="p-2 text-white/55 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile navigation — full-width segmented row */}
          <nav className="md:hidden grid grid-cols-3 gap-1 mt-3 p-1 rounded-xl bg-black/20 border border-white/10">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  aria-current={item.current ? "page" : undefined}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium min-h-[44px] transition-all duration-200 ${
                    item.current
                      ? "bg-[#FF6633] text-white shadow-lg shadow-[#FF6633]/20"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.name === "Bookings" && newBookingsCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1 rounded-full tabular-nums">
                      {newBookingsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
