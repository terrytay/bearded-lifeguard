"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Mail,
  Phone,
  Clock,
  Users,
  Calendar,
  Home,
  MessageSquare,
  CalendarPlus,
  Download,
} from "lucide-react";
import { CalendarHelper, type CalendarEvent } from "@/lib/calendar";
import { SingaporeTime } from "@/lib/singapore-time";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order") ?? "-";
  const amount = searchParams.get("amount") ?? "-";
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const serviceType = searchParams.get("service") ?? "Lifeguard Service";
  const location = searchParams.get("location") ?? "";

  // Create calendar event if we have dates
  const calendarEvent: CalendarEvent | null =
    startDate && endDate
      ? {
          title: `Bearded Lifeguard - ${serviceType}`,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          description: `Professional lifeguard service booked through Bearded Lifeguard.\n\nOrder Reference: ${order}\nAmount Paid: $${amount}\n\nOur certified lifeguard will arrive 15 minutes before the scheduled start time.\n\nFor any questions, contact us at support@sglifeguardservices.com or +65 8200 6021`,
          location: location || "To be confirmed by our operations team",
        }
      : null;

  const handleCalendarDownload = () => {
    if (calendarEvent) {
      CalendarHelper.downloadICSFile(
        calendarEvent,
        `lifeguard-booking-${order}.ics`
      );
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6633' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative py-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#20334F] mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for choosing Bearded Lifeguard! Your professional
              lifeguard service has been successfully booked. We will contact
              you once we have verified your payment.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#FF6633] to-[#e55a2b] px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                Booking Details
              </h2>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Order Reference:
                    </span>
                    <span className="text-[#20334F] font-bold text-lg">
                      {order}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Amount Paid:
                    </span>
                    <span className="text-green-600 font-bold text-xl">
                      ${amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 font-medium">
                      Payment Status:
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Confirmed
                    </span>
                  </div>

                  {location && (
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Location:
                      </span>
                      <span className="text-[#20334F] font-medium text-right max-w-xs">
                        {location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-[#20334F] mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Confirmation
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    A detailed confirmation email has been sent to your inbox
                    with all booking information, lifeguard deployment details,
                    and what to expect next.
                  </p>
                  <div className="text-xs text-gray-500">
                    Don't see it? Check your spam folder or contact us directly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Integration */}
          {calendarEvent && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <CalendarPlus className="w-6 h-6" />
                  Add to Calendar
                </h2>
              </div>

              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Don't forget about your lifeguard service! Add this booking to
                  your calendar so you never miss it.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <a
                      href={CalendarHelper.generateGoogleCalendarUrl(
                        calendarEvent
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      Google Calendar
                    </a>

                    <a
                      href={CalendarHelper.generateOutlookCalendarUrl(
                        calendarEvent
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      Outlook Calendar
                    </a>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={CalendarHelper.generateYahooCalendarUrl(
                        calendarEvent
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      Yahoo Calendar
                    </a>

                    <button
                      onClick={handleCalendarDownload}
                      className="flex items-center justify-center gap-3 w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download (.ics)
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">
                        Event Details
                      </h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>
                          <strong>Service:</strong> {calendarEvent.title}
                        </p>
                        <p>
                          <strong>Start:</strong>{" "}
                          {SingaporeTime.toLocaleString(
                            calendarEvent.startDate
                          )}
                        </p>
                        <p>
                          <strong>End:</strong>{" "}
                          {SingaporeTime.toLocaleString(calendarEvent.endDate)}
                        </p>
                        <p>
                          <strong>Location:</strong> {calendarEvent.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#20334F] to-[#334155] px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Clock className="w-6 h-6" />
                What Happens Next?
              </h2>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#FF6633] text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#20334F] mb-2">
                        Team Contact (Within 24 Hours)
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our operations team will contact you to confirm
                        deployment details and discuss any special requirements
                        for your venue.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#FF6633] text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#20334F] mb-2">
                        Logistics Coordination
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We'll coordinate the exact logistics, equipment needs,
                        and emergency protocols with your designated point of
                        contact.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#FF6633] text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#20334F] mb-2">
                        Pre-Service Arrival
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our certified lifeguard(s) will arrive 15 minutes before
                        your scheduled start time for setup and briefing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#FF6633] text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#20334F] mb-2">
                        Final Confirmation Call
                      </h4>
                      <p className="text-gray-600 text-sm">
                        You'll receive a confirmation call 24 hours before your
                        service for final details and any last-minute
                        adjustments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Need Help */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#20334F] mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#FF6633]" />
                Need Assistance?
              </h3>
              <p className="text-gray-600 mb-6">
                Have questions about your booking or need to make changes? Our
                team is here to help.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+6582006021"
                  className="flex items-center gap-3 text-[#FF6633] hover:text-[#e55a2b] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">+65 8200 6021</span>
                </a>

                <a
                  href="mailto:support@sglifeguardservices.com"
                  className="flex items-center gap-3 text-[#FF6633] hover:text-[#e55a2b] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">
                    sales@sglifeguardservices.com
                  </span>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#20334F] mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#FF6633]" />
                Quick Actions
              </h3>
              <p className="text-gray-600 mb-6">
                Need another booking or want to explore our other services?
              </p>

              <div className="space-y-4">
                <Link
                  href="/booking"
                  className="block w-full bg-[#FF6633] text-white text-center py-3 px-6 rounded-xl font-semibold hover:bg-[#e55a2b] transition-colors"
                >
                  Book Another Service
                </Link>

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 text-[#20334F] py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg">
              <div className="w-12 h-12 bg-[#FF6633] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-[#20334F]">
                  Professional Lifeguard Services
                </div>
                <div className="text-sm text-gray-600">
                  Keeping Singapore's waters safe since 2017
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
