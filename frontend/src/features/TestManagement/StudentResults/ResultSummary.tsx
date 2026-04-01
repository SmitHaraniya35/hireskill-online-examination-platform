import React from "react";
import type { Result } from "../../../types/studentAttempts.types";
import { Trophy, CheckSquare, Timer, Zap, Database } from "lucide-react";

interface ResultSummaryProps {
  result: Result;
  totalDurationMinutes: number;
  avgExecTime?: string;
  totalMemoryMB?: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  totalDurationMinutes,
  avgExecTime,
  totalMemoryMB,
}) => {
  const scorePercent =
    result.total_score > 0
      ? Math.round((result.achieved_score / result.total_score) * 100)
      : 0;

  const solvedPercent =
    result.total_problems > 0
      ? Math.round((result.solved_problems / result.total_problems) * 100)
      : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">

      {/* ── Header ── */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        Result Summary
      </p>

      {/* ── Unified 2x2 grid — all cards same height ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Score */}
        <StatCard
          icon={<Trophy size={11} className="text-amber-400" />}
          label="Score"
          value={
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {result.achieved_score}
              <span className="text-sm font-medium text-gray-400 ml-1">/ {result.total_score}</span>
            </span>
          }
          bar={{ percent: scorePercent, color: "bg-amber-400", label: `${scorePercent}% achieved` }}
        />

        {/* Problems Solved */}
        <StatCard
          icon={<CheckSquare size={11} className="text-indigo-400" />}
          label="Problems Solved"
          value={
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {result.solved_problems}
              <span className="text-sm font-medium text-gray-400 ml-1">/ {result.total_problems}</span>
            </span>
          }
          bar={{ percent: solvedPercent, color: "bg-indigo-400", label: `${solvedPercent}% completed` }}
        />

        {/* Duration */}
        <StatCard
          icon={<Timer size={11} className="text-gray-400" />}
          label="Duration"
          value={
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {totalDurationMinutes}
              <span className="text-sm font-medium text-gray-400 ml-1">mins</span>
            </span>
          }
        />

        {/* Status */}
        <StatCard
          label="Status"
          value={
            <span className="text-sm font-medium text-gray-400">N/A</span>
          }
        />

      </div>

      {/* ── Optional metrics row — only shown if data exists ── */}
      {(avgExecTime || totalMemoryMB !== undefined) && (
        <>
          <hr className="border-gray-100" />
          <div className={`grid gap-3 ${avgExecTime && totalMemoryMB !== undefined ? "grid-cols-2" : "grid-cols-1"}`}>
            {avgExecTime && (
              <StatCard
                icon={<Zap size={11} className="text-gray-400" />}
                label="Avg. Exec. Time"
                value={
                  <span className="text-2xl font-bold text-gray-900 leading-none">
                    {avgExecTime}
                    <span className="text-sm font-medium text-gray-400 ml-1">sec</span>
                  </span>
                }
              />
            )}
            {totalMemoryMB !== undefined && (
              <StatCard
                icon={<Database size={11} className="text-gray-400" />}
                label="Memory Used"
                value={
                  <span className="text-2xl font-bold text-gray-900 leading-none">
                    {totalMemoryMB}
                    <span className="text-sm font-medium text-gray-400 ml-1">MB</span>
                  </span>
                }
              />
            )}
          </div>
        </>
      )}

    </div>
  );
};

/* ── Unified stat card — same structure for every metric ── */
interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  bar?: { percent: number; color: string; label: string };
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bar }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5">
    {/* Label row */}
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">
        {label}
      </span>
    </div>

    {/* Value */}
    <div className="leading-none">{value}</div>

    {/* Optional progress bar — fills space so cards without it still align */}
    {bar ? (
      <div className="flex flex-col gap-1 mt-auto">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${bar.color}`}
            style={{ width: `${bar.percent}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400">{bar.label}</span>
      </div>
    ) : (
      /* Invisible spacer — keeps card height consistent with bar cards */
      <div className="mt-auto pt-4" />
    )}
  </div>
);

export default ResultSummary;