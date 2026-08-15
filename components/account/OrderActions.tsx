"use client";

import { useState } from "react";

interface OrderActionsProps {
  orderId: string;
  stripeSessionId: string;
  createdAt: string;
  paymentStatus: string;
  shippingStatus?: string;
  cancellationRequested?: boolean;
  activeBatch: {
    preorderCloseDate: string;
    phase: string;
  } | null;
}

export default function OrderActions({
  orderId,
  createdAt,
  paymentStatus,
  shippingStatus,
  cancellationRequested,
  activeBatch,
}: OrderActionsProps) {
  const [activeForm, setActiveForm] = useState<"none" | "address" | "cancel">("none");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [sentMessage, setSentMessage] = useState("");

  const inTransitOrDelivered = ["in_transit", "out_for_delivery", "delivered"].includes(
    shippingStatus || "",
  );

  const isAlreadyCancelled = Boolean(cancellationRequested);

  const canChangeAddress = paymentStatus === "paid" && !inTransitOrDelivered && !isAlreadyCancelled;

  let canCancel = false;
  let cancelReason = "";

  if (isAlreadyCancelled) {
    canCancel = false;
    cancelReason = "cancellation pending approval";
  } else if (paymentStatus !== "paid") {
    canCancel = false;
    cancelReason = "payment incomplete";
  } else if (inTransitOrDelivered) {
    canCancel = false;
    cancelReason = "order in transit";
  } else if (!activeBatch) {
    canCancel = false;
    cancelReason = "cancellation locked";
  } else {
    const now = new Date();
    const orderDate = new Date(createdAt);
    const closeDate = new Date(activeBatch.preorderCloseDate);
    closeDate.setHours(23, 59, 59, 999);

    const wasPurchasedDuringPreorder = orderDate <= closeDate;
    const isPreorderWindowStillOpen = now <= closeDate && activeBatch.phase === "preorder";

    if (!wasPurchasedDuringPreorder) {
      canCancel = false;
      cancelReason = "buffer stock purchase (non-cancellable)";
    } else if (!isPreorderWindowStillOpen) {
      canCancel = false;
      cancelReason = "pre-order window closed";
    } else {
      canCancel = true;
    }
  }

  async function handleSubmit(requestType: "cancel" | "address_change") {
    setStatus("submitting");
    try {
      const res = await fetch("/api/orders/request-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          requestType,
          newAddress: requestType === "address_change" ? address : undefined,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setSentMessage(
          requestType === "cancel"
            ? "cancellation request submitted. team will confirm via email."
            : "address update request submitted. team will confirm via email.",
        );
        setActiveForm("none");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }

  if (isAlreadyCancelled || status === "sent") {
    return (
      <div className="px-5 py-3 border-t border-hairline bg-white/[0.01]">
        <p className="text-[10px] font-mono text-white/80 lowercase flex items-start gap-2">
          <span className="shrink-0">✓</span>
          <span className="break-words">
            {status === "sent"
              ? sentMessage
              : "cancellation request pending approval. support team notified."}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-hairline bg-white/[0.01]">
      <div className="px-5 py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-mono tracking-[0.2em] text-text-dim lowercase shrink-0">
            actions /
          </span>
          <span className="text-[10px] font-mono text-text-faint lowercase break-words">
            {inTransitOrDelivered
              ? "in transit (locked)"
              : canCancel
              ? "pre-order editable"
              : cancelReason}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canChangeAddress && (
            <button
              onClick={() => setActiveForm(activeForm === "address" ? "none" : "address")}
              className="min-h-[44px] flex items-center justify-center px-4 text-[9px] font-mono tracking-[0.15em] text-white/70 hover:text-white border border-hairline hover:border-white/40 lowercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
            >
              {activeForm === "address" ? "close" : "change address"}
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => setActiveForm(activeForm === "cancel" ? "none" : "cancel")}
              className="min-h-[44px] flex items-center justify-center px-4 text-[9px] font-mono tracking-[0.15em] text-white/70 hover:text-white border border-hairline hover:border-white/40 lowercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
            >
              {activeForm === "cancel" ? "close" : "cancel order"}
            </button>
          )}
        </div>
      </div>

      {activeForm === "address" && (
        <div className="px-5 pb-4 pt-1 flex flex-col sm:flex-row gap-2">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="enter new shipping address"
            className="flex-1 min-h-[44px] bg-white/[0.03] border border-hairline px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 lowercase"
          />
          <button
            onClick={() => handleSubmit("address_change")}
            disabled={status === "submitting" || !address.trim()}
            className="min-h-[44px] py-2.5 px-4 bg-white text-black text-[9px] font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-40 transition-colors shrink-0"
          >
            {status === "submitting" ? "submitting..." : "submit new address"}
          </button>
        </div>
      )}

      {activeForm === "cancel" && (
        <div className="px-5 pb-4 pt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/[0.02]">
          <p className="text-[10px] font-mono text-white/60 lowercase break-words">
            confirm pre-order cancellation request?
          </p>
          <button
            onClick={() => handleSubmit("cancel")}
            disabled={status === "submitting"}
            className="min-h-[44px] py-2.5 px-4 bg-white text-black text-[9px] font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-40 transition-colors shrink-0"
          >
            {status === "submitting" ? "submitting..." : "confirm cancellation"}
          </button>
        </div>
      )}
    </div>
  );
}
