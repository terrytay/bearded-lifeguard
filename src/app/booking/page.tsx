"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Download,
  Users,
} from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { NumberInput } from "@/components/ui/NumberInput";

type OrderResponse = {
  orderId: string;
  amount: number;
  paynow: { payload: string; qrDataUrl: string };
  name: string;
  email: string;
  lifeguards: number;
  phone?: string;
  startISO?: string;
  endISO?: string;
  hours: number;
};

// ---------- Pricing helpers (client preview only; server is source-of-truth)
function computeRate(hours: number) {
  if (hours < 4) return 50;
  if (hours === 4) return 30;
  if (hours === 5) return 25;
  return 21; // >= 6 hrs
}
function computeBase(hours: number) {
  return computeRate(hours) * hours;
}
// Match server thresholds
function lastMinuteMultiplier(days: number) {
  if (days < 1) return 2.0; // +100%
  if (days < 2) return 1.4; // +40%
  if (days < 7) return 1.2; // +20%
  return 1.0; // standard
}
function lastMinuteLabel(days: number | null) {
  if (days == null) return "-";
  if (days < 1) return "Less than 1 day (+100%)";
  if (days < 2) return "Less than 2 days (+40%)";
  if (days < 7) return "Less than 1 week (+20%)";
  return "Standard rate";
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(n);
}
function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
// Now, rounded up to next 15 minutes
function nowRounded15() {
  const d = new Date();
  const ms = 1000 * 60 * 15;
  return new Date(Math.ceil(d.getTime() / ms) * ms);
}
// Friendly lead-time text
function formatLeadTime(days: number | null) {
  if (days == null) return "-";
  if (days >= 2) return `${days.toFixed(2)} days`;
  const hours = days * 24;
  if (hours >= 2) return `${hours.toFixed(1)} hours`;
  const mins = hours * 60;
  return `${Math.max(1, Math.round(mins))} minutes`;
}

export default function BookingPage() {
  const r = useRouter();

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [start, setStart] = useState<string>(""); // datetime-local
  const [end, setEnd] = useState<string>(""); // datetime-local
  const [lifeguards, setLifeguards] = useState(1); // number of lifeguards needed
  const [serviceType, setServiceType] = useState(""); // service type selection
  const [customService, setCustomService] = useState(""); // custom service description
  const [remarks, setRemarks] = useState(""); // optional remarks from user

  // ui state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // Focus management
  const formRef = useRef<HTMLDivElement>(null);

  // validation
  const emailOk = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
  const phoneSanitized = useMemo(() => phone.replace(/\s|-/g, ""), [phone]);
  const phoneOk = useMemo(() => {
    if (/^\+65\d{8}$/.test(phoneSanitized)) return true; // typical SG
    return /^\+?\d{8,15}$/.test(phoneSanitized);
  }, [phoneSanitized]);
  const nameOk = useMemo(() => name.trim().length >= 2, [name]);

  // min datetime for start (now rounded)
  const minStartDate = useMemo(() => nowRounded15(), []);
  const minStart = useMemo(
    () => toLocalInputValue(minStartDate),
    [minStartDate]
  );

  // time calculations
  const startDate = useMemo(() => (start ? new Date(start) : null), [start]);
  const endDate = useMemo(() => (end ? new Date(end) : null), [end]);

  // keep end >= start in UI hints - allow same day but ensure end time is after start time
  const minEnd = useMemo(() => {
    if (startDate) {
      // If we have a start date, use the same date as minimum for end date
      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      return toLocalInputValue(startDateOnly);
    }
    // If no start date selected, use the minimum start date
    return toLocalInputValue(minStartDate);
  }, [startDate, minStartDate]);

  const timeOk =
    !!startDate && !!endDate && endDate.getTime() > startDate.getTime();
  useEffect(() => {
    if (startDate && endDate && endDate <= startDate) setEnd("");
  }, [startDate, endDate]);

  const diffHoursRaw = useMemo(() => {
    if (!timeOk || !startDate || !endDate) return 0;
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  }, [timeOk, startDate, endDate]);

  // billable hours rounded UP to next full hour, min 1
  const hours = useMemo(
    () => Math.max(1, Math.ceil(diffHoursRaw)),
    [diffHoursRaw]
  );
  const rate = useMemo(() => computeRate(hours), [hours]);
  const baseSubtotal = useMemo(() => computeBase(hours), [hours]); // per lifeguard
  const subtotal = useMemo(
    () => baseSubtotal * lifeguards,
    [baseSubtotal, lifeguards]
  ); // total for all lifeguards
  const rawHoursText = useMemo(
    () => (!timeOk || !startDate || !endDate ? "-" : diffHoursRaw.toFixed(2)),
    [timeOk, startDate, endDate, diffHoursRaw]
  );
  const roundingNote = useMemo(() => {
    if (!timeOk) return null;
    const rounded = Math.ceil(diffHoursRaw);
    if (rounded <= 1 && diffHoursRaw < 1) {
      return `Min 1 hr rule: rounded up from ${diffHoursRaw.toFixed(2)}h to 1h`;
    }
    if (Math.abs(rounded - diffHoursRaw) < 1e-9) return "No rounding applied";
    return `Rounded up from ${diffHoursRaw.toFixed(2)}h to ${rounded}h`;
  }, [timeOk, diffHoursRaw]);
  const tierLabel = useMemo(() => {
    if (hours < 4) return "< 4 hrs tier";
    if (hours === 4) return "4-hr package";
    if (hours === 5) return "5-hr package";
    return "6+ hrs rate";
  }, [hours]);

  // lead time & last-minute
  const noticeDays = useMemo(() => {
    if (!startDate) return null;
    const now = new Date();
    return Math.max(
      0,
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [startDate]);
  const lmMult = useMemo(
    () => (noticeDays == null ? 1 : lastMinuteMultiplier(noticeDays)),
    [noticeDays]
  );
  const lmLabel = useMemo(() => lastMinuteLabel(noticeDays), [noticeDays]);
  const surcharge = useMemo(() => subtotal * (lmMult - 1), [subtotal, lmMult]);
  const estTotal = useMemo(() => subtotal * lmMult, [subtotal, lmMult]);
  const noticeDaysText = useMemo(
    () => formatLeadTime(noticeDays),
    [noticeDays]
  );

  const serviceOk =
    serviceType &&
    (serviceType !== "others" || customService.trim().length >= 3);
  const formOk =
    nameOk && phoneOk && emailOk && timeOk && serviceOk && !creating;
  const showSummary = timeOk;

  function markTouched(k: string) {
    setTouched((t) => ({ ...t, [k]: true }));
  }

  // QR modal: focus first action
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (showQR) closeBtnRef.current?.focus();
  }, [showQR]);

  async function onPaid() {
    if (!order || paying) return;
    setPaying(true);

    try {
      // Send confirmation email using Nodemailer
      await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phoneSanitized,
          orderId: order.orderId,
          startDateTime: startDate?.toLocaleString("en-SG"),
          endDateTime: endDate?.toLocaleString("en-SG"),
          hours,
          rate: formatCurrency(rate),
          subtotal: formatCurrency(subtotal),
          surcharge: formatCurrency(surcharge),
          totalAmount: formatCurrency(order.amount),
          leadTime: formatLeadTime(noticeDays),
          lastMinuteLabel: lmLabel,
          lifeguards,
          serviceType,
          customService: serviceType === "others" ? customService.trim() : "",
          remarks: remarks.trim(),
        }),
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      // Continue anyway - don't block the user flow
    }

    r.push(
      `/thank-you?order=${encodeURIComponent(
        order.orderId
      )}&amount=${order.amount.toFixed(2)}`
    );
  }

  async function onConfirm() {
    if (!formOk) {
      setTouched({
        name: true,
        phone: true,
        email: true,
        start: true,
        end: true,
        serviceType: true,
      });
      return;
    }
    setError(null);
    setCreating(true);

    try {
      // send server the same lead-time context it expects
      const body = {
        name: name.trim(),
        email: email.trim(),
        phone: phoneSanitized,
        hours,
        startISO: startDate!.toISOString(),
        endISO: endDate!.toISOString(),
        dateISO: startDate!.toISOString(), // server reads dateISO
        noticeDays: noticeDays ?? 14, // server default is 14
        lifeguards,
        serviceType,
        customService: serviceType === "others" ? customService.trim() : "",
        remarks: remarks.trim(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Order failed (${res.status})`);
      }

      const data: OrderResponse = await res.json();
      setOrder(data);
      setShowQR(true);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6633' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Professional Lifeguard Booking
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#20334F] mb-4">
            Book Your Lifeguard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure certified lifeguard services with our streamlined booking
            process. Get instant quotes and pay securely with PayNow.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Form */}
          <section className="lg:col-span-2 relative z-50">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
              ref={formRef}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#20334F] mb-2">
                  Booking Details
                </h2>
                <p className="text-gray-600">
                  Please fill in your information and select your preferred time
                  slots.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <FormField
                  label="Full Name"
                  required
                  error={
                    touched.name && !nameOk
                      ? "Please enter your full name (minimum 2 characters)"
                      : undefined
                  }
                >
                  <Input
                    icon={<User size={16} />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => markTouched("name")}
                    placeholder="Enter your full name"
                    error={touched.name && !nameOk}
                    autoComplete="name"
                  />
                </FormField>

                {/* Phone */}
                <FormField
                  label="Contact Number"
                  required
                  error={
                    touched.phone && !phoneOk
                      ? "Please enter a valid phone number"
                      : undefined
                  }
                >
                  <Input
                    icon={<Phone size={16} />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="+65 9XXX XXXX"
                    error={touched.phone && !phoneOk}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </FormField>
              </div>

              {/* Email */}
              <div className="mb-8">
                <FormField
                  label="Email Address"
                  required
                  description="We'll send your booking confirmation to this email"
                  error={
                    touched.email && !emailOk
                      ? "Please enter a valid email address"
                      : undefined
                  }
                >
                  <Input
                    icon={<Mail size={16} />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="your@email.com"
                    error={touched.email && !emailOk}
                    autoComplete="email"
                  />
                </FormField>
              </div>

              {/* Service Type Selection */}
              <div className="mb-8">
                <FormField
                  label="Service Type"
                  required
                  description="What type of lifeguard service do you need?"
                  error={
                    touched.serviceType && !serviceOk
                      ? "Please select a service type"
                      : undefined
                  }
                >
                  <div className="space-y-4">
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      onBlur={() => markTouched("serviceType")}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 bg-white ${
                        touched.serviceType && !serviceOk
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#FF6633] hover:border-gray-300"
                      }`}
                    >
                      <option value="">Select service type...</option>
                      <option value="pools">Pool Lifeguarding</option>
                      <option value="events">Event Lifeguarding</option>
                      <option value="pool-parties">
                        Pool Party Lifeguarding
                      </option>
                      <option value="open-water">
                        Open Water Lifeguarding
                      </option>
                      <option value="others">Others (Please specify)</option>
                    </select>

                    {serviceType === "others" && (
                      <div className="mt-4">
                        <textarea
                          value={customService}
                          onChange={(e) => setCustomService(e.target.value)}
                          onBlur={() => markTouched("serviceType")}
                          placeholder="Please describe your specific lifeguard service needs..."
                          rows={3}
                          className={`w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 bg-white placeholder:text-gray-400 resize-y ${
                            touched.serviceType &&
                            serviceType === "others" &&
                            customService.trim().length < 3
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-[#FF6633] hover:border-gray-300"
                          }`}
                        />
                        {touched.serviceType &&
                          serviceType === "others" &&
                          customService.trim().length < 3 && (
                            <div className="mt-2 text-sm text-red-600">
                              Please provide at least 3 characters describing
                              your service needs
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </FormField>
              </div>

              {/* Number of Lifeguards */}
              <div className="mb-8">
                <FormField
                  label="Number of Lifeguards Required"
                  required
                  description="Professional certified lifeguards for your event"
                >
                  <NumberInput
                    value={lifeguards}
                    onChange={setLifeguards}
                    min={1}
                    max={1000}
                    label={`lifeguard${lifeguards > 1 ? "s" : ""}`}
                    icon={<Users size={16} />}
                  />
                </FormField>
              </div>

              {/* Optional Remarks */}
              <div className="mb-8">
                <FormField
                  label="Additional Remarks (Optional)"
                  description="Any special requirements or notes for your booking"
                >
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g., Special safety requirements, accessibility needs, event details..."
                    rows={4}
                    className="w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 bg-white placeholder:text-gray-400 resize-y border-gray-200 focus:border-[#FF6633] hover:border-gray-300"
                  />
                </FormField>
              </div>

              {/* Date & Time Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Start */}
                <FormField
                  label="Start Date & Time"
                  required
                  error={
                    touched.start && !startDate
                      ? "Please select a start date and time"
                      : undefined
                  }
                >
                  <DateTimePicker
                    value={start}
                    onChange={setStart}
                    min={minStart}
                    label="Start"
                    error={touched.start && !startDate}
                    onBlur={() => markTouched("start")}
                  />
                </FormField>

                {/* End */}
                <FormField
                  label="End Date & Time"
                  required
                  error={
                    touched.end && (!endDate || !timeOk)
                      ? "End time must be after start time"
                      : undefined
                  }
                >
                  <DateTimePicker
                    value={end}
                    onChange={setEnd}
                    min={minEnd}
                    label="End"
                    error={touched.end && (!endDate || !timeOk)}
                    onBlur={() => markTouched("end")}
                  />
                </FormField>
              </div>

              {/* Billing Info */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Billing Information
                    </h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      • Billing rounds up to the next whole hour (minimum 1
                      hour)
                      <br />
                      • Rates: &lt;4hrs $50/hr • 4hrs $30/hr • 5hrs $25/hr •
                      6+hrs $21/hr
                      <br />• Last-minute bookings: +20% (&lt;1 week), +40%
                      (&lt;2 days), +100% (&lt;1 day)
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">
                        Booking Error
                      </h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={onConfirm}
                  disabled={!formOk}
                  aria-busy={creating}
                  className={`flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                    formOk
                      ? "bg-gradient-to-r from-[#FF6633] to-[#e55a2b] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {creating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preparing PayNow QR
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Confirm & Pay with PayNow
                    </>
                  )}
                </button>
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  <p className="font-medium">Secure Payment</p>
                  <p>PayNow QR • Instant confirmation</p>
                </div>
              </div>
            </div>
          </section>

          {/* Live Summary – only shows after both dates are valid */}
          {showSummary && (
            <aside className="lg:sticky lg:top-24 h-fit z-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#20334F]">
                    Booking Summary
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      lmMult > 1
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {lmMult > 1 ? (
                      <>
                        <AlertCircle size={12} />
                        Last-minute
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        Standard rate
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Service Period
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">
                          {startDate?.toLocaleString("en-SG")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End:</span>
                        <span className="font-medium">
                          {endDate?.toLocaleString("en-SG")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {rawHoursText} hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billed:</span>
                        <span className="font-medium">{hours} hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Pricing Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Rate ({tierLabel}):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(rate)}/hr
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours billed:</span>
                        <span className="font-medium">{hours} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Base cost (1 lifeguard):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(baseSubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Number of lifeguards:
                        </span>
                        <span className="font-medium">
                          {lifeguards} lifeguard{lifeguards > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lead time:</span>
                        <span className="font-medium">{noticeDaysText}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surcharge:</span>
                        <span
                          className={`font-medium ${
                            surcharge > 0 ? "text-orange-600" : ""
                          }`}
                        >
                          {formatCurrency(surcharge)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-[#FF6633] to-[#e55a2b] rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(estTotal)}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 mt-1">
                      Final amount confirmed on PayNow QR
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {showQR && order && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-title"
          onKeyDown={(e) => e.key === "Escape" && setShowQR(false)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3
                id="qr-title"
                className="text-2xl font-bold text-[#20334F] mb-2"
              >
                Payment QR Code
              </h3>
              <p className="text-gray-600">
                Order <span className="font-semibold">{order.orderId}</span> •{" "}
                {formatCurrency(order.amount)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <img
                src={order.paynow.qrDataUrl}
                alt={`PayNow QR for order ${order.orderId}`}
                className="w-full max-w-xs mx-auto rounded-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                ref={closeBtnRef}
                onClick={() => setShowQR(false)}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={order.paynow.qrDataUrl}
                download={`PayNow-${order.orderId}.png`}
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-center inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR
              </a>
              <button
                type="button"
                onClick={onPaid}
                disabled={paying}
                aria-busy={paying}
                className={`flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6633] to-[#e55a2b] text-white rounded-xl font-semibold transition-all ${
                  paying ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                }`}
              >
                {paying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                    Processing...
                  </>
                ) : (
                  "I've Paid"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
