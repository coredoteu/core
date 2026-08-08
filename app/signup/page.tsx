"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type State = "idle" | "loading" | "success";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setState("idle");
    } else if (data.session) {
      // If email confirmation is disabled, user is immediately logged in
      router.push("/account");
      router.refresh();
    } else {
      // Email confirmation required
      setState("success");
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

        <AnimatePresence mode="wait">
          {state === "success" ? (
            /* ── Confirmation State ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              {/* Checkmark icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12  border border-hairline bg-white/[0.03] flex items-center justify-center">
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
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-text-faint lowercase mb-2">
                account created
              </p>
              <h2 className="text-xl font-light text-white/90 tracking-tight mb-4">
                check your inbox
              </h2>
              <p className="text-[12px] text-text-faint leading-relaxed mb-8">
                we sent a confirmation link to{" "}
                <span className="text-text-muted">{email}</span>. open it to
                activate your account.
              </p>
              <Link
                href="/login"
                className="inline-block text-[11px] font-mono tracking-[0.2em] lowercase text-text-faint hover:text-white/70 transition-colors duration-200 underline underline-offset-4 decoration-white/15"
              >
                go to sign in
              </Link>
            </motion.div>
          ) : (
            /* ── Signup Form ── */
            <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Heading */}
              <div className="mb-8">
                <p className="text-[10px] font-mono tracking-[0.3em] text-text-faint lowercase mb-2">
                  new account
                </p>
                <h1 className="text-xl font-light text-white/90 tracking-tight">
                  create account
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullName"
                    className="block text-[10px] font-mono tracking-[0.25em] text-text-faint lowercase"
                  >
                    full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-white/[0.03] border border-hairline  px-4 py-3 text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200"
                  />
                </div>

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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="min. 8 characters"
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
                  id="signup-submit"
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full mt-2 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.25em] lowercase py-3.5  hover:bg-white/90 active:bg-white/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      creating account...
                    </>
                  ) : (
                    "create account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-mono text-text-dim">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <p className="text-center text-[11px] text-text-faint">
                already have an account?{" "}
                <Link
                  href="/login"
                  className="text-text-muted hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-200"
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
