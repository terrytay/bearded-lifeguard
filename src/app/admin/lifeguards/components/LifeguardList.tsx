"use client";

import {
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { SingaporeTime } from "@/lib/singapore-time";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LifeguardListProps {
  lifeguards: Lifeguard[];
  onEdit: (lifeguard: Lifeguard) => void;
  onDelete: (id: string) => void;
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
        active
          ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
          : "bg-rose-500/15 text-rose-200 border-rose-400/30"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-emerald-400" : "bg-rose-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function LifeguardList({
  lifeguards,
  onEdit,
  onDelete,
}: LifeguardListProps) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3.5 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#FF6633]/15 border border-[#FF6633]/30 flex items-center justify-center">
          <UserGroupIcon className="w-3.5 h-3.5 text-[#FF6633]" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">Lifeguards</h3>
          <p className="text-white/40 text-[11px] tabular-nums">
            {lifeguards.length} record{lifeguards.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Desktop column header */}
      <div className="hidden lg:block px-6 py-2.5 bg-black/20 border-b border-white/10">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-semibold text-white/40 uppercase tracking-[0.12em]">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {lifeguards.map((lifeguard) => (
          <div
            key={lifeguard.id}
            className="group hover:bg-white/[0.03] transition-colors"
          >
            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-3.5">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    lifeguard.is_active ? "bg-emerald-500/80" : "bg-white/10"
                  }`}
                >
                  {lifeguard.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-white text-sm truncate">
                  {lifeguard.name}
                </p>
              </div>

              <div className="col-span-3 flex items-center gap-2 text-white/70 min-w-0">
                <PhoneIcon className="w-4 h-4 text-sky-300 flex-shrink-0" />
                <span className="text-sm tabular-nums truncate">
                  {lifeguard.contact_number}
                </span>
              </div>

              <div className="col-span-2">
                <StatusPill active={lifeguard.is_active} />
              </div>

              <div className="col-span-2 text-white/55 text-sm">
                {SingaporeTime.format(lifeguard.created_at, "dd MMM yyyy")}
              </div>

              <div className="col-span-1 flex justify-center gap-1">
                <button
                  onClick={() => onEdit(lifeguard)}
                  className="p-2 text-white/50 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-all"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(lifeguard.id)}
                  className="p-2 text-white/50 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                      lifeguard.is_active ? "bg-emerald-500/80" : "bg-white/10"
                    }`}
                  >
                    {lifeguard.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">
                      {lifeguard.name}
                    </h4>
                    <div className="mt-1">
                      <StatusPill active={lifeguard.is_active} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(lifeguard)}
                    className="p-2 text-white/50 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lifeguard.id)}
                    className="p-2 text-white/50 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-black/15 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <PhoneIcon className="w-4 h-4 text-sky-300 flex-shrink-0" />
                  <span className="tabular-nums">{lifeguard.contact_number}</span>
                </div>
                <div className="flex items-center gap-2 text-white/55">
                  <ClockIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <span>
                    Added{" "}
                    {SingaporeTime.format(lifeguard.created_at, "dd MMM yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
