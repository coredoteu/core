"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ── Customisation ──────────────────────────────────────────────────────────
const DOT_SIZE         = 8;
const RING_SIZE        = 34;
const RING_SCALE_HOVER = 1.6;
const LERP             = 0.12;
const DOT_COLOR        = "#ffffff";
const RING_COLOR       = "rgba(255,255,255,0.55)";
const BLEND            = "difference";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]';
// ──────────────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const dotRef       = useRef<HTMLDivElement>(null);
  const ringWrapRef  = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  const hoveringRef = useRef(false);
  const ancestorRef = useRef<Element | null>(null);

  // Bridge from Effect 1 (route changes) into Effect 2's closure state.
  // Populated by Effect 2 once it mounts; used to force-hide the cursor
  // and invalidate its "visible" flag on every client-side navigation.
  const hideCursorRef = useRef<(() => void) | null>(null);

  // ── Effect 1: reset on every client-side navigation ────────────────────
  const pathname = usePathname();
  useEffect(() => {
    hoveringRef.current = false;
    ancestorRef.current = null;
    if (ringInnerRef.current) {
      ringInnerRef.current.style.transform = "scale(1)";
    }
    // CRITICAL: force-hide and invalidate "visible" so that a spurious
    // mouseenter/mouseover fired by the outgoing/incoming <Navbar/> DOM
    // swap can never reveal the cursor at a stale position. The cursor
    // will only reappear once a genuine, freshly-positioned event fires.
    hideCursorRef.current?.();
  }, [pathname]);

  // ── Effect 2: Core cursor logic ─────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!dotRef.current || !ringWrapRef.current || !ringInnerRef.current) return;

    const dot       = dotRef.current;
    const ringWrap  = ringWrapRef.current;
    const ringInner = ringInnerRef.current;

    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    ringInner.style.transform = hoveringRef.current
      ? `scale(${RING_SCALE_HOVER})`
      : "scale(1)";

    let mx = -500, my = -500;
    let rx = -500, ry = -500;
    let visible = false;
    let rafId: number;

    function tick() {
      rafId = requestAnimationFrame(tick);
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      dot.style.transform =
        `translate3d(${mx - DOT_SIZE / 2}px,${my - DOT_SIZE / 2}px,0)`;
      ringWrap.style.transform =
        `translate3d(${rx - RING_SIZE / 2}px,${ry - RING_SIZE / 2}px,0)`;
    }
    rafId = requestAnimationFrame(tick);

    // Positions the cursor at a given point and (optionally) reveals it.
    // Centralised so every reveal path goes through the same, correct logic.
    function reposition(x: number, y: number, reveal: boolean) {
      mx = x; my = y;
      if (reveal) {
        rx = x; ry = y; // snap the lerped ring too — no fly-in from stale rx/ry
        dot.style.transform =
          `translate3d(${mx - DOT_SIZE / 2}px,${my - DOT_SIZE / 2}px,0)`;
        ringWrap.style.transform =
          `translate3d(${rx - RING_SIZE / 2}px,${ry - RING_SIZE / 2}px,0)`;
        dot.style.opacity      = "1";
        ringWrap.style.opacity = "1";
        visible = true;
      }
    }

    function onMove(e: MouseEvent) {
      if (!e.isTrusted) return; // ignore programmatically dispatched events
      reposition(e.clientX, e.clientY, !visible);
      // keep tracking position even when already visible
      mx = e.clientX;
      my = e.clientY;
    }

    function onPointerOver(e: PointerEvent) {
      if (!e.isTrusted) return;
      const target = e.target as Element | null;
      if (!target) return;
      if (dot.contains(target) || ringWrap.contains(target)) return;

      const ancestor = target.closest<Element>(INTERACTIVE_SELECTOR) ?? null;
      if (ancestor === ancestorRef.current) return;
      ancestorRef.current = ancestor;

      const nowHovering = ancestor !== null;
      if (nowHovering === hoveringRef.current) return;
      hoveringRef.current = nowHovering;

      ringInner.style.transform = nowHovering
        ? `scale(${RING_SCALE_HOVER})`
        : "scale(1)";
    }

    function onLeave() {
      dot.style.opacity      = "0";
      ringWrap.style.opacity = "0";
      hoveringRef.current = false;
      ancestorRef.current = null;
      ringInner.style.transform = "scale(1)";
      visible = false;
    }

    // FIX: mouseenter now repositions using the event's OWN coordinates
    // before revealing, instead of blindly setting opacity on stale
    // mx/my/rx/ry left over from before the leave. This is what removes
    // the top-left "jump" — the dot/ring can never be shown at a position
    // other than where the pointer actually re-entered.
    function onEnter(e: MouseEvent) {
      if (!e.isTrusted) return;
      reposition(e.clientX, e.clientY, true);
    }

    // Exposed so route changes can force a hide + revalidation.
    hideCursorRef.current = () => {
      dot.style.opacity      = "0";
      ringWrap.style.opacity = "0";
      visible = false;
    };

    document.addEventListener("mousemove",  onMove,       { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",   onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      styleEl.remove();
      hideCursorRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          width: DOT_SIZE, height: DOT_SIZE, borderRadius: "50%",
          backgroundColor: DOT_COLOR,
          mixBlendMode: BLEND as React.CSSProperties["mixBlendMode"],
          pointerEvents: "none", zIndex: 99999, opacity: 0,
          willChange: "transform", transition: "opacity 0.3s ease",
        }}
      />
      <div
        ref={ringWrapRef}
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          pointerEvents: "none", zIndex: 99998, opacity: 0,
          willChange: "transform", transition: "opacity 0.3s ease",
        }}
      >
        <div
          ref={ringInnerRef}
          style={{
            width: RING_SIZE, height: RING_SIZE, borderRadius: "50%",
            border: `1.5px solid ${RING_COLOR}`,
            mixBlendMode: BLEND as React.CSSProperties["mixBlendMode"],
            pointerEvents: "none", transform: "scale(1)",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </div>
    </>
  );
}
