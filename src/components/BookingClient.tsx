"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// You’ll install this lib (see notes below). It builds a valid PayNow QR payload.
import PaynowQR from "paynowqr";
// We'll render the QR from the payload into a DataURL
import QRCode from "qrcode";

type Props = { initialRef: string; createdAt: string };

type Tier = {
  label: string;
  hourly: number;
  condition: (billedHours: number) => boolean;
};

// billing tiers interpreted as: ≤3h, =4h, =5h, ≥6h (we bill by whole hour, rounded up)
const TIERS: Tier[] = [
  { label: "< 4 hours", hourly: 50, condition: (h) => h <= 3 },
  { label: "4 hours", hourly: 30, condition: (h) => h === 4 },
  { label: "5 hours", hourly: 25, condition: (h) => h === 5 },
  { label: "6+ hours", hourly: 21, condition: (h) => h >= 6 },
];

function pickTier(billedHours: number): Tier {
  return TIERS.find((t) => t.condition(billedHours)) ?? TIERS[TIERS.length - 1];
}

function leadTimeSurchargeMultiplier(daysDiff: number) {
  // Last minute request surcharges (choose the highest applicable)
  if (daysDiff < 1) return 2.0; // +100%
  if (daysDiff < 2) return 1.4; // +40%
  if (daysDiff < 7) return 1.2; // +20%
  return 1.0; // no surcharge
}

function daysBetween(now: Date, then: Date) {
  return (then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
}

export default function BookingClient({ initialRef, createdAt }: Props) {
  // config: set this in your .env.local (see notes)
  const PAYNOW_UEN = process.env.NEXT_PUBLIC_PAYNOW_UEN || ""; // e.g. "201403121W"
  const PAYNOW_COMPANY =
    process.env.NEXT_PUBLIC_PAYNOW_COMPANY || "Bearded Lifeguard";

  // form state
  const [guards, setGuards] = useState(1);
  const [hours, setHours] = useState(4);
  const [start, setStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // default 2 weeks ahead (as requested)
    d.setMinutes(0);
    d.setSeconds(0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [ref, setRef] = useState(initialRef);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const billedHours = useMemo(() => Math.max(1, Math.ceil(hours)), [hours]);
  const tier = useMemo(() => pickTier(billedHours), [billedHours]);

  const now = new Date();
  const startDate = new Date(start);
  const daysLead = daysBetween(now, startDate);
  const multiplier = leadTimeSurchargeMultiplier(daysLead);

  const baseSubtotal = tier.hourly * billedHours * guards;
  const total = Math.round(baseSubtotal * multiplier * 100) / 100;

  useEffect(() => {
    let ignore = false;

    async function makeQR() {
      if (!PAYNOW_UEN || total <= 0) {
        setQrDataUrl("");
        return;
      }

      // expiry — optional; set to event date (YYYYMMDD)
      const y = startDate.getFullYear();
      const m = String(startDate.getMonth() + 1).padStart(2, "0");
      const d = String(startDate.getDate()).padStart(2, "0");
      const expiry = `${y}${m}${d}`;

      // Build PayNow payload (library handles TLV + CRC)
      // Ref: paynowqr (open-source) usage
      const payload = new PaynowQR({
        uen: PAYNOW_UEN,
        amount: total, // fixed amount
        editable: false, // lock the amount
        expiry, // optional
        refNumber: ref, // your reconciliation ID
        company: PAYNOW_COMPANY, // label
      }).output();

      // Render the payload to a QR image
      const dataUrl = await QRCode.toDataURL(payload, {
        margin: 1,
        scale: 8,
        errorCorrectionLevel: "M",
      });

      if (!ignore) setQrDataUrl(dataUrl);
    }

    makeQR();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PAYNOW_UEN, PAYNOW_COMPANY, total, ref, start]);

  const multiplierLabel =
    multiplier === 2
      ? "Last-minute (< 1 day) +100%"
      : multiplier === 1.4
      ? "Urgent (< 2 days) +40%"
      : multiplier === 1.2
      ? "Short notice (< 1 week) +20%"
      : "Planned (≥ 1 week)";

  const plannedOk = daysLead >= 14;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#20334F]">
        Book Lifeguard Services
      </h1>
      <p className="mt-2 text-gray-600">
        Duty should be planned 2 weeks in advance. Surcharges apply for urgent
        bookings.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm font-medium text-[#20334F]">
                Event start (date & time)
              </span>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
              />
              {!plannedOk && (
                <span className="mt-1 block text-xs text-amber-600">
                  Heads up: less than 14 days lead time.
                </span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#20334F]">
                Number of lifeguards
              </span>
              <input
                type="number"
                min={1}
                value={guards}
                onChange={(e) => setGuards(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#20334F]">
                Duty hours
              </span>
              <input
                type="number"
                step={0.5}
                min={1}
                value={hours}
                onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
              />
              <span className="mt-1 block text-xs text-gray-500">
                We bill whole hours (rounded up): {billedHours}h
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#20334F]">
                Payment reference
              </span>
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
              />
              <span className="mt-1 block text-xs text-gray-500">
                This appears in your PayNow transfer.
              </span>
            </label>
          </div>

          {/* Price breakdown */}
          <div className="mt-6 rounded-xl bg-orange-50 ring-1 ring-orange-100 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#20334F]">Tier</span>
              <span className="font-medium">
                {tier.label} — ${tier.hourly}/hr
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[#20334F]">Base subtotal</span>
              <span className="font-medium">
                ${tier.hourly} × {billedHours}h × {guards} guard(s) = $
                {baseSubtotal.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[#20334F]">Lead time</span>
              <span className="font-medium">
                {multiplierLabel}{" "}
                {multiplier > 1 ? `× ${multiplier.toFixed(2)}` : ""}
              </span>
            </div>
            <div className="mt-3 border-t border-orange-100 pt-3 flex items-center justify-between">
              <span className="text-base font-semibold text-[#20334F]">
                Total
              </span>
              <span className="text-lg font-bold text-[#20334F]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {!process.env.NEXT_PUBLIC_PAYNOW_UEN && (
            <p className="mt-3 text-sm text-amber-600">
              Set <code className="font-mono">NEXT_PUBLIC_PAYNOW_UEN</code> in{" "}
              <code>.env.local</code> to generate your PayNow QR.
            </p>
          )}
        </section>

        {/* QR & instructions */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#20334F]">PayNow</h2>
          <p className="mt-1 text-sm text-gray-600">
            Scan the QR with your banking app to pay{" "}
            <span className="font-medium">{PAYNOW_COMPANY}</span>.
          </p>

          <div className="mt-4 flex items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="PayNow QR"
                width={260}
                height={260}
                className="h-[260px] w-[260px]"
              />
            ) : (
              <div className="text-sm text-gray-500">QR will appear here</div>
            )}
          </div>

          <ul className="mt-4 text-xs text-gray-500 space-y-2 list-disc pl-5">
            <li>
              Ensure the amount and reference “{ref}” look correct before
              confirming.
            </li>
            <li>Keep your payment confirmation for our reconciliation.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
