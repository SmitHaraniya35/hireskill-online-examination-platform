import { fmt, formatTime } from "../utils/dashboard.utils";
import { DIFF_BG, MEDALS } from "../constants/dashboard.constants";
import type { Difficulty, ILeaderboard } from "@/types/dashboard.types";

// ─── Enhanced Tooltip ─────────────────────────────────────────────────────────

export const EnhancedTooltip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-xs min-w-[180px]">
      {label && (
        <p className="text-gray-500 font-medium mb-2 border-b border-gray-100 pb-1">
          {label}
        </p>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between items-center gap-4 py-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color || p.fill }}
            />
            <span className="text-gray-600">{p.name}:</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatter
              ? formatter(p.value, p)
              : typeof p.value === "number"
                ? fmt(p.value)
                : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Histogram Tooltip ────────────────────────────────────────────────────────

export const HistogramTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-gray-800 mb-2">{data.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-xs">
          <span className="text-gray-500">Students:</span>
          <span className="font-bold text-gray-900">{data.count}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs">
          <span className="text-gray-500">Percentage:</span>
          <span className="font-bold text-gray-900">
            {((data.count / (data.totalStudents || 1)) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-px bg-gray-100 my-1" />
        <div className="flex justify-between gap-4 text-xs">
          <span className="text-gray-500">Score Range:</span>
          <span className="font-medium text-gray-700">{data.name}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl h-28"
        />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl col-span-2 h-80" />
      <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl h-80" />
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

export const StatCard = ({ label, value, sub, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 group overflow-y-auto">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div
        className={`rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-200`}
      >
        <div className={`${color}`}>{icon}</div>
      </div>
    </div>
  </div>
);

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

export const DiffBadge = ({ d }: { d: Difficulty }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${DIFF_BG[d]} ${
      d === "Easy"
        ? "text-emerald-700"
        : d === "Medium"
          ? "text-amber-700"
          : "text-red-700"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        d === "Easy"
          ? "bg-emerald-500"
          : d === "Medium"
            ? "bg-amber-500"
            : "bg-red-500"
      }`}
    />
    {d}
  </span>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export const ProgressBar = ({
  value,
  color = "#6366f1",
  label,
}: {
  value: number;
  color?: string;
  label?: string;
}) => (
  <div className="flex items-center gap-3 w-full">
    {label && (
      <span className="text-xs text-gray-500 min-w-[60px]">{label}</span>
    )}
    <div className="flex-1">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        />
      </div>
    </div>
    <span className="text-xs font-medium text-gray-600 min-w-[45px] text-right tabular-nums">
      {fmt(value)}%
    </span>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

export const Card = ({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col ${className}`}
  >
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    <div className="flex-1 min-h-0 w-full">{children}</div>
  </div>
);

// ─── Table Helpers ────────────────────────────────────────────────────────────

export const TH = ({
  children,
  align = "left",
  className = "", 
}: {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) => (
  <th
    className={`text-${align} py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 whitespace-nowrap ${className}`} // Add this
  >
    {children}
  </th>
);

export const TD = ({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) => (
  <td className={`text-${align} py-3  text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

// ─── Leaderboard Rows ─────────────────────────────────────────────────────────

export const GlobalLBRow = ({ rank, p }: { rank: number; p: ILeaderboard }) => {
  const perfColor =
    p.performance >= 75
      ? "text-emerald-600"
      : p.performance >= 50
        ? "text-amber-600"
        : "text-red-600";
  const bgColor =
    rank <= 3 ? "bg-gradient-to-r from-amber-50 to-transparent" : "";

  return (
    <div
      className={`flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl px-3 -mx-3 transition-all ${bgColor}`}
    >
      <div className="w-10 text-center">
        {rank <= 3 ? (
          <span className="text-xl">{MEDALS[rank - 1]}</span>
        ) : (
          <span className="text-xs font-medium text-gray-400">#{rank}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {p.name ?? "—"}
        </p>
        <p className="text-[11px] text-gray-400 truncate">
          {p.testTitle ?? p.email ?? ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-sm font-bold tabular-nums ${perfColor}`}>
          {fmt(p.performance)}%
        </span>
        <br />
        <span className="text-xs font-bold tabular-nums text-gray-500">
          {p.achieved_score}/{p.total_score}
        </span>
      </div>
    </div>
  );
};

export const SingleLBRow = ({ rank, p }: { rank: number; p: ILeaderboard }) => {
  const perfColor =
    p.performance >= 75
      ? "text-emerald-600"
      : p.performance >= 50
        ? "text-amber-600"
        : "text-red-600";
  const bgColor =
    rank <= 3 ? "bg-gradient-to-r from-amber-50 to-transparent" : "";

  return (
    <div
      className={`flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl px-3 -mx-3 transition-all ${bgColor}`}
    >
      <div className="w-10 text-center">
        {rank <= 3 ? (
          <span className="text-xl">{MEDALS[rank - 1]}</span>
        ) : (
          <span className="text-xs font-medium text-gray-400">#{rank}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {p.name ?? "—"}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{p.email ?? ""}</p>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-sm font-bold tabular-nums ${perfColor}`}>
          {fmt(p.performance)}%
        </span>
        <br />
        <span className="text-[11px] tabular-nums text-gray-400 font-medium">
          {formatTime(p.timeTaken)}
        </span>
      </div>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

export const Icons = {
  Globe: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  Test: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  Chevron: ({ open }: { open: boolean }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-200 ${open ? "" : "rotate-180"}`}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Students: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Score: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Duration: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Check: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Chart: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M7 10l3-3 3 3 4-4" />
      <path d="M17 10V4h-6" />
    </svg>
  ),
};
