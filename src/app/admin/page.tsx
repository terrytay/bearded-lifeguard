"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import DashboardLayout from "./components/DashboardLayout";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import BookingCard from "./components/BookingCard";
import BookingList from "./components/BookingList";
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
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

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
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <div className="bg-white border border-ink/12 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-ink/15 border-t-signal rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-soft text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.payment_status === "paid").length,
    pending: bookings.filter((b) => b.payment_status === "pending").length,
    unconfirmed: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    newCount: newBookingsCount,
  };

  return (
    <DashboardLayout
      newBookingsCount={newBookingsCount}
      onSignOut={signOut}
      processing={processing}
    >
      <BackToTopButton />

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
      <StatsBar
        {...stats}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      {/* Content */}
      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-sand/60 border border-ink/8 animate-pulse"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 md:py-20 console-in">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-ink/12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🗓️
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-ink mb-2">
                No bookings found
              </h3>
              <p className="text-ink-soft mb-5 max-w-sm mx-auto text-sm">
                Nothing matches this search or filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  loadBookings();
                }}
                className="px-5 py-2.5 bg-ink text-paper rounded-xl hover:bg-signal transition-all font-semibold text-sm min-h-[44px]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {/* View Toggle */}
              <div className="mb-4 flex justify-end console-in">
                <div className="bg-sand/60 border border-ink/12 rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 min-h-[40px] ${
                      viewMode === "list"
                        ? "bg-ink text-paper"
                        : "text-ink-soft hover:text-ink hover:bg-ink/5"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 min-h-[40px] ${
                      viewMode === "card"
                        ? "bg-ink text-paper"
                        : "text-ink-soft hover:text-ink hover:bg-ink/5"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Cards</span>
                  </button>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'list' ? (
                <div className="console-in">
                  <BookingList
                    bookings={bookings}
                    onMarkViewed={(booking) =>
                      updateBooking(booking.id, {
                        action: booking.viewed_by_admin
                          ? "mark_unviewed"
                          : "mark_viewed",
                      })
                    }
                    onDelete={deleteBooking}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 console-in">
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
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
