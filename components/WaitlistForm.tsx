"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function action(formData: FormData) {
    setStatus("loading");
    const result = await joinWaitlist(formData);
    if (result?.error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="flex-1 bg-white/5 border border-white/20 px-6 py-4 flex items-center max-w-md w-full lg:ml-auto text-sm text-white/50 lowercase">
        you are on the list.
      </div>
    );
  }

  return (
    <form action={action} className="flex items-stretch border border-white/20 max-w-md w-full lg:ml-auto relative overflow-hidden group">
      <input
        type="email"
        name="email"
        required
        placeholder="you@domain.com"
        disabled={status === "loading"}
        className="flex-1 bg-transparent px-4 py-4 text-sm text-white placeholder:text-white/30 lowercase outline-none focus:bg-white/5 transition-colors duration-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="relative px-6 text-sm tracking-[0.15em] lowercase bg-white text-[#0D0D0D] hover:bg-white/90 transition-all duration-300 disabled:opacity-80 disabled:cursor-wait"
      >
        <span className={status === "loading" ? "opacity-0" : "opacity-100"}>
          notify me
        </span>
        {status === "loading" && (
          <span className="absolute inset-0 flex items-center justify-center">
            ...
          </span>
        )}
      </button>
    </form>
  );
}
