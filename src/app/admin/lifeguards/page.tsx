"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import DashboardLayout from "../components/DashboardLayout";
import LifeguardSearchBar from "./components/LifeguardSearchBar";
import LifeguardStatsBar from "./components/LifeguardStatsBar";
import LifeguardCard from "./components/LifeguardCard";
import LifeguardList from "./components/LifeguardList";
import LifeguardModal from "./components/LifeguardModal";
import BackToTopButton from "../components/BackToTop";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LifeguardStats {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
}

export default function LifeguardsPage() {
  const [lifeguards, setLifeguards] = useState<Lifeguard[]>([]);
  const [stats, setStats] = useState<LifeguardStats>({ total: 0, active: 0, inactive: 0, assigned: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLifeguard, setEditingLifeguard] = useState<Lifeguard | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadLifeguards();
    }
  }, [user, searchQuery, filterStatus]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/admin/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Admin access required");
      await supabase.auth.signOut();
      window.location.href = "/";
      return;
    }

    setUser(session.user);
  };

  const loadLifeguards = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filterStatus === "active") params.set("active_only", "true");
      params.set("limit", "100");

      const response = await fetch(`/api/admin/lifeguards?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        let filteredLifeguards = data.lifeguards;

        if (filterStatus === "inactive" && !searchQuery) {
          filteredLifeguards = data.lifeguards.filter((lifeguard: Lifeguard) => !lifeguard.is_active);
        }

        setLifeguards(filteredLifeguards);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLifeguard = async (lifeguardData: { name: string; contact_number: string; is_active: boolean }) => {
    setProcessing(true);
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
        body: JSON.stringify(lifeguardData),
      });

      if (response.ok) {
        setShowModal(false);
        await loadLifeguards();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create lifeguard");
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create lifeguard");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateLifeguard = async (lifeguardData: { name: string; contact_number: string; is_active: boolean }) => {
    if (!editingLifeguard) return;

    setProcessing(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/lifeguards/${editingLifeguard.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(lifeguardData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingLifeguard(null);
        await loadLifeguards();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update lifeguard");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update lifeguard");
    } finally {
      setProcessing(false);
    }
  };

  const deleteLifeguard = async (id: string) => {
    if (!confirm("Delete this lifeguard permanently?")) return;

    setProcessing(true);
    const optimisticLifeguards = lifeguards.filter((lg) => lg.id !== id);
    setLifeguards(optimisticLifeguards);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/lifeguards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (!response.ok) {
        setLifeguards([...lifeguards]);
        const error = await response.json();
        alert(error.error || "Delete failed");
      } else {
        setTimeout(loadLifeguards, 500);
      }
    } catch (error) {
      setLifeguards([...lifeguards]);
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleEditLifeguard = (lifeguard: Lifeguard) => {
    setEditingLifeguard(lifeguard);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingLifeguard(null);
    setShowModal(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center font-mono">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6633]/30 border-t-[#FF6633] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      newBookingsCount={0}
      onSignOut={signOut}
      processing={processing}
    >
      <BackToTopButton />

      {/* Search */}
      <LifeguardSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onRefresh={loadLifeguards}
        onAddNew={handleAddNew}
        isLoading={loading}
      />

      {/* Stats */}
      <LifeguardStatsBar
        {...stats}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Content */}
      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              ))}
            </div>
          ) : lifeguards.length === 0 ? (
            <div className="text-center py-12 md:py-20 console-in">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🛟
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                No lifeguards found
              </h3>
              <p className="text-white/50 mb-5 max-w-sm mx-auto text-sm">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter."
                  : "Add your first lifeguard to get started."}
              </p>
              <div className="flex items-center justify-center gap-3">
                {(searchQuery || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="px-5 py-2.5 bg-white/[0.04] text-white/80 border border-white/15 rounded-xl hover:border-white/30 hover:text-white transition-all font-semibold text-sm min-h-[44px]"
                  >
                    Reset filters
                  </button>
                )}
                <button
                  onClick={handleAddNew}
                  className="px-5 py-2.5 bg-[#FF6633] text-white rounded-xl hover:bg-[#e55a2b] transition-all font-semibold shadow-lg shadow-[#FF6633]/20 text-sm min-h-[44px]"
                >
                  Add lifeguard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Toggle */}
              <div className="mb-4 flex justify-end console-in">
                <div className="bg-black/20 border border-white/10 rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 min-h-[40px] ${
                      viewMode === "list"
                        ? "bg-[#FF6633] text-white shadow-lg shadow-[#FF6633]/20"
                        : "text-white/55 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 min-h-[40px] ${
                      viewMode === "card"
                        ? "bg-[#FF6633] text-white shadow-lg shadow-[#FF6633]/20"
                        : "text-white/55 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Cards</span>
                  </button>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === "list" ? (
                <div className="console-in">
                  <LifeguardList
                    lifeguards={lifeguards}
                    onEdit={handleEditLifeguard}
                    onDelete={deleteLifeguard}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 console-in">
                  {lifeguards.map((lifeguard) => (
                    <LifeguardCard
                      key={lifeguard.id}
                      lifeguard={lifeguard}
                      onEdit={() => handleEditLifeguard(lifeguard)}
                      onDelete={() => deleteLifeguard(lifeguard.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <LifeguardModal
          lifeguard={editingLifeguard}
          onClose={() => {
            setShowModal(false);
            setEditingLifeguard(null);
          }}
          onSubmit={editingLifeguard ? handleUpdateLifeguard : handleCreateLifeguard}
        />
      )}
    </DashboardLayout>
  );
}