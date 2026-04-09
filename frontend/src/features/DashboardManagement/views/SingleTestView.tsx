import {
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
  ReferenceLine,
} from "recharts";
import {
  EnhancedTooltip,
  HistogramTooltip,
  StatCard,
  DiffBadge,
  ProgressBar,
  Card,
  TH,
  TD,
  SingleLBRow,
  Icons,
} from "../components/dashboard.components";
import type { ISingleTestResponse } from "@/types/dashboard.types";
import { DIFF_COLOR, PALETTE } from "../constants/dashboard.constants";
import { fmt } from "../utils/dashboard.utils";

interface SingleTestViewProps {
  data: ISingleTestResponse;
}

const SingleTestView = ({ data }: SingleTestViewProps) => {
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
      {/* Stats Grid */}
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
      {(safeProblemAnalytics.length > 0 || safeLeaderboard.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Problem Analytics Card */}
          {safeProblemAnalytics.length > 0 && (
            <Card
              title="Problem Analytics"
              subtitle="Detailed performance metrics for each problem"
              className="lg:col-span-2"
            >
              {/* 1. Added overflow-x-hidden to prevent horizontal scroll */}
              <div className="h-[388px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                {/* 2. Added table-fixed and removed min-w-[600px] wrapper */}
                <table className="w-full table-fixed border-collapse">
                  <thead className="sticky top-0 z-20">
                    {/* Increased z-index */}
                    <tr className="bg-gray-50">
                      {/* Removed semi-transparency /50 */}
                      <TH align="center" className="w-[8%] bg-gray-50">
                        #
                      </TH>
                      <TH className="w-[22%] bg-gray-50">Problem</TH>
                      <TH className="w-[15%] bg-gray-50">Difficulty</TH>
                      <TH align="center" className="w-[12%] bg-gray-50">
                        Attempts
                      </TH>
                      <TH align="center" className="w-[30%] bg-gray-50">
                        Avg Performance
                      </TH>
                      <TH align="center" className="w-[13%] bg-gray-50">
                        Success
                      </TH>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {safeProblemAnalytics.map((p, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TD align="center">
                          <span className="text-gray-400 text-xs tabular-nums">
                            {i + 1}
                          </span>
                        </TD>
                        <TD className="overflow-hidden">
                          {/* 4. Added 'truncate' to the title div */}
                          <div
                            className="font-medium text-gray-800 truncate text-xs"
                            title={p.title}
                          >
                            {p.title}
                          </div>
                        </TD>
                        <TD>
                          <DiffBadge d={p.difficulty} />
                        </TD>
                        <TD align="center">
                          <span className="font-semibold text-gray-700 text-xs">
                            {p.attempts}
                          </span>
                        </TD>
                        <TD>
                          {/* 5. Simplified ProgressBar for the tight space */}
                          <div className="w-full px-2">
                            <ProgressBar
                              value={p.avgPerformance}
                              color={DIFF_COLOR[p.difficulty]}
                            />
                          </div>
                        </TD>
                        <TD align="center">
                          <span className="text-xs font-bold text-gray-700">
                            {p.successRate}%
                          </span>
                        </TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Leaderboard Card */}
          {safeLeaderboard.length > 0 && (
            <Card
              title="Leaderboard"
              subtitle="Top performers"
              className="lg:col-span-1 overflow-hidden" // Added overflow-hidden
            >
              {/* 1. Added overflow-x-hidden to the scroll container */}
              <div className="h-[365px] overflow-y-auto overflow-x-hidden custom-scrollbar px-2">
                {safeLeaderboard.map((p, i) => (
                  <SingleLBRow key={i} rank={i + 1} p={p} />
                ))}
              </div>

              <div className="mt-3 text-center">
                <p className="text-[10px] text-gray-400">
                  Showing top performers | Time taken to complete
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* No Data */}
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

export default SingleTestView;
