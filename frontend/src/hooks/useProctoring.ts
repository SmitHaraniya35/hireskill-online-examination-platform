import { useEffect, useRef, useState } from "react";

export const useProctoring = (onAutoFinish: () => void, enabled: boolean) => {
  const [isViolation, setIsViolation] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const onAutoFinishRef = useRef(onAutoFinish);
  useEffect(() => {
    onAutoFinishRef.current = onAutoFinish;
  }, [onAutoFinish]);



  const startPenalty = () => {
    if (timerRef.current) return;

    setIsViolation(true);
    setCountdown(5);

    // Call via ref — always gets the latest version
    timerRef.current = window.setTimeout(() => {
      onAutoFinishRef.current();
    }, 5000);
      intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearPenalty = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsViolation(false);
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .then(() => {
          clearPenalty();
        })
        .catch((err) => {
          console.error("Fullscreen entry failed:", err);
        });
    }
  };

  // --- TAB & FULLSCREEN DETECTION ---
  // --- TAB, BLUR & FULLSCREEN DETECTION ---
  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      if (document.hidden) {
        startPenalty();
      }
    };

    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        startPenalty();
      } else {
        clearPenalty();
      }
    };

    // NEW: Handle Window Blur (This catches the 3-finger swipe/Alt+Tab immediately)
    const handleBlur = () => {
      startPenalty();
    };

    // NEW: Handle Window Focus (Clears penalty if they come back)
    const handleFocus = () => {
      if (document.fullscreenElement && !document.hidden) {
        clearPenalty();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreen);
    window.addEventListener("blur", handleBlur); 
    window.addEventListener("focus", handleFocus); 

    if (!document.fullscreenElement) {
      startPenalty();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      window.removeEventListener("blur", handleBlur); 
      window.removeEventListener("focus", handleFocus); 
      clearPenalty();
    };
  }, [enabled]);

  // --- KEYBOARD BLOCKING ---
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Block Copy, Paste, Cut, Save, Inspect, and Print
      const forbidden = ["c", "v", "x", "s", "r", "p"];
      const isSystemKey = e.key === "Meta" || (e.altKey && e.key === "Tab");

      if ((e.ctrlKey && forbidden.includes(key)) || isSystemKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);

  return { isViolation, countdown, enterFullscreen };
};