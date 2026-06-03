import { ReactNode } from "react";
import Image from "next/image";
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
    <div className="relative min-h-screen w-full bg-paper text-ink">
      {/* Paper grain texture */}
      <div className="editorial-grain pointer-events-none fixed inset-0 z-0" />

      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-ink/25 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-paper border-2 border-ink rounded-2xl px-6 py-5 flex items-center gap-3 shadow-[6px_6px_0_0_var(--color-ink)]">
            <div className="w-5 h-5 border-2 border-ink/20 border-t-signal rounded-full animate-spin" />
            <span className="text-ink font-medium text-sm">Working…</span>
          </div>
        </div>
      )}

      {/* Masthead */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b-2 border-ink">
        <div className="px-3 py-2.5 md:px-6 md:py-3 relative z-10">
          <div className="flex items-center justify-between gap-3">
            {/* Brand + desktop nav */}
            <div className="flex items-center gap-4 md:gap-8 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Image
                  src="/logo.png"
                  alt="Bearded Lifeguard"
                  width={40}
                  height={40}
                  className="h-9 w-9 md:h-10 md:w-10 object-contain flex-shrink-0"
                  priority
                />
                <div className="min-w-0 leading-none">
                  <div className="font-display text-base md:text-lg font-semibold text-ink leading-none truncate">
                    Bearded Lifeguard
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mt-1">
                    Admin console
                  </div>
                </div>
              </div>

              {/* Desktop navigation — underline tabs */}
              <nav className="hidden md:flex items-stretch gap-6 self-stretch">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      aria-current={item.current ? "page" : undefined}
                      className={`relative flex items-center gap-2 text-sm font-medium transition-colors -mb-[2px] border-b-2 pb-1 ${
                        item.current
                          ? "text-ink border-signal"
                          : "text-ink-soft border-transparent hover:text-ink"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.name === "Bookings" && newBookingsCount > 0 && (
                        <span className="bg-signal text-white text-[10px] px-1.5 py-0.5 rounded-full tabular-nums leading-none">
                          {newBookingsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: notifications + sign out */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {newBookingsCount > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 bg-signal text-white px-2.5 py-1.5 rounded-md">
                  <BellIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold tabular-nums">
                    {newBookingsCount} new
                  </span>
                </div>
              )}
              <button
                onClick={onSignOut}
                className="p-2 text-ink-soft hover:text-ink hover:bg-ink/5 rounded-lg transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile navigation — segmented row */}
          <nav className="md:hidden grid grid-cols-3 gap-1.5 mt-2.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  aria-current={item.current ? "page" : undefined}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-semibold min-h-[44px] border transition-all ${
                    item.current
                      ? "bg-ink text-paper border-ink"
                      : "text-ink-soft border-ink/15 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.name === "Bookings" && newBookingsCount > 0 && (
                    <span
                      className={`text-[10px] px-1 rounded-full tabular-nums leading-none ${
                        item.current ? "bg-paper text-ink" : "bg-signal text-white"
                      }`}
                    >
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
      <main className="relative z-10 flex-1">{children}</main>
    </div>
  );
}
