"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" aria-label="CORE. home">
            <Image
              src="/CORE_logo_trans.svg"
              alt="CORE."
              width={72}
              height={18}
              priority
              className="h-[18px] w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-[10px] font-mono tracking-[0.3em] text-text-faint lowercase mb-2">
            account access
          </p>
          <h1 className="text-xl font-light text-white/90 tracking-tight">
            sign in
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[10px] font-mono tracking-[0.25em] text-text-faint lowercase"
            >
              email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/[0.03] border border-hairline  px-4 py-3 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-[10px] font-mono tracking-[0.25em] text-text-faint lowercase"
            >
              password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.03] border border-hairline  px-4 py-3 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] font-mono text-white bg-white/[0.03] border border-white/20  px-3 py-2">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.25em] lowercase py-3.5  hover:bg-white/90 active:bg-white/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                signing in...
              </>
            ) : (
              "sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] font-mono text-text-dim">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Link to signup */}
        <p className="text-center text-[11px] text-text-faint">
          no account?{" "}
          <Link
            href="/signup"
            className="text-text-muted hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-200"
          >
            create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
