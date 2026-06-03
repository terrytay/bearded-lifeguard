"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import LifeguardModal from "@/app/admin/lifeguards/components/LifeguardModal";

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
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      loadAvailableLifeguards();
      setSelectedLifeguards(currentAssignments.map((lg) => lg.id));
      setSearchQuery("");
    }
  }, [showModal, currentAssignments]);

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
          return [...prev.slice(1), lifeguardId];
        }
        return [...prev, lifeguardId];
      }
    });
  };

  const assignedCount = currentAssignments.length;
  const isComplete = assignedCount >= requiredCount;
  const canSave = selectedLifeguards.length <= requiredCount;
  const sortByName = (lifeguards: Lifeguard[]) =>
    [...lifeguards].sort((a, b) => a.name.localeCompare(b.name));
  const closeAssignmentModal = () => {
    setShowModal(false);
    setShowAddModal(false);
  };

  const handleCreateLifeguard = async (data: {
    name: string;
    contact_number: string;
    is_active: boolean;
  }) => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/admin/lifeguards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create lifeguard");
        return;
      }

      const lifeguard = (await response.json()) as Lifeguard;
      setAvailableLifeguards((prev) => sortByName([...prev, lifeguard]));
      const query = searchQuery.trim().toLowerCase();
      setFilteredLifeguards((prev) => {
        if (!query) {
          return sortByName([...prev, lifeguard]);
        }
        const matches =
          lifeguard.name.toLowerCase().includes(query) ||
          lifeguard.contact_number.toLowerCase().includes(query);
        return matches ? sortByName([...prev, lifeguard]) : prev;
      });
      setSelectedLifeguards((prev) => {
        if (prev.includes(lifeguard.id)) {
          return prev;
        }
        if (prev.length >= requiredCount) {
          return [...prev.slice(1), lifeguard.id];
        }
        return [...prev, lifeguard.id];
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating lifeguard:", error);
      alert("Failed to create lifeguard");
    }
  };

  return (
    <>
      <div className="bg-white border border-ink/12 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base md:text-lg font-semibold text-ink flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-signal/10 border border-signal/30 text-signal flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4" />
            </span>
            Lifeguard assignment
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-ink text-paper rounded-xl hover:bg-signal transition-all font-semibold text-xs flex items-center gap-1.5 min-h-[40px]"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Manage</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Required</span>
            <span className="text-ink font-semibold tabular-nums">
              {requiredCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Assigned</span>
            <span
              className={`font-semibold tabular-nums ${
                isComplete ? "text-sea" : "text-ochre"
              }`}
            >
              {assignedCount}
            </span>
          </div>

          {!isComplete ? (
            <div className="flex items-center gap-2 p-3 bg-ochre/10 border border-ochre/25 rounded-xl">
              <ExclamationTriangleIcon className="w-5 h-5 text-ochre flex-shrink-0" />
              <span className="text-ink text-xs tabular-nums">
                {requiredCount - assignedCount} more lifeguard
                {requiredCount - assignedCount !== 1 ? "s" : ""} needed
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-sea/10 border border-sea/25 rounded-xl">
              <CheckIcon className="w-5 h-5 text-sea flex-shrink-0" />
              <span className="text-ink text-xs">
                All required lifeguards assigned
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Assignment modal */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-[99] font-sans text-ink">
            <div className="bg-paper border-2 border-ink rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-[8px_8px_0_0_var(--color-ink)] flex flex-col console-in">
              {/* Header */}
              <div className="p-5 md:p-6 border-b border-ink/15 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    Assign lifeguards
                  </h2>
                  <button
                    onClick={closeAssignmentModal}
                    className="p-2 text-ink-soft hover:text-ink hover:bg-ink/5 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative mb-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
                  <input
                    type="text"
                    placeholder="Search by name or contact…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-white border border-ink/20 rounded-xl text-ink placeholder-ink-soft/60 text-sm focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all min-h-[44px]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-soft hover:text-ink"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full px-4 py-2.5 border border-ink/20 text-ink hover:border-ink/50 rounded-xl transition-all font-medium text-sm flex items-center justify-center gap-2 min-h-[44px] mb-3"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add new lifeguard</span>
                </button>

                <div className="p-3 bg-sand/60 rounded-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">Selection</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        selectedLifeguards.length === requiredCount
                          ? "text-sea"
                          : selectedLifeguards.length > requiredCount
                          ? "text-signal"
                          : "text-ochre"
                      }`}
                    >
                      {selectedLifeguards.length} / {requiredCount}
                    </span>
                  </div>
                  {searchQuery && (
                    <p className="text-ink-soft text-xs mt-1 tabular-nums">
                      Showing {filteredLifeguards.length} of{" "}
                      {availableLifeguards.length}
                    </p>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 pt-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-ink/15 border-t-signal rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-ink-soft text-sm">
                      Loading available lifeguards…
                    </p>
                  </div>
                ) : filteredLifeguards.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-ink-soft text-sm">
                      {searchQuery
                        ? "No lifeguards match your search"
                        : "No lifeguards available for this slot"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-3 px-4 py-2 border border-ink/20 text-ink rounded-lg hover:border-ink/50 transition-colors text-sm"
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
                        <button
                          key={lifeguard.id}
                          onClick={() => toggleLifeguardSelection(lifeguard.id)}
                          className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-sea/10 border-sea/45"
                              : "bg-white border-ink/12 hover:bg-sand/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-paper font-bold text-sm flex-shrink-0 ${
                                lifeguard.is_active ? "bg-sea" : "bg-ink/40"
                              }`}
                            >
                              {lifeguard.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-ink font-semibold text-sm truncate">
                                  {lifeguard.name}
                                </p>
                                {isCurrentlyAssigned && (
                                  <span className="px-2 py-0.5 bg-ochre/10 text-ochre text-[10px] uppercase tracking-wider rounded-md border border-ochre/30 flex-shrink-0">
                                    Assigned
                                  </span>
                                )}
                              </div>
                              <p className="text-ink-soft text-xs tabular-nums truncate">
                                {lifeguard.contact_number}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckIcon className="w-5 h-5 text-sea flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 md:p-6 border-t border-ink/15 flex-shrink-0">
                <div className="flex gap-3">
                  <button
                    onClick={closeAssignmentModal}
                    disabled={processing}
                    className="flex-1 px-6 py-3 border border-ink/25 text-ink hover:bg-ink hover:text-paper rounded-xl transition-all font-semibold text-sm min-h-[48px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAssignments}
                    disabled={processing || !canSave}
                    className="flex-1 px-6 py-3 bg-ink text-paper hover:bg-signal rounded-xl transition-all font-semibold text-sm min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? "Saving…" : "Save assignment"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showAddModal && (
        <LifeguardModal
          lifeguard={null}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateLifeguard}
          overlayClassName="z-[120]"
        />
      )}
    </>
  );
}
