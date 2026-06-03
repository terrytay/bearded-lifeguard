"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";

import DashboardLayout from "../../components/DashboardLayout";
import PaymentActions from "../../components/PaymentActions";
import StatusActions from "../../components/StatusActions";
import BookingDetailHeader from "../components/BookingDetailHeader";
import BookingDetailInfo from "../components/BookingDetailInfo";
import BackToTopButton from "../../components/BackToTop";

interface Booking {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_datetime: string;
  end_datetime: string;
  hours: number;
  lifeguards: number;
  service_type: string;
  custom_service?: string;
  location?: string;
  remarks?: string;
  amount: number;
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  viewed_by_admin: boolean;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && bookingId) {
      loadBooking();
    }
  }, [user, bookingId]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Admin access required");
      await supabase.auth.signOut();
      router.push("/");
      return;
    }

    setUser(session.user);
  };

  const loadBooking = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);

        // Mark as viewed if not already
        if (!data.booking.viewed_by_admin) {
          updateBooking(bookingId, { action: "mark_viewed" });
        }
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to load booking:", error);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updates: any) => {
    if (!booking) return;

    setProcessing(true);

    // Optimistic update
    const updatedBooking = { ...booking, ...updates };
    if (updates.action === "mark_viewed") {
      updatedBooking.viewed_by_admin = true;
    } else if (updates.action === "mark_unviewed") {
      updatedBooking.viewed_by_admin = false;
    } else if (updates.payment_status === "paid") {
      updatedBooking.payment_status = "paid";
      updatedBooking.status = "confirmed";
    }

    setBooking(updatedBooking);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        setBooking(booking);
        alert("Update failed");
      }
    } catch (error) {
      setBooking(booking);
      console.error("Update error:", error);
      alert("Update failed");
    } finally {
      setProcessing(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;

    setProcessing(true);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center font-mono">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6633]/30 border-t-[#FF6633] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout
        newBookingsCount={0}
        onSignOut={signOut}
        processing={processing}
      >
        <div className="p-3 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-40 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout
        newBookingsCount={0}
        onSignOut={signOut}
        processing={processing}
      >
        <div className="p-6">
          <div className="max-w-4xl mx-auto text-center py-20 console-in">
            <div className="w-16 h-16 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Booking not found
            </h2>
            <p className="text-white/50 mb-6 text-sm">
              This booking doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="px-5 py-2.5 bg-[#FF6633] text-white rounded-xl hover:bg-[#e55a2b] transition-all font-semibold shadow-lg shadow-[#FF6633]/20 text-sm min-h-[44px]"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      newBookingsCount={0}
      onSignOut={signOut}
      processing={processing}
    >
      <div className="p-3 md:p-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-white/55 hover:text-white transition-colors group text-sm mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to dashboard</span>
          </button>

          {/* Header */}
          <BookingDetailHeader booking={booking} />

          {/* Single Column Layout - Mobile First */}
          <div className="mt-4 space-y-3 md:space-y-4">
            {/* Actions on mobile - top */}
            <div className="md:hidden bg-white/[0.04] border border-white/10 rounded-2xl p-4 console-in">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2.5 text-sm">
                <span className="w-7 h-7 rounded-lg bg-[#FF6633]/15 border border-[#FF6633]/30 text-[#FF6633] flex items-center justify-center">
                  <Cog6ToothIcon className="w-4 h-4" />
                </span>
                Quick actions
              </h3>
              <div className="space-y-3">
                <PaymentActions booking={booking} onUpdate={updateBooking} />
                <StatusActions
                  booking={booking}
                  onUpdate={updateBooking}
                  onDelete={deleteBooking}
                />
              </div>
            </div>

            {/* Main Info */}
            <BookingDetailInfo booking={booking} onRefresh={loadBooking} />

            {/* Actions on desktop - bottom */}
            <div className="hidden md:block bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2.5 text-base">
                <span className="w-7 h-7 rounded-lg bg-[#FF6633]/15 border border-[#FF6633]/30 text-[#FF6633] flex items-center justify-center">
                  <Cog6ToothIcon className="w-4 h-4" />
                </span>
                Quick actions
              </h3>
              <div className="space-y-4 max-w-md">
                <PaymentActions booking={booking} onUpdate={updateBooking} />
                <StatusActions
                  booking={booking}
                  onUpdate={updateBooking}
                  onDelete={deleteBooking}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTopButton />
    </DashboardLayout>
  );
}
