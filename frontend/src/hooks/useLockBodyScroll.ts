import { useEffect } from "react";

// Simple reference-counted body-scroll lock to safely handle nested modals.
let lockCount = 0;
let originalOverflow: string | null = null;
let originalPaddingRight: string | null = null;

export default function useLockBodyScroll(active = true) {
  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    // lock
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow || null;
      originalPaddingRight = document.body.style.paddingRight || null;

      // prevent layout shift when hiding scrollbar
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

      document.body.style.overflow = "hidden";
    }

    lockCount++;

    return () => {
      // unlock
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow ?? "";
        document.body.style.paddingRight = originalPaddingRight ?? "";
        originalOverflow = null;
        originalPaddingRight = null;
      }
    };
  }, [active]);
}
