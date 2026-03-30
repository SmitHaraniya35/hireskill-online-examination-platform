import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import type {
  Difficulty,
  IGlobalResponse,
  ILeaderboard,
  ISingleTestResponse,
} from "../../types/dashboard.types";
import dashboardService from "../../services/dashboard.services";
import { RefreshCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "global" | "single";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

const DIFF_BG: Record<Difficulty, string> = {
  Easy: "bg-emerald-50",
  Medium: "bg-amber-50",
  Hard: "bg-red-50",
};

const PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : "—");

const relDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n) + "…" : s;

// ─── Enhanced Tooltip ─────────────────────────────────────────────────────────

const EnhancedTooltip = ({ active, payload, label, formatter }: any) => {
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

// ─── Histogram Specific Tooltip ───────────────────────────────────────────────

const HistogramTooltip = ({ active, payload }: any) => {
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl h-28"
        />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl col-span-2 h-80" />
      <div className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl h-80" />
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

const StatCard = ({ label, value, sub, icon, color }: StatCardProps) => (
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
        className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-200`}
      >
        <div className={`${color}`}>{icon}</div>
      </div>
    </div>
  </div>
);

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

const DiffBadge = ({ d }: { d: Difficulty }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${DIFF_BG[d]} ${d === "Easy" ? "text-emerald-700" : d === "Medium" ? "text-amber-700" : "text-red-700"}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${d === "Easy" ? "bg-emerald-500" : d === "Medium" ? "bg-amber-500" : "bg-red-500"}`}
    />
    {d}
  </span>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({
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

const Card = ({
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
    className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ─── Table Helpers ────────────────────────────────────────────────────────────

const TH = ({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
}) => (
  <th
    className={`text-${align} py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 whitespace-nowrap`}
  >
    {children}
  </th>
);

const TD = ({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) => (
  <td className={`text-${align} py-3 px-4 text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

// ─── Medals constant (shared) ─────────────────────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"];

// ─── GlobalLBRow ──────────────────────────────────────────────────────────────
// Used in: Global View → "Top Performers" card
// Shows: rank · name · testTitle · achieved_score/total_score · performance %

const GlobalLBRow = ({ rank, p }: { rank: number; p: ILeaderboard }) => {
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

// ─── SingleLBRow ──────────────────────────────────────────────────────────────
// Used in: Single Test View → "🏆 Leaderboard" card
// Shows: rank · name · email · performance % · timeTaken
// No achieved_score/total_score

const SingleLBRow = ({ rank, p }: { rank: number; p: ILeaderboard }) => {
  const perfColor =
    p.performance >= 75
      ? "text-emerald-600"
      : p.performance >= 50
        ? "text-amber-600"
        : "text-red-600";
  const bgColor =
    rank <= 3 ? "bg-gradient-to-r from-amber-50 to-transparent" : "";

  const formatTime = (ms: number): string => {
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

const Icons = {
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
  Refresh: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
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

// ─── Global View ──────────────────────────────────────────────────────────────

const GlobalView = ({
  data,
  onTestClick,
}: {
  data: IGlobalResponse;
  onTestClick: (id: string) => void;
}) => {
  const {
    summary,
    scoreTrendsTestWise,
    topPerformers,
    difficultyStats,
    problemAnalytics,
    testWiseAnalytics,
  } = data;

  const trendData = scoreTrendsTestWise.map((t) => ({
    name: truncate(t.title, 15),
    avgScore: t.avgScore,
    fullMark: 100,
  }));

  const radarData = difficultyStats.map((d) => ({
    difficulty: d.difficulty,
    performance: d.avgPerformance,
    fullMark: 100,
  }));

  const topProblems = [...problemAnalytics]
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 7)
    .map((p) => ({
      name: truncate(p.title, 15),
      attempts: p.attempts,
      avgPerf: p.avgPerformance,
      difficulty: p.difficulty,
    }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Attempts"
          value={summary.totalStudents.toLocaleString()}
          sub="Enrolled across all tests"
          icon={<Icons.Students />}
          color="text-indigo-600"
        />
        <StatCard
          label="Completion Rate"
          value={`${fmt(summary.completionRate)}%`}
          sub={`${summary.completedStudents} out of ${summary.totalStudents} completed`}
          icon={<Icons.Check />}
          color="text-emerald-600"
        />
        <StatCard
          label="Average Score"
          value={`${fmt(summary.avgScore)}%`}
          icon={<Icons.Score />}
          color="text-amber-600"
        />
        <StatCard
          label="Total Tests"
          value={summary.totalTests ?? testWiseAnalytics.length}
          sub="Administered"
          icon={<Icons.Duration />}
          color="text-violet-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Score Trends"
          subtitle="Average performance across tests"
          className="lg:col-span-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<EnhancedTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  name="Average Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">
              Score trend across tests | Higher scores indicate better
              performance
            </p>
          </div>
        </Card>

        <Card
          title="Difficulty Analysis"
          subtitle="Performance by difficulty level"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="difficulty"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                />
                <Radar
                  name="Performance"
                  dataKey="performance"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip
                  content={
                    <EnhancedTooltip formatter={(v: number) => `${fmt(v)}%`} />
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">
              Students perform best on Easy questions | Hard questions need
              attention
            </p>
          </div>
        </Card>
      </div>

      {/* Problem Analytics and Top Performers - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Analytics - Takes 2/3 of the space */}
        <Card
          title="Problem Analytics"
          subtitle="Attempts vs Performance across problems"
          className="lg:col-span-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={topProblems}
                margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Attempts",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#94a3b8", fontSize: 10 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Performance %",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#94a3b8", fontSize: 10 },
                  }}
                />
                <Tooltip content={<EnhancedTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  yAxisId="left"
                  dataKey="attempts"
                  name="Attempts"
                  radius={[4, 4, 0, 0]}
                >
                  {topProblems.map((e, i) => (
                    <Cell
                      key={i}
                      fill={DIFF_COLOR[e.difficulty as Difficulty]}
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgPerf"
                  name="Avg Performance %"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">
              Bar height shows attempts | Line shows performance percentage |
              Color indicates difficulty
            </p>
          </div>
        </Card>

        {/* Top Performers - Takes 1/3 of the space */}
        <Card
          title="Top Performers"
          subtitle="Highest scoring students across all tests"
        >
          <div className="max-h-80 overflow-y-auto p-5">
            {topPerformers.slice(0, 8).map((p, i) => (
              <GlobalLBRow key={i} rank={i + 1} p={p} />
            ))}
          </div>
        </Card>
      </div>

      {/* Test-Wise Table */}
      <Card
        title="Test-Wise Breakdown"
        subtitle="Detailed analytics for each test"
      >
        {/* <div className="overflow-x-auto"> */}
        <table className="w-full">
          <thead>
            <tr>
              <TH>Test</TH>
              <TH>Date</TH>
              <TH>Students</TH>
              <TH>Completion</TH>
              <TH>Avg Score</TH>
              <TH align="center">Action</TH>
            </tr>
          </thead>
          <tbody>
            {testWiseAnalytics.map((t) => {
              const scoreColor =
                t.avgScore >= 70
                  ? "text-emerald-600"
                  : t.avgScore >= 40
                    ? "text-amber-600"
                    : "text-red-600";
              return (
                <tr
                  key={t.testId}
                  onClick={() => onTestClick(t.testId)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <TD>
                    <span className="font-medium text-gray-800">{t.title}</span>
                  </TD>
                  <TD>
                    <span className="text-xs text-gray-400 tabular-nums">
                      {relDate(t.start_at)}
                    </span>
                  </TD>
                  <TD>
                    <span className="tabular-nums">{t.totalStudents}</span>
                  </TD>
                  <TD>
                    <div className="min-w-[140px]">
                      <ProgressBar
                        value={t.completionRate}
                        color={
                          t.completionRate >= 75
                            ? "#10b981"
                            : t.completionRate >= 40
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    </div>
                  </TD>
                  <TD>
                    <span
                      className={`text-xs font-semibold tabular-nums px-2 py-1 rounded-lg ${scoreColor} bg-opacity-10`}
                    >
                      {fmt(t.avgScore)} %
                    </span>
                  </TD>
                  <TD align="center">
                    <span className="inline-flex items-center gap-1 text-indigo-500 text-xs hover:text-indigo-700 font-medium">
                      View Details
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* </div> */}
      </Card>
    </div>
  );
};

// ─── Single Test View ─────────────────────────────────────────────────────────

const SingleTestView = ({ data }: { data: ISingleTestResponse }) => {
  const {
    test,
    summary,
    scoreDistributions,
    difficultyStats,
    problemAnalytics,
    leaderboard,
  } = data;

  const scoreDistData =
    scoreDistributions && typeof scoreDistributions === "object"
      ? Object.entries(scoreDistributions)
          .map(([range, count], i) => {
            const [start, end] = range.split("-").map(Number);
            return {
              name: range,
              start,
              end,
              count: count || 0,
              fill: PALETTE[i % PALETTE.length],
              totalStudents: summary?.totalStudents || 0,
            };
          })
          .sort((a, b) => a.start - b.start)
      : [];

  const maxCount = Math.max(...scoreDistData.map((d) => d.count), 0);
  const totalStudents = summary?.totalStudents || 0;

  const radarData =
    difficultyStats && Array.isArray(difficultyStats)
      ? difficultyStats.map((d) => ({
          subject: d.difficulty,
          value: d.avgPerformance,
          fullMark: 100,
        }))
      : [];

  const safeProblemAnalytics =
    problemAnalytics && Array.isArray(problemAnalytics) ? problemAnalytics : [];
  const safeLeaderboard =
    leaderboard && Array.isArray(leaderboard) ? leaderboard : [];

  return (
    <div className="space-y-6">
      {/* Stats Grid — unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Attempts"
          value={summary?.totalStudents?.toLocaleString() ?? "0"}
          sub="Enrolled in this test"
          icon={<Icons.Students />}
          color="text-indigo-600"
        />
        <StatCard
          label="Completion Rate"
          value={`${fmt(summary?.completionRate ?? 0)}%`}
          sub={`${summary?.completedStudents ?? 0} out of ${summary?.totalStudents ?? 0} completed`}
          icon={<Icons.Check />}
          color="text-emerald-600"
        />
        <StatCard
          label="Average Score"
          value={`${fmt(summary.avgScore)}%`}
          sub={`out of ${test?.total_score ?? 0} points`}
          icon={<Icons.Score />}
          color="text-amber-600"
        />
        <StatCard
          label="Duration"
          value={`${test?.duration_minutes ?? 0} min`}
          sub="Test duration"
          icon={<Icons.Duration />}
          color="text-violet-600"
        />
      </div>

      {/* ROW 1: Score Distribution Histogram (2/3) + Difficulty Breakdown (1/3) */}
      {(scoreDistData.length > 0 || radarData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {scoreDistData.length > 0 && (
            <Card
              title="Score Distribution Histogram"
              subtitle="Distribution of student scores across different ranges"
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreDistData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
                      barGap={2}
                      barCategoryGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "#475569",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        interval={0}
                        angle={0}
                        dy={10}
                        label={{
                          value: "Score Ranges (%)",
                          position: "bottom",
                          offset: 5,
                          style: {
                            fill: "#64748b",
                            fontSize: 11,
                            fontWeight: 500,
                          },
                        }}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                        allowDecimals={false}
                        domain={[0, maxCount + maxCount * 0.15]}
                        label={{
                          value: "Number of Students",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            fill: "#64748b",
                            fontSize: 11,
                            fontWeight: 500,
                            textAnchor: "middle",
                          },
                        }}
                      />
                      <Tooltip content={<HistogramTooltip />} />
                      <Bar
                        dataKey="count"
                        name="Students"
                        radius={[6, 6, 0, 0]}
                        barSize={Math.min(
                          80,
                          Math.max(50, 120 - scoreDistData.length * 4),
                        )}
                      >
                        {scoreDistData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            fillOpacity={0.85}
                            stroke={entry.fill}
                            strokeWidth={1}
                            strokeOpacity={0.3}
                          />
                        ))}
                      </Bar>
                      <ReferenceLine
                        y={totalStudents / scoreDistData.length}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{
                          value: "Average",
                          position: "right",
                          fill: "#f59e0b",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          )}

          {radarData.length > 0 && (
            <Card
              title="Difficulty Analysis"
              subtitle="Performance analysis by difficulty level"
              className="lg:col-span-1"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#94a3b8", fontSize: 9 }}
                    />
                    <Radar
                      name="Avg Performance"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Tooltip
                      content={
                        <EnhancedTooltip
                          formatter={(v: number) => `${fmt(v)}%`}
                        />
                      }
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400">
                  Performance varies significantly by difficulty level
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ROW 2: Problem Analytics (2/3) + Leaderboard (1/3) */}
      {/* Leaderboard uses SingleLBRow: shows timeTaken, NOT achieved_score/total_score */}
      {(safeProblemAnalytics.length > 0 || safeLeaderboard.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {safeProblemAnalytics.length > 0 && (
            <Card
              title="Problem Analytics"
              subtitle="Detailed performance metrics for each problem"
              className="lg:col-span-2"
            >
              {/* <div className="overflow-x-auto"> */}
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <TH>#</TH>
                      <TH>Problem</TH>
                      <TH>Difficulty</TH>
                      <TH align="center">Attempts</TH>
                      <TH align="center">Avg Performance</TH>
                      <TH align="center">Success Rate</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProblemAnalytics.map((p, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-50"
                      >
                        <TD align="center">
                          <span className="text-gray-400 text-xs tabular-nums">
                            {i + 1}
                          </span>
                        </TD>
                        <TD>
                          <div className="flex flex-col">
                            <span
                              className="font-medium text-gray-800"
                              title={p.title}
                            >
                              {truncate(p.title, 35)}
                            </span>
                            {/* <span className="text-[10px] text-gray-400">
                              ID: {p.id.slice(0, 8)}...
                            </span> */}
                          </div>
                        </TD>
                        <TD>
                          <DiffBadge d={p.difficulty} />
                        </TD>
                        <TD align="center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-gray-700">
                              {p.attempts}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              attempts
                            </span>
                          </div>
                        </TD>
                        <TD className="w-48">
                          <ProgressBar
                            value={p.avgPerformance}
                            color={DIFF_COLOR[p.difficulty]}
                          />
                        </TD>
                        <TD align="center">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg">
                            {p.successRate}%
                          </span>
                        </TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* </div> */}
            </Card>
          )}

          {safeLeaderboard.length > 0 && (
            <Card
              title="🏆 Leaderboard"
              subtitle="Top performers in this test"
              className="lg:col-span-1"
            >
              <div className="max-h-96">
                {safeLeaderboard.slice(0, 10).map((p, i) => (
                  <SingleLBRow key={i} rank={i + 1} p={p} />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">
                  Showing top performers | Time taken to complete
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* No Data Message */}
      {scoreDistData.length === 0 &&
        radarData.length === 0 &&
        safeProblemAnalytics.length === 0 && (
          <Card title="No Data Available">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-sm">
                No analytics data available for this test.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Try refreshing or check back later
              </p>
            </div>
          </Card>
        )}
    </div>
  );
};

// ─── Root Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [view, setView] = useState<View>("global");
  const [tests, setTests] = useState<
    { id: string; title: string; start_at: string }[]
  >([]);
  const [selectedId, setSelectedId] = useState("");
  const [globalData, setGlobalData] = useState<IGlobalResponse | null>(null);
  const [singleData, setSingleData] = useState<ISingleTestResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadGlobal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.fetchAllTestsAnalytics();
      setGlobalData(data!);
      setTests(
        (data!.testWiseAnalytics ?? []).map((t) => ({
          id: t.testId,
          title: t.title,
          start_at: t.start_at,
        })),
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSingle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.fetchSingleTestAnalytics(id);
      console.log("Single test data:", data);
      setSingleData(data!);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load test analytics.");
      console.error("Error loading single test:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGlobal();
  }, [loadGlobal]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView("single");
    loadSingle(id);
  };

  const handleGlobal = () => {
    setView("global");
    setSelectedId("");
  };

  const currentTitle =
    view === "global"
      ? "Global Analytics"
      : (singleData?.test?.title ?? "Test Analytics");
  const currentSub =
    view === "single" && singleData
      ? `${relDate(singleData.test.start_at)} · ${singleData.test.duration_minutes} min · ${singleData.test.total_score} pts`
      : undefined;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-[#f5f6f8] backdrop-blur-sm border-r border-gray-200 flex flex-col sticky top-0 h-screen transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1DA077] to-[#158563] flex items-center justify-center shrink-0 shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 21L11 13L15 17L19 9"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-[16px] text-gray-900 whitespace-nowrap tracking-tight">
                TestMetrics
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded transition-colors shrink-0"
          >
            <Icons.Chevron open={sidebarOpen} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1">
          <button
            onClick={handleGlobal}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 ${
              view === "global"
                ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-[#1DA077] shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            title="Global Overview"
          >
            <span className="shrink-0">
              <Icons.Globe />
            </span>
            {sidebarOpen && (
              <span className="text-[14px] font-medium truncate">
                Global Overview
              </span>
            )}
          </button>

          {sidebarOpen && (
            <p className="text-[10px] uppercase tracking-widest text-gray-300 px-3 pt-4 pb-2 font-semibold">
              Recent Tests
            </p>
          )}

          {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 ${
                selectedId === t.id && view === "single"
                  ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-[#1DA077] shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title={t.title}
            >
              <span className="shrink-0">
                <Icons.Test />
              </span>
              {sidebarOpen && (
                <span className="flex flex-col min-w-0 flex-1">
                  <span className="text-[14px] font-medium truncate leading-tight">
                    {t.title}
                  </span>
                  <span className="text-[12px] mt-1 text-gray-600 leading-tight tabular-nums">
                    {relDate(t.start_at)}
                  </span>
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-[#f5f6f8] backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 py-4 shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentTitle}
            </h1>
            {currentSub && (
              <span className="text-[11px] text-gray-400 tabular-nums">
                {currentSub}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              view === "global" ? loadGlobal() : loadSingle(selectedId)
            }
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              <RefreshCcw
                className="w-3.5 h-3.5 hover:[#1DA077]"
              />Refresh
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : view === "global" && globalData ? (
            <GlobalView data={globalData} onTestClick={handleSelect} />
          ) : view === "single" && singleData ? (
            <SingleTestView data={singleData} />
          ) : null}
        </main>
      </div>
    </div>
  );
}
