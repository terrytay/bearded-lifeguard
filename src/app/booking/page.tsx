"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "emailjs-com";

type OrderResponse = {
  orderId: string;
  amount: number;
  paynow: { payload: string; qrDataUrl: string };
  name: string;
  email: string;
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

  // ui state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // EmailJS init guard
  const emailInitRef = useRef(false);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY && !emailInitRef.current) {
      try {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
        emailInitRef.current = true;
      } catch {
        // ignore
      }
    }
  }, []);

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

  // keep end >= start in UI hints
  const minEnd = useMemo(() => {
    const base = startDate ?? minStartDate;
    return toLocalInputValue(new Date(base.getTime() + 15 * 60 * 1000));
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
  const subtotal = useMemo(() => computeBase(hours), [hours]); // before last-minute
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

  const formOk = nameOk && phoneOk && emailOk && timeOk && !creating;
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
      if (
        emailInitRef.current &&
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      ) {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            // recipient
            to_email: email,
            to_name: name || "Customer",

            // booking
            order_id: order.orderId,
            start_at: startDate?.toLocaleString("en-SG"),
            end_at: endDate?.toLocaleString("en-SG"),

            // contact
            phone: phoneSanitized,

            // pricing (client-estimated)
            raw_hours: timeOk ? diffHoursRaw.toFixed(2) : "0.00",
            rounding_note: roundingNote || "N/A",
            billed_hours: String(hours),
            tier_label: tierLabel,
            rate_applied: `${formatCurrency(rate)}/hr`,
            estimated_subtotal: formatCurrency(subtotal),

            // last-minute
            notice_days:
              noticeDays == null
                ? "N/A"
                : noticeDays >= 2
                ? noticeDays.toFixed(2)
                : (noticeDays * 24).toFixed(1) + " hours",
            last_minute_label: lmLabel,
            last_minute_multiplier: lmMult.toFixed(2),
            last_minute_surcharge: formatCurrency(surcharge),
            client_est_total: formatCurrency(estTotal),

            // server-confirmed
            final_amount: formatCurrency(order.amount),
          }
        );
      }
    } catch {
      // non-blocking
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
    <main className="relative">
      {/* Soft background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#20334F]">
            Book Lifeguard Services
          </h1>
          <p className="mt-2 text-slate-600">
            Pick your start and end time. You’ll get a PayNow QR for payment
            after you have confirmed.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Form */}
          <section className="md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Name */}
                <label className="block">
                  <span className="text-sm font-medium text-[#20334F]">
                    Full name
                  </span>
                  <input
                    className={`mt-1 w-full rounded-xl border p-2.5 outline-none transition
                    ${
                      touched.name && !nameOk
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-slate-300 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20"
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => markTouched("name")}
                    placeholder="Jane Tan"
                    required
                    autoComplete="name"
                    aria-invalid={touched.name && !nameOk}
                  />
                  {touched.name && !nameOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Please enter your name (min 2 characters).
                    </p>
                  )}
                </label>

                {/* Phone */}
                <label className="block">
                  <span className="text-sm font-medium text-[#20334F]">
                    Contact number
                  </span>
                  <input
                    className={`mt-1 w-full rounded-xl border p-2.5 outline-none transition
                    ${
                      touched.phone && !phoneOk
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-slate-300 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20"
                    }`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="+65 9XXXXXXX"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={touched.phone && !phoneOk}
                  />
                  {touched.phone && !phoneOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Enter a valid phone (8–15 digits, “+65” allowed).
                    </p>
                  )}
                </label>

                {/* Email */}
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-[#20334F]">
                    Email
                  </span>
                  <input
                    type="email"
                    className={`mt-1 w-full rounded-xl border p-2.5 outline-none transition
                    ${
                      touched.email && !emailOk
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-slate-300 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                    aria-invalid={touched.email && !emailOk}
                  />
                  {touched.email && !emailOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Please enter a valid email.
                    </p>
                  )}
                </label>

                {/* Start */}
                <label className="block">
                  <span className="text-sm font-medium text-[#20334F]">
                    Start (date &amp; time)
                  </span>
                  <input
                    type="datetime-local"
                    className={`mt-1 w-full rounded-xl border p-2.5 outline-none transition
                    ${
                      touched.start && !startDate
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-slate-300 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20"
                    }`}
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    onBlur={() => markTouched("start")}
                    required
                    min={minStart}
                    step={900}
                    aria-invalid={touched.start && !startDate}
                  />
                  {touched.start && !startDate && (
                    <p className="mt-1 text-xs text-red-600">
                      Please select a start date & time.
                    </p>
                  )}
                </label>

                {/* End */}
                <label className="block">
                  <span className="text-sm font-medium text-[#20334F]">
                    End (date &amp; time)
                  </span>
                  <input
                    type="datetime-local"
                    className={`mt-1 w-full rounded-xl border p-2.5 outline-none transition
                    ${
                      touched.end && (!endDate || !timeOk)
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-slate-300 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20"
                    }`}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    onBlur={() => markTouched("end")}
                    required
                    min={minEnd}
                    step={900}
                    aria-invalid={touched.end && (!endDate || !timeOk)}
                  />
                  {touched.end && (!endDate || !timeOk) && (
                    <p className="mt-1 text-xs text-red-600">
                      End must be after the start.
                    </p>
                  )}
                </label>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Billing is rounded up to the next whole hour (min 1 hr).
              </p>

              {error && (
                <div
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Confirm */}
              <div className="mt-6">
                <button
                  onClick={onConfirm}
                  disabled={!formOk}
                  aria-busy={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6633] px-5 py-3 text-white font-medium shadow hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity="0.25"
                        />
                        <path
                          d="M22 12a10 10 0 0 1-10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Preparing your PayNow QR…
                    </>
                  ) : (
                    "Confirm & Pay (PayNow QR)"
                  )}
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  The PayNow QR will appear after confirmation. You can download
                  it to save/scan.
                </p>
              </div>

              {/* How we charge – always visible (transparent rules) */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                <h3 className="font-semibold text-[#20334F]">How we charge</h3>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>
                    Billing rounds up to the next whole hour (minimum 1 hour).
                  </li>
                  <li>
                    <span className="font-medium">Rates:</span> &lt;4 hrs:{" "}
                    <span className="font-mono">$50/hr</span>, 4 hrs:{" "}
                    <span className="font-mono">$30/hr</span>, 5 hrs:{" "}
                    <span className="font-mono">$25/hr</span>, 6+ hrs:{" "}
                    <span className="font-mono">$21/hr</span>.
                  </li>
                  <li>
                    <span className="font-medium">Last-minute factor:</span>{" "}
                    &lt;1 week +20%, &lt;2 days +40%, &lt;1 day +100%.
                  </li>
                  <li>
                    Final amount is server-confirmed on your PayNow QR. No
                    hidden fees.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Live Summary – only shows after both dates are valid */}
          {showSummary && (
            <aside className="md:sticky md:top-24 h-fit">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#20334F]">
                    Your Summary
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      lmMult > 1
                        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {lmMult > 1 ? "Last-minute applied" : "Standard rate"}
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt>Start</dt>
                    <dd>{startDate?.toLocaleString("en-SG")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>End</dt>
                    <dd>{endDate?.toLocaleString("en-SG")}</dd>
                  </div>

                  <div className="border-t my-3" />

                  <div className="flex justify-between">
                    <dt>Raw duration</dt>
                    <dd>{rawHoursText} h</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Rounding</dt>
                    <dd>{roundingNote}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Billable hours</dt>
                    <dd>{hours}</dd>
                  </div>

                  <div className="border-t my-3" />

                  <div className="flex justify-between">
                    <dt>Pricing tier</dt>
                    <dd>{tierLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Rate applied</dt>
                    <dd>{formatCurrency(rate)}/hr</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Estimated subtotal</dt>
                    <dd>{formatCurrency(subtotal)}</dd>
                  </div>

                  <div className="border-t my-3" />

                  <div className="flex justify-between">
                    <dt>Lead time</dt>
                    <dd>{noticeDaysText}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Last-minute factor</dt>
                    <dd>{lmLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Last-minute surcharge</dt>
                    <dd>{formatCurrency(surcharge)}</dd>
                  </div>

                  <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-[#20334F]">
                    <dt>Estimated total</dt>
                    <dd>{formatCurrency(estTotal)}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* QR Modal — scrollable on mobile, sits above navbar */}
      {showQR && order && (
        <div
          className="fixed inset-0 z-[9999] h-dvh w-full p-4 pt-20 flex items-start justify-center overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-title"
          onKeyDown={(e) => e.key === "Escape" && setShowQR(false)}
        >
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowQR(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg max-h-[calc(100dvh-6rem)] overflow-auto">
            <h3 id="qr-title" className="text-lg font-semibold text-[#20334F]">
              Scan to Pay (PayNow)
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Order <strong>{order.orderId}</strong> — Amount{" "}
              <strong>{formatCurrency(order.amount)}</strong>
            </p>
            <img
              src={order.paynow.qrDataUrl}
              alt={`PayNow QR for order ${order.orderId}`}
              className="mt-4 mx-auto rounded-lg border max-h-[70svh] w-auto h-auto object-contain"
            />
            <div className="mt-4 flex items-center justify-between">
              <a
                href={order.paynow.qrDataUrl}
                download={`PayNow-${order.orderId}.png`}
                className="text-sm underline"
              >
                Download QR
              </a>
              <div className="space-x-2">
                <button
                  ref={closeBtnRef}
                  onClick={() => setShowQR(false)}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onPaid}
                  disabled={paying}
                  aria-busy={paying}
                  className={`rounded-lg bg-[#FF6633] px-3 py-1.5 text-white text-sm ${
                    paying ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {paying ? "Processing…" : "I’ve paid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
