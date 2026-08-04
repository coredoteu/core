"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSupabaseSession } from "@/context/AuthContext";

const navLinks = ["shop", "science", "roadmap"] as const;

export default function Navbar() {
  const { itemCount, toggleDrawer } = useCart();
  const { session } = useSupabaseSession();
  const accountHref = session ? "/account" : "/login";
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (menuOpen) return;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0D0D0D]/50"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="shrink-0 flex items-center"
          aria-label="CORE. home"
          onClick={closeMenu}
        >
          <Image
            src="/CORE_logo_trans.svg"
            alt="CORE."
            width={80}
            height={19}
            priority
            className="h-[18px] w-auto md:h-[22px]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((label) => (
            <Link
              key={label}
              href={`/${label}`}
              className="text-xs tracking-[0.25em] lowercase text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-4"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-2.5">
          {/* Desktop: User account icon */}
          <Link
            href={accountHref}
            aria-label={session ? "my account" : "sign in"}
            className="hidden md:flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.4}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Link>

          {/* Desktop: Cart button */}
          <button
            onClick={toggleDrawer}
            aria-label="open cart"
            className="hidden md:flex items-center gap-2.5 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
          >
            <img
              src="/icons/cart-large-minimalistic.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 opacity-80"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="text-xs font-mono tracking-[0.1em] text-white/60">
              ({itemCount})
            </span>
          </button>

          <Link
            href="/cart"
            onClick={closeMenu}
            className="md:hidden flex items-center justify-center gap-2 min-h-[44px] px-2 text-white/70 hover:text-white transition-colors duration-200"
            aria-label={`shopping cart, ${itemCount} items`}
          >
            <img
              src="/icons/cart-large-minimalistic.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 opacity-80"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="text-xs font-mono tracking-[0.1em] text-white/60">
              ({itemCount})
            </span>
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "close menu" : "open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-5 bg-current"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="block h-px w-5 bg-current"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-5 bg-current"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#0D0D0D]"
          >
            <nav className="flex flex-col px-6 py-4">
              {navLinks.map((label, i) => (
                <Link
                  key={label}
                  href={`/${label}`}
                  onClick={closeMenu}
                  className="flex items-center justify-between py-4 border-b border-white/[0.06] last:border-b-0 text-lg font-light lowercase text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
                >
                  <span>{label}</span>
                  <span className="font-mono text-[10px] text-white/60">
                    0{i + 1}
                  </span>
                </Link>
              ))}
              {/* Account link in mobile menu */}
              <Link
                href={accountHref}
                onClick={closeMenu}
                className="flex items-center justify-between py-4 border-t border-white/[0.06] text-lg font-light lowercase text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
              >
                <span>{session ? "account" : "sign in"}</span>
                <svg
                  className="h-4 w-4 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.4}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>
            </nav>
            <div className="px-6 pb-6">
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
                refined to the core.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
