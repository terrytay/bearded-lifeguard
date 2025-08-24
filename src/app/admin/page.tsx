"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Eye,
  EyeOff,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Users,
  Clock,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  LogOut,
  DollarSign,
  MapPin,
  MessageSquare,
  ArrowUpDown,
  MoreHorizontal,
  Send,
  Ban,
  FileText,
  Zap,
  User,
  FolderOpen,
  Bell,
  Settings,
  Download,
  Copy,
  Edit3,
  Shield,
} from "lucide-react";

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
  remarks?: string;
  amount: number;
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  viewed_by_admin: boolean;
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [user, setUser] = useState<any>(null);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    booking: Booking;
    x: number;
    y: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "details" | "actions"
  >("overview");
  const [operationProgress, setOperationProgress] = useState<{
    isActive: boolean;
    message: string;
    progress: number;
  }>({ isActive: false, message: '', progress: 0 });
  const [optimisticBookings, setOptimisticBookings] = useState<Booking[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, searchTerm, statusFilter]);

  // Use optimistic bookings when available, fallback to regular bookings
  const displayBookings = optimisticBookings.length > 0 ? optimisticBookings : bookings;

  // Progress bar animation helper
  const showProgress = (message: string, duration: number = 2000) => {
    setOperationProgress({ isActive: true, message, progress: 0 });
    
    const interval = setInterval(() => {
      setOperationProgress(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setOperationProgress({ isActive: false, message: '', progress: 0 });
          }, 500);
          return prev;
        }
        return { ...prev, progress: prev.progress + (100 / (duration / 50)) };
      });
    }, 50);
  };

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login or show login form
      window.location.href = "/admin/login";
      return;
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Access denied. Admin role required.");
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
      return;
    }

    setUser(session.user);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      params.set("limit", "100");

      const response = await fetch(`/api/admin/bookings?${params}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        let filteredBookings = data.bookings;

        if (statusFilter !== "all") {
          filteredBookings = data.bookings.filter((booking: Booking) => {
            switch (statusFilter) {
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
                return booking.status === statusFilter;
            }
          });
        }

        setBookings(filteredBookings);
        setUnviewedCount(data.unviewedCount);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updates: any) => {
    const targetBooking = bookings.find(b => b.id === id);
    if (!targetBooking) return;

    // Show progress
    showProgress('Updating booking...', 1500);

    // Optimistic update
    const optimisticUpdate = { ...targetBooking, ...updates };
    if (updates.action === 'mark_viewed') {
      optimisticUpdate.viewed_by_admin = true;
    } else if (updates.action === 'mark_unviewed') {
      optimisticUpdate.viewed_by_admin = false;
    } else if (updates.payment_status === 'paid') {
      optimisticUpdate.payment_status = 'paid';
      optimisticUpdate.status = 'confirmed';
    }

    const optimisticBookings = bookings.map(b => 
      b.id === id ? optimisticUpdate : b
    );
    setOptimisticBookings(optimisticBookings);
    setBookings(optimisticBookings);

    // Update selected booking if it's the one being updated
    if (selectedBooking?.id === id) {
      setSelectedBooking(optimisticUpdate);
    }

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
        // Rollback on failure
        setOptimisticBookings([]);
        setBookings(bookings);
        if (selectedBooking?.id === id) {
          setSelectedBooking(targetBooking);
        }
        alert("Failed to update booking");
      } else {
        // Success - fetch fresh data to ensure consistency
        setTimeout(() => {
          fetchBookings();
        }, 500);
      }
    } catch (error) {
      // Rollback on error
      setOptimisticBookings([]);
      setBookings(bookings);
      if (selectedBooking?.id === id) {
        setSelectedBooking(targetBooking);
      }
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const targetBooking = bookings.find(b => b.id === id);
    if (!targetBooking) return;

    // Show progress
    showProgress('Deleting booking...', 2000);

    // Optimistic delete - remove from list immediately
    const optimisticBookings = bookings.filter(b => b.id !== id);
    setOptimisticBookings(optimisticBookings);
    setBookings(optimisticBookings);
    
    // Close modal if deleting current booking
    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        // Rollback on failure - restore the deleted booking
        setOptimisticBookings([]);
        setBookings([...bookings]);
        alert("Failed to delete booking");
      } else {
        // Success - fetch fresh data to ensure consistency
        setTimeout(() => {
          fetchBookings();
        }, 500);
      }
    } catch (error) {
      // Rollback on error
      setOptimisticBookings([]);
      setBookings([...bookings]);
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const confirmPayment = async () => {
    if (!selectedBooking) return;

    setConfirmingPayment(true);
    setShowPaymentConfirm(false);
    
    // Show progress for payment confirmation
    showProgress('Confirming payment & sending email...', 3000);
    
    try {
      await updateBooking(selectedBooking.id, {
        action: "update_payment_status",
        payment_status: "paid",
        status: "confirmed",
        send_email: true,
      });
    } finally {
      setConfirmingPayment(false);
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getStatusColor = (status: string, paymentStatus: string) => {
    // Payment status takes priority
    if (paymentStatus === "paid") {
      if (status === "completed") return "text-emerald-600 bg-emerald-100";
      if (status === "cancelled") return "text-orange-600 bg-orange-100"; // Paid but cancelled
      return "text-green-600 bg-green-100"; // Paid and confirmed/active
    }

    if (paymentStatus === "refunded") return "text-purple-600 bg-purple-100";

    // Status-based colors for unpaid bookings
    if (status === "cancelled") return "text-red-600 bg-red-100";
    if (status === "confirmed") return "text-blue-600 bg-blue-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";

    return "text-gray-600 bg-gray-100";
  };

  const getStatusLabel = (status: string, paymentStatus: string) => {
    if (paymentStatus === "paid") {
      if (status === "pending") return "Paid & Pending";
      if (status === "completed") return "Service Completed";
      if (status === "cancelled") return "Paid & Cancelled";
      return "Paid & Confirmed";
    }

    if (paymentStatus === "refunded") return "Refunded";

    if (status === "cancelled") return "Booking Cancelled";
    if (status === "confirmed") return "Awaiting Payment";
    if (status === "pending") return "Pending Review";
    if (status === "completed") return "Completed (Unpaid)";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatServiceType = (serviceType: string, customService?: string) => {
    const serviceNames: Record<string, string> = {
      pools: "Pool Lifeguarding",
      events: "Event Lifeguarding",
      "pool-parties": "Pool Party Lifeguarding",
      "open-water": "Open Water Lifeguarding",
      others: "Custom Service",
    };

    const baseName = serviceNames[serviceType] || serviceType;
    return serviceType === "others" && customService
      ? `${baseName}: ${customService}`
      : baseName;
  };

  // Context menu handlers
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, booking: Booking) => {
      e.preventDefault();
      setContextMenu({
        booking,
        x: e.clientX,
        y: e.clientY,
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu, closeContextMenu]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-4 text-white/80 font-medium">
            Authenticating admin access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Modern Admin Header */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-white/60 text-sm">
                    Bearded Lifeguard Management Portal
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Unviewed Count */}
              {unviewedCount > 0 && (
                <div className="relative">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span className="hidden sm:inline">
                      {unviewedCount} new booking{unviewedCount > 1 ? "s" : ""}
                    </span>
                    <span className="sm:hidden">{unviewedCount}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              )}

              {/* View Toggle - Show on mobile too */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 order-first sm:order-none mb-3 sm:mb-0">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "cards"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Table
                </button>
              </div>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">
                  Online
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slick Progress Bar */}
      {operationProgress.isActive && (
        <div className="fixed top-[88px] left-0 right-0 z-50">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-400/50 border-t-blue-400 rounded-full animate-spin"></div>
                  <span className="text-white/90 font-medium text-sm">{operationProgress.message}</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out rounded-full shadow-lg"
                    style={{ width: `${operationProgress.progress}%` }}
                  >
                    <div className="h-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-white/70 text-xs font-mono min-w-[40px]">
                  {Math.round(operationProgress.progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search bookings by name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filter and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 text-white w-full sm:min-w-[200px] appearance-none backdrop-blur-sm [&>option]:bg-slate-800 [&>option]:text-white"
                >
                  <option value="all" className="bg-slate-800 text-white">All Bookings</option>
                  <option value="unviewed" className="bg-slate-800 text-white">🔴 Unviewed</option>
                  <option value="pending" className="bg-slate-800 text-white">⏳ Pending Review</option>
                  <option value="pending_payment" className="bg-slate-800 text-white">💳 Awaiting Payment</option>
                  <option value="paid" className="bg-slate-800 text-white">💚 Paid</option>
                  <option value="confirmed" className="bg-slate-800 text-white">✅ Confirmed</option>
                  <option value="completed" className="bg-slate-800 text-white">🎉 Completed</option>
                  <option value="cancelled" className="bg-slate-800 text-white">❌ Cancelled</option>
                </select>
              </div>

              <button
                onClick={fetchBookings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {displayBookings.length}
                </div>
                <div className="text-sm text-white/70 font-medium">
                  Total Bookings
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {displayBookings.filter((b) => b.payment_status === "paid").length}
                </div>
                <div className="text-sm text-white/70 font-medium">Paid</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {
                    displayBookings.filter((b) => b.payment_status === "pending")
                      .length
                  }
                </div>
                <div className="text-sm text-white/70 font-medium">
                  Pending Payment
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-4 border border-red-500/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {unviewedCount}
                </div>
                <div className="text-sm text-white/70 font-medium">
                  Unviewed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Bookings Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin absolute top-3 left-3 animate-pulse"></div>
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin absolute top-6 left-6"></div>
            </div>
            <p className="mt-6 text-white/80 font-semibold text-lg">
              Loading bookings...
            </p>
            <p className="text-white/50 text-sm">Fetching the latest data</p>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <FileText className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              No bookings found
            </h3>
            <p className="text-white/70">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  fetchBookings();
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cards View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`group relative bg-white/10 backdrop-blur-lg border rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl ${
                      !booking.viewed_by_admin
                        ? "border-red-500/50 bg-red-500/10 shadow-red-500/20"
                        : "border-white/20 hover:border-blue-500/50"
                    }`}
                    onClick={() => setSelectedBooking(booking)}
                    onContextMenu={(e) => handleContextMenu(e, booking)}
                  >
                    {/* New Badge */}
                    {!booking.viewed_by_admin && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        NEW
                      </div>
                    )}

                    {/* Customer Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                          booking.payment_status === "paid"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                      >
                        {booking.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
                          {booking.customer_name}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {booking.customer_email}
                        </p>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="mb-4">
                      <div className="text-white/90 font-medium mb-2">
                        {formatServiceType(
                          booking.service_type,
                          booking.custom_service
                        )}
                      </div>
                      <div className="text-white/70 text-sm mb-3">
                        📅{" "}
                        {new Date(booking.start_datetime).toLocaleString(
                          "en-SG"
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                          <div className="text-white font-semibold">
                            {booking.hours}h
                          </div>
                          <div className="text-white/60 text-xs">Duration</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                          <div className="text-white font-semibold">
                            {booking.lifeguards}
                          </div>
                          <div className="text-white/60 text-xs">Guards</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                          <div className="text-white font-semibold">
                            ${booking.amount.toFixed(2)}
                          </div>
                          <div className="text-white/60 text-xs">Amount</div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.payment_status === "paid"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : booking.status === "cancelled"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        }`}
                      >
                        {getStatusLabel(booking.status, booking.payment_status)}
                      </span>

                      <div className="text-white/40 text-xs font-mono">
                        #{booking.order_id}
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors">
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/20">
                    <thead className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                          Customer & Order
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                          Service Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                          Status & Payment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {displayBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className={`hover:bg-white/20 transition-all duration-300 cursor-pointer group ${
                            !booking.viewed_by_admin
                              ? "bg-red-500/10 border-l-4 border-l-red-500 shadow-red-500/20"
                              : "hover:shadow-lg"
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                          onContextMenu={(e) => handleContextMenu(e, booking)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                                    booking.payment_status === "paid"
                                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                                  }`}
                                >
                                  {booking.customer_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                                    {booking.customer_name}
                                  </div>
                                  {!booking.viewed_by_admin && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-white/70">
                                  {booking.customer_email}
                                </div>
                                <div className="text-xs text-white/50 mt-1 font-mono">
                                  #{booking.order_id} •{" "}
                                  {new Date(
                                    booking.created_at
                                  ).toLocaleDateString("en-SG")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-white/90 mb-1">
                                {formatServiceType(
                                  booking.service_type,
                                  booking.custom_service
                                )}
                              </div>
                              <div className="text-sm text-white/70 mb-2">
                                📅{" "}
                                {new Date(
                                  booking.start_datetime
                                ).toLocaleString("en-SG")}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-white/60">
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                                  <Clock className="w-3 h-3" />
                                  {booking.hours}h
                                </span>
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                                  <Users className="w-3 h-3" />
                                  {booking.lifeguards}
                                </span>
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                                  <DollarSign className="w-3 h-3" />$
                                  {booking.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg ${
                                  booking.payment_status === "paid"
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                                    : booking.status === "cancelled"
                                    ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30"
                                    : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                                }`}
                              >
                                {getStatusLabel(
                                  booking.status,
                                  booking.payment_status
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBooking(booking);
                                }}
                                className="p-2 text-white/70 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                                title="View Details"
                              >
                                <FolderOpen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateBooking(booking.id, {
                                    action: booking.viewed_by_admin
                                      ? "mark_unviewed"
                                      : "mark_viewed",
                                  });
                                }}
                                className="p-2 text-white/70 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                                title={
                                  booking.viewed_by_admin
                                    ? "Mark as Unviewed"
                                    : "Mark as Viewed"
                                }
                              >
                                {booking.viewed_by_admin ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBooking(booking.id);
                                }}
                                className="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                                title="Delete Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile-Optimized Card View */}
            <div className="md:hidden space-y-4">
              {displayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`group relative bg-white/10 backdrop-blur-lg border rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${
                    !booking.viewed_by_admin
                      ? "border-red-500/50 bg-red-500/10 shadow-red-500/20"
                      : "border-white/20 hover:border-blue-500/50"
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                  onContextMenu={(e) => handleContextMenu(e, booking)}
                >
                  {/* New Badge */}
                  {!booking.viewed_by_admin && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      NEW
                    </div>
                  )}

                  {/* Customer Info Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                          booking.payment_status === "paid"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                      >
                        {booking.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                          {booking.customer_name}
                        </h3>
                        <p className="text-white/60 text-xs">
                          {booking.customer_email}
                        </p>
                        <p className="text-white/40 text-xs font-mono mt-1">
                          #{booking.order_id}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="p-2 text-white/70 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateBooking(booking.id, {
                            action: booking.viewed_by_admin
                              ? "mark_unviewed"
                              : "mark_viewed",
                          });
                        }}
                        className="p-2 text-white/70 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-200"
                      >
                        {booking.viewed_by_admin ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="mb-4">
                    <div className="text-white/90 font-medium text-sm mb-2">
                      {formatServiceType(
                        booking.service_type,
                        booking.custom_service
                      )}
                    </div>
                    <div className="text-white/70 text-sm mb-3">
                      📅{" "}
                      {new Date(booking.start_datetime).toLocaleString("en-SG")}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white font-bold text-sm">
                          {booking.hours}h
                        </div>
                        <div className="text-white/60 text-xs">Duration</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white font-bold text-sm">
                          {booking.lifeguards}
                        </div>
                        <div className="text-white/60 text-xs">Guards</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <div className="text-white font-bold text-sm">
                          ${booking.amount.toFixed(2)}
                        </div>
                        <div className="text-white/60 text-xs">Amount</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg ${
                        booking.payment_status === "paid"
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                          : booking.status === "cancelled"
                          ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30"
                          : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {getStatusLabel(booking.status, booking.payment_status)}
                    </span>

                    <div className="text-white/50 text-xs">
                      {new Date(booking.created_at).toLocaleDateString("en-SG")}
                    </div>
                  </div>

                  {/* Tap to view indicator */}
                  <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white/40 text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Tap to view
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right-click Context Menu */}
        {contextMenu && (
          <div
            className="fixed z-[70] bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl py-2 min-w-[200px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              onClick={() => {
                setSelectedBooking(contextMenu.booking);
                closeContextMenu();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-500/20 hover:text-blue-600 flex items-center gap-3 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => {
                updateBooking(contextMenu.booking.id, {
                  action: contextMenu.booking.viewed_by_admin
                    ? "mark_unviewed"
                    : "mark_viewed",
                });
                closeContextMenu();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-500/20 hover:text-green-600 flex items-center gap-3 transition-colors"
            >
              {contextMenu.booking.viewed_by_admin ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Mark as{" "}
              {contextMenu.booking.viewed_by_admin ? "Unviewed" : "Viewed"}
            </button>
            {contextMenu.booking.payment_status !== "paid" && (
              <button
                onClick={() => {
                  setSelectedBooking(contextMenu.booking);
                  setShowPaymentConfirm(true);
                  closeContextMenu();
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-500/20 hover:text-green-600 flex items-center gap-3 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Payment
              </button>
            )}
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  contextMenu.booking.customer_email
                );
                closeContextMenu();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-500/20 hover:text-blue-600 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Email
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.booking.order_id);
                closeContextMenu();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-500/20 hover:text-blue-600 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Order ID
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => {
                deleteBooking(contextMenu.booking.id);
                closeContextMenu();
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-500/20 hover:text-red-700 flex items-center gap-3 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Booking
            </button>
          </div>
        )}
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Confirm Payment
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This action is{" "}
                  <strong className="text-red-600">irreversible</strong>. A
                  payment confirmation email will be automatically sent to the
                  customer.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Customer:</strong> {selectedBooking.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedBooking.customer_email}
                  </p>
                  <p>
                    <strong>Amount:</strong> $
                    {selectedBooking.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Order:</strong> #{selectedBooking.order_id}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentConfirm(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  disabled={confirmingPayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {confirmingPayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Confirm & Send Email"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl ${
                      selectedBooking.payment_status === "paid"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}
                  >
                    {selectedBooking.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Booking Details
                    </h2>
                    <p className="text-white/60 text-sm mt-1 font-mono">
                      #{selectedBooking.order_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 hover:scale-110"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
                    selectedBooking.payment_status === "paid"
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                      : selectedBooking.status === "cancelled"
                      ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30"
                      : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                  }`}
                >
                  {getStatusLabel(
                    selectedBooking.status,
                    selectedBooking.payment_status
                  )}
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white/5 border-b border-white/10">
              <div className="flex">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "details", label: "Details", icon: Calendar },
                  { id: "actions", label: "Actions", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setSelectedTab(
                          tab.id as "overview" | "details" | "actions"
                        )
                      }
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                        selectedTab === tab.id
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-b-2 border-blue-400"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {selectedTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        Customer Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 text-sm min-w-[80px]">
                            Name:
                          </span>
                          <span className="font-semibold text-white">
                            {selectedBooking.customer_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 hover:text-blue-200 cursor-pointer transition-colors">
                            {selectedBooking.customer_email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-green-400" />
                          <span className="text-white font-mono">
                            {selectedBooking.customer_phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-400" />
                        </div>
                        Service Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-white/60 text-sm">
                            Service Type:
                          </span>
                          <p className="font-semibold text-white mt-1">
                            {formatServiceType(
                              selectedBooking.service_type,
                              selectedBooking.custom_service
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">
                            Schedule:
                          </span>
                          <p className="font-semibold text-white mt-1">
                            {new Date(
                              selectedBooking.start_datetime
                            ).toLocaleString("en-SG")}
                          </p>
                          <p className="text-white/70 text-sm">
                            to{" "}
                            {new Date(
                              selectedBooking.end_datetime
                            ).toLocaleString("en-SG")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 text-center border border-blue-500/30">
                      <div className="text-3xl font-bold text-blue-300 mb-2">
                        {selectedBooking.hours}h
                      </div>
                      <div className="text-white/70 text-sm font-medium">
                        Duration
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 text-center border border-green-500/30">
                      <div className="text-3xl font-bold text-green-300 mb-2">
                        {selectedBooking.lifeguards}
                      </div>
                      <div className="text-white/70 text-sm font-medium">
                        Lifeguards
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 text-center border border-yellow-500/30">
                      <div className="text-3xl font-bold text-yellow-300 mb-2">
                        ${selectedBooking.amount.toFixed(2)}
                      </div>
                      <div className="text-white/70 text-sm font-medium">
                        Total Amount
                      </div>
                    </div>
                  </div>

                  {/* Customer Remarks */}
                  {selectedBooking.remarks && (
                    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                      <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-amber-400" />
                        Customer Remarks
                      </h3>
                      <p className="text-white/90 italic leading-relaxed">
                        "{selectedBooking.remarks}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Details Tab */}
              {selectedTab === "details" && (
                <div className="space-y-6">
                  {/* Booking Timeline */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Booking Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">
                            Booking Created
                          </div>
                          <div className="text-white/60 text-sm">
                            {new Date(
                              selectedBooking.created_at
                            ).toLocaleString("en-SG")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selectedBooking.payment_status === "paid"
                              ? "bg-green-400"
                              : "bg-yellow-400"
                          }`}
                        ></div>
                        <div>
                          <div className="text-white font-medium">
                            Payment{" "}
                            {selectedBooking.payment_status === "paid"
                              ? "Confirmed"
                              : "Pending"}
                          </div>
                          <div className="text-white/60 text-sm">
                            Status: {selectedBooking.payment_status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Technical Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Booking ID:</span>
                          <span className="font-mono text-white">
                            {selectedBooking.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Order ID:</span>
                          <span className="font-mono text-white">
                            #{selectedBooking.order_id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Status:</span>
                          <span className="text-white capitalize">
                            {selectedBooking.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Payment Status:</span>
                          <span className="text-white capitalize">
                            {selectedBooking.payment_status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Admin Viewed:</span>
                          <span
                            className={`${
                              selectedBooking.viewed_by_admin
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedBooking.viewed_by_admin ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Created:</span>
                          <span className="text-white text-sm">
                            {new Date(
                              selectedBooking.created_at
                            ).toLocaleDateString("en-SG")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Tab */}
              {selectedTab === "actions" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Actions */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-green-400" />
                        Payment Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            if (selectedBooking.payment_status !== "paid") {
                              setShowPaymentConfirm(true);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            selectedBooking.payment_status === "paid"
                              ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 hover:scale-105"
                          }`}
                          disabled={selectedBooking.payment_status === "paid"}
                        >
                          <CheckCircle className="w-5 h-5" />
                          {selectedBooking.payment_status === "paid"
                            ? "Payment Confirmed"
                            : "Confirm Payment & Send Email"}
                        </button>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-blue-400" />
                        Status Management
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() =>
                            updateBooking(selectedBooking.id, {
                              action: selectedBooking.viewed_by_admin
                                ? "mark_unviewed"
                                : "mark_viewed",
                            })
                          }
                          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all hover:scale-105 font-medium"
                        >
                          {selectedBooking.viewed_by_admin ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                          Mark as{" "}
                          {selectedBooking.viewed_by_admin
                            ? "Unviewed"
                            : "Viewed"}
                        </button>

                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                updateBooking(selectedBooking.id, {
                                  status: e.target.value,
                                });
                              }
                            }}
                            defaultValue=""
                            className="w-full appearance-none px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all font-medium text-white backdrop-blur-sm"
                          >
                            <option value="" className="bg-slate-800">
                              Change Booking Status
                            </option>
                            <option value="pending" className="bg-slate-800">
                              📋 Pending Review
                            </option>
                            <option value="confirmed" className="bg-slate-800">
                              ✅ Confirmed
                            </option>
                            <option value="completed" className="bg-slate-800">
                              🎉 Completed
                            </option>
                            <option value="cancelled" className="bg-slate-800">
                              ❌ Cancelled
                            </option>
                          </select>
                          <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedBooking.customer_email
                          );
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all hover:scale-105 font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedBooking.order_id
                          );
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all hover:scale-105 font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Order ID
                      </button>
                      <button
                        onClick={() => {
                          window.open(
                            `mailto:${selectedBooking.customer_email}`
                          );
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all hover:scale-105 font-medium"
                      >
                        <Send className="w-4 h-4" />
                        Send Email
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 border border-red-500/30">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                      <Ban className="w-5 h-5 text-red-400" />
                      Danger Zone
                    </h3>
                    <button
                      onClick={() => deleteBooking(selectedBooking.id)}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all hover:scale-105 font-semibold shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Booking Forever
                    </button>
                    <p className="text-red-300/80 text-sm mt-2">
                      This action cannot be undone. The booking will be
                      permanently removed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
