import type { Difficulty } from "@/types/dashboard.types";

export const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export const DIFF_BG: Record<Difficulty, string> = {
  Easy: "bg-emerald-50",
  Medium: "bg-amber-50",
  Hard: "bg-red-50",
};

export const PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const MEDALS = ["🥇", "🥈", "🥉"];