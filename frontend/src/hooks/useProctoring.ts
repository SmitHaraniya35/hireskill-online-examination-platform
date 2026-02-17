import { useEffect } from "react";

export const useProctoring = (onViolation: (msg: string) => void) => {
  useEffect(() => {
    // 1. Detect Tab Switching (Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation("Tab Switch Detected! Your activity is being logged.");
      }
    };

    // 2. Detect Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onViolation("You exited full-screen mode. Please return to continue.");
      }
    };

    // 3. Disable Right Click (Context Menu)
    const disableRightClick = (e: MouseEvent) => e.preventDefault();

    // 4. Disable Copy/Paste
    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation("Copy/Paste is disabled during the exam.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, [onViolation]);
};