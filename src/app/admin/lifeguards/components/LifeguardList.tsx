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
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
        active
          ? "text-sea border-sea/40 bg-sea/10"
          : "text-signal border-signal/40 bg-signal/10"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-sea" : "bg-signal"
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
    <div className="bg-white border border-ink/12 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3.5 border-b border-ink/12 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Directory
          </div>
          <h3 className="font-display text-lg font-semibold text-ink leading-none mt-0.5">
            Lifeguards
          </h3>
        </div>
        <span className="text-ink-soft text-xs tabular-nums">
          {lifeguards.length} record{lifeguards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop column header */}
      <div className="hidden lg:block px-6 py-2.5 bg-sand/50 border-b border-ink/15">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-semibold text-ink-soft uppercase tracking-[0.14em]">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-ink/10">
        {lifeguards.map((lifeguard) => (
          <div
            key={lifeguard.id}
            className="group hover:bg-sand/40 transition-colors"
          >
            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-3.5">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                    lifeguard.is_active ? "bg-sea" : "bg-ink/40"
                  }`}
                >
                  {lifeguard.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-ink text-sm truncate">
                  {lifeguard.name}
                </p>
              </div>

              <div className="col-span-3 flex items-center gap-2 text-ink min-w-0">
                <PhoneIcon className="w-4 h-4 text-sea flex-shrink-0" />
                <span className="text-sm tabular-nums truncate">
                  {lifeguard.contact_number}
                </span>
              </div>

              <div className="col-span-2">
                <StatusPill active={lifeguard.is_active} />
              </div>

              <div className="col-span-2 text-ink-soft text-sm">
                {SingaporeTime.format(lifeguard.created_at, "dd MMM yyyy")}
              </div>

              <div className="col-span-1 flex justify-center gap-1">
                <button
                  onClick={() => onEdit(lifeguard)}
                  className="p-2 text-ink-soft hover:text-sea hover:bg-sea/10 rounded-lg transition-all"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(lifeguard.id)}
                  className="p-2 text-ink-soft hover:text-signal hover:bg-signal/10 rounded-lg transition-all"
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
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                      lifeguard.is_active ? "bg-sea" : "bg-ink/40"
                    }`}
                  >
                    {lifeguard.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-ink text-sm truncate">
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
                    className="p-2 text-ink-soft hover:text-sea hover:bg-sea/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lifeguard.id)}
                    className="p-2 text-ink-soft hover:text-signal hover:bg-signal/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-sand/50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-ink">
                  <PhoneIcon className="w-4 h-4 text-sea flex-shrink-0" />
                  <span className="tabular-nums">{lifeguard.contact_number}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-soft">
                  <ClockIcon className="w-4 h-4 text-ink-soft/60 flex-shrink-0" />
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
