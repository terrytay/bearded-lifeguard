"use client";

import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
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

export default function LifeguardList({
  lifeguards,
  onEdit,
  onDelete,
}: LifeguardListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
            <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm md:text-base">
              Lifeguards Directory
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              {lifeguards.length} lifeguard{lifeguards.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Table Header - Hidden on mobile */}
      <div className="hidden lg:block px-4 md:px-6 py-2 md:py-3 bg-white/5 border-b border-white/5">
        <div className="grid grid-cols-12 gap-4 text-xs md:text-sm font-medium text-white/70 uppercase tracking-wider">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-3">Created</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-white/5">
        {lifeguards.map((lifeguard, index) => (
          <div
            key={lifeguard.id}
            className={`group hover:bg-white/5 transition-all duration-200 ${
              index % 2 === 0 ? "bg-white/2" : ""
            }`}
          >
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 md:px-6 py-3 md:py-4">
              {/* Status */}
              <div className="col-span-1 flex justify-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    lifeguard.is_active
                      ? "bg-emerald-400 shadow-emerald-400/30 shadow-lg"
                      : "bg-red-400 shadow-red-400/30 shadow-lg"
                  }`}
                  title={lifeguard.is_active ? "Active" : "Inactive"}
                />
              </div>

              {/* Name */}
              <div className="col-span-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                      lifeguard.is_active
                        ? "bg-gradient-to-br from-emerald-500 to-green-600"
                        : "bg-gradient-to-br from-gray-500 to-slate-600"
                    }`}
                  >
                    {lifeguard.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base">
                      {lifeguard.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          lifeguard.is_active
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {lifeguard.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2 text-white/70">
                  <PhoneIcon className="w-4 h-4 text-blue-400" />
                  <span className="font-mono text-sm">
                    {lifeguard.contact_number}
                  </span>
                </div>
              </div>

              {/* Created */}
              <div className="col-span-3">
                <div className="flex items-center space-x-2 text-white/60">
                  <ClockIcon className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm">
                      {SingaporeTime.format(lifeguard.created_at, "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-white/40">
                      {SingaporeTime.format(lifeguard.created_at, "HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="col-span-2">
                <div className="text-white/60">
                  <p className="text-sm">
                    {SingaporeTime.format(lifeguard.updated_at, "MMM dd")}
                  </p>
                  <p className="text-xs text-white/40">
                    {SingaporeTime.format(lifeguard.updated_at, "HH:mm")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-center space-x-1">
                <button
                  onClick={() => onEdit(lifeguard)}
                  className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                  title="Edit lifeguard"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(lifeguard.id)}
                  className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                  title="Delete lifeguard"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden px-4 py-4 space-y-3">
              {/* Header with Status and Actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      lifeguard.is_active
                        ? "bg-gradient-to-br from-emerald-500 to-green-600"
                        : "bg-gradient-to-br from-gray-500 to-slate-600"
                    }`}
                  >
                    {lifeguard.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">
                      {lifeguard.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          lifeguard.is_active
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {lifeguard.is_active ? (
                          <CheckIcon className="w-3 h-3 inline mr-1" />
                        ) : (
                          <XMarkIcon className="w-3 h-3 inline mr-1" />
                        )}
                        {lifeguard.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Actions */}
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(lifeguard)}
                    className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lifeguard.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <PhoneIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 font-mono text-sm">
                    {lifeguard.contact_number}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/50 mb-1">Created</p>
                  <p className="text-white/80">
                    {SingaporeTime.format(lifeguard.created_at, "MMM dd, yyyy")}
                  </p>
                  <p className="text-white/50">
                    {SingaporeTime.format(lifeguard.created_at, "HH:mm")}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-white/50 mb-1">Updated</p>
                  <p className="text-white/80">
                    {SingaporeTime.format(lifeguard.updated_at, "MMM dd")}
                  </p>
                  <p className="text-white/50">
                    {SingaporeTime.format(lifeguard.updated_at, "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 border-t border-white/10 text-center">
        <p className="text-white/50 text-xs md:text-sm">
          Showing {lifeguards.length} lifeguard{lifeguards.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}