import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Booking {
  id: string;
  order_id: string;
  customer_email: string;
  status: string;
  viewed_by_admin: boolean;
}

interface StatusActionsProps {
  booking: Booking;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export default function StatusActions({ booking, onUpdate, onDelete }: StatusActionsProps) {
  const handleStatusChange = (newStatus: string) => {
    onUpdate(booking.id, { status: newStatus });
  };

  const handleViewedToggle = () => {
    onUpdate(booking.id, {
      action: booking.viewed_by_admin ? "mark_unviewed" : "mark_viewed",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      {/* View Status */}
      <button
        onClick={handleViewedToggle}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all font-semibold flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
      >
        {booking.viewed_by_admin ? (
          <>
            <EyeSlashIcon className="w-5 h-5" />
            <span>Mark as New</span>
          </>
        ) : (
          <>
            <EyeIcon className="w-5 h-5" />
            <span>Mark as Viewed</span>
          </>
        )}
      </button>

      {/* Status Change */}
      <div className="relative">
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleStatusChange(e.target.value);
              e.target.value = "";
            }
          }}
          defaultValue=""
          className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 appearance-none text-white backdrop-blur-sm font-medium"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff70' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em'
          }}
        >
          <option value="" className="bg-slate-800 text-white">Change Booking Status</option>
          <option value="pending" className="bg-slate-800 text-white">📋 Pending Review</option>
          <option value="confirmed" className="bg-slate-800 text-white">✅ Confirmed</option>
          <option value="completed" className="bg-slate-800 text-white">🎉 Completed</option>
          <option value="cancelled" className="bg-slate-800 text-white">❌ Cancelled</option>
        </select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => copyToClipboard(booking.customer_email)}
          className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-all hover:scale-105"
        >
          Copy Email
        </button>
        <button
          onClick={() => copyToClipboard(booking.order_id)}
          className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-all hover:scale-105"
        >
          Copy Order ID
        </button>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => onDelete(booking.id)}
          className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete Booking Forever</span>
        </button>
        <p className="text-red-300/80 text-xs text-center mt-2">
          This action cannot be undone
        </p>
      </div>
    </div>
  );
}