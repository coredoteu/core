"use client";

import { useState } from "react";

export function WithdrawalForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/refunds/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-sm">
        <h3 className="text-white mb-2">request submitted.</h3>
        <p className="text-neutral-400">
          we have received your withdrawal notice. our team will review it and
          get back to you shortly with return instructions.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white/[0.02] rounded-lg border border-white/10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="orderNumber" className="text-xs font-mono tracking-[0.1em] text-neutral-400 lowercase">
            order number *
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            required
            placeholder="e.g. #10234"
            className="bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-mono tracking-[0.1em] text-neutral-400 lowercase">
              full name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-mono tracking-[0.1em] text-neutral-400 lowercase">
              email address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reason" className="text-xs font-mono tracking-[0.1em] text-neutral-400 lowercase">
            reason for withdrawal (optional)
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            className="bg-transparent border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
          ></textarea>
        </div>

        {status === "error" && (
          <p className="text-red-400 text-xs font-mono lowercase">
            something went wrong. please try again or email us.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 w-full py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-50 transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60 focus-visible:outline-offset-2"
        >
          {status === "submitting" ? "submitting..." : "submit withdrawal notice"}
        </button>
      </form>
    </div>
  );
}
