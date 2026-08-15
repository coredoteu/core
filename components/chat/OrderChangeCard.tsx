"use client";
import { useState } from "react";

export function OrderChangeCard({ data }: { data: any }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [address, setAddress] = useState("");

  if (!data || data.error) return null;

  async function submit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/orders/request-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          requestType: data.requestType,
          newAddress: data.requestType === "address_change" ? address : undefined,
        }),
      });
      setStatus(res.ok ? "sent" : "idle");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
          order / #{data.orderRef}
        </span>
        <span className={`font-mono text-[9px] tracking-[0.2em] px-2 py-1 border lowercase ${
          data.eligible ? "border-white/30 text-white" : "border-white/10 text-white/30"
        }`}>
          {data.eligible ? "change window open" : "locked"}
        </span>
      </div>

      {!data.eligible ? (
        <p className="text-xs text-white/50 lowercase leading-relaxed">{data.reason}</p>
      ) : status === "sent" ? (
        <p className="text-xs text-white/70 lowercase leading-relaxed">
          request submitted. our team will confirm by email shortly.
        </p>
      ) : (
        <>
          {data.requestType === "address_change" && (
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="new shipping address"
              className="w-full bg-white/[0.03] border border-hairline px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 lowercase"
            />
          )}
          <button
            onClick={submit}
            disabled={status === "submitting" || (data.requestType === "address_change" && !address.trim())}
            className="w-full py-3 bg-white text-black text-[10px] font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-40 transition-colors"
          >
            {status === "submitting"
              ? "submitting..."
              : data.requestType === "cancel"
              ? "confirm cancellation"
              : "submit new address"}
          </button>
        </>
      )}
    </div>
  );
}
