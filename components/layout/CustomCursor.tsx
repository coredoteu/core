"use client";

/**
 * CustomCursor — Glitch-free, high-performance custom cursor
 *
 * Root causes fixed in this version:
 *
 *  1. Ring inner missing `pointer-events: none`
 *     `pointer-events` is NOT inherited in CSS for HTML elements. The outer
 *     wrapper had it, but the inner circle defaulted to `auto`. This meant
 *     `elementFromPoint(mx, my)` could return the ring inner div itself,
 *     causing `closest(INTERACTIVE_SELECTOR)` to return null, toggling the
 *     hover state off/on every frame as the lerped ring crossed the cursor.
 *     FIX: `pointerEvents: "none"` explicitly on the ring inner.
 *
 *  2. `elementFromPoint` called every RAF frame (fragile during navigation)
 *     During Next.js client-side route transitions, the DOM is in flux.
 *     `elementFromPoint` can return null, stale elements, or transition
 *     overlays, causing spurious hover state changes at ~60fps.
 *     FIX: replaced entirely with `pointerover` + ancestor comparison.
 *     `pointerover` only fires on real user input, never during DOM churn.
 *
 *  3. No hover-state reset on page navigation
 *     After navigating, the ring could be stuck in the hover-scaled state
 *     from the previous page's interactive element. When the user then
 *     moved to the nav bar, the scale transition would re-trigger from a
 *     stale state, causing a visible glitch.
 *     FIX: `usePathname()` + dedicated effect resets all hover state on
 *     every client-side navigation.
 *
 *  4. Ancestor comparison for hover detection (immune to child re-entries)
 *     Even event-based detection (`mouseover`) glitches when the cursor
 *     moves between children of the same <a> tag (icon → text → span).
 *     Each child fires a separate event. If you only track boolean
 *     (hovering/not), you get rapid true/false toggling.
 *     FIX: track the *resolved interactive ancestor element reference*.
 *     Moving between children of the same <a> all resolve to the same
 *     <a> reference → identical → no state change → zero flicker.
 *
 * ── Customisation knobs ────────────────────────────────────────────────────
 *  DOT_SIZE           — dot diameter in px
 *  RING_SIZE          — ring diameter in px (at rest)
 *  RING_SCALE_HOVER   — ring scale multiplier on hover
 *  LERP               — ring follow speed (0 = frozen, 1 = instant snap)
 *  DOT_COLOR          — CSS color for the dot
 *  RING_COLOR         — CSS color for the ring border
 *  BLEND              — CSS mix-blend-mode value
 *  INTERACTIVE_SELECTOR — which elements trigger the hover state
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ── Customisation ──────────────────────────────────────────────────────────
const DOT_SIZE         = 8;    // px
const RING_SIZE        = 34;   // px
const RING_SCALE_HOVER = 1.6;  // scale multiplier while hovering
const LERP             = 0.12; // ring follow speed
const DOT_COLOR        = "#ffffff";
const RING_COLOR       = "rgba(255,255,255,0.55)";
const BLEND            = "difference"; // "normal" to disable inversion

/**
 * Add `data-cursor-hover` to any element you also want to trigger the hover
 * state (e.g. custom interactive components that aren't <a> or <button>).
 */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]';
// ──────────────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const dotRef       = useRef<HTMLDivElement>(null);
  const ringWrapRef  = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  /**
   * Refs (not state) for values shared between the two effects.
   * Using refs means no React re-renders when they change.
   *  hoveringRef   — current hover boolean
   *  ancestorRef   — the resolved interactive ancestor Element (or null)
   *                  Used to deduplicate pointerover events on child elements
   *                  of the same interactive parent.
   */
  const hoveringRef = useRef(false);
  const ancestorRef = useRef<Element | null>(null);

  // ── Effect 1: Reset hover state on every client-side navigation ───────────
  // When Next.js routes to a new page, interactive elements from the previous
  // page may be gone, but our hover state still reflects them. This effect
  // clears everything so the new page starts with a neutral ring state.
  const pathname = usePathname();
  useEffect(() => {
    hoveringRef.current = false;
    ancestorRef.current = null;
    if (ringInnerRef.current) {
      ringInnerRef.current.style.transform = "scale(1)";
    }
  }, [pathname]);

  // ── Effect 2: Core cursor logic ───────────────────────────────────────────
  useEffect(() => {
    // Touch / coarse-pointer guard — bail completely on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    if (!dotRef.current || !ringWrapRef.current || !ringInnerRef.current) return;
    const dot       = dotRef.current;
    const ringWrap  = ringWrapRef.current;
    const ringInner = ringInnerRef.current;

    // Inject a high-specificity `cursor: none` rule that overrides browser
    // defaults on interactive elements (:hover, :focus, etc.)
    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    // Ensure ring scale is in sync with current hover state on mount
    ringInner.style.transform = hoveringRef.current
      ? `scale(${RING_SCALE_HOVER})`
      : "scale(1)";

    // Raw mouse coords — only updated by mousemove (plain numbers, no React)
    let mx = -500, my = -500;
    // Ring lerp coords
    let rx = -500, ry = -500;
    // Visibility flag — false until first mousemove after mount
    let visible = false;
    let rafId: number;

    // ── RAF loop ─────────────────────────────────────────────────────────────
    // The ONLY place that writes position to the DOM.
    // Hover state is NOT managed here — it's managed by pointerover events.
    // This separation is critical: position writes happen every frame,
    // hover writes happen only on user input. Mixing them caused flickering.
    function tick() {
      rafId = requestAnimationFrame(tick);

      // Lerp ring toward cursor
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;

      // Dot — snaps instantly (no CSS transition on transform)
      dot.style.transform =
        `translate3d(${mx - DOT_SIZE / 2}px,${my - DOT_SIZE / 2}px,0)`;

      // Ring outer — lerped (no CSS transition on transform)
      ringWrap.style.transform =
        `translate3d(${rx - RING_SIZE / 2}px,${ry - RING_SIZE / 2}px,0)`;
    }

    rafId = requestAnimationFrame(tick);

    // ── mousemove — stores coords and triggers first-move visibility ──────────
    // No DOM writes here (except first-move opacity reveal). Keeps event
    // handlers pure so the browser can batch them without jank.
    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;

      if (!visible) {
        // Snap ring to current position so it doesn't fly in from (-500, -500)
        rx = mx;
        ry = my;
        dot.style.opacity      = "1";
        ringWrap.style.opacity = "1";
        visible = true;
      }
    }

    // ── pointerover — hover detection with ancestor comparison ────────────────
    // Why `pointerover` instead of `mouseover` or `elementFromPoint`:
    //  • `pointerover` is the modern Pointer Events API equivalent of
    //    `mouseover` — it bubbles and works correctly.
    //  • Crucially: we resolve `target.closest(INTERACTIVE_SELECTOR)` to get
    //    the actual interactive ANCESTOR element, then compare that reference
    //    to the previous one. Moving between children of the same <a> tag
    //    (span → svg → text node) all resolve to the same <a> reference →
    //    no state change → zero flicker on complex nav bars.
    //  • Unlike `elementFromPoint`, this only fires on real user input,
    //    never during page transitions or DOM mutations.
    function onPointerOver(e: PointerEvent) {
      const target = e.target as Element | null;
      if (!target) return;

      // Guard: skip if the event somehow targets one of our own cursor divs.
      // This shouldn't happen because they have pointer-events: none, but
      // belt-and-suspenders in case of browser quirks.
      if (dot.contains(target) || ringWrap.contains(target)) return;

      // Walk up to the nearest interactive ancestor (or null if none)
      const ancestor = target.closest<Element>(INTERACTIVE_SELECTOR) ?? null;

      // If the ancestor hasn't changed, we're still within the same interactive
      // element (just moved between its children). No update needed.
      if (ancestor === ancestorRef.current) return;
      ancestorRef.current = ancestor;

      const nowHovering = ancestor !== null;
      if (nowHovering === hoveringRef.current) return; // redundant guard
      hoveringRef.current = nowHovering;

      // Ring inner scale — CSS transition handles the animation.
      // This write only happens when hover state genuinely changes, not per-frame.
      ringInner.style.transform = nowHovering
        ? `scale(${RING_SCALE_HOVER})`
        : "scale(1)";
    }

    // ── Mouse leaves / enters the browser window ──────────────────────────────
    function onLeave() {
      dot.style.opacity      = "0";
      ringWrap.style.opacity = "0";
      // Reset hover so ring doesn't stay enlarged when mouse re-enters
      hoveringRef.current = false;
      ancestorRef.current = null;
      ringInner.style.transform = "scale(1)";
      visible = false;
    }

    function onEnter() {
      dot.style.opacity      = "1";
      ringWrap.style.opacity = "1";
      visible = true;
    }

    // Register listeners
    document.addEventListener("mousemove",  onMove,       { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    // documentElement is more reliable than `window` for viewport leave/enter
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",   onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      styleEl.remove();
    };
  }, []);

  return (
    <>
      {/*
       * DOT
       * position: fixed, top-left origin so translate3d is straightforward.
       * willChange: "transform" promotes to its own GPU compositor layer.
       * transition covers ONLY opacity — never transform (that fights the RAF).
       */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           DOT_SIZE,
          height:          DOT_SIZE,
          borderRadius:    "50%",
          backgroundColor: DOT_COLOR,
          mixBlendMode:    BLEND as React.CSSProperties["mixBlendMode"],
          pointerEvents:   "none",
          zIndex:          99999,
          opacity:         0,
          willChange:      "transform",
          transition:      "opacity 0.3s ease", // opacity ONLY — no transform!
        }}
      />

      {/*
       * RING OUTER (position layer)
       * Receives the lerped translate3d every RAF frame.
       * transition covers ONLY opacity — never transform.
       * Width/height are fixed; we never mutate them in JS (no layout thrash).
       */}
      <div
        ref={ringWrapRef}
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          pointerEvents: "none", // outer wrapper: no pointer events
          zIndex:        99998,
          opacity:       0,
          willChange:    "transform",
          transition:    "opacity 0.3s ease", // opacity ONLY — no transform!
        }}
      >
        {/*
         * RING INNER (visual layer)
         * NEVER moved by RAF — only scale() is written, and only when hover
         * state actually changes (not every frame).
         * CSS transition on `transform` is safe here because the RAF loop
         * does NOT write to this element.
         *
         * ⚠️  CRITICAL: `pointer-events: none` must be set EXPLICITLY here.
         * `pointer-events` is NOT inherited for HTML elements. Without this,
         * the inner div defaults to `pointer-events: auto` and would be
         * returned by `elementFromPoint`, intercepting hover detection.
         */}
        <div
          ref={ringInnerRef}
          style={{
            width:        RING_SIZE,
            height:       RING_SIZE,
            borderRadius: "50%",
            border:       `1.5px solid ${RING_COLOR}`,
            mixBlendMode: BLEND as React.CSSProperties["mixBlendMode"],
            pointerEvents: "none", // ← MUST be explicit, not inherited
            transform:    "scale(1)",
            transition:   "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </div>
    </>
  );
}
