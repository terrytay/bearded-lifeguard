"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import DashboardLayout from "./components/DashboardLayout";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import BookingCard from "./components/BookingCard";
import BackToTopButton from "./components/BackToTop";

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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [newBookingsCount, setNewBookingsCount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, searchQuery, filterStatus]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/admin/login";
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
      window.location.href = "/";
      return;
    }

    setUser(session.user);
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      params.set("limit", "100");

      const response = await fetch(`/api/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        let filteredBookings = data.bookings;

        if (filterStatus !== "all") {
          filteredBookings = data.bookings.filter((booking: Booking) => {
            switch (filterStatus) {
              case "unviewed":
                return !booking.viewed_by_admin;
              case "pending_payment":
                return booking.payment_status === "pending";
              case "paid":
                return booking.payment_status === "paid";
              case "confirmed":
                return booking.status === "confirmed";
              case "completed":
                return booking.status === "completed";
              case "cancelled":
                return booking.status === "cancelled";
              case "pending":
                return booking.status === "pending";
              default:
                return booking.status === filterStatus;
            }
          });
        }

        setBookings(filteredBookings);
        setNewBookingsCount(data.unviewedCount);
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updates: any) => {
    setProcessing(true);

    const targetBooking = bookings.find((b) => b.id === id);
    if (!targetBooking) return;

    // Optimistic update
    const updatedBooking = { ...targetBooking, ...updates };
    if (updates.action === "mark_viewed") {
      updatedBooking.viewed_by_admin = true;
    } else if (updates.action === "mark_unviewed") {
      updatedBooking.viewed_by_admin = false;
    } else if (updates.payment_status === "paid") {
      updatedBooking.payment_status = "paid";
      updatedBooking.status = "confirmed";
    }

    const optimisticBookings = bookings.map((b) =>
      b.id === id ? updatedBooking : b
    );
    setBookings(optimisticBookings);

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
        // Revert on failure
        setBookings(bookings);
        alert("Update failed");
      } else {
        setTimeout(loadBookings, 500);
      }
    } catch (error) {
      // Revert on error
      setBookings(bookings);
      console.error("Update error:", error);
      alert("Update failed");
    } finally {
      setProcessing(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;

    setProcessing(true);

    const optimisticBookings = bookings.filter((b) => b.id !== id);
    setBookings(optimisticBookings);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (!response.ok) {
        setBookings([...bookings]);
        alert("Delete failed");
      } else {
        setTimeout(loadBookings, 500);
      }
    } catch (error) {
      setBookings([...bookings]);
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.payment_status === "paid").length,
    pending: bookings.filter((b) => b.payment_status === "pending").length,
    newCount: newBookingsCount,
  };

  return (
    <DashboardLayout
      newBookingsCount={newBookingsCount}
      onSignOut={signOut}
      processing={processing}
    >
      <BackToTopButton/>
      
      {/* Search */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onRefresh={loadBookings}
        isLoading={loading}
      />
      {/* Stats */}
      <StatsBar {...stats} />
      {/* Content */}
      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 md:py-20">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin mx-auto mb-4 md:mb-6"></div>
                <div className="w-6 h-6 md:w-10 md:h-10 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin absolute top-3 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <p className="text-white/80 font-medium text-sm md:text-lg">
                Loading bookings...
              </p>
              <p className="text-white/50 text-xs md:text-sm mt-1 md:mt-2">
                Fetching the latest data
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-white/20">
                <div className="text-2xl md:text-4xl">📋</div>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
                No bookings found
              </h3>
              <p className="text-white/70 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  loadBookings();
                }}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onMarkViewed={() =>
                    updateBooking(booking.id, {
                      action: booking.viewed_by_admin
                        ? "mark_unviewed"
                        : "mark_viewed",
                    })
                  }
                  onDelete={() => deleteBooking(booking.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
