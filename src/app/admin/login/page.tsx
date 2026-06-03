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
    "w-full pl-11 pr-4 py-3 bg-white border border-ink/20 rounded-xl text-ink placeholder-ink-soft/60 text-sm focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all min-h-[48px]";

  return (
    <div className="font-sans text-ink min-h-screen flex items-center justify-center p-4 bg-paper relative overflow-hidden">
      <div className="editorial-grain pointer-events-none absolute inset-0" />
      {/* Decorative editorial rules */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-1.5 bg-ink" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-1.5 bg-signal" />

      <div className="relative w-full max-w-md bg-white border-2 border-ink rounded-3xl p-6 md:p-8 shadow-[10px_10px_0_0_var(--color-ink)] console-in">
        <div className="text-center mb-7">
          <Image
            src="/logo.png"
            alt="Bearded Lifeguard"
            width={64}
            height={64}
            className="h-14 w-14 object-contain mx-auto mb-3"
            priority
          />
          <div className="text-[10px] uppercase tracking-[0.24em] text-ink-soft">
            Bearded Lifeguard
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink mt-1">
            Admin access
          </h1>
        </div>

        {error && (
          <div className="bg-signal/10 border border-signal/30 rounded-xl p-3.5 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-signal mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-signal text-sm">Login error</p>
              <p className="text-ink-soft text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft w-4 h-4" />
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
              className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft w-4 h-4" />
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
            className="w-full bg-ink text-paper py-3 px-4 rounded-xl font-semibold hover:bg-signal transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
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
            className="text-ink-soft hover:text-ink text-sm transition-colors ink-underline"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
