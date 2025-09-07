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
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-emerald-300 font-semibold">Payment Confirmed</p>
            <p className="text-emerald-200/70 text-sm">
              Email sent to customer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      >
        Confirm Payment & Send Email
      </button>

      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20 overflow-y-auto max-h-[90vh]">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm Payment
                </h3>
                <p className="text-white/70 leading-relaxed">
                  This action is{" "}
                  <span className="text-red-300 font-semibold">
                    irreversible
                  </span>
                  . A payment confirmation email will be automatically sent to
                  the customer.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Customer:</span>
                    <span className="text-white font-semibold">
                      {booking.customer_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Amount:</span>
                    <span className="text-emerald-300 font-bold">
                      ${booking.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Order:</span>
                    <span className="text-white font-mono">
                      #{booking.order_id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                >
                  {processing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm & Send Email"
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
