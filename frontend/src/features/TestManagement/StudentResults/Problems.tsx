import React, { useState } from "react";
import type { StudentAssignedProblems } from "../../../types/studentAttempts.types";

interface ProblemsProps {
  problems: StudentAssignedProblems[];
  selectedSubmissionId: string | null;
  onSelectProblem: (submissionId: string) => void;
}

type FilterType = "All" | "Submitted" | "Not Attempted" | "Attempted";

const difficultyStyles: Record<string, string> = {
  Easy: "bg-green-50 text-green-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-600",
};

const Problems: React.FC<ProblemsProps> = ({
  problems,
  selectedSubmissionId,
  onSelectProblem,
}) => {
  const [filter, setFilter] = useState<FilterType>("All");

  const filtered = problems.filter((p) => {
    if (filter === "All") return true;
    if (p.status === filter) return true;
    return false;
  });

  const getStatusStyle = (p: StudentAssignedProblems) => {
    if (p.status === "Submitted") return "bg-green-50 text-green-700";
    if (p.status === "Not Attempted") return "bg-gray-100 text-gray-500";
    if (p.status === "Attempted") return "bg-blue-100 text-blue-500";
    // const s = p.status?.toLowerCase();
    // if (s === "failed") return "bg-red-50 text-red-600";
    // return "bg-green-50 text-green-700";
  };

  const getStatusLabel = (p: StudentAssignedProblems) => {
    return p.status;
  };

  const getStatusIcon = (p: StudentAssignedProblems) => {
    if (p.status === "Submitted") return "✓";
    if (p.status === "Not Attempted") return "✕";
    if (p.status === "Attempted") return "✓";
  };

  const getAccentColor = (p: StudentAssignedProblems) => {
    if (p.status === "Submitted") return "bg-green-400";
    if (p.status === "Not Attempted") return "bg-gray-400";
    if (p.status === "Attempted") return "bg-blue-400";
    // const s = p.status?.toLowerCase();
    // if (s === "failed") return "bg-red-400";
    // return "bg-green-400";
  };

  return (
    <div className="bg-white border max-h-[120vh] border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-wrap gap-3 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Problems</h2>
        <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
          {(
            ["All", "Submitted", "Not Attempted", "Attempted"] as FilterType[]
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                filter === f
                  ? "bg-white text-gray-900 font-semibold shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto">
        {filtered.map((problem, idx) => {
          const difficulty = problem.codingProblem?.difficulty || "Easy";
          const hasNotAttempted = problem.status === "Not Attempted";
          const isSelected = hasNotAttempted && problem.submission?.id === selectedSubmissionId;

          return (
            <div
              key={problem.id}
              onClick={() =>
                !hasNotAttempted &&
                problem.submission?.id &&
                onSelectProblem(problem.submission.id)
              }
              className={`flex items-stretch transition-colors ${
                !hasNotAttempted ? "cursor-pointer" : ""
              } ${isSelected ? "bg-blue-50" : !hasNotAttempted ? "hover:bg-gray-50" : ""}`}
            >
              {/* Accent bar */}
              <div className={`w-1 flex-shrink-0 ${getAccentColor(problem)}`} />

              {/* Content */}
              <div className="flex-1 px-4 py-3.5 min-w-0">
                <div className="flex  items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900 flex-1 min-w-0 truncate">
                    {idx + 1}. {problem.codingProblem?.title || "Unknown Problem"}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                      difficultyStyles[difficulty] || difficultyStyles.Easy
                    }`}
                  >
                    {difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1">
                  {problem.is_submitted && problem.submission ? (
                    <span className="text-xs text-green-600 font-medium">
                      Passed:&nbsp;
                      <strong>
                        {problem.submission.passed_test_cases} /{" "}
                        {problem.submission.total_test_cases}
                      </strong>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${getStatusStyle(
                      problem
                    )}`}
                  >
                    {getStatusIcon(problem)}&nbsp;{getStatusLabel(problem)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No problems in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Problems;
