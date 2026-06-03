"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          window.location.href = "/admin";
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin role required.");
        }

        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-black/20 border border-white/15 rounded-xl text-white placeholder-white/40 text-sm focus:ring-2 focus:ring-[#FF6633]/40 focus:border-[#FF6633]/50 transition-all min-h-[48px]";

  return (
    <div className="font-mono min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6633]/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 console-in">
        <div className="text-center mb-7">
          <Image
            src="/logo.png"
            alt="Bearded Lifeguard"
            width={64}
            height={64}
            className="h-14 w-14 object-contain mx-auto mb-3"
            priority
          />
          <h1 className="text-xl font-bold text-white">Admin access</h1>
          <p className="text-white/45 text-xs uppercase tracking-[0.18em] mt-1">
            Bearded Lifeguard
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-3.5 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-200 text-sm">Login error</p>
              <p className="text-rose-200/70 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@sglifeguardservices.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6633] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#e55a2b] transition-all shadow-lg shadow-[#FF6633]/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/45 hover:text-white text-sm transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
