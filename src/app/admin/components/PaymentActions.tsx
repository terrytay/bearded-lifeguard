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
      <div className="bg-sea/10 border border-sea/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-sea rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sea font-semibold text-sm">Payment confirmed</p>
          <p className="text-ink-soft text-xs">Email sent to customer</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 px-6 bg-sea text-white rounded-xl hover:brightness-110 font-semibold transition-all min-h-[48px]"
      >
        Confirm payment &amp; send email
      </button>

      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm overflow-y-auto font-sans text-ink">
            <div className="bg-paper border-2 border-ink rounded-3xl max-w-md w-full p-6 md:p-8 shadow-[8px_8px_0_0_var(--color-ink)] overflow-y-auto max-h-[90vh] console-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-ochre/15 border border-ochre/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-ochre" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">
                  Confirm payment
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  This is{" "}
                  <span className="text-signal font-semibold">irreversible</span>
                  . A confirmation email will be sent to the customer.
                </p>
              </div>

              <div className="bg-white border border-ink/15 rounded-2xl p-4 mb-6 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft">Customer</span>
                  <span className="text-ink font-semibold">
                    {booking.customer_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft">Amount</span>
                  <span className="font-display text-sea font-semibold tabular-nums">
                    ${booking.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-soft">Order</span>
                  <span className="text-ink tabular-nums">
                    #{booking.order_id}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 px-4 border border-ink/25 text-ink hover:bg-ink hover:text-paper rounded-xl font-medium transition-all min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="flex-1 py-3 px-4 bg-sea text-white rounded-xl hover:brightness-110 font-semibold disabled:opacity-50 transition-all min-h-[48px]"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
