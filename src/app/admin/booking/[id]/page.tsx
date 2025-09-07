"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Checking access...</p>
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
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="w-10 h-10 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin absolute top-3 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <p className="text-white/80 font-medium text-lg">
                Loading booking details...
              </p>
            </div>
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
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Booking Not Found
            </h2>
            <p className="text-white/70 mb-8">
              The booking you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Back to Dashboard
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
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group text-sm md:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Header */}
          <BookingDetailHeader booking={booking} />

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Main Info */}
            <div className="xl:col-span-2 space-y-4 md:space-y-6">
              <BookingDetailInfo booking={booking} />
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="font-bold text-white mb-3 md:mb-4 flex items-center text-sm md:text-base">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  Quick Actions
                </h3>

                <div className="space-y-3 md:space-y-4">
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
      </div>
      <BackToTopButton />
    </DashboardLayout>
  );
}
