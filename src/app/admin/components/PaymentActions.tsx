import { useState } from "react";
import { createPortal } from "react-dom";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Booking {
  id: string;
  order_id: string;
  customer_name: string;
  amount: number;
  payment_status: string;
}

interface PaymentActionsProps {
  booking: Booking;
  onUpdate: (id: string, updates: any) => void;
}

export default function PaymentActions({
  booking,
  onUpdate,
}: PaymentActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    setProcessing(true);
    await onUpdate(booking.id, {
      action: "update_payment_status",
      payment_status: "paid",
      status: "confirmed",
      send_email: true,
    });
    setProcessing(false);
    setShowConfirm(false);
  };

  if (booking.payment_status === "paid") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/80 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-emerald-200 font-semibold text-sm">
            Payment confirmed
          </p>
          <p className="text-emerald-200/60 text-xs">Email sent to customer</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 px-6 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold transition-all shadow-lg shadow-emerald-500/20 min-h-[48px]"
      >
        Confirm payment &amp; send email
      </button>

      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto font-mono">
            <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] console-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-amber-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Confirm payment
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  This is{" "}
                  <span className="text-rose-300 font-semibold">irreversible</span>
                  . A confirmation email will be sent to the customer.
                </p>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-6 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Customer</span>
                  <span className="text-white font-semibold">
                    {booking.customer_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Amount</span>
                  <span className="text-emerald-300 font-bold tabular-nums">
                    ${booking.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Order</span>
                  <span className="text-white tabular-nums">
                    #{booking.order_id}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl font-medium transition-all border border-white/15 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 min-h-[48px]"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing…</span>
                    </span>
                  ) : (
                    "Confirm & send"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
