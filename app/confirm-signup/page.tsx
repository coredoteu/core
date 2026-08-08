"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";


// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoaderState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative w-10 h-10">
        <div
          className="absolute inset-0 border border-white/20 animate-ping"
          style={{ animationDuration: "1.8s" }}
        />
        <div className="absolute inset-2 border border-white/30" />
        <div className="absolute inset-4 bg-white/8" />
      </div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 lowercase">
        loading...
      </p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function InvalidLinkState() {
  return (
    <div className="flex flex-col gap-5 border border-white/10 p-8 md:p-12 max-w-md w-full bg-white/[0.018]">
      {/* mono tag */}
      <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 lowercase">
        // error
      </span>

      <h1 className="text-2xl font-extralight text-white lowercase tracking-tight">
        invalid link.
      </h1>

      <p className="font-mono text-xs text-white/40 leading-relaxed lowercase">
        invalid verification link. please request a new one.
      </p>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function ConfirmSignupContent() {
  const searchParams = useSearchParams();
  const confirmationUrl = searchParams.get("confirmation_url");

  if (!confirmationUrl) {
    return <InvalidLinkState />;
  }

  return (
    <div className="flex flex-col gap-6 border border-white/10 p-8 md:p-12 max-w-md w-full bg-white/[0.018]">
      {/* mono tag */}
      <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 lowercase">
        // verification required
      </span>

      {/* header */}
      <h1 className="text-3xl md:text-4xl font-extralight text-white lowercase tracking-tight">
        almost there.
      </h1>

      {/* body copy */}
      <p className="font-mono text-xs text-white/45 leading-relaxed lowercase">
        click the button below to confirm your email address and activate your
        core. account.
      </p>

      {/* CTA */}
      <a
        id="cta-confirm-email"
        href={confirmationUrl}
        className="inline-flex items-center justify-center px-6 py-4 bg-white text-black text-[10px] font-mono tracking-[0.3em] lowercase hover:bg-white/90 active:scale-[0.98] transition-all w-full text-center"
      >
        confirm email &amp; login
      </a>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function ConfirmSignupPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">


      {/* centred layout */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <Suspense fallback={<LoaderState />}>
          <ConfirmSignupContent />
        </Suspense>
      </div>
    </main>
  );
}
