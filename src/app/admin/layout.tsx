import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Bearded Lifeguard",
  description: "Admin dashboard for managing lifeguard bookings and customer communications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {children}
    </div>
  );
}