export const fmt = (n: number, d = 1) =>
  Number.isFinite(n) ? n.toFixed(d) : "—";

export const relDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

export const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n) + "…" : s;

export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};