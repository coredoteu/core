"use client";

import { useState, FormEvent, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type VerifyState = "idle" | "loading" | "success" | "error";

interface SuccessPayload {
  code: string;
  message: string;
}

export default function FoundersPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<VerifyState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessPayload | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "loading") return;

    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/founders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.error ??
            "access denied. this email address was not found in our batch 01 order history."
        );
        setState("error");
        return;
      }

      setSuccess({ code: data.code, message: data.message });
      setState("success");
    } catch {
      setError("a network error occurred. please try again.");
      setState("error");
    }
  }

  function handleReset() {
    setEmail("");
    setError(null);
    setState("idle");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const [copied, setCopied] = useState(false);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6">
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.025) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Link href="/" aria-label="CORE. home">
            <Image
              src="/CORE_logo_trans.svg"
              alt="CORE."
              width={72}
              height={18}
              priority
              className="h-[18px] w-auto opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {state === "success" && success ? (
            /* ─── SUCCESS STATE ─────────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="mb-8">
                <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 lowercase mb-2">
                  batch 01 / verified
                </p>
                <h1 className="text-xl font-light text-white/90 tracking-tight">
                  welcome, founder.
                </h1>
              </div>

              {/* Code reveal */}
              <button
                type="button"
                onClick={() => handleCopy(success.code)}
                className="w-full text-left mb-6 bg-white/[0.03] border border-white/10 hover:border-white/20 p-6 relative overflow-hidden transition-colors duration-200 group cursor-pointer"
              >
                {/* Shimmer line */}
                <div
                  className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"
                  style={{ animation: "shimmer 2.5s infinite linear" }}
                />

                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 lowercase">
                    your single-use code
                  </p>
                  <span className="text-[9px] font-mono text-white/40 group-hover:text-white/70 transition-colors lowercase">
                    {copied ? "copied ✓" : "click to copy"}
                  </span>
                </div>
                <p className="text-2xl font-mono tracking-[0.25em] text-white select-all">
                  {success.code}
                </p>
              </button>

              {/* Perks detail */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-white/50 leading-relaxed lowercase">
                    15% lifetime discount on all core. products.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-white/50 leading-relaxed lowercase">
                    24h early access to project v2 before public launch.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-white/50 leading-relaxed lowercase">
                    this email is now permanently registered in our founding member registry.
                  </p>
                </div>
              </div>

              {/* CTA back to shop */}
              <Link
                href="/shop"
                className="block w-full text-center bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.25em] lowercase py-3.5 hover:bg-white/90 active:bg-white/80 transition-all duration-200"
              >
                go to shop
              </Link>
            </motion.div>
          ) : (
            /* ─── FORM STATE (idle / loading / error) ───────────────────── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="mb-8">
                <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 lowercase mb-2">
                  founding member verification.
                </p>
                <h1 className="text-xl font-light text-white/90 tracking-tight">
                  batch 01 access.
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-[11px] font-mono text-white/45 leading-relaxed lowercase mb-8">
                enter the email address used for your batch 01 order to unlock
                your v2 early access &amp; lifetime perks.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="founders-email"
                    className="block text-[10px] font-mono tracking-[0.25em] text-white/40 lowercase"
                  >
                    email address
                  </label>
                  <input
                    ref={inputRef}
                    id="founders-email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error as user retypes
                      if (state === "error") {
                        setState("idle");
                        setError(null);
                      }
                    }}
                    placeholder="you@example.com"
                    disabled={state === "loading"}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {state === "error" && error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/[0.03] border border-white/20 px-3 py-2.5 flex items-start gap-2.5">
                        {/* X icon */}
                        <svg
                          className="flex-shrink-0 w-3 h-3 mt-0.5 text-white/40"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M1 1L11 11M11 1L1 11"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="text-[11px] font-mono text-white/60 leading-relaxed lowercase">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  id="founders-verify-submit"
                  type="submit"
                  disabled={state === "loading" || !email.trim()}
                  className="w-full mt-2 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.25em] lowercase py-3.5 hover:bg-white/90 active:bg-white/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      verifying...
                    </>
                  ) : (
                    "verify access"
                  )}
                </button>

                {/* Try again link shown in error state */}
                {state === "error" && (
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="w-full text-center text-[10px] font-mono tracking-[0.2em] text-white/35 hover:text-white/60 transition-colors duration-200 lowercase pt-1"
                  >
                    try a different email
                  </motion.button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
