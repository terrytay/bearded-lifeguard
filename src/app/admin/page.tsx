"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, searchTerm, statusFilter]);

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

      if (response.ok) {
        await fetchBookings();
        setSelectedBooking(null);
      } else {
        alert("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

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

      if (response.ok) {
        await fetchBookings();
        setSelectedBooking(null);
      } else {
        alert("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const confirmPayment = async () => {
    if (!selectedBooking) return;

    setConfirmingPayment(true);
    try {
      await updateBooking(selectedBooking.id, {
        action: "update_payment_status",
        payment_status: "paid",
        status: "confirmed", // Automatically set to confirmed when payment is received
        send_email: true,
      });
      setShowPaymentConfirm(false);
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

  if (!user) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="modern-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6633] mx-auto"></div>
          <p className="mt-2 text-modern-light">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Modern Header */}
      <div className="sticky top-0 z-40 modern-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#20334F] to-[#FF6633] bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-500 text-sm hidden sm:block">
                    Manage bookings & communications
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unviewedCount > 0 && (
                <div className="relative">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {unviewedCount} unviewed
                    </span>
                    <span className="sm:hidden">{unviewedCount}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#FF6633] transition-colors" />
                <input
                  type="text"
                  placeholder="Search bookings by name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6633]/20 focus:border-[#FF6633] transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filter and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6633]/20 focus:border-[#FF6633] transition-all duration-200 text-gray-700 min-w-[200px] appearance-none"
                >
                  <option value="all">All Bookings</option>
                  <option value="unviewed">🔴 Unviewed</option>
                  <option value="pending">⏳ Pending Review</option>
                  <option value="pending_payment">💳 Awaiting Payment</option>
                  <option value="paid">💚 Paid</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">🎉 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>

              <button
                onClick={fetchBookings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF6633] to-[#e55a2b] text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF6633]">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.payment_status === "paid").length}
              </div>
              <div className="text-sm text-gray-500">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.payment_status === "pending").length}
              </div>
              <div className="text-sm text-gray-500">Pending Payment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {unviewedCount}
              </div>
              <div className="text-sm text-gray-500">Unviewed</div>
            </div>
          </div>
        </div>

        {/* Modern Bookings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#FF6633]/20 border-t-[#FF6633] rounded-full animate-spin"></div>
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin absolute top-3 left-3"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer & Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status & Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className={`hover:bg-white/70 transition-colors duration-200 ${
                          !booking.viewed_by_admin
                            ? "bg-blue-50/50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getStatusColor(
                                  booking.status,
                                  booking.payment_status
                                )
                                  .replace("text-", "bg-")
                                  .replace("bg-", "bg-")
                                  .replace("-100", "-500")}`}
                              >
                                {booking.customer_name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold text-gray-900">
                                  {booking.customer_name}
                                </div>
                                {!booking.viewed_by_admin && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {booking.customer_email}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
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
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {formatServiceType(
                                booking.service_type,
                                booking.custom_service
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              📅{" "}
                              {new Date(booking.start_datetime).toLocaleString(
                                "en-SG"
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.hours}h
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {booking.lifeguards}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />$
                                {booking.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status,
                                booking.payment_status
                              )}`}
                            >
                              {getStatusLabel(
                                booking.status,
                                booking.payment_status
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 text-gray-600 hover:text-[#FF6633] hover:bg-[#FF6633]/10 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateBooking(booking.id, {
                                  action: booking.viewed_by_admin
                                    ? "mark_unviewed"
                                    : "mark_viewed",
                                })
                              }
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
                              onClick={() => deleteBooking(booking.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                    !booking.viewed_by_admin
                      ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    {/* Customer Info Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getStatusColor(
                            booking.status,
                            booking.payment_status
                          )
                            .replace("text-", "bg-")
                            .replace("-100", "-500")}`}
                        >
                          {booking.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {booking.customer_name}
                            </h3>
                            {!booking.viewed_by_admin && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {booking.customer_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-600 hover:text-[#FF6633] hover:bg-[#FF6633]/10 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            updateBooking(booking.id, {
                              action: booking.viewed_by_admin
                                ? "mark_unviewed"
                                : "mark_viewed",
                            })
                          }
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          {booking.viewed_by_admin ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-2 mb-3">
                      <div className="text-sm font-medium text-gray-900">
                        {formatServiceType(
                          booking.service_type,
                          booking.custom_service
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        📅{" "}
                        {new Date(booking.start_datetime).toLocaleString(
                          "en-SG"
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.hours}h
                        </div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.lifeguards}
                        </div>
                        <div className="text-xs text-gray-500">Lifeguards</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          ${booking.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Amount</div>
                      </div>
                    </div>

                    {/* Status and Order Info */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status,
                          booking.payment_status
                        )}`}
                      >
                        {getStatusLabel(booking.status, booking.payment_status)}
                      </span>
                      <div className="text-xs text-gray-400">
                        #{booking.order_id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#20334F] to-[#FF6633] bg-clip-text text-transparent">
                    Booking Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    #{selectedBooking.order_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    selectedBooking.status,
                    selectedBooking.payment_status
                  )}`}
                >
                  {getStatusLabel(
                    selectedBooking.status,
                    selectedBooking.payment_status
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {/* TODO: Check if this icon is correct */}
                    <User className="w-4 h-4 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[60px]">Name:</span>
                      <span className="font-medium">
                        {selectedBooking.customer_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-blue-600">
                        {selectedBooking.customer_email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedBooking.customer_phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Service Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <p className="font-medium">
                        {formatServiceType(
                          selectedBooking.service_type,
                          selectedBooking.custom_service
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Schedule:</span>
                      <p className="font-medium">
                        {new Date(
                          selectedBooking.start_datetime
                        ).toLocaleString("en-SG")}
                      </p>
                      <p className="text-xs text-gray-500">
                        to{" "}
                        {new Date(selectedBooking.end_datetime).toLocaleString(
                          "en-SG"
                        )}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {selectedBooking.hours}
                        </div>
                        <div className="text-xs text-gray-500">Hours</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {selectedBooking.lifeguards}
                        </div>
                        <div className="text-xs text-gray-500">Guards</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          ${selectedBooking.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Amount</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.remarks && (
                  <div className="md:col-span-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-yellow-600" />
                      Customer Remarks
                    </h3>
                    <p className="text-sm text-gray-700 italic">
                      {selectedBooking.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (selectedBooking.payment_status !== "paid") {
                    setShowPaymentConfirm(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedBooking.payment_status === "paid"}
              >
                <CheckCircle className="w-4 h-4" />
                {selectedBooking.payment_status === "paid"
                  ? "Payment Confirmed"
                  : "Confirm Payment & Email"}
              </button>

              <button
                onClick={() =>
                  updateBooking(selectedBooking.id, {
                    action: selectedBooking.viewed_by_admin
                      ? "mark_unviewed"
                      : "mark_viewed",
                  })
                }
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
              >
                {selectedBooking.viewed_by_admin ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                Mark as{" "}
                {selectedBooking.viewed_by_admin ? "Unviewed" : "Viewed"}
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
                  className="appearance-none px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6633]/20 focus:border-[#FF6633] transition-all font-medium text-gray-700 min-w-[160px]"
                >
                  <option value="">Change Status</option>
                  <option value="pending">📋 Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">🎉 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => deleteBooking(selectedBooking.id)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
