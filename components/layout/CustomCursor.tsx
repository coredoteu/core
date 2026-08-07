"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 1000, damping: 50, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 1000, damping: 50, mass: 0.1 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.style.cursor = "none";

    const updateMousePosition = (e: MouseEvent) => {
      x.set(e.clientX - 4);
      y.set(e.clientY - 4);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      animate={{ scale: isHovering ? 3 : 1, opacity: isHovering ? 0.3 : 1 }}
      className="fixed top-0 left-0 w-2 h-2 bg-white rounded-[50%] pointer-events-none z-[9999] mix-blend-difference"
    />
  );
}
