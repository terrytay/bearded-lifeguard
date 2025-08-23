"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Home,
  Phone,
  Mail,
  BookCopy,
} from "lucide-react";

interface CustomerBooking {
  orderId: string;
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  startDateTime: string;
  endDateTime: string;
  serviceType: string;
  lifeguards: number;
  amount: number;
  createdAt: string;
}

export default function TrackBooking() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackBooking = async () => {
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const response = await fetch(
        `/api/booking-status/${encodeURIComponent(orderId.trim())}`
      );

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else if (response.status === 404) {
        setError(
          "Booking not found. Please check your order ID and try again."
        );
      } else {
        setError("Failed to retrieve booking status. Please try again later.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string, paymentStatus: string) => {
    // if (paymentStatus === "paid") {
    //   return {
    //     label: "Payment Confirmed",
    //     color: "text-green-600 bg-green-100",
    //     icon: <CheckCircle className="w-5 h-5" />,
    //   };
    // }

    switch (status) {
      case "confirmed":
        return {
          label: "Booking Confirmed",
          color: "text-blue-600 bg-blue-100",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "completed":
        return {
          label: "Service Completed",
          color: "text-green-600 bg-green-100",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "cancelled":
        return {
          label: "Booking Cancelled",
          color: "text-red-600 bg-red-100",
          icon: <XCircle className="w-5 h-5" />,
        };
      default:
        return {
          label: "Pending Confirmation",
          color: "text-yellow-600 bg-yellow-100",
          icon: <AlertCircle className="w-5 h-5" />,
        };
    }
  };

  const getPaymentStatusInfo = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return {
          label: "Payment Confirmed",
          color: "text-green-600 bg-green-100",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "refunded":
        return {
          label: "Payment Refunded",
          color: "text-blue-600 bg-blue-100",
          icon: <CreditCard className="w-5 h-5" />,
        };
      default:
        return {
          label: "Payment Pending",
          color: "text-orange-600 bg-orange-100",
          icon: <AlertCircle className="w-5 h-5" />,
        };
    }
  };

  const formatServiceType = (serviceType: string) => {
    const serviceNames: Record<string, string> = {
      pools: "Pool Lifeguarding",
      events: "Event Lifeguarding",
      "pool-parties": "Pool Party Lifeguarding",
      "open-water": "Open Water Lifeguarding",
      others: "Custom Service",
    };
    return serviceNames[serviceType] || serviceType;
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6633' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='90' cy='30' r='3'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3Ccircle cx='30' cy='90' r='2'/%3E%3Ccircle cx='90' cy='90' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative py-8 sm:py-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Modern Header */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm border border-white/20">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full animate-bounce"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#20334F] to-[#FF6633] bg-clip-text text-transparent mb-4">
              Track Your Booking
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Enter your order ID to check the real-time status of your
              lifeguard service booking.
            </p>
          </div>

          {/* Modern Search Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="orderId"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    🔍 Order ID
                  </label>
                  <div className="relative group">
                    <input
                      id="orderId"
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && trackBooking()}
                      placeholder="e.g., BL-123456-ABCD"
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6633]/20 focus:border-[#FF6633] transition-all duration-200 text-gray-700 placeholder-gray-400 group-focus-within:shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF6633]/5 to-[#e55a2b]/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    You can find your order ID in your confirmation email
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={trackBooking}
                    disabled={loading || !orderId.trim()}
                    className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#e55a2b] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#FF6633] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Search className="w-5 h-5" />
                        <span className="hidden sm:inline">Track Booking</span>
                        <span className="sm:hidden">Track</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 mb-2 text-lg">
                    Booking Not Found
                  </h3>
                  <p className="text-red-700 leading-relaxed">{error}</p>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-600">
                      💡 <strong>Tip:</strong> Order IDs are case-sensitive and
                      usually start with "BL-"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Booking Details */}
          {booking && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-[#FF6633] via-[#e55a2b] to-[#d14d24] px-6 sm:px-8 py-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='80' cy='40' r='1' fill='rgba(255,255,255,0.08)'/%3E%3Ccircle cx='40' cy='80' r='1' fill='rgba(255,255,255,0.12)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%' height='100%' fill='url(%23grain)'/%3E%3C/svg%3E")`,
                  }}
                />{" "}
                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:inline">Booking Status</span>
                    <span className="sm:hidden">Status</span>
                  </h2>
                  <p className="text-white/90 text-sm font-medium">
                    #{booking.orderId}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Status Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {/* Booking Status Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookCopy className="w-5 h-5 text-blue-600" />
                      Booking Status
                    </h3>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold ${
                        getStatusInfo(booking.status, booking.paymentStatus)
                          .color
                      } shadow-sm`}
                    >
                      {
                        getStatusInfo(booking.status, booking.paymentStatus)
                          .icon
                      }
                      {
                        getStatusInfo(booking.status, booking.paymentStatus)
                          .label
                      }
                    </div>
                  </div>

                  {/* Payment Status Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Payment Status
                    </h3>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold ${
                        getPaymentStatusInfo(booking.paymentStatus).color
                      } shadow-sm`}
                    >
                      {getPaymentStatusInfo(booking.paymentStatus).icon}
                      {getPaymentStatusInfo(booking.paymentStatus).label}
                    </div>
                  </div>
                </div>

                {/* Service Details Card */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Service Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                          Service Type
                        </span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {formatServiceType(booking.serviceType)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                          Duration
                        </span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {Math.round(
                            (new Date(booking.endDateTime).getTime() -
                              new Date(booking.startDateTime).getTime()) /
                              (1000 * 60 * 60)
                          )}{" "}
                          hours
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                          Lifeguards
                        </span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {booking.lifeguards} professional
                          {booking.lifeguards > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                          Start Time
                        </span>
                        <p className="font-semibold text-gray-900 mt-1 text-sm sm:text-base">
                          {new Date(booking.startDateTime).toLocaleString(
                            "en-SG",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                          End Time
                        </span>
                        <p className="font-semibold text-gray-900 mt-1 text-sm sm:text-base">
                          {new Date(booking.endDateTime).toLocaleString(
                            "en-SG",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#FF6633] to-[#e55a2b] p-4 rounded-lg text-white">
                        <span className="text-white/80 text-xs uppercase tracking-wide font-medium">
                          Total Amount
                        </span>
                        <p className="font-bold text-xl mt-1">
                          ${booking.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Timeline */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Booking Timeline
                  </h3>
                  <div className="space-y-6">
                    {/* Booking Created */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-lg"></div>
                        <div className="absolute top-4 left-2 w-0.5 h-8 bg-gradient-to-b from-green-300 to-gray-300"></div>
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="font-semibold text-gray-900">
                            Booking Created
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleString("en-SG", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {booking.paymentStatus === "paid" ? (
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-lg"></div>
                          {(booking.status === "confirmed" ||
                            booking.status === "completed") && (
                            <div className="absolute top-4 left-2 w-0.5 h-8 bg-gradient-to-b from-green-300 to-blue-300"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <p className="font-semibold text-gray-900">
                              Payment Confirmed
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Your payment has been processed successfully
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <p className="font-semibold text-gray-900">
                              Awaiting Payment
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Please complete your payment to confirm the booking
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Service Confirmation */}
                    {booking.status === "confirmed" && (
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
                          {/* TODO: verify this one as i changed it from completed to confirmed */}
                          {booking.status === "confirmed" && (
                            <div className="absolute top-4 left-2 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-purple-300"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <p className="font-semibold text-gray-900">
                              Service Confirmed
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Our team has confirmed your lifeguard service
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Service Completion */}
                    {booking.status === "completed" && (
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-lg"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <p className="font-semibold text-gray-900">
                              Service Completed
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Your lifeguard service has been successfully
                            completed
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Service Cancelled */}
                    {booking.status === "cancelled" && (
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-lg"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <p className="font-semibold text-gray-900">
                              Booking Cancelled
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            This booking has been cancelled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Help Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#20334F] mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Need Help?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Can't find your booking or need assistance? Our support team is
                here to help you 24/7.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+6591234567"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#FF6633]/10 to-[#e55a2b]/10 rounded-xl hover:from-[#FF6633]/20 hover:to-[#e55a2b]/20 transition-all duration-200 group border border-[#FF6633]/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#20334F] group-hover:text-[#FF6633] transition-colors">
                      +65 9123 4567
                    </p>
                    <p className="text-sm text-gray-500">Call us anytime</p>
                  </div>
                </a>
                <a
                  href="mailto:support@sglifeguardservices.com"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200 group border border-blue-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#20334F] group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                      support@sglifeguardservices.com
                    </p>
                    <p className="text-sm text-gray-500">Email support</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#20334F] mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Need another booking or want to explore our other services?
              </p>
              <div className="space-y-4">
                <Link
                  href="/booking"
                  className="block w-full bg-gradient-to-r from-[#FF6633] to-[#e55a2b] text-white text-center py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  🚀 Book Another Service
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gray-100 to-gray-200 text-[#20334F] py-4 px-6 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
