import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Result } from "../../../types/studentAttempts.types";

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
  // const isPassed = result.solved_problems >= Math.ceil(result.total_problems / 2);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Result Summary</h2>

      <div className="grid grid-cols-3 gap-3">
        {/* Score */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Score</span>
          <span className="text-2xl font-bold text-gray-900 leading-none mt-1">
            {result.achieved_score}
            <span className="text-sm font-medium text-gray-400 ml-1">/ {result.total_score}</span>
          </span>
        </div>

        {/* Problems Solved */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Problems Solved</span>
          <span className="text-2xl font-bold text-gray-900 leading-none mt-1">
            {result.solved_problems}
            <span className="text-sm font-medium text-gray-400 ml-1">/ {result.total_problems}</span>
          </span>
        </div>

        {/* Status */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Status</span>
          {/* <span
            className={`flex items-center gap-1.5 text-base font-bold leading-none mt-1 ${
              isPassed ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPassed ? (
              <CheckCircle2 size={16} strokeWidth={2.5} />
            ) : (
              <XCircle size={16} strokeWidth={2.5} />
            )}
            {isPassed ? "Passed" : "Failed"}
          </span> */}
          <span> N/A </span>
        </div>

        {/* Duration */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Total Duration</span>
          <span className="text-xl font-bold text-gray-900 leading-none mt-1">{totalDurationMinutes} mins</span>
        </div>

        {/* Avg Exec Time */}
        {avgExecTime && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Avg. Exec. Time</span>
            <span className="text-xl font-bold text-gray-900 leading-none mt-1">{avgExecTime} sec</span>
          </div>
        )}

        {/* Memory */}
        {totalMemoryMB !== undefined && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Memory Used</span>
            <span className="text-xl font-bold text-gray-900 leading-none mt-1">{totalMemoryMB} MB</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSummary;