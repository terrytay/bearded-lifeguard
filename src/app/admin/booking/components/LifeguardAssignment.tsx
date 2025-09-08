"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  UserIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
}

interface LifeguardAssignmentProps {
  bookingId: string;
  requiredCount: number;
  currentAssignments: Lifeguard[];
  onAssignmentUpdate: () => void;
}

export default function LifeguardAssignment({
  bookingId,
  requiredCount,
  currentAssignments,
  onAssignmentUpdate,
}: LifeguardAssignmentProps) {
  const [availableLifeguards, setAvailableLifeguards] = useState<Lifeguard[]>(
    []
  );
  const [filteredLifeguards, setFilteredLifeguards] = useState<Lifeguard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLifeguards, setSelectedLifeguards] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      loadAvailableLifeguards();
      setSelectedLifeguards(currentAssignments.map((lg) => lg.id));
      setSearchQuery("");
    }
  }, [showModal, currentAssignments]);

  // Filter lifeguards based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLifeguards(availableLifeguards);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableLifeguards.filter(
        (lifeguard) =>
          lifeguard.name.toLowerCase().includes(query) ||
          lifeguard.contact_number.toLowerCase().includes(query)
      );
      setFilteredLifeguards(filtered);
    }
  }, [availableLifeguards, searchQuery]);

  const loadAvailableLifeguards = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(
        `/api/admin/lifeguards/assignments?booking_id=${bookingId}`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableLifeguards(data.available);
        setFilteredLifeguards(data.available);
      }
    } catch (error) {
      console.error("Error loading available lifeguards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssignments = async () => {
    setProcessing(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/admin/lifeguards/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          lifeguard_ids: selectedLifeguards,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        onAssignmentUpdate();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update assignments");
      }
    } catch (error) {
      console.error("Error updating assignments:", error);
      alert("Failed to update assignments");
    } finally {
      setProcessing(false);
    }
  };

  const toggleLifeguardSelection = (lifeguardId: string) => {
    setSelectedLifeguards((prev) => {
      if (prev.includes(lifeguardId)) {
        return prev.filter((id) => id !== lifeguardId);
      } else {
        if (prev.length >= requiredCount) {
          return [...prev.slice(1), lifeguardId]; // Replace oldest selection
        }
        return [...prev, lifeguardId];
      }
    });
  };

  const assignedCount = currentAssignments.length;
  const isComplete = assignedCount >= requiredCount;
  const canAddMore = assignedCount < requiredCount;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm md:text-base flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
              <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            </div>
            Lifeguard Assignment
          </h3>

          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-semibold text-xs md:text-sm flex items-center space-x-1 md:space-x-2"
          >
            <PlusIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span>Manage</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm md:text-base">
            <span className="text-white/70">Required:</span>
            <span className="text-white font-semibold">
              {requiredCount} lifeguards
            </span>
          </div>

          <div className="flex items-center justify-between text-sm md:text-base">
            <span className="text-white/70">Assigned:</span>
            <span
              className={`font-semibold ${
                isComplete ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {assignedCount} lifeguards
            </span>
          </div>

          {!isComplete && (
            <div className="flex items-center space-x-2 p-2 md:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-200 text-xs md:text-sm">
                {requiredCount - assignedCount} more lifeguard
                {requiredCount - assignedCount !== 1 ? "s" : ""} needed
              </span>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center space-x-2 p-2 md:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-200 text-xs md:text-sm">
                All required lifeguards assigned
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-99">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 border border-white/20 rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
              {/* Header - Fixed */}
              <div className="p-6 md:p-8 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Assign Lifeguards
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search lifeguards by name or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-white/70">Selection:</span>
                    <span
                      className={`font-semibold ${
                        selectedLifeguards.length === requiredCount
                          ? "text-emerald-400"
                          : selectedLifeguards.length > requiredCount
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {selectedLifeguards.length} / {requiredCount} selected
                    </span>
                  </div>
                  {selectedLifeguards.length > requiredCount && (
                    <p className="text-red-400 text-xs mt-1">
                      Too many selected! Only {requiredCount} lifeguards are
                      needed.
                    </p>
                  )}
                  {searchQuery && (
                    <p className="text-white/60 text-xs mt-1">
                      Showing {filteredLifeguards.length} of{" "}
                      {availableLifeguards.length} lifeguards
                    </p>
                  )}
                </div>
              </div>

              {/* Available Lifeguards - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70">
                      Loading available lifeguards...
                    </p>
                  </div>
                ) : filteredLifeguards.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/70">
                      {searchQuery
                        ? "No lifeguards found matching your search"
                        : "No lifeguards available for this time slot"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-3 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLifeguards.map((lifeguard) => {
                      const isSelected = selectedLifeguards.includes(
                        lifeguard.id
                      );
                      const isCurrentlyAssigned = currentAssignments.some(
                        (lg) => lg.id === lifeguard.id
                      );

                      return (
                        <div
                          key={lifeguard.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-500/20 border-blue-400/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => toggleLifeguardSelection(lifeguard.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                lifeguard.is_active
                                  ? "bg-emerald-500/20"
                                  : "bg-red-500/20"
                              }`}
                            >
                              <UserIcon
                                className={`w-4 h-4 ${
                                  lifeguard.is_active
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className="text-white font-semibold text-sm">
                                  {lifeguard.name}
                                </p>
                                {isCurrentlyAssigned && (
                                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded border border-yellow-500/30">
                                    Currently Assigned
                                  </span>
                                )}
                              </div>
                              <p className="text-white/60 text-xs font-mono">
                                {lifeguard.contact_number}
                              </p>
                            </div>

                            {isSelected && (
                              <CheckIcon className="w-5 h-5 text-blue-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions - Fixed Bottom */}
              <div className="p-6 md:p-8 border-t border-white/10 flex-shrink-0">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-200 font-semibold text-sm md:text-base"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAssignments}
                    disabled={
                      processing || selectedLifeguards.length > requiredCount
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? "Saving..." : "Save Assignment"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
