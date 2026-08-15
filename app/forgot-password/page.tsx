"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
      setState("idle");
    } else {
      setState("success");
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 pt-28 pb-16">
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
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            aria-label="CORE. home"
            className="inline-flex items-center justify-center p-3 -m-1"
          >
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

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border border-hairline bg-white/[0.03] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-text-faint lowercase mb-2">
                recovery initiated
              </p>
              <h2 className="text-xl font-light text-white/90 tracking-tight mb-4">
                check your inbox
              </h2>
              <p className="text-[12px] text-text-faint leading-relaxed mb-8">
                if an account exists for <span className="text-text-muted break-all">{email}</span>, you will receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="inline-block py-2 -my-2 text-[11px] font-mono tracking-[0.2em] lowercase text-text-faint hover:text-white/70 transition-colors duration-200 underline underline-offset-4 decoration-white/15"
              >
                back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <p className="text-[10px] font-mono tracking-[0.3em] text-text-faint lowercase mb-2">
                  password recovery
                </p>
                <h1 className="text-xl font-light text-white/90 tracking-tight">
                  reset password
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full bg-white/[0.03] border border-hairline px-4 py-3 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[11px] font-mono text-white bg-white/[0.03] border border-white/20 px-3 py-2">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  id="reset-submit"
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full mt-2 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.25em] lowercase py-3.5 hover:bg-white/90 active:bg-white/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {state === "loading" ? (
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
                      sending link...
                    </>
                  ) : (
                    "send reset link"
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-mono text-text-dim">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <p className="text-center text-[11px] text-text-faint">
                remember your password?{" "}
                <Link
                  href="/login"
                  className="inline-block py-2 -my-2 text-text-muted hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-200"
                >
                  sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
