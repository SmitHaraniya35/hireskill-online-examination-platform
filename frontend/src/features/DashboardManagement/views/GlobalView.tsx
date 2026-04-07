import {
  AreaChart,
  Area,
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
  ComposedChart,
  Line,
} from "recharts";
import {
  EnhancedTooltip,
  StatCard,
  Card,
  TH,
  TD,
  GlobalLBRow,
  Icons,
} from "../components/dashboard.components";
import type { Difficulty, IGlobalResponse } from "@/types/dashboard.types";
import { fmt, relDate, truncate } from "../utils/dashboard.utils";
import { DIFF_COLOR } from "../constants/dashboard.constants";

interface GlobalViewProps {
  data: IGlobalResponse;
  onTestClick: (id: string) => void;
}

const GlobalView = ({ data, onTestClick }: GlobalViewProps) => {
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
          <div className="h-80 w-full min-h-[300px]">
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
                  dot={{ fill: "#ffffff", stroke: "#6366f1", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    fill: "#6366f1",
                    stroke: "#fff",
                    strokeWidth: 2,
                    r: 6,
                  }}
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
          <div className="h-80 ">
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

      {/* Problem Analytics + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Problem Analytics"
          subtitle="Attempts vs Performance across problems"
          className="lg:col-span-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={topProblems}
                margin={{ top: 10, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                {/* <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                /> */}
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={80}
                  axisLine={false}
                  tickLine={false}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const label = payload.value;
                    const isLong = label.length > 12;
                    const displayLabel = isLong
                      ? `${label.slice(0, 12)}...`
                      : label;

                    return (
                      <g transform={`translate(${x},${y})`}>
                        {/* The title tag provides the hover tooltip */}
                        <title>{label}</title>
                        <text
                          x={0}
                          y={0}
                          dy={16}
                          textAnchor="end"
                          fill="#94a3b8"
                          fontSize={11}
                          transform="rotate(-30)"
                          className="hover:fill-indigo-500 hover:font-medium transition-all cursor-default"
                        >
                          {displayLabel}
                        </text>
                      </g>
                    );
                  }}
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
        <table className="w-full">
          <thead>
            <tr>
              <TH>Test</TH>
              <TH>Date</TH>
              <TH>Students</TH>
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
      </Card>
    </div>
  );
};

export default GlobalView;
